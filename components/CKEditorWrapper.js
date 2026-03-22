import React, { useState, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CKEditorWrapper = ({ onSave }) => {
  const editorRef = useRef();
  const [data, setData] = useState("");

  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={data}
        onReady={(editor) => {
          editorRef.current = editor;
        }}
        onChange={(event, editor) => {
          const newData = editor.getData();
          setData(newData);
        }}
      />
      <button
        onClick={() => {
          if (editorRef.current) {
            const content = editorRef.current.getData();
            if (content.trim()) {
              onSave && onSave(content);
              editorRef.current.setData("");
              setData("");
            }
          }
        }}
        style={{
          marginTop: 12,
          backgroundColor: "darkblue",
          color: "white",
          padding: "10px 20px",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
        }}
      >
        Сохранить запись
      </button>
    </div>
  );
};

export default CKEditorWrapper;
