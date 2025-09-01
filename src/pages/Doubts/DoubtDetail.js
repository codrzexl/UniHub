import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { ThumbsUp, ThumbsDown, CheckCircle, MessageSquare, User, Calendar, Tag, ArrowLeft, Send } from 'lucide-react';
import { format } from 'date-fns';

const DoubtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [answerContent, setAnswerContent] = useState('');

  const { data: doubt, isLoading, error } = useQuery(
    ['doubt', id],
    async () => {
      const response = await axios.get(`/api/doubts/${id}`);
      return response.data;
    }
  );

  const voteMutation = useMutation(
    async ({ type }) => {
      const response = await axios.post(`/api/doubts/${id}/vote`, { type });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['doubt', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to vote');
      }
    }
  );

  const solveMutation = useMutation(
    async () => {
      const response = await axios.patch(`/api/doubts/${id}/solve`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(['doubt', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update status');
      }
    }
  );

  const answerMutation = useMutation(
    async (content) => {
      const response = await axios.post(`/api/doubts/${id}/answer`, { content });
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Answer posted successfully!');
        setAnswerContent('');
        queryClient.invalidateQueries(['doubt', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to post answer');
      }
    }
  );

  const answerVoteMutation = useMutation(
    async ({ answerId, type }) => {
      const response = await axios.post(`/api/doubts/${id}/answer/${answerId}/vote`, { type });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['doubt', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to vote on answer');
      }
    }
  );

  const handleVote = (type) => {
    voteMutation.mutate({ type });
  };

  const handleSolve = () => {
    solveMutation.mutate();
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (answerContent.trim()) {
      answerMutation.mutate(answerContent);
    }
  };

  const handleAnswerVote = (answerId, type) => {
    answerVoteMutation.mutate({ answerId, type });
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
        <p className="text-red-600">Error loading question. Please try again.</p>
      </div>
    );
  }

  const isOwner = user?.id === doubt?.askedBy?._id;
  const hasUpvoted = doubt?.upvotes?.some(vote => vote._id === user?.id);
  const hasDownvoted = doubt?.downvotes?.some(vote => vote._id === user?.id);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/doubts')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Questions</span>
      </button>

      <div className="space-y-6">
        {/* Question */}
        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {doubt.title}
                </h1>
                {doubt.isSolved && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full font-medium">
                  {doubt.subject}
                </span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  Semester {doubt.semester}
                </span>
                {doubt.isSolved && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Solved
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {doubt.content}
            </p>
          </div>

          {doubt.tags && doubt.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {doubt.tags.map((tag, index) => (
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

          {/* Question Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{doubt.askedBy?.name}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {doubt.askedBy?.role}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(doubt.createdAt), 'MMM dd, yyyy')}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Voting */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleVote('upvote')}
                  disabled={voteMutation.isLoading}
                  className={`p-2 rounded-md transition-colors ${
                    hasUpvoted
                      ? 'bg-green-100 text-green-600'
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-gray-900">
                  {doubt.upvotes?.length || 0}
                </span>
                <button
                  onClick={() => handleVote('downvote')}
                  disabled={voteMutation.isLoading}
                  className={`p-2 rounded-md transition-colors ${
                    hasDownvoted
                      ? 'bg-red-100 text-red-600'
                      : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </div>

              {/* Mark as Solved */}
              {isOwner && (
                <button
                  onClick={handleSolve}
                  disabled={solveMutation.isLoading}
                  className={`btn text-sm ${
                    doubt.isSolved
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {doubt.isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Answers ({doubt.answers?.length || 0})
          </h2>

          {doubt.answers && doubt.answers.length > 0 ? (
            <div className="space-y-6">
              {doubt.answers.map((answer) => {
                const hasUpvotedAnswer = answer.upvotes?.some(vote => vote.toString() === user?.id);
                const hasDownvotedAnswer = answer.downvotes?.some(vote => vote.toString() === user?.id);

                return (
                  <div key={answer._id} className="border-l-4 border-gray-200 pl-6">
                    <div className="prose max-w-none mb-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {answer.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{answer.answeredBy?.name}</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {answer.answeredBy?.role}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(answer.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAnswerVote(answer._id, 'upvote')}
                          disabled={answerVoteMutation.isLoading}
                          className={`p-1 rounded transition-colors ${
                            hasUpvotedAnswer
                              ? 'bg-green-100 text-green-600'
                              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-medium text-gray-900">
                          {answer.upvotes?.length || 0}
                        </span>
                        <button
                          onClick={() => handleAnswerVote(answer._id, 'downvote')}
                          disabled={answerVoteMutation.isLoading}
                          className={`p-1 rounded transition-colors ${
                            hasDownvotedAnswer
                              ? 'bg-red-100 text-red-600'
                              : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No answers yet. Be the first to help!</p>
            </div>
          )}
        </div>

        {/* Answer Form */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
          <form onSubmit={handleAnswerSubmit}>
            <div className="mb-4">
              <textarea
                rows={4}
                className="input"
                placeholder="Write your answer here..."
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={answerMutation.isLoading || !answerContent.trim()}
                className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {answerMutation.isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Post Answer</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoubtDetail;
