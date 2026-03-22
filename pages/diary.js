import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";

const CKEditorWrapper = dynamic(() => import("../components/CKEditorWrapper"), {
  ssr: false,
});

const Test1 = () => {
  const [entries, setEntries] = useState([]);
  const editorRef = useRef();

  const handleSave = (data) => {
    if (data) {
      setEntries((prev) => [...prev, data]);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Diary</h1>
      <div>TEXT</div>
      <CKEditorWrapper onSave={handleSave} />
      <div style={{ marginTop: "24px" }}>
        {entries.length === 0 && <p>Записей пока нет.</p>}
        {entries.map((entry, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "12px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>Запись {i + 1}</h3>
            <div dangerouslySetInnerHTML={{ __html: entry }} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Test1;
