import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HelpCircle } from 'lucide-react';

const PostDoubt = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    semester: '',
    tags: ''
  });
  const navigate = useNavigate();

  const postMutation = useMutation(
    async (data) => {
      const response = await axios.post('/api/doubts', data);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Question posted successfully!');
        navigate('/doubts');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to post question';
        toast.error(message);
      }
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postMutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <HelpCircle className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
        </div>
        <p className="text-gray-600">
          Get help from your peers and faculty members
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Question Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="input"
                placeholder="What's your question about?"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Question Details *
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={6}
                className="input"
                placeholder="Provide detailed information about your question..."
                value={formData.content}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="input"
                  placeholder="e.g., Mathematics, Physics"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                  Semester *
                </label>
                <select
                  id="semester"
                  name="semester"
                  required
                  className="input"
                  value={formData.semester}
                  onChange={handleChange}
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="input"
                placeholder="e.g., calculus, derivatives, integration (comma separated)"
                value={formData.tags}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Add relevant tags to help others find your question
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/doubts')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={postMutation.isLoading}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {postMutation.isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Posting...</span>
              </div>
            ) : (
              'Post Question'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostDoubt;
