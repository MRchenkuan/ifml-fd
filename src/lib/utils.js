// 时间戳转换
function tmStampToTime (tmStamp) {
  let dateObj = new Date(tmStamp)
  return dateObj.getFullYear() + '-' +
    ('00' + (dateObj.getMonth() + 1)).substr(-2) + '-' +
    ('00' + (dateObj.getDate())).substr(-2, 2) + ' ' +
    ('00' + dateObj.getHours()).substr(-2, 2) + ':' +
    ('00' + dateObj.getMinutes()).substr(-2, 2) + ':' +
    ('00' + dateObj.getSeconds()).substr(-2, 2)
}

// 纯数组对象数组深度拷贝方法
function deepCopyArrayObject (list) {
  let result = []
  if (list) {
    list.forEach((it) => {
      result.push(deepCopyObject(it))
    })
  }
  return result
}

// 纯对象深度拷贝方法
function deepCopyObject (source) {
  let result = {}
  for (let key in source) {
    if (source.hasOwnProperty(key)) { result[key] = typeof source[key] === 'object' ? deepCopyObject(source[key]) : source[key] }
  }
  return result
}
// ES6 的对象克隆
function clone (origin) {
  let originProto = Object.getPrototypeOf(origin)
  return Object.assign(Object.create(originProto), origin)
}

export default {
  tmStampToTime,
  deepCopyArrayObject,
  deepCopyObject,
  clone
}
