import React from 'react';
import { useQuill } from 'react-quilljs';
import BlotFormatter from 'quill-blot-formatter';
import 'quill/dist/quill.snow.css';

const Editor = ({onChange}) => {
  const { quill, quillRef, Quill } = useQuill({
    modules: { blotFormatter: {} }
  });

  if (Quill && !quill) {
    // const BlotFormatter = require('quill-blot-formatter');
    Quill.register('modules/blotFormatter', BlotFormatter);
  }

  const handleChange = () => {
    const htmlContent = quill.root.innerHTML;
    onChange(htmlContent); // Call the parent callback with the new content
  };

  React.useEffect(() => {
    if (quill) {
      quill.on('text-change', handleChange);
    }
  }, [quill, handleChange]);

  return (
    <div className='text-editor'>
      <div ref={quillRef}/>
    </div>
  );
};

export default Editor;
