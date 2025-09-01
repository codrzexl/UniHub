import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, MapPin, User, Users, ArrowLeft, Check, X, Clock, Trash2 } from 'lucide-react';
import { format, isAfter } from 'date-fns';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: event, isLoading, error } = useQuery(
    ['event', id],
    async () => {
      const response = await axios.get(`/api/events/${id}`);
      return response.data;
    }
  );

  const rsvpMutation = useMutation(
    async (status) => {
      const response = await axios.post(`/api/events/${id}/rsvp`, { status });
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('RSVP updated successfully!');
        queryClient.invalidateQueries(['event', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update RSVP');
      }
    }
  );

  const deleteMutation = useMutation(
    async () => {
      await axios.delete(`/api/events/${id}`);
    },
    {
      onSuccess: () => {
        toast.success('Event deleted successfully');
        navigate('/events');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete event');
      }
    }
  );

  const handleRSVP = (status) => {
    rsvpMutation.mutate(status);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
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
        <p className="text-red-600">Error loading event. Please try again.</p>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isUpcoming = isAfter(eventDate, new Date());
  const userRsvp = event.rsvps?.find(rsvp => rsvp.user._id === user?.id);
  const isOwner = user?.id === event?.createdBy?._id;

  const rsvpCounts = {
    going: event.rsvps?.filter(rsvp => rsvp.status === 'going').length || 0,
    maybe: event.rsvps?.filter(rsvp => rsvp.status === 'maybe').length || 0,
    not_going: event.rsvps?.filter(rsvp => rsvp.status === 'not_going').length || 0
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/events')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Events</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {event.title}
                  </h1>
                  {isUpcoming && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
              
              {isOwner && (
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isLoading}
                  className="text-red-600 hover:text-red-700 p-2"
                  title="Delete Event"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Date</p>
                  <p className="text-sm text-gray-600">
                    {format(eventDate, 'EEEE, MMMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Time</p>
                  <p className="text-sm text-gray-600">
                    {format(eventDate, 'h:mm a')}
                  </p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Organized by</p>
                  <p className="text-sm text-gray-600">
                    {event.createdBy?.name} ({event.createdBy?.role})
                  </p>
                </div>
              </div>
            </div>

            {/* RSVP Buttons */}
            {isUpcoming && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Will you attend this event?
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleRSVP('going')}
                    disabled={rsvpMutation.isLoading}
                    className={`btn flex items-center space-x-2 ${
                      userRsvp?.status === 'going'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'btn-secondary'
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    <span>Going</span>
                  </button>
                  
                  <button
                    onClick={() => handleRSVP('maybe')}
                    disabled={rsvpMutation.isLoading}
                    className={`btn flex items-center space-x-2 ${
                      userRsvp?.status === 'maybe'
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        : 'btn-secondary'
                    }`}
                  >
                    <span>Maybe</span>
                  </button>
                  
                  <button
                    onClick={() => handleRSVP('not_going')}
                    disabled={rsvpMutation.isLoading}
                    className={`btn flex items-center space-x-2 ${
                      userRsvp?.status === 'not_going'
                        ? 'bg-red-100 text-red-700 border-red-200'
                        : 'btn-secondary'
                    }`}
                  >
                    <X className="h-4 w-4" />
                    <span>Can't Go</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* RSVP Stats */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Going</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{rsvpCounts.going}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Maybe</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{rsvpCounts.maybe}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Can't Go</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{rsvpCounts.not_going}</span>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Total Responses</span>
                  <span className="text-sm font-medium text-gray-900">
                    {event.rsvps?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendees */}
          {event.rsvps && event.rsvps.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Attendees ({rsvpCounts.going})
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {event.rsvps
                  .filter(rsvp => rsvp.status === 'going')
                  .map((rsvp) => (
                    <div key={rsvp.user._id} className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {rsvp.user.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {rsvp.user.role}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
