// pages/tryDetail/tryDetail.js
let util = require('../../utils/util.js');
let config = util.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tryList:[],
    selectIndex:0,
    num:"",
    maxNum:"",
    tryId:"",
    isScoket:false,
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let putawayBoxId = options.putawayBoxId;
    let frameId = options.frameId
    this.tryNum();
    this.tryLog();    
    if (putawayBoxId) {
      this.setData({
        frameId: frameId,
        putawayBoxId: putawayBoxId
      })
      this.createTry();
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
    let isShow = this.data.isShow;
    if(isShow){
      this.tryNum();
      this.tryLog();  
    }
    console.log(2)
      
    this.createSocket();    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let isScoket = this.data.isScoket;
    console.log(1)
    this.setData({
      isShow:true
    })
    if(isScoket){
      wx.closeSocket();
    }
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
  changeImgTips(e){
    let index = e.currentTarget.dataset.index;
    let selectIndex = this.data.selectIndex
    console.log(index)
    if(index==selectIndex){
      this.setData({
        "selectIndex": "-1"
      })
    }else{
      this.setData({
        "selectIndex": index
      })
    }
  },
  createTry(){
    let putawayBoxId = this.data.putawayBoxId;
    wx.showLoading({
      title: '正在打开箱门...',
    })
    return new Promise((resolve, reject)=>{
      util.request({
        url: config.apiUrl + "/user/tryLog/create",
        method: "GET",
        data: {
          BoxId: putawayBoxId
        },
        success: res => {
          this.setData({
            tryId: res.data.TryId
          })
          resolve()
          //wx.hideLoading()
        }
      })
    })
    
  },
  tryLog() {
    util.request({
      url: config.apiUrl + "/user/tryLog/newLists",
      method: "GET",
      data: {
        type:"ING"
      },
      success: res => {
        this.setData({
          tryList:res.data,
          maxNum:res.data.length
        })
      }
    })
  },
  tryNum(){
    util.request({
      url: config.apiUrl + "/user/tryLog/num",
      method: "GET",
      data: {
      },
      success: res => {
        this.setData({
          num:res.data.num
        })
      }
    })
  },
  createSocket: function () {
    
    // if (!this.globalData.isSocket){
    //判断如果长连接未连接，则连接
    wx.connectSocket({
      // url: 'ws://123.56.247.11:8282',
      url: config.wsUrl,//'wss://user.wx.yifengyoujian.com',
      //url: 'wss://user.wx.fangxiangzhineng.com',
      success: res => {
        console.log(res)
      }
    })
    wx.onSocketOpen(res => {
      this.setData({
        isScoket:true
      })
    })
    wx.onSocketError(res => {
      //this.globalData.isSocket = false;
      //this.createSocket()
    })
    wx.onSocketClose(res => {
      // this.globalData.isSocket =false;
      //this.createSocket()
    })
    wx.onSocketMessage(res => {
      
      let data = JSON.parse(res.data)
      console.log(data.Status)
      
      if (data.data) {
        //创建连接
        let client_id = data.data.client_id;
        if (client_id) {
          this.bindUid(client_id)
        }
      }
      if (data.TryId) {
        if (data.Status == 2) {
          //开门
          wx.hideLoading();          
          this.tryLog();                          
        }else if(data.Status==11){
          //关门操作了
          let maxNum=this.data.maxNum;
          let tryList = this.data.tryList;
          let index = tryList.findIndex(res=>{
            return res.TryId == data.TryId;
          })
          console.log(index)
          if(index!=-1){
            maxNum--;
            tryList[index].Status = 11
            this.setData({
              tryList: tryList,
              maxNum: maxNum
            })
            if (maxNum <= 0) {
              let ids = [];
              for (let i = 0; i < tryList.length; i++) {
                ids[i] = tryList[i].TryId
              }
              wx.navigateTo({
                url: '../giveBackSuccess/giveBackSuccess?ids=' + ids.toString(),
              })
            }
          }else{
            let tryId = this.data.tryId
            wx.navigateTo({
              url: '../giveBackSuccess/giveBackSuccess?ids=' + tryId,
            })
          }
          
          
        } else {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            showCancel:false,
            content: data.StatusName,
            success: res=> {
              if (res.confirm) {
                let frameId = this.data.frameId
                wx.reLaunch({
                  url: '../index/index',
                })
                // console.log('用户点击确定')
              }
            }
          })
        }
      }
      console.log('收到服务器内容1：' + res.data)
    })
    // }



  },
  bindUid: function (id) {
    util.request({
      url: config.apiUrl + "/user/socket/bindUid",
      method: "GET",
      data: {
        client_id: id
      },
      success: function (res) {

        // console.log(res)
      }
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