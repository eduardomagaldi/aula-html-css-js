function createCodeEnv(wrapperSelector) {
    const wrapper = document.querySelector(wrapperSelector)
    if (!wrapper) return

    createHtml(wrapper)

    let lastValue = {
        html: '',
        css: '',
        js: '',
    }

    const editorArray = [
        createEditor(
            {
                type: 'html',
                value: '<div>div</div>',
                mode: 'xml',
            },
            lastValue,
            wrapper,
        ),
        createEditor(
            {
                type: 'css',
                value: `div {
  color: blue;
}`,
                mode: 'css',
            },
            lastValue,
            wrapper,
        ),
        createEditor(
            {
                type: 'js',
                value: `console.log('foo');`,
                mode: 'javascript',
            },
            lastValue,
            wrapper,
        ),
    ]

    editorArray.forEach((editor) => {
        lastValue[editor.type] = editor.getValue()

        editor.on('change', () => {
            onChange(editor.type, editorArray, lastValue, wrapper)
        })
    })

    onChange('html', editorArray, lastValue, wrapper)
    onChange('css', editorArray, lastValue, wrapper)
    onChange('js', editorArray, lastValue, wrapper)
}

function onChange(type, editorArray, lastValue, wrapper) {
    const values = []

    editorArray.forEach((editor) => {
        const value = editor.getValue().trim()
        values.push(value)
        const hasChanged = value !== lastValue[type]
        if (hasChanged) {
            lastValue[type] = value
        }
    })

    applyToIframe(type, editorArray, wrapper)

    const [html, css, js] = values
    const uuid = get('uuid')
    sendMessage({ uuid, html, css, js })
}

function createHtml(wrapper) {
    const div = document.createElement('div')
    div.setAttribute('class', 'editors')

    const editorHtml = createElement('div.editor-html.editor')
    div.appendChild(editorHtml)

    const editorCss = createElement('div.editor-css.editor')
    div.appendChild(editorCss)

    wrapper.appendChild(div)
    wrapper.appendChild(createElement('div.page'))
}

function createEditor({ type, value, mode }, lastValue, wrapper) {
    const defaultOptions = {
        theme: 'monokai',
        lineNumbers: true,
        gutters: ['CodeMirror-lint-markers'],
        lint: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        matchTags: true,
        autoCloseTags: true,
        lint: { options: { esversion: 2021 } },
    }
    const editor = CodeMirror(wrapper.querySelector('.editor-' + type), {
        ...defaultOptions,
        value,
        mode,
    })
    editor.type = type
    return editor
}

function applyToIframe(type, editorArray, wrapper) {
    let error = ''
    const [editorHtml, editorCss, editorJs] = editorArray
    let [html, css, js] = [
        editorHtml.getValue().trim(),
        editorCss.getValue().trim(),
        editorJs.getValue().trim(),
    ]

    if (type === 'js') {
        try {
            const log = console.log
            console.log = () => {}
            eval(js)
            console.log = log
        } catch (e) {
            error = e
        }
    } else {
        js = ''
    }

    if (isRunnable(error)) {
        if (window.location.host.includes('localhost')) {
            console.log('====================================')
        } else {
            console.clear()
        }

        const iframe = wrapper.querySelector('iframe')

        iframe?.remove()

        const wrapperPage = wrapper.querySelector('.page')
        const newIframe = document.createElement('iframe')
        const template = getTemplate(html, css, js)

        wrapperPage.innerHTML = ''
        wrapperPage.appendChild(newIframe)

        newIframe?.contentWindow?.document.open()
        newIframe?.contentWindow?.document.write(template)
        newIframe?.contentWindow?.document.close()
    }
}

// setInterval(() => {
//   sendMessage({});
// }, 1);

function sendMessage(json) {
    console.log('sendMessage', !!window.ws, window.ws?.readyState)
    if (window.ws && window.ws?.readyState === 1) {
        console.log('sending...')
        ws.send(JSON.stringify(json))
    }
}

function getTemplate(html = '', css = '', js = '') {
    const result = `
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                ${css}
            </style>
        </head>
        <body>
            ${html}

            <script>
                ${js}
            </script>
        </body>
    </html>`

    return result
}

function isRunnable(error) {
    if (!error) {
        return true
    }

    if (error?.includes) {
        return (
            !error?.includes('ReferenceError: c is not defined') ||
            !error?.includes('ReferenceError: co is not defined') ||
            !error?.includes('ReferenceError: con is not defined') ||
            !error?.includes('ReferenceError: cons is not defined') ||
            !error?.includes('ReferenceError: l is not defined') ||
            !error?.includes('ReferenceError: le is not defined') ||
            !error?.includes('ReferenceError: let is not defined')
        )
    }

    return false
}

function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    }
}

function saveInput() {
    console.log('Saving data')
}
