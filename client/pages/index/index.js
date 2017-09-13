var app = getApp();
Page({
  data: {
    currentWeather: null,
    city: null,
    temperature: '',
    description: { strName: 'Clear' },
    loadComplete: false,
    lat: 0,
    lon: 0
  },
  onLoad: function (options) {
    let that = this;
    console.log(app.globalData.api);
    // 生命周期函数--监听页面加载
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          lat: res.latitude,
          lon: res.longitude
        })
        that.getWeather(res.latitude, res.longitude)
      }
    })
  },
  getWeather: function (lat, lon) {
    let that = this;
    wx.request({
      url: `${app.globalData.api}/weather`, //仅为示例，并非真实的接口地址
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
          currentWeather: data.currentWeather,
          city: data.city,
          temperature: data.temperature,
          description: { strName: data.description.strName, name: data.description.description }
        })
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
  onPressTemperature: function () {
    let that = this;
    wx.navigateTo({
      url: `/pages/temperature/temperature?lat=${that.data.lat}&lon=${that.data.lon}`
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
    let that = this;
    // 生命周期函数--监听页面加载
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.getWeather(res.latitude, res.longitude)
      }
    })
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
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
