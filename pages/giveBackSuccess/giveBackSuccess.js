// pages/giveBackSuccess/giveBackSuccess.js
let App1 = getApp();
let util = require('../../utils/util.js');
let config = util.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tryList: [],
    ids:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ids=options.ids;
    if(ids){
      this.setData({
        ids:ids
      })
    }
    this.tryLog();
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
  tryLog() {
    wx.showLoading({
      title: '加载中..',
    })
    let ids=this.data.ids;
    util.request({
      url: config.apiUrl + "/user/tryLog/newLists",
      method: "GET",
      data: {
        type: "IDS",
        ids: ids
      },
      success: res => {
        wx.hideLoading()
        this.setData({
          tryList: res.data
        })
      }
    })
  },
  routerDeposit(){
    wx.navigateTo({
      url: '../myDeposit/myDeposit',
    })
  },
  routerDetail(e){
    let frameId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../shopDetail/shopDetail?frameId=' + frameId,
    })

  },
  scanCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        let data = decodeURIComponent(res.result);
        let path = res.path.replace("pages", "..");
        wx.navigateTo({
          url: path
        })
      }
    })
  },
})