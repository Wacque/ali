// let App = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const  request = opts =>{
  let _opts = opts||{};
  let _header = _opts.header || { 'content-type': 'application/x-www-form-urlencoded'};
  let _token = my.getStorageSync("token");
  let _callback=opts.callback;
  if (_token) {
    // _header.Cookie = "token=" + _token
    _opts.data.token=_token;
  }
  my.request({
    url: _opts.url, //
    data: _opts.data,
    header: _header,
    method: _opts.method,
    success: function (res) {
      let data = res.data;
      let code=data.code;
      // console.log(App)
      if(code==0){
        _opts.success(res.data);
      }else if(code==99){
        //重新登录
        getAuthKey().then(res=>{
          request(opts)
        })
        // console.log(getAuthKey);
      }else{
        console.log(res.data);
        console.log(_opts);
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: data.msg,
          showCancel:false,
          success: function (res) {
            if (typeof _callback =="function"){
              _callback();
            }
          }
        })
      }
      // let data=res.data;
      // console.log(res.data);
      // let newData = JSON.parse(data);
      
    },
    fail: _opts.fail

  })
}

//公方法登陆
let getAuthKey=function() {
  return new Promise(function (resolve, reject) {
    my.getAuthCode({
      success: res => {
        let code = res.code;
        // console.log(res.code)
        getToken(code, resolve)
        // getSetting(code, resolve);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  })
}


let getToken = function (code, resolve) {
  request({
    url: config.apiUrl + "/user/member/newGetToken",
    method: "GET",
    data: {
      JsCode: code
    },
    success: function (res) {
      let token = res.data.token;
      // let data= JSON.parse(res.data);
      wx.setStorageSync('token', token);
      //getUser()
      resolve(res);
      // console.log(res)
    }
  })
}

/*获取当前页url*/
function getCurrentPageUrl() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

const config={
  // apiUrl:"https://container.hidev.cn"
  //apiUrl:"https://xcx.wx.yifengyoujian.com",
  apiUrl:"https://xcx.wx.fangxiangzhineng.com",
  //wsUrl:"wss://user.wx.yifengyoujian.com"
  wsUrl: "wss://user.wx.fangxiangzhineng.com"
}



module.exports = {
  formatTime: formatTime,
  request: request,
  getAuthKey: getAuthKey,
  config: config,
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs
}
