import React, { useRef } from 'react';
import { Editor, } from '@tinymce/tinymce-react';

export function TinyEditor({ value, onChange }) {
  const editorRef = useRef(null);

 
  const handleContentChange = (content) => {
    if (onChange) {
      onChange(content);
    }
  };

  const handleFullscreen = (isFullscreen) => {
    if (isFullscreen) {
      // Add styles when entering fullscreen
      document.body.style.marginTop = '20vh'; // Adjust the margin value as needed
    } else {
      // Remove styles when exiting fullscreen
      document.body.style.marginTop = '0';
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
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount','image'
          ],
          toolbar:
            'undo redo spellcheckdialog| ' +
            'bold italic underline forecolor backcolor | ' +
            '| blocks fontfamily fontsize |'+
            'alignleft aligncenter alignright alignjustify | ' +'lineheight | '+
            'bullist numlist outdent indent | ' +
            'removeformat typography| help | link image'+  'charmap emoticons | ' +
            'hr pagebreak | ' +
            'searchreplace | spellchecker | ' +
            'fullscreen | ' +
            'formats | ' +
            'help',

          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

          // Set target_list to open links in a new window by default
          target_list: [{ title: 'New Window', value: '_blank' }],

          setup: (editor) => {
            editor.on('FullscreenStateChanged', (e) => {
              handleFullscreen(e.state);
            })

          
         }}}
      />
    </>
  );
}
