function createElement(selectorAndElement, text) {
    if (selectorAndElement.includes('.')) {
        const [element, ...selector] = selectorAndElement.split('.')
        const classValue = selector.join(' ')
        const el = document.createElement(element)
        el.setAttribute('class', classValue)
        if (text) {
            el.appendChild(document.createTextNode(text))
        }
        return el
    } else if (selectorAndElement.includes('#')) {
        const [element, ...selector] = selectorAndElement.split('#')
        const el = document.createElement(element)
        el.setAttribute('id', selector)
        if (text) {
            el.appendChild(document.createTextNode(text))
        }
        return el
    }
}
