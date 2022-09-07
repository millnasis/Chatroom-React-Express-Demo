import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { Boot } from "@wangeditor/editor";
import moment from "moment";
import { momentFormat } from "../../../constant/index";

class CloseBtn {
  constructor(func) {
    this.title = "关闭";
    this.tag = "button";
    this.func = func;
  }
  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(editor) {
    // JS 语法
    return false;
  }

  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive(editor) {
    // JS 语法
    return false;
  }

  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled(editor) {
    // JS 语法
    return false;
  }

  // 点击菜单时触发的函数
  exec(editor, value) {
    this.func();
  }
}
class SendBtn {
  constructor(func) {
    this.title = "发送";
    this.tag = "button";
    this.func = func;
  }
  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(editor) {
    // JS 语法
    return false;
  }

  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive(editor) {
    // JS 语法
    return false;
  }

  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled(editor) {
    // JS 语法
    return false;
  }

  // 点击菜单时触发的函数
  exec(editor, value) {
    this.func(editor.getHtml());
  }
}

function EditorWarp(props) {
  // editor 实例
  const [editor, setEditor] = useState(null); // TS 语法
  // const [editor, setEditor] = useState(null)                   // JS 语法

  // 编辑器内容
  const [html, setHtml] = useState();

  // 模拟 ajax 请求，异步设置 html

  // 工具栏配置
  const toolbarConfig = {
    toolbarKeys: [
      "bold",
      "underline",
      "italic",
      {
        key: "group-more-style",
        title: "更多",
        iconSvg:
          '<svg t="1662456436896" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4284" width="200" height="200"><path d="M675.328 117.717333A425.429333 425.429333 0 0 0 512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667c0-56.746667-11.093333-112-32.384-163.328a21.333333 21.333333 0 0 0-39.402667 16.341333A382.762667 382.762667 0 0 1 896 512c0 212.074667-171.925333 384-384 384S128 724.074667 128 512 299.925333 128 512 128c51.114667 0 100.8 9.984 146.986667 29.12a21.333333 21.333333 0 0 0 16.341333-39.402667zM298.666667 554.666667a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m213.333333 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m213.333333 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z" fill="#3D3D3D" p-id="4285"></path></svg>',
        menuKeys: ["through", "code", "clearStyle"],
      },
      "color",
      "|",
      "fontSize",
      "fontFamily",
      "|",
      "bulletedList",
      "numberedList",
      "todo",
      "|",
      "emotion",
      "insertLink",
      {
        key: "group-image",
        title: "图片",
        iconSvg:
          '<svg t="1662456341102" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2406" width="200" height="200"><path d="M938.666667 553.92V768c0 64.8-52.533333 117.333333-117.333334 117.333333H202.666667c-64.8 0-117.333333-52.533333-117.333334-117.333333V256c0-64.8 52.533333-117.333333 117.333334-117.333333h618.666666c64.8 0 117.333333 52.533333 117.333334 117.333333v297.92z m-64-74.624V256a53.333333 53.333333 0 0 0-53.333334-53.333333H202.666667a53.333333 53.333333 0 0 0-53.333334 53.333333v344.48A290.090667 290.090667 0 0 1 192 597.333333a286.88 286.88 0 0 1 183.296 65.845334C427.029333 528.384 556.906667 437.333333 704 437.333333c65.706667 0 126.997333 16.778667 170.666667 41.962667z m0 82.24c-5.333333-8.32-21.130667-21.653333-43.648-32.917333C796.768 511.488 753.045333 501.333333 704 501.333333c-121.770667 0-229.130667 76.266667-270.432 188.693334-2.730667 7.445333-7.402667 20.32-13.994667 38.581333-7.68 21.301333-34.453333 28.106667-51.370666 13.056-16.437333-14.634667-28.554667-25.066667-36.138667-31.146667A222.890667 222.890667 0 0 0 192 661.333333c-14.464 0-28.725333 1.365333-42.666667 4.053334V768a53.333333 53.333333 0 0 0 53.333334 53.333333h618.666666a53.333333 53.333333 0 0 0 53.333334-53.333333V561.525333zM320 480a96 96 0 1 1 0-192 96 96 0 0 1 0 192z m0-64a32 32 0 1 0 0-64 32 32 0 0 0 0 64z" p-id="2407"></path></svg>',
        menuKeys: ["insertImage", "uploadImage"],
      },
      {
        key: "group-video",
        title: "视频",
        iconSvg:
          '<svg t="1662456411535" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3363" width="200" height="200"><path d="M825.6 153.6H198.4C124.5 153.6 64 214.1 64 288v448c0 73.9 60.5 134.4 134.4 134.4h627.2c73.9 0 134.4-60.5 134.4-134.4V288c0-73.9-60.5-134.4-134.4-134.4z m-138.2 44.8l112 112H706l-112-112h93.4z m-156.8 0l112 112H526.7l-112-112h115.9z m-179.2 0l112 112H347.5l-112-112h115.9zM108.8 288c0-41.4 28.4-76.1 66.7-86.3l108.7 108.7H108.8V288z m806.4 448c0 49.4-40.2 89.6-89.6 89.6H198.4c-49.4 0-89.6-40.2-89.6-89.6V355.2h806.4V736z m0-425.6h-52.5l-112-112h74.9c49.4 0 89.6 40.2 89.6 89.6v22.4z" p-id="3364"></path><path d="M454 687.2l149.3-77.6c27.5-13.8 27.5-53 0-66.8L468 472.2c-31.2-15.6-68 7.1-68 42v139.6c0 27.8 29.2 45.8 54 33.4zM444.8 512l134.4 67.2-134.4 67.2V512z" p-id="3365"></path></svg>',
        menuKeys: ["insertVideo", "uploadVideo"],
      },
      "codeBlock",
      "divider",
      "|",
      "undo",
      "redo",
      "|",
      "fullScreen",
      "my_close_window",
      "my_send_window",
    ],
  }; // TS 语法
  // const toolbarConfig = { }                        // JS 语法

  // 编辑器配置
  const editorConfig = {
    // TS 语法
    // const editorConfig = {                         // JS 语法
    placeholder: "请输入内容...",
    scroll: true,
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  useEffect(() => {
    Boot.registerMenu({
      key: "my_close_window",
      factory() {
        return new CloseBtn(() => props.close_window());
      },
    });
    Boot.registerMenu({
      key: "my_send_window",
      factory() {
        return new SendBtn((html) => {
          target.socket.emit("message", {
            username: userInfo.username,
            time: moment().format(momentFormat.toSec),
            content: html,
          });
          setHtml();
        });
      },
    });
  }, [null]);

  const { target, userInfo } = props;
  return (
    <>
      <div
        style={{
          border: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          zIndex: 100,
        }}
      >
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => {
            return setHtml(editor.getHtml());
          }}
          mode="default"
          style={{
            flex: 1,
            overflow: "auto",
          }}
        />
      </div>
    </>
  );
}

export default EditorWarp;
