import './css/index.css'
import defaultBg from './img/bg.jpg'
import createHeading from './js/heading'

const heading = createHeading()
const bg = new Image()
bg.src = defaultBg

document.body.append(heading)
document.body.append(bg)