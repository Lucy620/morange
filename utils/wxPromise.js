/**
 * Appi SDK
 * 小程序wx接口Promise化
 */
let fsm = wx.getFileSystemManager()

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  )
}

function promiseify(tar, property) {
  return (...params) => {
    return new Promise(function (resolve, reject) {
      try {
        if (params.length <= 1) {
          let obj = params[0] || {};
          if (typeof obj == 'string') {
            try {
              let b = tar[property](obj)
              resolve(b);
            } catch (e) {
              reject(e);
            }
          } else {
            obj.success = (...args) => {
              resolve(...args)
            };
            obj.fail = (...args) => {
              reject(...args);
            };
            tar[property](obj);
          }
        } else {
          try {
            let b = tar[property](...params);
            resolve(b);
          } catch (e) {
            reject(e);
          }
        }
      } catch (e) {
        reject(e)
      }
    })
  }
}

let wxPromise = {}

for (const key in wx) {
  if (Object.prototype.hasOwnProperty.call(wx, key) && typeof wx[key] === 'function') {
    wxPromise[`${key}`] = promiseify(wx, key);
  }
}

for (const key in fsm) {
  if (Object.prototype.hasOwnProperty.call(fsm, key) && typeof fsm[key] === 'function') {
    wxPromise[`${key}`] = promiseify(fsm, key);
  }
}

module.exports = wxPromise