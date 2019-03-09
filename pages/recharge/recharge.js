// pages/recharge/recharge.js
let App3 = getApp();
let util = require('../../utils/util.js');
let config = util.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let putawayBoxId = options.putawayBoxId
    let frameId = options.frameId

    if (putawayBoxId) {
      this.setData({
        frameId: frameId,
        putawayBoxId: putawayBoxId
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDepositNum();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //获取押金
  getDepositNum: function () {
    wx.showLoading({
      title: '加载中...',
    })
    util.request({
      url: config.apiUrl + "/user/deposit/num",
      method: "GET",
      data: {},
      success: res => {
        wx.hideLoading()
        this.setData({
          price: res.data.Price
        })
      }
    })
  },
  pay: function () {
    wx.showLoading({
      title: '充值中...',
    })
    util.request({
      url: config.apiUrl + "/user/deposit/pay",
      method: "POST",
      data: {
        Price: this.data.price
      },
      success: res => {
        wx.hideLoading()
        let depositId = res.data.DepositId;
        let pay_info = res.data.pay_info;
        wx.requestPayment({
          'timeStamp': pay_info.timeStamp,
          'nonceStr': pay_info.nonceStr,
          'package': pay_info.package,
          'signType': 'MD5',
          'paySign': pay_info.paySign,
          'success': res => {
            wx.showToast({
              title: '充值成功',
              icon: "none",
              success: res => {
                let putawayBoxId = this.data.putawayBoxId;
                let frameId = this.data.frameId

                if (putawayBoxId) {
                  wx.reLaunch({
                    url: '../tryDetail/tryDetail?putawayBoxId=' + putawayBoxId + "&frameId=" + frameId,
                  })
                }else{
                  wx.navigateBack({})
                  
                }
              }
            })

          },
          'fail': function (res) {
          }
        })


      }
    })
  }
})