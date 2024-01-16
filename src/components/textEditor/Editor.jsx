import React, { useRef } from 'react';
import { Editor, } from '@tinymce/tinymce-react';

export function TinyEditor({ value, onChange }) {
  const editorRef = useRef(null);

 
  const handleContentChange = (content) => {
    if (onChange) {
      onChange(content);
    }
  };


  
 
  
  return (
    <>
      <Editor
        apiKey='upzlvpyzyxwa2ruk88onayhmb7zk3vv4nsmtbx3svwmwwrqf'
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue="<p>Type the article contents here.</p>"
        value={value}
        onEditorChange={handleContentChange}
        init={{
          height: 500,
          menu: {
            file: { title: 'File', items: 'newdocument restoredraft | preview | export print | deleteallconversations' },
            edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
            view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
            insert: { title: 'Insert', items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
            format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
            tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
            table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
            help: { title: 'Help', items: 'help' }
          },
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'uploadcare', 'image'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold underline italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | link image ',

          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

          
         }}
      />
    </>
  );
}
