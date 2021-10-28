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
generator.throw(new Error('Generator error'))

