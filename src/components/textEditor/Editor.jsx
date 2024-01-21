import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export function TinyEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [imageAlt, setImageAlt] = useState('');

  const handleContentChange = (content) => {
    if (onChange) {
      onChange(content);
    }
  };

 

const handleNodeChange = (e) => {
  if (e.element.nodeName === 'IMG') {
    console.log('Image alt text:', e.element.alt);

    // Set alt text to state or perform actions based on alt text
    setImageAlt(e.element.alt);
  }
};

// Additional configuration for TinyMCE initialization
const imagetools_cors_hosts = ['www.tinymce.com', 'codepen.io'];
// ...



  return (
    <>
      <Editor
        apiKey='upzlvpyzyxwa2ruk88onayhmb7zk3vv4nsmtbx3svwmwwrqf'
        // apiKey : process.env.REACT_APP_EDITOR_KEY,
        onInit={(evt, editor) => {
          editorRef.current = editor;
          // Attach the event listener for node changes
          editor.on('NodeChange Change', handleNodeChange);
        }}
        initialValue="<p>Type the article contents here.</p>"
        value={value}
        onEditorChange={handleContentChange}
        init={{
          height: 500,
          menu: {
            // ... (rest of your menu configuration)
          },
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'image', 'imagetools'
          ],
          toolbar:
            'undo redo spellcheckdialog| ' +
            'bold italic underline forecolor backcolor | ' +
            '| blocks fontfamily fontsize |' +
            'alignleft aligncenter alignright alignjustify | ' + 'lineheight | ' +
            'bullist numlist outdent indent | ' +
            'removeformat typography| help | link image' + 'charmap emoticons | ' +
            'hr pagebreak | ' +
            'searchreplace | spellchecker | ' +
            'fullscreen | ' +
            'formats | ' +
            'help',

          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

          // Set target_list to open links in a new window by default
          target_list: [{ title: 'New Window', value: '_blank' }],
          // Configure the imagetools plugin to set default styles
        imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
        imagetools_cors_hosts: imagetools_cors_hosts,
        // Custom imagetools button
        imagetools_custom_ui_selector: '.custom-button',
        imagetools_custom_ui_title: 'Image Alt Text',
        imagetools_custom_ui_onclick: function () {
          alert('Image Alt Text: ' + imageAlt);
        }
        }}
      />

    </>
  );
}
