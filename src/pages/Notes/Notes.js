import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { BookOpen, Download, Heart, Search, Filter, Upload, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Notes = () => {
  const [filters, setFilters] = useState({
    semester: '',
    subject: '',
    search: ''
  });
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery(
    ['notes', filters, page],
    async () => {
      const params = new URLSearchParams();
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.search) params.append('search', filters.search);
      params.append('page', page);
      params.append('limit', '12');

      const response = await axios.get(`/api/notes?${params}`);
      return response.data;
    },
    {
      keepPreviousData: true
    }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ semester: '', subject: '', search: '' });
    setPage(1);
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
        <p className="text-red-600">Error loading notes. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Notes</h1>
          <p className="text-gray-600 mt-1">
            Browse and download study materials shared by your peers
          </p>
        </div>
        <Link
          to="/notes/upload"
          className="btn btn-primary flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Notes</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                className="input pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <select
              className="input"
              value={filters.semester}
              onChange={(e) => handleFilterChange('semester', e.target.value)}
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              placeholder="Enter subject"
              className="input"
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="btn btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.notes?.map((note) => (
          <div key={note._id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {note.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                    {note.subject}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    Sem {note.semester}
                  </span>
                </div>
              </div>
            </div>

            {note.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {note.description}
              </p>
            )}

            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {note.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="text-gray-500 text-xs">
                    +{note.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{note.uploadedBy?.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(note.createdAt), 'MMM dd, yyyy')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>{note.downloads}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{note.likes?.length || 0}</span>
                </div>
              </div>
              <Link
                to={`/notes/${note._id}`}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {data?.notes?.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or be the first to upload notes for this criteria.
          </p>
          <Link to="/notes/upload" className="btn btn-primary">
            Upload Notes
          </Link>
        </div>
      )}

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="flex items-center px-4 py-2 text-sm text-gray-700">
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === data.totalPages}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Notes;
