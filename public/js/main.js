const defaultOptions = {
  theme: 'monokai',
  lineNumbers: true,
}

const editorHtml = CodeMirror(
  document.querySelector('#editor-html'),
  {
    ...defaultOptions,
    value: '<!-- <div></div> -->',
    mode: 'xml',
    matchTags: true,
    autoCloseTags: true,
  }
)

editorHtml.on('change', () => {
    onChange()
})

const editorCss = CodeMirror(
  document.querySelector('#editor-css'),
  {
    ...defaultOptions,
    value: `/* div {
  color: blue;
} */`,
    mode: 'css',
    matchBrackets: true,
    autoCloseBrackets: true,
  }
)
editorCss.on('change', () => {
    onChange()
})

const editorJs = CodeMirror(
  document.querySelector('#editor-js'),
  {
    ...defaultOptions,
    placeholder: document.querySelector('#placeholder-js'),
    value: '// console.log(\'foo\')',
    mode: 'javascript',
    matchBrackets: true,
    autoCloseBrackets: true,
    lint: {options: {esversion: 2021}},
  }
)
editorJs.on('change', () => {
    onChange()
})

function applyToIframe(html, css, js) {
    const iframe = document.querySelector('iframe')
    const template = getTemplate(html, css, js)

    iframe.contentWindow.document.open()
    iframe.contentWindow.document.write(template)
    iframe.contentWindow.document.close()
}

function onChange() {
    const html = editorHtml.getValue()
    const css = editorCss.getValue()
    const js = editorJs.getValue()

    applyToIframe(html, css, js)
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

// <style>
// body {
//     background-color: white;
//     font-size: 20px;
// }
// </style>