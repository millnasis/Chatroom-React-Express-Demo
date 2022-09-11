import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { Boot } from "@wangeditor/editor";

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
  constructor(func, setHtml) {
    this.title = "发送";
    this.tag = "button";
    this.func = func;
    this.setHtml = setHtml;
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
    this.func(editor.getHtml(), this.setHtml);
  }
}

function EditorWarp(props) {
  // editor 实例
  const [editor, setEditor] = useState(null); // TS 语法
  // const [editor, setEditor] = useState(null)                   // JS 语法

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
      "uploadImage",
      "uploadVideo",
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
    MENU_CONF: {},
  };

  editorConfig.MENU_CONF["uploadImage"] = {
    server: "/api/uploadIMG-wang",
    // form-data fieldName ，默认值 'wangeditor-uploaded-image'
    fieldName: "wangeditor-pic",

    maxFileSize: 100 * 1024 * 1024, // 1M

    // 最多可上传几个文件，默认为 100
    maxNumberOfFiles: 1,

    // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
    allowedFileTypes: ["image/*"],
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    if (!props.register) {
      Boot.registerMenu({
        key: "my_close_window",
        factory() {
          return new CloseBtn(() => props.close_window());
        },
      });
      Boot.registerMenu({
        key: "my_send_window",
        factory() {
          return new SendBtn((html, setHtml) => {
            props.emitmessage();
            setHtml();
          }, props.setHtml);
        },
      });
      props.register_menu_item();
    }
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);
  
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
          value={props.html}
          onCreated={setEditor}
          onChange={(editor) => {
            return props.setHtml(editor.getHtml());
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
