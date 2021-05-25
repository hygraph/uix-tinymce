import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  Wrapper as ExtensionWrapper,
  FieldExtensionType,
  FieldExtensionFeature,
  useUiExtension,
} from "@graphcms/uix-react-sdk";

const declaration = {
  extensionType: "field",
  fieldType: FieldExtensionType.STRING,
  name: "TinyMCE Editor",
  description: "Edit HTML with tinyMCE",
  features: [FieldExtensionFeature.FieldRenderer],
};

export default function App() {
  const uid = new URLSearchParams(document.location.search).get("extensionUid");
  console.log({ uid });
  return (
    <ExtensionWrapper uid={uid} declaration={declaration}>
      <WrappedEditor />
    </ExtensionWrapper>
  );
}

export function WrappedEditor() {
  const { expandField, isExpanded, value, onChange } = useUiExtension();
  const editorRef = useRef(null);
  const expandRef = useRef(false);
  const initialValue = useRef(value);
  expandRef.current = isExpanded;
  return (
    <div style={{ height: isExpanded ? "100vh" : "300px" }}>
      <Editor
        tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
        initialValue={initialValue.current}
        onEditorChange={(value) => onChange(value)}
        init={{
          height: "100%",
          menubar: false,
          setup: function (editor) {
            editor.ui.registry.addButton("uixfullscreen", {
              tooltip: "Toggle fullscreen",
              icon: "new-tab",
              onAction: function (api) {
                expandField(!expandRef.current);
              },
            });
          },
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help | uixfullscreen",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </div>
  );
}
