import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { Download, Heart, User, Calendar, Tag, FileText, ArrowLeft, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: note, isLoading, error } = useQuery(
    ['note', id],
    async () => {
      const response = await axios.get(`/api/notes/${id}`);
      return response.data;
    }
  );

  const likeMutation = useMutation(
    async () => {
      const response = await axios.post(`/api/notes/${id}/like`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['note', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to like note');
      }
    }
  );

  const deleteMutation = useMutation(
    async () => {
      await axios.delete(`/api/notes/${id}`);
    },
    {
      onSuccess: () => {
        toast.success('Note deleted successfully');
        navigate('/notes');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete note');
      }
    }
  );

  const handleDownload = async () => {
    try {
      const response = await axios.get(`/api/notes/${id}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', note.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading note. Please try again.</p>
      </div>
    );
  }

  const isOwner = user?.id === note?.uploadedBy?._id;
  const isLiked = note?.likes?.some(like => like._id === user?.id);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/notes')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Notes</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {note.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full font-medium">
                    {note.subject}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                    Semester {note.semester}
                  </span>
                </div>
              </div>
              
              {isOwner && (
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isLoading}
                  className="text-red-600 hover:text-red-700 p-2"
                  title="Delete Note"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            {note.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">{note.description}</p>
              </div>
            )}

            {note.tags && note.tags.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleDownload}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              
              <button
                onClick={handleLike}
                disabled={likeMutation.isLoading}
                className={`btn flex items-center space-x-2 ${
                  isLiked
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    : 'btn-secondary'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{note.likes?.length || 0}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* File Info */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">File Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">File Name</p>
                  <p className="text-sm text-gray-600">{note.fileName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Download className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">File Size</p>
                  <p className="text-sm text-gray-600">
                    {(note.fileSize / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Download className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Downloads</p>
                  <p className="text-sm text-gray-600">{note.downloads}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Uploader Info */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Uploaded By</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {note.uploadedBy?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {note.uploadedBy?.role}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Upload Date</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(note.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Downloads</span>
                <span className="text-sm font-medium text-gray-900">{note.downloads}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Likes</span>
                <span className="text-sm font-medium text-gray-900">{note.likes?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
