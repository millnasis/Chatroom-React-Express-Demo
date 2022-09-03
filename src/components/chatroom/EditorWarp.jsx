import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { DomEditor } from "@wangeditor/editor";

function EditorWarp() {
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
        iconSvg: (
          <svg viewBox="0 0 1024 1024">
            <path d="M204.8 505.6…0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path>
          </svg>
        ),
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
        iconSvg: (
          <svg viewBox="0 0 1024 1024">
            <path d="M959.877 128…l224.01-384 256 320h64l224.01-192z"></path>
          </svg>
        ),
        menuKeys: ["insertImage", "uploadImage"],
      },
      {
        key: "group-video",
        title: "视频",
        iconSvg: (
          <svg viewBox="0 0 1024 1024">
            <path d="M981.184 160….904zM384 704V320l320 192-320 192z"></path>
          </svg>
        ),
        menuKeys: ["insertVideo", "uploadVideo"],
      },
      "codeBlock",
      "divider",
      "|",
      "undo",
      "redo",
      "|",
      "fullScreen",
    ],
  }; // TS 语法
  // const toolbarConfig = { }                        // JS 语法

  // 编辑器配置
  const editorConfig = {
    // TS 语法
    // const editorConfig = {                         // JS 语法
    placeholder: "请输入内容...",
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
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
            height: "20vh",
            maxHeight: "200px",
            minHeight: "100px",
            overflowY: "hidden",
          }}
        />
      </div>
      <div style={{ marginTop: "15px" }}>{html}</div>
    </>
  );
}

export default EditorWarp;
