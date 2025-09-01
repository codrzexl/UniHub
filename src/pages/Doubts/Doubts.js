import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { HelpCircle, MessageSquare, ThumbsUp, ThumbsDown, CheckCircle, Search, Plus, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Doubts = () => {
  const [filters, setFilters] = useState({
    semester: '',
    subject: '',
    search: '',
    solved: ''
  });
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery(
    ['doubts', filters, page],
    async () => {
      const params = new URLSearchParams();
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.search) params.append('search', filters.search);
      if (filters.solved) params.append('solved', filters.solved);
      params.append('page', page);
      params.append('limit', '10');

      const response = await axios.get(`/api/doubts?${params}`);
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
    setFilters({ semester: '', subject: '', search: '', solved: '' });
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
        <p className="text-red-600">Error loading doubts. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doubt Forum</h1>
          <p className="text-gray-600 mt-1">
            Ask questions and help your peers with their academic doubts
          </p>
        </div>
        <Link
          to="/doubts/post"
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Ask Question</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              className="input"
              value={filters.solved}
              onChange={(e) => handleFilterChange('solved', e.target.value)}
            >
              <option value="">All Questions</option>
              <option value="false">Unsolved</option>
              <option value="true">Solved</option>
            </select>
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

      {/* Questions List */}
      <div className="space-y-4">
        {data?.doubts?.map((doubt) => (
          <div key={doubt._id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {doubt.title}
                  </h3>
                  {doubt.isSolved && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                    {doubt.subject}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    Sem {doubt.semester}
                  </span>
                  {doubt.isSolved && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Solved
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-3">
              {doubt.content}
            </p>

            {doubt.tags && doubt.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {doubt.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {doubt.tags.length > 3 && (
                  <span className="text-gray-500 text-xs">
                    +{doubt.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{doubt.askedBy?.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(doubt.createdAt), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{doubt.upvotes?.length || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{doubt.answers?.length || 0}</span>
                  </div>
                </div>
              </div>
              <Link
                to={`/doubts/${doubt._id}`}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {data?.doubts?.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or be the first to ask a question.
          </p>
          <Link to="/doubts/post" className="btn btn-primary">
            Ask Question
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

export default Doubts;
