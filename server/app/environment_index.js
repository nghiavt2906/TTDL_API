import * as indicatorConst from 'constant/environment_index'
import * as indicatorName from 'constant/environment_indicator'
import _ from 'lodash'

export default class EnviromentIndex {
  constructor () {}

  calculateWqiStation = (monitoringData, stationIndicators) => {
    try{
      // console.log(monitoringData[0])
      let newMonitoringData = this.matchWqiIndicator(monitoringData, stationIndicators)
      // console.log(monitoringData, stationIndicators)
      // console.log(newMonitoringData)
      // let newMonitoringData = [{
      //   indicator: 'pH',
      //   value: 7.2
      // },{
      //   indicator: 'Cu',
      //   value: 0.05
      // },{
      //   indicator: 'As',
      //   value: 0.02
      // },{
      //   indicator: 'Temp',
      //   value: 27.5
      // },{
      //   indicator: 'DO',
      //   value: 5.7
      // },{
      //   indicator: 'BOD5',
      //   value: 20
      // },{
      //   indicator: 'COD',
      //   value: 25
      // },{
      //   indicator: 'NH4',
      //   value: 0.2
      // },{
      //   indicator: 'PO4',
      //   value: 0.3
      // },{
      //   indicator: 'Aldrin',
      //   value: 0.05
      // },{
      //   indicator: 'Dieldrin',
      //   value: 0.05
      // },{
      //   indicator: 'Coliform',
      //   value: 10000
      // }]
      let wqi = newMonitoringData.map(item => {
        return this.calculateWqiIndicator(item.indicator, item.value)
      })
      wqi = _.compact(wqi)
      let groupI = this.filterEnvGroup(wqi, 'I')
      let groupII = this.filterEnvGroup(wqi, 'II')
      let groupIII = this.filterEnvGroup(wqi, 'III')
      let groupIV = this.filterEnvGroup(wqi, 'IV')
      let groupV = this.filterEnvGroup(wqi, 'V')
      // console.log(groupI, groupII, groupIII, groupIV, groupV)
  
      if(groupIV.length < 3) return null
      let wqiGroupII = 1
      groupII.forEach(item => {
        wqiGroupII = wqiGroupII*item.wqi
      })
      let wqiGroupIII = 1
      groupIII.forEach(item => {
        wqiGroupIII = wqiGroupIII*item.wqi
      })
      let wqiGroupIV = 0
      groupIV.forEach(item => {
        wqiGroupIV = wqiGroupIV + item.wqi
      })
      let wqiGroupV = 0
      groupV.forEach(item => {
        wqiGroupV = wqiGroupV + item.wqi
      })
      let wqiStation = 0
      // console.log(groupI[0].wqi/100, wqiGroupII, wqiGroupIII, wqiGroupIV, wqiGroupV)
      let wqiFinalGroupII = (groupII.length > 0) ? Math.pow(wqiGroupII,1/(groupII.length))/100 : 1
      let wqiFinalGroupIII = (groupIII.length > 0) ? Math.pow(wqiGroupIII,1/(groupIII.length))/100 : 1
      
      wqiStation = Math.floor((groupI[0].wqi/100)*wqiFinalGroupII*wqiFinalGroupIII*(1/(groupIV.length)*wqiGroupIV))
      // if(groupV.length === 0){
      //   wqiStation = Math.floor((groupI[0].wqi/100)*wqiFinalGroupII*wqiFinalGroupIII*(1/(groupIV.length)*wqiGroupIV))
      // } else {
      //   wqiStation = Math.floor((groupI[0].wqi/100)*wqiFinalGroupII*wqiFinalGroupIII*Math.pow(((1/(groupIV.length)*wqiGroupIV)*(1/(groupV.length)*wqiGroupV)), 1/2))
      // }
      if(wqiStation === undefined || wqiStation === NaN || wqiStation === 0 || wqiStation === null){
        return null
      } else {
        // console.log('======>', wqiStation)
        return wqiStation
      }
    } catch (err){
      console.log(err)
    }
  }

  matchWqiIndicator = (monitoringData, stationIndicators) => {
    let wqiMonitoringData = [] 
    monitoringData.forEach(item => {
      let index = _.findIndex(stationIndicators, element => {
        return element.wqiIndicator === item.indicator
      })
      if(index > -1) {
        wqiMonitoringData.push({
          indicator: stationIndicators[index].wqiIndicator,
          value: item.value
        })
      }
    })
    // console.log(wqiMonitoringData)
    return wqiMonitoringData
  }

  filterEnvGroup = (arrayEnvIndicator, group) => {
    let envGroup = []
    arrayEnvIndicator.forEach(item => {
      if(item.group === group) {
        envGroup.push(item)
      }
    })
    return envGroup
  }

  calculateWqiIndicator = (name, value) => {
    switch(name){
      case indicatorName.pH:
        return {
          indicator: name,
          wqi: this.calculateWqiPH(indicatorConst.pH, value),
          group: 'I'
        }
      case indicatorName.Aldrin: 
        return {
          indicator: name,
          wqi: this.calculateWqiGroupII(indicatorConst.Aldrin, value),
          group: 'II'
        }
      case indicatorName.BHC:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupII(indicatorConst.BHC, value),
          group: 'II'
        }
      case indicatorName.Dieldrin:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupII(indicatorConst.Dieldrin, value),
          group: 'II'
        }
      case indicatorName.DDTs:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupII(indicatorConst.DDTs, value),
          group: 'II'
        }
      case indicatorName.Heptachlor:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupII(indicatorConst.Heptachlor, value),
          group: 'II'
        }
      case indicatorName.As:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.As, value),
          group: 'III'
        }
      case indicatorName.As:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.As, value),
          group: 'III'
        }
      case indicatorName.Cd:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.Cd, value),
          group: 'III'
        }
      case indicatorName.Pb:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.Pb, value),
          group: 'III'
        }
      case indicatorName.Cr:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.Cr, value),
          group: 'III'
        }
      case indicatorName.Cu:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.Cu, value),
          group: 'III'
        }
      case indicatorName.Zn:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.Zn, value),
          group: 'III'
        }
      case indicatorName.Hg:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.Hg, value),
          group: 'III'
        }
      case indicatorName.DO:
        return {
          indicator: name,
          wqi: this.calculateWqiDO(value, 29.5, indicatorConst.DO),
          group: 'IV'
        }
      case indicatorName.BOD5:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.BOD5, value),
          group: 'IV'
        }
      case indicatorName.COD:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.COD, value),
          group: 'IV'
        }
      case indicatorName.TOC:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.TOC, value),
          group: 'IV'
        }
      case indicatorName.NH4:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.NH4, value),
          group: 'IV'
        } 
      case indicatorName.NO3:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.NO3, value),
          group: 'IV'
        } 
      case indicatorName.NO2:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.NO2, value),
          group: 'IV'
        }
      case indicatorName.PO4:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupIIIAndIVAndV(indicatorConst.PO4, value),
          group: 'IV'
        } 
      case indicatorName.Coliform:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupV(indicatorConst.Coliform, value),
          group: 'V'
        }
      case indicatorName.ECOLI:
        return {
          indicator: name,
          wqi: this.calculateWqiGroupV(indicatorConst.ECOLI, value),
          group: 'V'
        }
      default: return null                
    }
  }

  calculateWqiGroupIIIAndIVAndV = (indicator, value) => {
    // console.log(indicator, value)
    if(value <= indicator[0].BPi) return indicator[0].qi
    if(value >= indicator[4].BPi) return indicator[4].qi
    let i = this.findIndexBPiInterval(value, indicator)
    const wqiIndicator = (indicator[i-1].qi - indicator[i].qi)/(indicator[i].BPi - indicator[i-1].BPi)*(indicator[i].BPi - value) + indicator[i].qi
    return Math.round(wqiIndicator*100)/100 //Lam tron 2 chu so
  }

  calculateWqiGroupV = (indicator, value) => {
    // console.log(indicator, value)
    if(value <= indicator[0].BPi) return indicator[0].qi
    if(value > indicator[4].BPi) return indicator[4].qi
    let i = this.findIndexBPiInterval(value, indicator)
    const wqiIndicator = (indicator[i-1].qi - indicator[i].qi)/(indicator[i].BPi - indicator[i-1].BPi)*(indicator[i].BPi - value) + indicator[i].qi
    return Math.round(wqiIndicator*100)/100 //Lam tron 2 chu so
  }

  // Hàm này để tính WQI của chỉ số PH
  calculateWqiPH = (indicator, value) => {
    if(value <= 5.5) return 10
    if( 6 <= value && value <= 8.5 ) return 100
    if(value >= 9) return 10
    if(5.5 < value && value < 6){
      let i = this.findIndexBPiInterval(value, indicator)
      return Math.round(((indicator[i].qi - indicator[i-1].qi)/(indicator[i].BPi - indicator[i-1].BPi)*(value - indicator[i-1].BPi) + indicator[i-1].qi)*100)/100
    }
    if(8.5 < value && value < 9){
      let i = this.findIndexBPiInterval(value, indicator)
      return Math.round(((indicator[i-1].qi - indicator[i].qi)/(indicator[i].BPi - indicator[i-1].BPi)*(indicator[i].BPi - value) + indicator[i].qi)*100)/100
    }
  }

  // Hàm này để tính WQI của chỉ số DO
  calculateWqiDO = (valueDO, valueTemp, indicator) => {
    let saturateDo = 14.652 - 0.41022*valueTemp + 0.0079910*Math.pow(valueTemp,2) - 0.000077774*Math.pow(valueTemp,3)
    let percentSaturateDo = Math.round((valueDO/saturateDo*100)*100)/100
    if(percentSaturateDo < 20) return 10
    if(88 <= percentSaturateDo && percentSaturateDo <= 112) return 100
    if(percentSaturateDo > 200) return 10
    if(20 < percentSaturateDo && percentSaturateDo < 88){
      let i = this.findIndexBPiInterval(percentSaturateDo, indicator)
      return Math.round(((indicator[i].qi - indicator[i-1].qi)/(indicator[i].BPi - indicator[i-1].BPi)*(percentSaturateDo - indicator[i-1].BPi) + indicator[i-1].qi)*100)/100
    }
    if(112 < percentSaturateDo && percentSaturateDo < 200){
      let i = this.findIndexBPiInterval(percentSaturateDo, indicator)
      return Math.round(((indicator[i-1].qi - indicator[i].qi)/(indicator[i].BPi - indicator[i-1].BPi)*(indicator[i].BPi - percentSaturateDo) + indicator[i].qi)*100)/100
    }
  }

  calculateWqiGroupII = (defaultValue, value) => {
    if(value <= defaultValue) return 100
    return 10
  }

  // Hàm này trả về index của khoảng giá trị đó nằm trong vùng nào của BPi để xác đị qi, q+1
  // Ví dụ: BODdo = 8 nằm giữa khoảng 6-15 => qi=75, qi+1 = 50
  findIndexBPiInterval (value, bpiArray){
    let indexs = bpiArray.map((item, index) => {
      return value <= item.BPi ? index : null
    })
    indexs = _.compact(indexs)
    return indexs[0]
  }
}