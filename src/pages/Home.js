import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, HelpCircle, Calendar, Upload, MessageSquare, Plus, TrendingUp, Users, FileText } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Upload Notes',
      description: 'Share your study materials with others',
      icon: Upload,
      link: '/notes/upload',
      color: 'bg-blue-500'
    },
    {
      title: 'Ask a Doubt',
      description: 'Get help with your academic questions',
      icon: MessageSquare,
      link: '/doubts/post',
      color: 'bg-green-500'
    },
    {
      title: 'Browse Notes',
      description: 'Find study materials for your subjects',
      icon: BookOpen,
      link: '/notes',
      color: 'bg-purple-500'
    },
    {
      title: 'View Events',
      description: 'Check out upcoming college events',
      icon: Calendar,
      link: '/events',
      color: 'bg-orange-500'
    }
  ];

  const facultyActions = [
    {
      title: 'Create Event',
      description: 'Announce new college events',
      icon: Plus,
      link: '/events/create',
      color: 'bg-red-500'
    }
  ];

  const stats = [
    {
      title: 'Study Materials',
      value: '500+',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: '200+',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Questions Solved',
      value: '150+',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-primary-100 text-lg">
          Ready to share knowledge and learn together? Explore notes, ask questions, and stay updated with college events.
        </p>
        <div className="mt-4 flex items-center space-x-2">
          <span className="bg-primary-500 px-3 py-1 rounded-full text-sm font-medium">
            {user?.role}
          </span>
          {user?.semester && (
            <span className="bg-primary-500 px-3 py-1 rounded-full text-sm font-medium">
              Semester {user.semester}
            </span>
          )}
          <span className="bg-primary-500 px-3 py-1 rounded-full text-sm font-medium">
            {user?.department}
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="card p-6 hover:shadow-lg transition-shadow group"
              >
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Faculty Actions */}
      {user?.role === 'Faculty' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Faculty Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultyActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="card p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="card p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">New notes uploaded in Computer Science</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <HelpCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">Question answered in Mathematics</p>
                <p className="text-sm text-gray-600">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div>
                <p className="font-medium text-gray-900">New event: Tech Symposium 2024</p>
                <p className="text-sm text-gray-600">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
