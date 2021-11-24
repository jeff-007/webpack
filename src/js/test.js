//
// const _ = require('lodash')
// const array = ['jack', 'tom', 'lucy']
//
// console.log(_.first(array))
// console.log(_.last(array))
//
// function getSum (a, b, c) {
//   return a + b + c
// }
//
// // const curried = _.curry(getSum)
// // console.log('test', curried(1, 2))
//
// function curry (func) {
//   return function curriedFn (...args) {
//     if (args.length < func.length) {
//       return function () {
//         return curriedFn(...args.concat(Array.from(arguments)))
//       }
//     }
//     return func(...args)
//   }
// }
// const curried = curry(getSum)
//
// curried(1, 2, 3)
//
// // function test (...args) {
// //   console.log('test')
// //   console.log(...args)
// // }
// //
// // test(1,2,3)
//
// // lodash中提供的组合函数
// const reverse = arr => arr.reverse();
// const first = arr => arr[0];
// const toUpper = s => s.toUpperCase();
//
// // const f = _.flowRight(toUpper, first, reverse)
// // console.log(f(['one', 'tow', 'three']))
// //
// // const numbers = [1, 2, 3, 4, 5]
// //
// // function getSum2 (total, num) {
// //   console.log('total', total)
// //   console.log('num', num)
// //   return total + num
// // }
// // let a = numbers.reduce(getSum2, 100)
// // console.log(a)
//
// // 生成器
// function * foo () {
//   console.log('start')
//   try {
//     const res = yield 'foo'
//     console.log('yield', res)
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// const generator = foo()
// const result = generator.next()
// console.log(result)
// generator.next('bar')
// // generator.throw(new Error('Generator error'))
//
// const PENDING = 'pending';
// const FULFILLED = 'fulfilled';
// const REJECTED = 'REJECTED'
//
// class MyPromise {
//   constructor (executor) {
//     try {
//       executor(this.resolve, this.reject)
//     } catch (e) {
//       this.reject(e)
//     }
//   }
//   // promise状态
//   // resolve，reject只能修改pending状态
//   status = PENDING
//   value = undefined
//   reason = undefined
//
//   // 保存成功回调、失败回调，在resolve或者reject之后执行，处理异步情况
//   // 定义为数组，处理多个回调函数
//   successCallback = []
//   failCallback = []
//   // 定义为箭头函数，resolve，reject函数的this指向promise实例
//   resolve = (value) => {
//     if (this.status !== PENDING) return;
//     this.status = FULFILLED
//     // 保存成功后的值
//     this.value = value
//     while(this.successCallback.length) this.successCallback.shift()()
//   }
//   reject = (reason) => {
//     if (this.status !== PENDING) return
//     this.status = REJECTED
//     // 保存失败后的原因
//     this.reason = reason
//     while(this.failCallback.length) this.failCallback.shift()()
//   }
//   // 在then方法中再创建一个promise对象，事项promise的链式调用
//   // 链式调用的then方法处理的是上一个回调函数的返回值，需要先判断该返回值是普通值还是promise对象
//   // 如果返回值是普通值，直接调用resolve，如果是promise对象，根据该promise对象的返回状态，调用resolve或者reject
//   then(successCallback, failCallback) {
//     successCallback = successCallback ? successCallback : value => value
//     failCallback = failCallback ? failCallback : reason => { throw reason }
//     const promise = new MyPromise((resolve, reject) => {
//       if (this.status === FULFILLED) {
//         // 通过setTimeout异步执行resolvePromise，为了获取new方法创建的promise实例，因为在构造函数执行过程中访问不到创建成功后的实例对象
//         setTimeout(() => {
//           try {
//             let callbackValue = successCallback(this.value)
//             resolvePromise(promise, callbackValue, resolve, reject)
//           } catch (e) {
//             reject(e)
//           }
//         }, 0)
//       } else if (this.status === REJECTED) {
//         setTimeout(() => {
//           try {
//             let callbackValue = failCallback(this.reason)
//             resolvePromise(promise, callbackValue, resolve, reject)
//           } catch (e) {
//             reject(e)
//           }
//         }, 0)
//       } else {
//         // 处理异步回调函数
//         this.successCallback.push(() => {
//           setTimeout(() => {
//             try {
//               let callbackValue = successCallback(this.value)
//               resolvePromise(promise, callbackValue, resolve, reject)
//             } catch (e) {
//               reject(e)
//             }
//           }, 0)
//         })
//         this.failCallback.push(() => {
//           setTimeout(() => {
//             try {
//               let callbackValue = failCallback(this.reason)
//               resolvePromise(promise, callbackValue, resolve, reject)
//             } catch (e) {
//               reject(e)
//             }
//           }, 0)
//         })
//       }
//     })
//     return promise
//   }
//
//   catch(failCallback) {
//     return this.then(undefined, failCallback)
//   }
//
//   // 无论当前promise对象状态为何值，传入的回调函数都会执行一次，并且
//   finally(callback) {
//     return this.then(value => {
//       callback()
//       return value
//     }, reason => {
//       callback()
//       throw reason
//     })
//   }
//
//   static all(array) {
//     let result = []
//     let count = 0
//     return new MyPromise((resolve, reject) => {
//       function addData (key, value) {
//         result[key] = value
//         count++
//         if (count === array.length) {
//           resolve(result);
//         }
//       }
//       array.forEach((current, index) => {
//         if (current instanceof MyPromise) {
//           current.then(value => addData(index, value), reason => reject(reason))
//         } else {
//           addData(index, current)
//         }
//       })
//     })
//   }
//
//   // 静态resolve方法，如果传入参数是promise对象直接返回该参数，否则生成一个promise对象再返回
//   static resolve(value) {
//     if (value instanceof MyPromise) return value;
//     return new MyPromise(resolve => resolve(value))
//   }
// }
// function resolvePromise (promise, value, resolve, reject) {
//   // 检测promise是否循环调用，循环调用示例如下
//   // const p1 = promise.then(value => {
//   //   console.log(value)
//   //   return p1
//   // })
//   if (promise === value) {
//     return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
//   }
//   if (value instanceof MyPromise) {
//     value.then(resolve, reject)
//   } else {
//     resolve(value)
//   }
// }
//
// const promise = new MyPromise((resolve, reject) => {
//   resolve('成功')
//   // reject('失败')
// })
//
// function other () {
//   return new MyPromise((resolve, reject) => {
//     resolve('other')
//   })
// }
//
// promise.then(value => {
//   console.log(value);
//   return other()
// }).then(value => {
//   console.log(value)
// })
//
// const person = {}
// const personProxy = new Proxy(person, {
//   deleteProperty (target, p) {
//     console.log('delete', p)
//     delete target[p]
//   }
// })
// delete personProxy.age
// console.log(person)

// const obj = {
//   name: 'zce',
//   age: 18
// }
// console.log(Reflect.has(obj, 'name'))
// console.log(Reflect.deleteProperty(obj, 'age'))
// console.log(Reflect.ownKeys(obj))
//
// const m = new Map()
// const tom = { name: 'tom' }
// m.set(tom, 90)
// console.log(m)


class Vue {
  constructor (options) {
    // 1. 通过属性保存选项的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.getElementById(options.el) : options.el

    // 2. 把data中的成员转换成getter和setter，注入到vue示例中，方便后续直接使用this调用
    this._proxyData(this.$data)
    // 3. 调用observer对象，监听data中的数据变化，监听到变化后通知Dep
    new Observer(this.$data)
    // 4. 调用compiler对象，解析指令和插值表达式并替换成相应的数据
    new Compiler(this)
  }
  _proxyData(data) {
    // 遍历data对象中的所有属性
    Object.keys(data).forEach(key => {
      // 把data中的属性注入到vue实例中，这里使用箭头函数，this指向vue实例
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get () {
          return data[key]
        },
        set (newValue) {
          if (newValue === data[key]) return
          data[key] = newValue
        }
      })
    })
  }
}

class Observer {
  constructor (data) {
    this.walk(data)
  }
  // 遍历data中的所有属性，执行defineReactive
  walk(data) {
    // 1. 判断data是否是对象
    if (!data || typeof data !== 'object') return

    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  // 通过调用Object.defineProperty将属性转换为定义响应式数据（即getter和setter）
  defineReactive(obj, key, val) {
    const that = this
    // 对每一个响应式属性创建dep收集依赖，然后当数据改变时在setter中发送通知
    let dep = new Dep()
    // 如果val是对象，也需要把val内部的属性转换成响应式数据
    this.walk(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set (newValue) {
        if (newValue === val) return
        val = newValue
        // 如果新的赋值是对象，也需要将其转换为响应式数据
        that.walk(newValue)
        // 监听到值发生变化后，发送通知
        dep.notify()
      }
    })
  }
}

class Compiler {
  constructor (vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }
  // 编译模板，处理文本节点、元素节点
  // 使用childNodes遍历所有节点，childNodes获取到的是一个伪数组，需要通过Array转换成数组才能使用数组的各个方法
  compile(el) {
    if (el) {
      let childNodes = el.childNodes
      Array.from(childNodes).forEach(node => {
        if (this.isTextNode(node)) {
          // 处理文本节点
          this.compileText(node)
        } else if (this.isElementNode(node)) {
          // 处理元素节点
          this.compileElement(node)
        }
        // 递归调用compile处理node的子节点
        if (node.childNodes && node.childNodes.length) {
          this.compile(node)
        }
      })
    }
  }
  // 编译元素节点，处理指令
  compileElement(node) {
    // 遍历当前dom的所有属性节点
    Array.from(node.attributes).forEach(attr => {
      // 属性节点对象中的name，value字段分别表示当前属性的属性名和属性值
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        // v-text ---> text
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      }
    })
  }
  update(node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    // 使用call改变this指向，使任何时候调用updateFn时this均指向Compiler对象
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }
  // 处理v-text指令
  textUpdater(node, value, key) {
    node.textContent = value
    // 创建watcher对象，当数据改变时更新视图
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }
  // 处理v-model指令
  modelUpdater(node, value, key) {
    node.value = value
    // 创建watcher对象，当数据改变时更新视图
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })
    // 处理双向绑定，监听节点的input事件，并将绑定的属性更新为input事件更新的值
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  // 编译文本节点，处理差值表达式
  compileText(node) {
    // textContent获取节点的文本内容
    // 使用正则表达式匹配文本中的差值表达式
    // .匹配任意的单个字符，不包括换行，+表示匹配一次或者多次，?使用非贪婪模式，尽可能早的结束正则匹配
    // 使用()分组匹配差值表达式中{{}}里的内容，RegExp.$1表示获取第一个分组中的内容
    // 最后将节点的文本内容替换成vm实例中对应的值
    const reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      // 创建watcher对象，当数据改变时更新视图
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }
  // 判断元素属性是否是指令，即判断是否以v-开头
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  // 判断元素是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  // 判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}

class Dep {
  constructor () {
    // 存储所有的观察者
    this.subs = []
  }
  // 添加观察者
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  // 发送通知
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

class Watcher {
  constructor (vm, key, cb) {
    this.vm = vm
    // data中的属性名称
    this.key = key
    // 回调函数负责更新视图
    this.cb = cb
    // 把watcher对象记录到Dep类的静态属性target
    Dep.target = this
    // 触发Observer中的get方法，从而调Dep的addSub方法，将watcher添加到Dep中
    this.oldValue = vm[key]
    // 防止重复添加watcher
    Dep.target = null
  }
  // 当数据发生变化时，更新视图
  update() {
    let newValue = this.vm[this.key]
    if (this.oldValue === newValue) return
    this.cb(newValue)
  }
}

// let vm = new Vue({
//   el: '#app',
//   data: {
//     msg: 'hello vue',
//     count: 10,
//     person: {
//       name: '123'
//     }
//   }
// })

// Dep在data的getter中收集依赖，每一个响应式属性都会创建一个dep对象，负责收集所有依赖该属性的位置，而所有依赖该属性的位置都会设置一个watcher，即dep收集的是依赖该属性的watcher对象
// Dep在data的setter中通知依赖，当属性的值发生变化时，调用dep的notify方法，通知watcher调用update方法

// console.log(vm)
// console.log(vm.msg)




