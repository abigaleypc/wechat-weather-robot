
var app = getApp();
Page({
  data: {
    userInfo: {},
    friendInfo: null,
    msgList: [],
    scrollPosition: 0,
    inputValue: null,
    touchClear: false,
    clientHeight: 0
  },
  onLoad: function (options) {
    let that = this;
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        scrollTop: 0
      })
    })

    // 获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight - 60
        });
      }
    });

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    // this.getMsgList();
  },

  inputMsg: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  clearInput: function () {
    let that = this;
    that.setData({
      inputValue: ''
    })
  },
  addMsg: function (user, msg) {
    let that = this;

    let newMsgList = that.data.msgList;
    newMsgList.push({
      sender: user,
      msg: msg.replace(/{br}/g, '。')
    })
    let scrollPosition = newMsgList.length - 1;
    that.setData({
      msgList: newMsgList,
      scrollPosition: scrollPosition
    })
  },
  send: function () {
    var that = this;

    if (that.data.inputValue) {
      let sendMsgParam = that.data.inputValue

      that.clearInput();
      that.addMsg(that.data.userInfo.nickName, sendMsgParam)

      wx.request({
        url: `${app.globalData.api}/askRobot`,
        header: {
          'content-type': 'application/json'
        },
        data: {
          question: sendMsgParam
        },
        method: 'GET',
        success: function (res) {

          // success
          let data = res.data;
          if (data.result == 0) {
            that.addMsg('robot', data.content)
          }
        },
        fail: function (err) {

          that.addMsg('robot', err)
          // fail
        },
        complete: function () {

          // complete
        }
      })
    }
  },
  clear: function () {
    let that = this;
    that.clearInput();
    that.setData({
      touchClear: true
    })

    setTimeout(function () {
      that.setData({
        msgList: []
      })
      that.setData({
        touchClear: false
      })
    }, 1000);
  },

  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '机器人', // 分享标题
      desc: '跟个笨蛋机器人说瞎话吧', // 分享描述
      path: 'path' // 分享路径
    }
  }
})
