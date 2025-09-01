import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, HelpCircle, Calendar, TrendingUp, Users, FileText, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for dashboard stats - in a real app, you'd fetch this from your API
  const stats = {
    totalNotes: 45,
    totalDoubts: 12,
    totalEvents: 8,
    notesUploaded: user?.role === 'Student' ? 5 : 15,
    doubtsAsked: user?.role === 'Student' ? 3 : 0,
    doubtsAnswered: user?.role === 'Faculty' ? 25 : 8,
    eventsCreated: user?.role === 'Faculty' ? 4 : 0,
    eventsAttended: 6
  };

  const recentActivity = [
    {
      type: 'note',
      title: 'Uploaded "Data Structures Notes"',
      time: '2 hours ago',
      icon: BookOpen,
      color: 'text-blue-500'
    },
    {
      type: 'doubt',
      title: 'Asked about "Binary Trees"',
      time: '1 day ago',
      icon: HelpCircle,
      color: 'text-green-500'
    },
    {
      type: 'event',
      title: 'RSVP\'d to "Tech Symposium"',
      time: '2 days ago',
      icon: Calendar,
      color: 'text-orange-500'
    },
    {
      type: 'doubt',
      title: 'Answered "Sorting Algorithms"',
      time: '3 days ago',
      icon: MessageSquare,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your activity and platform statistics
        </p>
      </div>

      {/* Personal Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Notes Uploaded</p>
                <p className="text-2xl font-bold text-gray-900">{stats.notesUploaded}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {user?.role === 'Faculty' ? 'Questions Answered' : 'Questions Asked'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {user?.role === 'Faculty' ? stats.doubtsAnswered : stats.doubtsAsked}
                </p>
              </div>
              <HelpCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          {user?.role === 'Faculty' && (
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Events Created</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.eventsCreated}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          )}

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Events Attended</p>
                <p className="text-2xl font-bold text-gray-900">{stats.eventsAttended}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalNotes}</p>
                <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Questions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDoubts}</p>
                <p className="text-sm text-green-600 mt-1">↑ 8% from last month</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                <p className="text-sm text-orange-600 mt-1">3 this week</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="card p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Icon className={`h-6 w-6 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/notes/upload"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-blue-500" />
              <span className="font-medium text-gray-900">Upload Notes</span>
            </div>
          </a>

          <a
            href="/doubts/post"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="h-6 w-6 text-green-500" />
              <span className="font-medium text-gray-900">Ask Question</span>
            </div>
          </a>

          {user?.role === 'Faculty' && (
            <a
              href="/events/create"
              className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-orange-500" />
                <span className="font-medium text-gray-900">Create Event</span>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
