module.exports = '懒加载测试'

const _ = require('lodash')
const array = ['jack', 'tom', 'lucy']

console.log(_.first(array))
console.log(_.last(array))

function getSum (a, b, c) {
  return a + b + c
}

// const curried = _.curry(getSum)
// console.log('test', curried(1, 2))

function curry (func) {
  return function curriedFn (...args) {
    if (args.length < func.length) {
      return function () {
        return curriedFn(...args.concat(Array.from(arguments)))
      }
    }
    return func(...args)
  }
}
const curried = curry(getSum)

curried(1, 2, 3)

// function test (...args) {
//   console.log('test')
//   console.log(...args)
// }
//
// test(1,2,3)

// lodash中提供的组合函数
const reverse = arr => arr.reverse();
const first = arr => arr[0];
const toUpper = s => s.toUpperCase();

// const f = _.flowRight(toUpper, first, reverse)
// console.log(f(['one', 'tow', 'three']))
//
// const numbers = [1, 2, 3, 4, 5]
//
// function getSum2 (total, num) {
//   console.log('total', total)
//   console.log('num', num)
//   return total + num
// }
// let a = numbers.reduce(getSum2, 100)
// console.log(a)

// 生成器
function * foo () {
  console.log('start')
  try {
    const res = yield 'foo'
    console.log('yield', res)
  } catch (e) {
    console.log(e)
  }
}

const generator = foo()
const result = generator.next()
console.log(result)
generator.next('bar')
// generator.throw(new Error('Generator error'))

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'REJECTED'

class MyPromise {
  constructor (executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }
  // promise状态
  // resolve，reject只能修改pending状态
  status = PENDING
  value = undefined
  reason = undefined

  // 保存成功回调、失败回调，在resolve或者reject之后执行，处理异步情况
  // 定义为数组，处理多个回调函数
  successCallback = []
  failCallback = []
  // 定义为箭头函数，resolve，reject函数的this指向promise实例
  resolve = (value) => {
    if (this.status !== PENDING) return;
    this.status = FULFILLED
    // 保存成功后的值
    this.value = value
    while(this.successCallback.length) this.successCallback.shift()()
  }
  reject = (reason) => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    // 保存失败后的原因
    this.reason = reason
    while(this.failCallback.length) this.failCallback.shift()()
  }
  // 在then方法中再创建一个promise对象，事项promise的链式调用
  // 链式调用的then方法处理的是上一个回调函数的返回值，需要先判断该返回值是普通值还是promise对象
  // 如果返回值是普通值，直接调用resolve，如果是promise对象，根据该promise对象的返回状态，调用resolve或者reject
  then(successCallback, failCallback) {
    successCallback = successCallback ? successCallback : value => value
    failCallback = failCallback ? failCallback : reason => { throw reason }
    const promise = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // 通过setTimeout异步执行resolvePromise，为了获取new方法创建的promise实例，因为在构造函数执行过程中访问不到创建成功后的实例对象
        setTimeout(() => {
          try {
            let callbackValue = successCallback(this.value)
            resolvePromise(promise, callbackValue, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let callbackValue = failCallback(this.reason)
            resolvePromise(promise, callbackValue, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else {
        // 处理异步回调函数
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              let callbackValue = successCallback(this.value)
              resolvePromise(promise, callbackValue, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.failCallback.push(() => {
          setTimeout(() => {
            try {
              let callbackValue = failCallback(this.reason)
              resolvePromise(promise, callbackValue, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise
  }

  catch(failCallback) {
    return this.then(undefined, failCallback)
  }

  // 无论当前promise对象状态为何值，传入的回调函数都会执行一次，并且
  finally(callback) {
    return this.then(value => {
      callback()
      return value
    }, reason => {
      callback()
      throw reason
    })
  }

  static all(array) {
    let result = []
    let count = 0
    return new MyPromise((resolve, reject) => {
      function addData (key, value) {
        result[key] = value
        count++
        if (count === array.length) {
          resolve(result);
        }
      }
      array.forEach((current, index) => {
        if (current instanceof MyPromise) {
          current.then(value => addData(index, value), reason => reject(reason))
        } else {
          addData(index, current)
        }
      })
    })
  }

  // 静态resolve方法，如果传入参数是promise对象直接返回该参数，否则生成一个promise对象再返回
  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value))
  }
}
function resolvePromise (promise, value, resolve, reject) {
  // 检测promise是否循环调用，循环调用示例如下
  // const p1 = promise.then(value => {
  //   console.log(value)
  //   return p1
  // })
  if (promise === value) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if (value instanceof MyPromise) {
    value.then(resolve, reject)
  } else {
    resolve(value)
  }
}

const promise = new MyPromise((resolve, reject) => {
  resolve('成功')
  // reject('失败')
})

function other () {
  return new MyPromise((resolve, reject) => {
    resolve('other')
  })
}

// promise.then(value => {
//   console.log(value);
//   return other()
// }).then(value => {
//   console.log(value)
// })





