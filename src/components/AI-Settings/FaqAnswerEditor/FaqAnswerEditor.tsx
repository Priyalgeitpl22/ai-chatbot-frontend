import React, { useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Button } from '@mui/material';
import api from "../../../services/api";
import Cookies from 'js-cookie';
import toast ,{ Toaster } from 'react-hot-toast';


// Configure Quill to force links to open in _blank
const Link = Quill.import('formats/link');
const originalSanitize = Link.sanitize; // Save the original sanitize
Link.sanitize = function (url: string) {
  let value = originalSanitize.call(this, url); // Call the original
  return value;
};
Link.prototype.format = function (name: string, value: string) {
  if (value) {
    this.domNode.setAttribute('href', value);
    this.domNode.setAttribute('target', '_blank');
  } else {
    this.domNode.removeAttribute('href');
    this.domNode.removeAttribute('target');
  }
};
Quill.register(Link, true);

interface FaqAnswerEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const FaqAnswerEditor: React.FC<FaqAnswerEditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<ReactQuill | null>(null);

  // Handle file upload to backend
const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const token = Cookies.get('access_token');
    const res = await api.post('/faq/faq-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });

    const { fileName, fileUrl } = res.data.file;

    const editor = quillRef.current?.getEditor();
    const index = editor?.getSelection()?.index || 0;
    editor?.insertText(index, fileName, 'link', fileUrl);

    // ✅ Show toast only once
    // toast.dismiss(); 
      toast.success(res.data.message);  } catch (error: any) {
    console.error('File upload failed:', error);
    toast.error("File upload failed!");
  }
};


  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean']
      ]
    }
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link'
  ];

  return (
  <>
    <Box>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Write the FAQ answer here..."
      />

      <Button variant="outlined" component="label" sx={{ mt: 1 }}>
        Upload File (PDF/DOCX)
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          hidden
          onChange={handleFileUpload}
        />
      </Button>
      <Toaster />
    </Box>

  </>
);

};

export default FaqAnswerEditor;
