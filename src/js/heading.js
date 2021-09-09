export default () => {
    const element = document.createElement('div')

    element.textContent = 'Hello world' + '12312312'
    element.addEventListener('click', () => {
        alert('hello world')
        // console.log('update')
    })
    return element
}