// pages/shopDetail/shopDetail.js
let util = require('../../utils/util.js');
let config = util.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deposit: 0,
    is_Union: false,
    frameId:"",
    detailData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let frameId = options.frameId;
    console.log(frameId)
    if (frameId) {
      this.setData({
        frameId: frameId
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
    let token = wx.getStorageSync("token");
    // console.log(token=='')
    if(!token){
      util.getAuthKey().then(res => {
        this.init()
      })
    }else{
      
      this.init()
    }
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
  init(){
    //拉取试穿列表
    this.tryNum();
    //拉取详情
    this.getDetail();
    //拉取授权信息
    this.getAccreditStatus().then(res => {
      if (res) {
        this.getDeposit();
      }
    })
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
          deposit: res.data.Price
        })
      }
    })
  },
  tryLog(num) {
    util.request({
      url: config.apiUrl + "/user/tryLog/newLists",
      method: "GET",
      data: {
        type:"ING"
      },
      success: res => {
        let len=res.data.length;
        if (len >= num){
          wx.reLaunch({
            url: '../tryDetail/tryDetail',
          })
        }
      }
    })
  },
  tryNum() {
    util.request({
      url: config.apiUrl + "/user/tryLog/num",
      method: "GET",
      data: {
      },
      success: res => {
        this.setData({
          num: res.data.num
        })
        this.tryLog(res.data.num)
      }
    })
  },
  getDetail: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let FrameId = this.data.frameId;
    util.request({
      url: config.apiUrl + "/user/product/show",
      method: "GET",
      data: {
        FrameId: FrameId
      },
      success: res => {
        // console.log(res)
        wx.hideLoading();
        this.setData({
          detailData:res.data,
          selectPrice: res.data.Price,
        })
      }
    })
  },
  getAccreditStatus() {
    //获取授权状态
    return new Promise((resolve, reject) => {
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

  },
  sizeChange: function (e) {
    let sku = e.currentTarget.dataset.sku;
    let putawayBoxId = e.currentTarget.dataset.boxid;
    let price = e.currentTarget.dataset.price;
    console.log(price)
    let data = {
      selectSku: sku,
      selectPrice: price,
      putawayBoxId: putawayBoxId
    }
    this.setData(data)
  },
  createTry: function () {
    let is_Union = this.data.is_Union;
    let deposit = this.data.deposit;
    let putawayBoxId = this.data.putawayBoxId;
    let frameId = this.data.frameId;
    if(!putawayBoxId){
      wx.showToast({
        title: '请选择尺码',
        icon: "none"
      })
      return
    }
    if (!is_Union){
      //未授权
      wx.navigateTo({
        url: '../login/login?putawayBoxId=' + putawayBoxId + "&frameId=" + frameId,
      })
      return
    }
     if (deposit<=0) {
       //未缴纳押金
       wx.navigateTo({
         url: '../recharge/recharge?putawayBoxId=' + putawayBoxId + "&frameId=" + frameId,
       })
       return
     }
     
    else
    {
      wx.reLaunch({
        url: '../tryDetail/tryDetail?putawayBoxId=' + putawayBoxId + "&frameId=" + frameId,
      })
    }


  }
})