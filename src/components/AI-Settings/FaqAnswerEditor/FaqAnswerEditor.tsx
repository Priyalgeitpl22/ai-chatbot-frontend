import React, { useRef, useEffect, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from "../../../services/api";
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';

const Link = Quill.import('formats/link');
const originalSanitize = Link.sanitize;
Link.sanitize = function (url: string) {
  let value = originalSanitize.call(this, url);
  return value;
};
Link.prototype.format = function (value: string) {
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  
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

      
      const { fileName, fileUrl: fileKey, fileContent, type } = res.data.file;

      const presignedRes = await api.get(`/faq/faq-files/presigned-url/${encodeURIComponent(fileKey)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const presignedUrl = presignedRes.data.url;

      const editor = quillRef.current?.getEditor();
      const index = editor?.getSelection()?.index || 0;
      editor?.clipboard.dangerouslyPasteHTML(
        index,
        `<a href="${presignedUrl}" target="_blank" rel="noopener noreferrer">${fileName}</a>`
      );

      setPreviewUrl(presignedUrl);
      setPreviewType(type);
      setPreviewContent(fileContent);
      setShowModal(true); 

      toast.success(res.data.message || 'File uploaded!');
    } catch (error: any) {
      console.error('File upload failed:', error);
      toast.error("File upload failed!");
    }
  };

  
  useEffect(() => {
    const quillEditor = quillRef.current?.editor?.root;
    if (!quillEditor) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        const url = (target as HTMLAnchorElement).getAttribute('href');
        if (url) {
          e.preventDefault();

          const isPDF = url.toLowerCase().includes('.pdf');
          const isDOC = url.toLowerCase().includes('.doc') || url.toLowerCase().includes('.docx');

          setPreviewUrl(url);
          setPreviewType(
            isPDF
              ? 'application/pdf'
              : isDOC
                ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                : 'link'
          );
          setPreviewContent(null);
          setShowModal(true); 
        }
      }
    };

    quillEditor.addEventListener('click', handleClick);
    return () => {
      quillEditor.removeEventListener('click', handleClick);
    };
  }, []);

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
          style={{ height: '140px' }}
        />
        <Button variant="outlined" component="label" sx={{ mt: 1, height: "35px" }}>
          Upload File (PDF/DOCX)
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            hidden
            onChange={handleFileUpload}
          />
        </Button>
        <Toaster />
        <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="md" fullWidth>
          <DialogContent>
            <IconButton
              aria-label="close"
              onClick={() => setShowModal(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>

            {previewContent &&
              !previewContent.toLowerCase().includes("not supported") &&
              !previewContent.toLowerCase().includes("could not extract") ? (
              <Box sx={{ whiteSpace: 'pre-wrap', maxHeight: 400, overflow: 'auto', mb: 2 }}>
                {previewContent}
              </Box>
            ) : previewUrl && previewType?.includes('pdf') ? (
              <iframe src={previewUrl} width="100%" height="600px" title="PDF Preview" />
            ) : previewUrl &&
              (previewType?.includes('word') || previewUrl.endsWith('.docx')) ? (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                width="100%"
                height="600px"
                title="DOCX Preview"
              />
            ) : (
              <a href={previewUrl || undefined} target="_blank" rel="noopener noreferrer">
                Download File
              </a>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default FaqAnswerEditor;
