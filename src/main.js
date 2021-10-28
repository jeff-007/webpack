// import './css/index.css'
// import defaultBg from './img/bg.jpg'
// import createHeading from './js/heading'
import './js/test'
//
// const heading = createHeading()
// const bg = new Image()
// bg.src = defaultBg
//
// document.body.append(heading)
// document.body.append(bg)

let btn = document.getElementById('btn')

btn.addEventListener('click', function () {
  import('./js/test.js').then((test) => {
    console.log(test)
  })
})

console.log('执行')
