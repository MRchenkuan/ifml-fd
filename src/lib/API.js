let API = {}
let ENV = {}
import { Loading, Message } from 'element-ui'
import router from '../router'
import 'fetch-polyfill'

switch (location.host) {
  case 'ifml.me':
    ENV = {
      ifsys: 'http://119.23.29.194/',
      project: 'http://119.23.29.194/project/'
    }
    break
  case '119.23.29.194':
    ENV = {
      ifsys: 'http://119.23.29.194/',
      project: 'http://119.23.29.194/project/'
    }
    break
  default:
    ENV = {
      ifsys: 'http://119.23.29.194/',
      project: 'http://119.23.29.194/project/'
    }
}
let requestQueue = []
/**
 * POST请求方法
 * @param url 请求地址
 * @param param 请求参数
 * @param silence 是否不显示loading图
 * @returns {Promise}
 * @private
 */
function _request (url, param, silence) {
  let req = new Promise(function (resolve, reject) {
    $.ajax({
      url: url,
      type: "post",
      success: function(data){
        resolve(data)
      },
      error:function(data){
        reject(data)
      },
      data: JSON.stringify(param),
      //dataType: 'jsonp',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      contentType: "application/json"
    });

    /**
     * fetch ver.
     */
    // let promise = fetch(url, {
    //   method: 'POST',
    //   body: JSON.stringify(param),
    //   mode: 'cors',credentials: 'include'
    // })

    // promise.then((res) => {
    //   return res.json()
    // }).catch((err) => {
    //   reject(err)
    // }).then((data) => {
    //   resolve(data)
    // }).catch((err) => {
    //   reject(err)
    // })
  })

  // 加载
  // let options = loadingTarget ? {target: loadingTarget} : {fullscreen: true}
  let loading = silence || Loading.service({fullscreen: true})

  // 管理请求队列
  silence || requestQueue.push(req)
  Promise.all(requestQueue).then(() => {
    requestQueue = []
    silence || loading.close()
  }).catch((err) => {
    console.log(err)
    Message({
      message: err.toString(),
      type: 'error'
    })
    silence || loading.close()
  })
  req.then(data => {
    if (data.rspCd === '30002') {
      router.push('/login')
    }

    if (data.rspCd === 'D0001') {
      Message({
        message: '权限不够'
      })
      router.push('/')
    }
  })
  return req
}

API.whoAmI = function () {
  return _request(ENV.ifsys + 'whoAmI.do', {})
}

API.getAllProjectInfo = function () {
  return _request(ENV.project + 'getAllProjectInfo.do', {})
}

API.getAllProductInfo = function (pid) {
  return _request(ENV.project + 'getAllProductInfo.do', {
    type: 'all',
    pid: `${pid}`
  })
}

API.getFeedList = function (pid, silence) {
  return _request(ENV.ifsys + 'getIfsysFeed.do', {
    pid: pid,
    limit: 200
  }, silence)
}

API.getInterfaceList = function (pid, proId, pageNum, silence) {
  return _request(ENV.ifsys + 'getallifsys.do', {
    'ifName': '',
    'ifProId': ~~proId || null,
    'pageNum': pageNum,
    'pid': pid
  }, silence)
}

API.createProduct = function (pid, proName, remark) {
  return _request(ENV.project + 'createProduct.do', {
    pid: pid,
    proName: proName,
    remark: remark
  })
}

API.createProject = function (proName, remark, projectColor) {
  return _request(ENV.project + 'createProject.do', {
    name: proName,
    desc: remark,
    sign: projectColor
  })
}

API.getMemberList = function (pid) {
  return _request(ENV.ifsys + 'getMemberList.do', {
    pid: pid
  })
}

API.getInterfaceBasicInfo = function (ifId, silence) {
  return _request(ENV.ifsys + 'queryInterFaceById.do', {'interFaceInfo': {'id': ifId}}, silence)
}
API.getInterfaceFieldsDetail = function (ifId, silence) {
  return _request(ENV.ifsys + 'getInterfaceDetail.do', {'ifId': ifId}, silence)
}
API.getInterfaceChanges = function (ifId, silence) {
  return _request(ENV.ifsys + 'getInterfaceChanges.do', {'ifId': ifId}, silence)
}

API.saveInterfaceDetail = function (interfaceInfo, advance, silence) {
  interfaceInfo.advance = advance
  return _request(ENV.ifsys + 'saveInterfaceDetail.do', interfaceInfo, silence)
}

// 用户登录接口
API.login = function (username, password, silence) {
  return _request(ENV.ifsys + 'login.do', {userInfo: {
    loginName: username,
    loginPassword: password
  }}, silence)
}
// 用户登出
API.logout = function () {
  return _request(ENV.ifsys + 'logout.do', {})
}

// 用户注册接口
API.regByEmail = function (nickname, email, pass, silence) {
  return _request(ENV.ifsys + 'regByEmail.do', {
    nickname: nickname,
    email: email,
    pass: pass
  }, silence)
}

// 全局搜索用户接口
API.searchUsers = function (key, silence) {
  return _request(ENV.ifsys + 'searchUsers.do', {key: key}, silence)
}

// 添加用户接口
API.addProjectMember = function (pid, email, userId, memberType, silence) {
  return _request(ENV.ifsys + 'addProjectMember.do', {
    pid: pid,
    email: email,
    userId: userId,
    memberType: memberType
  }, silence)
}

// 搜索接口方法
API.searchInterfaces = function (keywords, pid, proId, pageNum) {
  return _request(ENV.ifsys + 'getallifsys.do', {
    'ifName': keywords,
    'ifProId': ~~proId || null,
    'pageNum': pageNum,
    'pid': pid
  })
}

// 关注接口方法
API.followInterface = function (ifId, remark, silence) {
  return _request(ENV.ifsys + 'followInterface.do', {
    'ifId': `${ifId}`,
    'remark': remark
  }, silence)
}
export default API
