createCodeEnv("#aaa");
createCodeEnv("#bbb");

function createCodeEnv(wrapperSelector) {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) return;

  createHtml(wrapper);

  let lastValue = {
    html: "",
    css: "",
    js: "",
  };

  const editorArray = [
    createEditor(
      {
        type: "html",
        value: "<div>div</div>",
        mode: "xml",
      },
      lastValue,
      wrapper
    ),
    createEditor(
      {
        type: "css",
        value: `div {
  color: blue;
}`,
        mode: "css",
      },
      lastValue,
      wrapper
    ),
    createEditor(
      {
        type: "js",
        value: `console.log('foo');`,
        mode: "javascript",
      },
      lastValue,
      wrapper
    ),
  ];

  editorArray.forEach((editor) => {
    lastValue[editor.type] = editor.getValue();

    editor.on("change", () => {
      onChange(editor.type, editorArray, lastValue, wrapper);
    });
  });

  // const HOST = location.origin.replace(/^http/, "ws");
  // const ws = new WebSocket(HOST);
  // let el;
  // const id = createUUID();
  // ws.onmessage = function (event) {
  //   el = document.getElementById("server-time");
  //   el.innerHTML = "Server time: " + event.data;
  // };

  onChange("html", editorArray, lastValue, wrapper);
  onChange("css", editorArray, lastValue, wrapper);
  onChange("js", editorArray, lastValue, wrapper);

  // onChange(editorHtml, editorCss, editorJs, lastValue);
}

function createHtml(wrapper) {
  const div = document.createElement("div");
  div.setAttribute("class", "editors");

  // div.appendChild(header);

  // const a = createElement("div.bla", "bla1");
  const editorHtml = createElement("div.editor-html.editor");
  // editorHtml.appendChild(a);
  div.appendChild(editorHtml);

  // const b = createElement("div.bla", "bla2");
  const editorCss = createElement("div.editor-css.editor");
  // editorCss.appendChild(b);
  div.appendChild(editorCss);

  // const c = createElement("div.bla", "bla3");
  // const editorJs = createElement("div.editor-js.editor");
  // // editorJs.appendChild(c);
  // div.appendChild(editorJs);

  // div.appendChild(
  //   createElement("div.editor-css.editor").appendChild(
  //     createElement("div.bla", "bla")
  //   )
  // );
  // div.appendChild(
  //   createElement("div.editor-js.editor").appendChild(
  //     createElement("div.bla", "bla")
  //   )
  // );

  wrapper.appendChild(div);
  wrapper.appendChild(createElement("div.page"));
}

function createEditor({ type, value, mode }, lastValue, wrapper) {
  const defaultOptions = {
    theme: "monokai",
    lineNumbers: true,
    gutters: ["CodeMirror-lint-markers"],
    lint: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    matchTags: true,
    autoCloseTags: true,
    lint: { options: { esversion: 2021 } },
  };
  const editor = CodeMirror(wrapper.querySelector(".editor-" + type), {
    ...defaultOptions,
    value,
    mode,
  });
  editor.type = type;
  return editor;
}

function createElement(selectorAndElement, text) {
  if (selectorAndElement.includes(".")) {
    const [element, ...selector] = selectorAndElement.split(".");
    const classValue = selector.join(" ");
    const el = document.createElement(element);
    el.setAttribute("class", classValue);
    if (text) {
      el.appendChild(document.createTextNode(text));
    }
    return el;
  }
}

function onChange(type, editorArray, lastValue, wrapper) {
  editorArray.forEach((editor) => {
    const value = editor.getValue().trim();
    const hasChanged = value !== lastValue[type];
    if (hasChanged) {
      lastValue[type] = value;
    }
  });

  // // if (hasChangedHtml || hasChangedCss || hasChangedJs) {
  // //   sendMessage({ id, name: window.userName, html, css, js });
  // // }

  applyToIframe(type, editorArray, wrapper);
}

function applyToIframe(type, editorArray, wrapper) {
  let error = "";
  const [editorHtml, editorCss, editorJs] = editorArray;
  let [html, css, js] = [
    editorHtml.getValue().trim(),
    editorCss.getValue().trim(),
    editorJs.getValue().trim(),
  ];

  if (type === "js") {
    try {
      const log = console.log;
      console.log = () => {};
      eval(js);
      console.log = log;
    } catch (e) {
      error = e;
    }
  } else {
    js = "";
  }

  if (isRunnable(error)) {
    if (window.location.host.includes("localhost")) {
      console.log("====================================");
    } else {
      console.clear();
    }

    const iframe = wrapper.querySelector("iframe");

    iframe?.remove();

    const wrapperPage = wrapper.querySelector(".page");
    const newIframe = document.createElement("iframe");
    const template = getTemplate(html, css, js);

    wrapperPage.innerHTML = "";
    wrapperPage.appendChild(newIframe);

    newIframe?.contentWindow?.document.open();
    newIframe?.contentWindow?.document.write(template);
    newIframe?.contentWindow?.document.close();
  }
}

function sendMessage(json) {
  ws.send(JSON.stringify(json));
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

  if (error?.includes) {
    return (
      !error?.includes("ReferenceError: c is not defined") ||
      !error?.includes("ReferenceError: co is not defined") ||
      !error?.includes("ReferenceError: con is not defined") ||
      !error?.includes("ReferenceError: cons is not defined") ||
      !error?.includes("ReferenceError: l is not defined") ||
      !error?.includes("ReferenceError: le is not defined") ||
      !error?.includes("ReferenceError: let is not defined")
    );
  }

  return false;
}

function createUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function saveInput() {
  console.log("Saving data");
}
