const defaultOptions = {
  theme: "monokai",
  lineNumbers: true,
  gutters: ["CodeMirror-lint-markers"],
  lint: true,
};

let lastValue = {
  html: "",
  css: "",
  js: "",
};

let lock = false;

const editorHtml = CodeMirror(document.querySelector("#editor-html"), {
  ...defaultOptions,
  value: "<div>div</div>",
  mode: "xml",
  matchTags: true,
  autoCloseTags: true,
});

editorHtml.on("change", () => {
  onChange();
});

lastValue.html = editorHtml.getValue();

const editorCss = CodeMirror(document.querySelector("#editor-css"), {
  ...defaultOptions,
  value: `div {
  color: blue;
}`,
  mode: "css",
  matchBrackets: true,
  autoCloseBrackets: true,
});
editorCss.on("change", () => {
  onChange();
});

lastValue.css = editorCss.getValue();

const editorJs = CodeMirror(document.querySelector("#editor-js"), {
  ...defaultOptions,
  placeholder: document.querySelector("#placeholder-js"),
  value: "console.log('foo')",
  mode: "javascript",
  matchBrackets: true,
  autoCloseBrackets: true,
  lint: { options: { esversion: 2021 } },
});
editorJs.on("change", () => {
  onChange(true);
});

lastValue.js = editorJs.getValue();

onChange();

function applyToIframe(html, css, js) {
  let error = "";

  try {
    const log = console.log;
    console.log = () => {};
    eval(js);
    console.log = log;
  } catch (e) {
    error = e;
  }

  if (isRunnable(error)) {
    console.log("running");
    const iframe = document.querySelector("iframe");
    let first;

    iframe?.remove();

    const wrapper = document.querySelector(".page");

    const newIframe = document.createElement("iframe");
    const template = getTemplate(html, css, js);

    wrapper.innerHTML = "";
    wrapper.appendChild(newIframe);

    newIframe?.contentWindow?.document.open();
    newIframe?.contentWindow?.document.write(template);
    newIframe?.contentWindow?.document.close();
  }
}

function onChange(isJs = false) {
  const html = editorHtml.getValue().trim();
  const hasChangedHtml = html !== lastValue.html;
  if (hasChangedHtml) {
    lastValue.html = html.trim();
  }

  const css = editorCss.getValue().trim();
  const hasChangedCss = css !== lastValue.css;
  if (hasChangedCss) {
    lastValue.css = css.trim();
  }

  let js = editorJs.getValue().trim();
  const hasChangedJs = js !== lastValue.js;
  if (hasChangedJs) {
    lastValue.js = js.trim();
  } else {
    js = "";
  }

  applyToIframe(html, css, js);
}

function getTemplate(html = "", css = "", js = "") {
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
    </html>`;

  return result;
}

function isRunnable(error) {
  if (!error) {
    return true;
  }

  // return (
  //   !error.includes("ReferenceError: c is not defined") ||
  //   !error.includes("ReferenceError: co is not defined") ||
  //   !error.includes("ReferenceError: con is not defined") ||
  //   !error.includes("ReferenceError: cons is not defined")
  // );
}

// <style>
// body {
//     background-color: white;
//     font-size: 20px;
// }
// </style>
