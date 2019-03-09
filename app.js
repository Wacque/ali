//app.js
let util = require('./utils/util.js');
let config = util.config;

App({
  userInfo: null,

  onLaunch: function() {
    let self = this;
    //展示本地存储能力
    var logs = my.setStorageSync({key: 'logs' // 缓存数据的key
    }) || []
    // logs.unshift(Date.now())
    my.setStorageSync({
      key: 'logs', // 缓存数据的key
      data: 'logs', // 要缓存的数据
    });
    my.onNetworkStatusChange(res=>{
      //网络监听，切换网络，就重连
      console.log(res.isConnected)
      console.log(res.networkType)
      let arg = util.getCurrentPageUrlWithArgs();
      let bool = /frameId=/.test(arg);

      //closeSocket()
      if (res.isConnected && bool) {
        this.globalData.isSocket = false;
        this.createSocket()
      }
    })
  },
  onHide:function() {

  },
  createSocket:function() {
    //创建socket
    try{
      my.closeSocket()
    } catch(e) {

    }
    //判断如果长连接未连接，则连接
    my.connectSocket({
      //url: 'wss://123.56.247.11:8282',
      url: config.wsUrl, //'wss://user.wx.yifengyoujian.com',
      //url: 'wss://user.wx.fangxiangzhineng.com',
      success: res => {
        console.log(res)
      }
    })

    my.onSocketOpen(res => {
      console.log(res)
      this.globalData.isSocket = true;
    })

    my.onSocketError(res => {
      this.globalData.isSocket = false;
      this.createSocket()
    })
    
    my.onSocketClose(res => {
        //this.globalData.isSocket = false;
        //this.createSocket()
    })

    my.onSocketMessage(res => {
      let data = JSON.parse(res.data)
      //let tryId = this.data.tryId;
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
          my.hideLoading();
          my.navigateTo({
            url: '../tryDetail/tryDetail?tryId=' + data.TryId,
          })
        } else {
          my.showToast({
              title: data.StatusName,
              icon: "none"
          })
        }
        my.closeSocket()
      }
      console.log('收到服务器内容1：' + res.data)
    })
  },

  bindUid:function(id) {
    util.request({
      url: config.apiUrl + "/user/socket/bindUid",
      method: "GET",
      data: {
        client_id: id
      },
      success:function(res) {

      }
    })
  },

  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo);

      my.getAuthCode({
        scopes: ['auth_user'],
        success: authcode => {
          console.info(authcode);

          my.getAuthUserInfo({
            success: res => {
              this.userInfo = res;
              resolve(this.userInfo);
            },
            fail: () => {
              reject({});
            },
          });
        },
        fail: () => {
          reject({});
        },
      });
    });
  },

   globalData: {
    isSocket:false,
    userInfo: null
  }
});
