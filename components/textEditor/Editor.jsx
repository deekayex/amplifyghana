import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export function TinyEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [ setImageAlt] = useState('');

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



return (
  <>
    <Editor
      apiKey='upzlvpyzyxwa2ruk88onayhmb7zk3vv4nsmtbx3svwmwwrqf'
      onInit={(evt, editor) => {
        editorRef.current = editor;
        editor.on('NodeChange Change', handleNodeChange);
      }}
      initialValue="<p>Type the article contents here.</p>"
      value={value}
      onEditorChange={handleContentChange}
      init={{
        height: 500,
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
        automatic_uploads: true,
        file_picker_types: 'image',
        file_picker_callback: function (cb) {
          var input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');

          input.onchange = function () {
            var file = this.files[0];

            var reader = new FileReader();
            reader.onload = function () {
              var id = 'blobid' + (new Date()).getTime();
              var blobCache = editorRef.current.editorUpload.blobCache;
              var base64 = reader.result.split(',')[1];
              var blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);

              cb(blobInfo.blobUri(), { title: file.name });
            };
            reader.readAsDataURL(file);
          };

          input.click();
        },
        content_style: 'body { font-family: Helvetica, Arial, sans-serif; font-size: 14px }',
        imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
      }}
    />
  </>
);
}