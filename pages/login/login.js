// pages/login/login.js
let util = require('../../utils/util.js');
let config = util.config;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // loginType:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let putawayBoxId = options.putawayBoxId
    let frameId = options.frameId
    if (putawayBoxId){
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // bindLogin: function () {
  //   wx.showLoading({
  //     title: '授权中...',
  //   })
  //   util.getAuthKey().then(res => {
  //     console.log(res)
  //     //判断是直接
  //     wx.hideLoading()
  //     // this.getUser()
  //     // this.getDeposit().then(res=>{
        
  //     // })
  //   })
  // },
  getUserInfoAuthKey(e){
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      wx.showToast({
        title: '您取消了授权，请允许授权才能继续使用',
        icon: "none"
      })
    } else {
      // this.bindLogin();
      let data=e.detail;
      this.updateUnionId(data);
      
    }
  },
  updateUnionId(data){
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
            JsCode:code,
            encryptedData: data.encryptedData,
            iv: data.iv,
            signature: data.signature
          },
          success: res => {
            //成功后跳到购买页面
            wx.hideLoading();
            let putawayBoxId = this.data.putawayBoxId;
            let frameId = this.data.frameId
            if(putawayBoxId){
              wx.navigateTo({
                //url: '../tryDetail/tryDetail?putawayBoxId=' + putawayBoxId + "&frameId=" + frameId,
//原有流程授权后直接跳转押金页面
                 url: '../recharge/recharge?putawayBoxId=' + putawayBoxId + "&frameId=" + frameId,
              })
            }
          }
        })
      }
    })
  }
})