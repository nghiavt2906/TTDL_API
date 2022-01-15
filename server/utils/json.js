const moment = require('moment')
const _ = require('lodash')
import * as func from 'utils/functions'
import app from 'app'

// import models from 'models'
import { newId } from 'models/utils'

export const handleJsonData = async jsonData => {
	let idStation = ''
	let rawData = ''

	console.log({ jsonData })
	// if (json.dev === undefined || json.dev === null || json.id === undefined || json.id === null || json.time === undefined || json.time === null) {
	//   return { statusCode: 400, message: 'WRONG FORMAT JSON' }
	// }

	idStation = jsonData.idStation
	// let sentTime = func.convertToISODateFormat(jsonData.time)
	// sentTime = moment(sentTime).format('YYYY-MM-DD HH:mm:ss')
	let sentTime = jsonData.time
	rawData = JSON.stringify(jsonData)

	let checkData = await app.MonitoringDataInfo.findMonitoringDataInfo(idStation, rawData, sentTime)

	if (checkData.length > 0) {
		if (checkData[0].monitoringContent === JSON.stringify(jsonData)) {
			console.log('Du liệu đã tồn tại')
			return { statusCode: 400, message: 'DATA EXISTS' }
		} else {
			console.log('Update dữ liệu')
			updateDataInfo(jsonData, checkData[0].id)
			return { statusCode: 200, message: 'DATA IS UPDATED' }
		}
	} else {
		console.log('Thêm mới dữ liệu')
		insertDataInfo(jsonData, idStation)
		return { statusCode: 200, message: 'SUCCESS' }
	}
}

async function updateDataInfo(jsonObject, id) {
	let dataInfo = {}
	let dataIndicator = {}

	dataIndicator = func.eleminateElementFromObject(jsonObject, ['dev', 'id', 'time', 'pin', 'axis', 'idStation'])
	dataInfo.monitoringContent = JSON.stringify(jsonObject)
	dataInfo.battery = _.has(jsonObject, 'pin') ? jsonObject['pin'] : null
	dataInfo.location = _.has(jsonObject, 'axis') ? jsonObject['axis'] : null

	let updateInfo = await app.MonitoringDataInfo.updateMonitoringDataInfo(dataInfo, id)
	if (updateInfo.length > 0) {
		let deleteData = await app.MonitoringData.deleteMonitoringData(id)
		if (deleteData > 0) {
			let arrayIndicatorData = convertObjectToArrayData(dataIndicator, id)
			await app.MonitoringData.createMonitoringData(arrayIndicatorData)
		}
	}
}

async function insertDataInfo(jsonObject, id) {
	let dataInfo = {}
	let dataIndicator = {}

	dataIndicator = func.eleminateElementFromObject(jsonObject, ['dev', 'id', 'time', 'pin', 'axis', 'idStation'])
	dataInfo.id = newId()
	dataInfo.stationId = id
	dataInfo.monitoringContent = JSON.stringify(jsonObject)
	dataInfo.battery = _.has(jsonObject, 'pin') ? jsonObject['pin'] : null
	dataInfo.location = _.has(jsonObject, 'axis') ? jsonObject['axis'] : null
	dataInfo.isFtpdata = 0

	// let datetime = func.convertToISODateFormat(jsonObject.time)
	// dataInfo.sentAt = moment(datetime).format('YYYY-MM-DD HH:mm:ss')
	dataInfo.sentAt = jsonObject.time

	let insertedInfo = await app.MonitoringDataInfo.createMonitoringDataInfo(dataInfo)

	if (insertedInfo.id !== undefined) {
		let arrayIndicatorData = convertObjectToArrayData(dataIndicator, insertedInfo.id)
		await app.MonitoringData.createMonitoringData(arrayIndicatorData)
	}
}

function convertObjectToArrayData(objectData, idData) {
	let arrayData = []
	for (var key in objectData) {
		let element = {}
		let data = objectData[key].split(' ')
		if (data.length === 1) {
			data.push('')
		}
		element.id = newId()
		element.idData = idData
		element.indicator = key.toUpperCase()
		element.value = parseFloat(data[0])
		element.unit = data[1]
		element.sensorStatus = '01'
		arrayData.push(element)
	}
	return arrayData
}