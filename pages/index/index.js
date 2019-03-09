// pages/index/index.js
let util = require('../../utils/util.js');
let config = util.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    tryList: [],
    isloadList: false,
    isEnd: false,
    page: 1,
    price:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getDeposit();
    this.getBanner();
    util.getAuthKey().then(res=>{
      this.tryNum();      
      this.getList();    
    })
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
    let isloadList = this.data.isloadList;
    let isEnd = this.data.isEnd;
    if (!isloadList && !isEnd) {
      this.getList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //获得轮播图
  getBanner () {
    util.request({
      url: config.apiUrl + "/user/product/banner",
      method: "GET",
      data: {
      },
      success: res => {
        this.setData({
          banners: res.data
        })
      }
    })
  },
  scanCode () {
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
  getList () {
    let page = this.data.page;
    this.setData({
      isloadList: true
    })
    util.request({
      url: config.apiUrl + "/user/tryLog/newLists",
      method: "GET",
      data: {
        page: page,
        type:"END"
      },
      success: res => {
        let lists = this.data.tryList;
        let page = this.data.page;
        let len = res.data.length;
        let isEnd = false;
        if (len == 0) {
          isEnd = true
        }
        for (let i = 0; i < len; i++) {
          lists.push(res.data[i])
        }

        page = Number(page) + 1;
        this.setData({
          tryList: lists,
          page: page,
          isEnd: isEnd,
          isloadList: false
        })
      }
    })
  },
  // routerDetail (e) {
  //   let tryId = e.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: '../tryDetail/tryDetail?tryId=' + tryId,
  //   })
  // },
  goBuy(e){
    wx.navigateToMiniProgram({
      appId: 'wx999a0d532ea792fd',
      path: 'pages/goods/detail/index?alias=2oversd9dg5g8',
      extraData: {
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  },
  routerDeposit(){
    wx.navigateTo({
      url: '../myDeposit/myDeposit',
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
        let len = res.data.length;
        if (len >= num) {
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
})