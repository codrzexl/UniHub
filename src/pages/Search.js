import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { SearchIcon, BookOpen, HelpCircle, Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';

const Search = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, error } = useQuery(
    ['search', debouncedQuery, type],
    async () => {
      if (!debouncedQuery.trim()) return null;
      
      const params = new URLSearchParams();
      params.append('q', debouncedQuery);
      if (type) params.append('type', type);

      const response = await axios.get(`/api/search?${params}`);
      return response.data;
    },
    {
      enabled: !!debouncedQuery.trim()
    }
  );

  const { data: suggestions } = useQuery(
    ['search-suggestions', query],
    async () => {
      if (!query.trim() || query.length < 2) return { suggestions: [] };
      
      const response = await axios.get(`/api/search/suggestions?q=${query}`);
      return response.data;
    },
    {
      enabled: query.length >= 2
    }
  );

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setDebouncedQuery(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search UniHub</h1>
        <p className="text-gray-600">
          Find notes, questions, events, and more across the platform
        </p>
      </div>

      {/* Search Form */}
      <div className="card p-6">
        <div className="space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for notes, questions, events..."
              className="input pl-10 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Search Suggestions */}
          {suggestions?.suggestions?.length > 0 && query.length >= 2 && (
            <div className="bg-white border border-gray-200 rounded-md shadow-sm">
              <div className="p-2">
                <p className="text-xs font-medium text-gray-500 mb-2">Suggestions</p>
                <div className="space-y-1">
                  {suggestions.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setType('')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                type === ''
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => setType('notes')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                type === 'notes'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setType('doubts')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                type === 'doubts'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Questions
            </button>
            <button
              onClick={() => setType('events')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                type === 'events'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Events
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {isLoading && debouncedQuery && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">Error occurred while searching. Please try again.</p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Notes Results */}
          {data.results.notes && data.results.notes.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Notes ({data.results.notes.length})</span>
              </h2>
              <div className="space-y-4">
                {data.results.notes.map((note) => (
                  <div key={note._id} className="card p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          to={`/notes/${note._id}`}
                          className="text-lg font-medium text-gray-900 hover:text-primary-600"
                        >
                          {note.title}
                        </Link>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                            {note.subject}
                          </span>
                          <span>Sem {note.semester}</span>
                          <span>By {note.uploadedBy?.name}</span>
                          <span>{format(new Date(note.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                        {note.description && (
                          <p className="text-gray-600 mt-2 line-clamp-2">{note.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doubts Results */}
          {data.results.doubts && data.results.doubts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>Questions ({data.results.doubts.length})</span>
              </h2>
              <div className="space-y-4">
                {data.results.doubts.map((doubt) => (
                  <div key={doubt._id} className="card p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          to={`/doubts/${doubt._id}`}
                          className="text-lg font-medium text-gray-900 hover:text-primary-600"
                        >
                          {doubt.title}
                        </Link>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                            {doubt.subject}
                          </span>
                          <span>Sem {doubt.semester}</span>
                          <span>By {doubt.askedBy?.name}</span>
                          <span>{format(new Date(doubt.createdAt), 'MMM dd, yyyy')}</span>
                          {doubt.isSolved && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Solved
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-2 line-clamp-2">{doubt.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Results */}
          {data.results.events && data.results.events.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Events ({data.results.events.length})</span>
              </h2>
              <div className="space-y-4">
                {data.results.events.map((event) => (
                  <div key={event._id} className="card p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          to={`/events/${event._id}`}
                          className="text-lg font-medium text-gray-900 hover:text-primary-600"
                        >
                          {event.title}
                        </Link>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                          <span>By {event.createdBy?.name}</span>
                          {event.location && <span>{event.location}</span>}
                        </div>
                        <p className="text-gray-600 mt-2 line-clamp-2">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {data.results.notes?.length === 0 && 
           data.results.doubts?.length === 0 && 
           data.results.events?.length === 0 && (
            <div className="text-center py-12">
              <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or browse different categories.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!debouncedQuery && (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
          <p className="text-gray-600">
            Enter keywords to find notes, questions, and events across UniHub.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
