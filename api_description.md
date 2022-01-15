Mô tả API:
- Trang dữ liệu mới nhất:
api: api/dulieumoinhat
method: GET
req.body: {
  monitoringType : 'QTN/QTK',
  monitoringGroup: 'All/QTNM/QTNT...'
  station: 'All/HBT/HPL...'
}

- Trang dữ liệu dạng bảng:
api: api/dulieudangbang
method: GET
req.body: {
  monitoringType : 'QTN/QTK',
  monitoringGroup: 'QTNM/QTNT...'
  station: 'HBT/HPL...'
  startTime: '2019/10/22 12:23:12'
  endTime: '2019/10/22 12:45:12'
}

method: PUT
req.body: {
  idData : [123,145,176]
}

- Trang dữ liệu biểu đồ:
api: api/dulieubieudo
method: GET
req.body: {
  monitoringType : 'QTN/QTK',
  monitoringGroup: 'QTNM/QTNT...'
  station: 'HBT/HPL...'
  startTime: '2019/10/22 12:23:12'
  endTime: '2019/10/22 12:45:12'
}

- Bản đồ:
api: api/bando
method: GET
req.body: {
  monitoringType : 'All/QTN/QTK',
  monitoringGroup: 'QTNM/QTNT...'
  station: 'HBT/HPL...'
}

- Thông tin trạm:
api: api/thongtintram
method: GET
req.body: {
  monitoringType : 'All/QTN/QTK',
  monitoringGroup: 'QTNM/QTNT...'
  station: 'HBT/HPL...'
}

- Quản lý nhóm quan trắc:
api: api/quanlynhomquantrac
method: GET
req.body: {
  monitoringType : 'QTN/QTK',
}

method: PUT
req.body: {
  idMonitoringGroup: 34,
  data: {
    name: 'Quan trắc nước thải',
    symbol: 'QTNT',
    description: 'Quan trắc nước thải công nghiệp...'
  }
}

method: POST
req.body: {
  monitoringType : 'QTN/QTK',
  data: {
    name: 'Quan trắc nước sinh hoạt',
    symbol: 'QTNT',
    description: 'Quan trắc nước thải sinh hoạt...'
  }
}

method: DELETE
req.body: {
  idMonitoringGroup: 34
}

- Quản lý chỉ só:
api: api/quanlychiso
method: GET
req.body: {
  monitoringType : 'QTN/QTK',
}

method: PUT
req.body: {
  idIndicator: 34,
  data: {
    name: 'NH4',
    symbol: 'NH4',
    unit: 'mg/l'
    description: 'Nồng độ amoniac trong nước...'
  }
}

method: POST
req.body: {
  monitoringType : 'QTN/QTK',
  data: {
    name: 'NH4',
    symbol: 'NH4',
    unit: 'mg/l'
    description: 'Nồng độ amoniac trong nước...'
  }
}

method: DELETE
req.body: {
  idIndicator: 34,
}

- Quản lý ngưỡng chỉ só:
api: api/quanlynguongchiso
method: GET
req.body: {
  monitoringType : 'QTN/QTK',
  monitoringGroup: 'QTNT/QTNM'
}

method: PUT
req.body: {
  idIndicator: 34,
  data: {
    name: 'NH4',
    unit: 'mg/l',
    upperThreshold: 3,
    lowerThreshold: 0,
    overThresholdDescription: 'Theo thông tư...',
    safetyThresholdDescription: 'Theo thông tư...'
  }
}

method: POST
req.body: {
  monitoringType : 'QTN/QTK',
  monitoringType : 'QTNM',
  data: {
    name: 'NH4',
    unit: 'mg/l',
    upperThreshold: 3,
    lowerThreshold: 0,
    overThresholdDescription: 'Theo thông tư...',
    safetyThresholdDescription: 'Theo thông tư...'
  }
}

method: DELETE
req.body: {
  idThreshold: 34,
}

- Quản lý ngưỡng chỉ só:
api: api/quanlynguoidung
method: GET
req.body: {
  monitoringType : 'QTN/QTK',
}

method: PUT
req.body: {
  idUser: 34,
  data: {
    name: 'Nguyễn Văn A',
    phoneNumber: '0192837212',
    email: 'nguyenvana@gmail.com',
    address: 'Quận Hải CHâu, Đà Nẵng',
    workplace: 'Sở Thông Tin Truyền Thông',
    userRole: '01',
    idStation: [01,29,24]
  }
}

method: POST
req.body: {
  monitoringType : 'QTN/QTK',
  data: {
    name: 'Nguyễn Văn A',
    phoneNumber: '0192837212',
    email: 'nguyenvana@gmail.com',
    address: 'Quận Hải CHâu, Đà Nẵng',
    workplace: 'Sở Thông Tin Truyền Thông',
    userRole: '01',
    idStation: [01,29,24]
  }
}

method: DELETE
req.body: {
  idUser: 34,
}

- Quản lý Firmwares:
api: api/quanlyfirmware
method: GET
req.body: {
  monitoringType : 'QTN/QTK',
}

method: PUT
req.body: {
  idFirmware: 34,
  data: {
    name: 'quantracnuoc_3.04_104',
    version: '3.03',
    url: 'quantracnuoc.com/quanlyfirmware_3.04',
    status: 'Quận Hải CHâu, Đà Nẵng',
    creatTime: '06-29-2019'
  }
}

method: POST
req.body: {
  monitoringType : 'QTN/QTK',
  data: {
    name: 'quantracnuoc_3.04_104',
    version: '3.03',
    url: 'quantracnuoc.com/quanlyfirmware_3.04',
    status: 'Quận Hải CHâu, Đà Nẵng',
    creatTime: '06-29-2019'
  }
}

method: DELETE
req.body: {
  idFirmware: 34,
}

- Thông số hệ thống
api: api/thongsohethong
method: GET

method: PUT
req.body: {
  emailServer: 'abc@gmail.com'
  ftpServer: '123.182.89.12'
  ...
}
