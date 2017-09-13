var app = getApp();
Page({
  data: {
  
    loadComplete: false,
    temperatureList:[],
    temperatureDetail:[],
    dateSelected:0
  },
  onLoad: function (options) {
    let that = this;
    that.getTemperatureList(options.lat,options.lon)
  
  },
  scroll:function (params) {
    
  },
  getTemperatureList: function (lat, lon) {
    let that = this;
    wx.request({
      url: `${app.globalData.api}/temperature`, //仅为示例，并非真实的接口地址
      data: {
        lat: lat,
        lon: lon
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let data = res.data;
        that.setData({
          temperatureList:data
        })
        that.getTemperatureDetail(data[0].date)
       
      },
      fail: function (err) {

      },
      complete: function () {
        that.setData({
          loadComplete: true
        })
      }
    })
  },
  getTemperatureDetail:function (date) {
    let that = this;
  
    wx.request({
      url: `${app.globalData.api}/weatherDetail`, //仅为示例，并非真实的接口地址
      data: {
        date:date
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let data = res.data;
        that.setData({
          temperatureDetail:data
        })
      },
      fail: function (err) {

      },
      complete: function () {
        
      }
    })
  },
  onChangeDate:function (event) {
    let that = this;
    let date = event.currentTarget.dataset.date?event.currentTarget.dataset.date:0;
    that.setData({
      dateSelected:event.currentTarget.dataset.index
    })
    that.getTemperatureDetail(date)
    
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})
