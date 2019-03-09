// pages/myDeposit/myDeposit.js
let App2 = getApp();
let util = require('../../utils/util.js');
let config = util.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: 0,
    deposit: 0,
    is_Union:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAccreditStatus().then(res=>{
      if(res){
        this.getDeposit();        
      }
    })
    this.getDepositNum();
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
  getDeposit: function () {
    wx.showLoading({
      title: '加载中...',
    })
    util.request({
      url: config.apiUrl + "/user/deposit/show",
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
  //获取押金金额
  getDepositNum: function () {
    util.request({
      url: config.apiUrl + "/user/deposit/num",
      method: "GET",
      data: {},
      success: res => {
        this.setData({
          deposit: res.data.Price
        })
      }
    })
  },
  refundCom: function () {
    wx.showModal({
      title: '提示',
      content: '您不再继续试穿了么？',
      cancelText: "继续试穿",
      confirmText: "退押金",
      success: res => {
        if (res.confirm) {
          this.refund()
        } else if (res.cancel) {

        }
      }
    })
  },
  refund: function () {
    //退押金
    wx.showLoading({
      title: '加载中...',
    })


    util.request({
      url: config.apiUrl + "/user/deposit/refund",
      method: "GET",
      data: {},
      success: res => {
        wx.hideLoading()
        this.setData({
          price: 0
        })
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '已经退款成功,请稍后查看',
          success: res => {

          }
        })
      }
    })
  },
  recharge: function (e) {
    let is_Union = this.data.is_Union;
    if(is_Union){
      wx.navigateTo({
        url: '../recharge/recharge'
      })
    }else{
      if (e.detail.errMsg == "getUserInfo:fail auth deny") {
        wx.showToast({
          title: '您取消了授权，请允许授权才能继续使用',
          icon: "none"
        })
      } else {
        // this.bindLogin();
        let data = e.detail;
        this.updateUnionId(data);

      }
    }
    
  },
  updateUnionId(data) {
    wx.showLoading({
      title: '授权中...',
    })
    wx.login({
      success: res => {
        let code = res.code;
        util.request({
          url: config.apiUrl + "/user/member/updateUnionId",
          method: "GET",
          data: {
            JsCode: code,
            encryptedData: data.encryptedData,
            iv: data.iv,
            signature: data.signature
          },
          success: res => {
            //成功后跳到购买页面
            wx.hideLoading()
            wx.navigateTo({
              url: '../recharge/recharge'
            })
          }
        })
      }
    })
  },
  getAccreditStatus(){
    //获取授权状态
    return new Promise((resolve, reject)=>{
      util.request({
        url: config.apiUrl + "/user/member/getAccreditStatus",
        method: "GET",
        data: {},
        success: res => {
          this.setData({
            is_Union: res.data.is_Union
          })
          resolve(res.data.is_Union)
        }
      })
    })
    
  }
})