export default () => {
  const element = document.createElement('div')

  element.textContent = 'Hello world'
  element.addEventListener('click', () => {
    alert('hello world')
    // console.log('update')
  })
  return element
}
