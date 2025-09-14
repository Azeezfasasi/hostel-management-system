import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { Editor } from '@tinymce/tinymce-react';
import { RICHT_TEXT_API } from '../../../config/richText';

function SendNewsletterMain() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipients, setRecipients] = useState(''); //comma-separated emails or empty for all
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const sendNewsletterMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('token'); // Assumes admin JWT is stored here
      return axios.post(
        `${API_BASE_URL}/newsletter/send`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      setSuccess('Newsletter sent successfully!');
      setError('');
      setSubject('');
      setContent('');
      setRecipients('');
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to send newsletter.');
      setSuccess('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !content) {
      setError('Subject and content are required.');
      setSuccess('');
      return;
    }
    sendNewsletterMutation.mutate({
      subject,
      content,
      recipients: recipients
        ? recipients.split(',').map((r) => r.trim()).filter(Boolean)
        : undefined,
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px #e0e0e0', padding: 32 }}>
      <h2 style={{ marginBottom: 24 }} className='text-blue-500 font-bold'>Send Newsletter</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500 }}>Subject<span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc', marginTop: 6 }}
            placeholder="Newsletter subject"
            required
          />
        </div>
        <div className="mb-4">
          <label className="font-semibold block mb-1">Content<span className="text-red-500">*</span></label>
          <Editor
            apiKey={RICHT_TEXT_API}
            value={content}
            init={{
              height: 400,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar:
                'undo redo | blocks |' + 'bold italic forecolor | alignleft aligncenter alignright alignjustify |' + '| bullist numlist outdent indent | ' + 'removeformat | help',
            }}
            onEditorChange={setContent}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500 }}>Recipients (optional)</label>
          <input
            type="text"
            value={recipients}
            onChange={e => setRecipients(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc', marginTop: 6 }}
            placeholder="Comma-separated emails, or leave blank for all subscribers"
          />
        </div>
        {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button
          type="submit"
          style={{ color: '#fff', padding: '12px 32px', border: 'none', borderRadius: 4, fontWeight: 600, fontSize: 16, cursor: sendNewsletterMutation.isLoading ? 'not-allowed' : 'pointer' }} className='bg-blue-500 hover:bg-blue-600'
          disabled={sendNewsletterMutation.isLoading}
        >
          {sendNewsletterMutation.isLoading ? 'Sending...' : 'Send Newsletter'}
        </button>
      </form>
    </div>
  );
}

export default SendNewsletterMain;