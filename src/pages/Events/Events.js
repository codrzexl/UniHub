import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, MapPin, User, Users, Plus, Clock } from 'lucide-react';
import { format, isAfter } from 'date-fns';

const Events = () => {
  const { user } = useAuth();
  const [showUpcoming, setShowUpcoming] = useState(true);

  const { data, isLoading, error } = useQuery(
    ['events', showUpcoming],
    async () => {
      const params = new URLSearchParams();
      if (showUpcoming) params.append('upcoming', 'true');
      params.append('limit', '20');

      const response = await axios.get(`/api/events?${params}`);
      return response.data;
    },
    {
      keepPreviousData: true
    }
  );

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
        <p className="text-red-600">Error loading events. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">College Events</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with upcoming college events and activities
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {user?.role === 'Faculty' && (
            <Link
              to="/events/create"
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Event</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setShowUpcoming(true)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              showUpcoming
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setShowUpcoming(false)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              !showUpcoming
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Events
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.events?.map((event) => {
          const eventDate = new Date(event.date);
          const isUpcoming = isAfter(eventDate, new Date());
          const rsvpCount = event.rsvps?.length || 0;
          const userRsvp = event.rsvps?.find(rsvp => rsvp.user._id === user?.id);

          return (
            <div key={event._id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {event.title}
                  </h3>
                  {isUpcoming && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Upcoming
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {event.description}
                </p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{format(eventDate, 'MMM dd, yyyy')}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{format(eventDate, 'h:mm a')}</span>
                </div>

                {event.location && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>By {event.createdBy?.name}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{rsvpCount} attending</span>
                </div>
              </div>

              {userRsvp && (
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    userRsvp.status === 'going'
                      ? 'bg-green-100 text-green-800'
                      : userRsvp.status === 'maybe'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    You're {userRsvp.status === 'going' ? 'going' : userRsvp.status === 'maybe' ? 'maybe going' : 'not going'}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <Link
                  to={`/events/${event._id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {data?.events?.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {showUpcoming ? 'No upcoming events' : 'No events found'}
          </h3>
          <p className="text-gray-600 mb-4">
            {showUpcoming 
              ? 'Check back later for new events or view all events.'
              : 'No events have been created yet.'
            }
          </p>
          {user?.role === 'Faculty' && (
            <Link to="/events/create" className="btn btn-primary">
              Create Event
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;
