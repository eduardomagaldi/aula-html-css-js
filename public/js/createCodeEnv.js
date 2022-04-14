function createCodeEnv(wrapperSelector, { html, css, js, name }, silent) {
    const wrapper = document.querySelector(wrapperSelector)
    if (!wrapper) return

    createHtml(wrapper, name)

    const editorArray = [
        createEditor(
            {
                type: 'html',
                value: html ?? '<div>div</div>',
                mode: 'xml',
            },
            wrapper,
        ),
        createEditor(
            {
                type: 'css',
                value:
                    css ??
                    `div {
  color: blue;
}`,
                mode: 'css',
            },
            wrapper,
        ),
        // createEditor(
        //     {
        //         type: 'js',
        //         value: js ?? `console.log('foo');`,
        //         mode: 'javascript',
        //     },
        //     wrapper,
        // ),
    ]

    if (!silent) {
        editorArray.forEach((editor) => {
            save(editor.type, editor.getValue())

            editor.on('change', () => {
                onChange(editor.type, editorArray, wrapper)
            })
        })
    }

    onChange('html', editorArray, wrapper, silent)
    onChange('css', editorArray, wrapper, silent)
    onChange('js', editorArray, wrapper, silent)
}

function onChange(type, editorArray, wrapper, silent) {
    console.log('onChange')

    const values = []

    editorArray.forEach((editor) => {
        const value = editor.getValue().trim()
        values.push(value)
        const type = editor.type
        const lastValue = get(type)
        const hasChanged = value !== lastValue
        if (hasChanged) {
            save(type, value)
        }
    })

    applyToIframe(type, editorArray, wrapper)

    if (!silent) {
        console.log('not silent')

        const [html, css, js] = values
        const uuid = get('uuid')
        const name = get('name')

        sendMessage({ name, uuid, html, css, js })
    }
}

function createHtml(wrapper, name) {
    const div = document.createElement('div')
    div.setAttribute('class', 'wrapper-header')

    const header = createElement('div.header')
    header.appendChild(createElement('span.name', name))
    // const a = createElement('a', 'Galera')

    // console.log('a', a)

    // a.setAttribute('href', '/galera')

    const createA = document.createElement('a')
    const createAText = document.createTextNode('Galera')
    createA.setAttribute('href', '/galera')
    createA.setAttribute('target', '_blank')
    createA.appendChild(createAText)
    header.appendChild(createA)

    div.appendChild(header)

    const div2 = document.createElement('div')
    div2.setAttribute('class', 'editors')

    const editorHtml = createElement('div.editor-html.editor')
    div2.appendChild(editorHtml)

    const editorCss = createElement('div.editor-css.editor')
    div2.appendChild(editorCss)

    div.appendChild(div2)

    wrapper.appendChild(div)
    wrapper.appendChild(createElement('div.page'))
}

function createEditor({ type, value, mode }, wrapper) {
    // console.log('type', type)
    // console.log('value', value)

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
    console.log('applyToIframe')

    let error = ''
    const [editorHtml, editorCss, editorJs] = editorArray
    let [html, css] = [
        editorHtml.getValue().trim(),
        editorCss.getValue().trim(),
        // editorJs.getValue().trim(),
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

    console.log('out if')

    if (isRunnable(error)) {
        if (window.location.host.includes('localhost')) {
            console.log('====================================')
        } else {
            console.clear()
        }

        const iframe = wrapper.querySelector('iframe')

        iframe?.remove()

        const wrapperPage = wrapper.querySelector('.page')

        console.log('wrapperPage', wrapperPage)

        const newIframe = document.createElement('iframe')
        const template = getTemplate(html, css, js)

        wrapperPage.innerHTML = ''
        wrapperPage.appendChild(newIframe)

        newIframe?.contentWindow?.document.open()
        newIframe?.contentWindow?.document.write(template)
        newIframe?.contentWindow?.document.close()
    }
}

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
