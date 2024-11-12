"use client";

import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  description: string;
}

interface NewEvent {
  title: string;
  time: string;
  description: string;
}

const CalendarApp: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    time: '09:00',
    description: ''
  });

  // Calculate calendar grid values
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();

  // Initialize dark mode from localStorage and system preferences
  useEffect(() => {
    // Check system preferences
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check localStorage or fall back to system preference
    const savedDarkMode = localStorage.getItem('darkMode');
    const shouldBeDark = savedDarkMode ? savedDarkMode === 'true' : systemPrefersDark;
    
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  // Add new event
  const addEvent = () => {
    if (!newEvent.title) return; // Basic validation

    const event: Event = {
      id: Date.now(), // Simple way to generate unique IDs
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      description: newEvent.description
    };

    setEvents([...events, event]);
    
    // Reset form and close modal
    setNewEvent({
      title: '',
      time: '09:00',
      description: ''
    });
    setShowEventForm(false);
  };

  // Delete event
  const deleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Rest of your JSX remains the same */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        <div className="flex gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-gray-600" />
            )}
          </button>
          <button
            onClick={() => setShowEventForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            New Event
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="mt-2 space-x-2">
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
            className="px-4 py-2 border rounded hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Previous
          </button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-4 py-2 border rounded hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Today
          </button>
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
            className="px-4 py-2 border rounded hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-semibold text-center py-2 bg-gray-100 dark:bg-gray-800 dark:text-white">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-white dark:bg-gray-800">
        {Array(firstDayOfMonth).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className="h-24 bg-gray-50 dark:bg-gray-700"></div>
        ))}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;
          const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
          const dayEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === currentDate.toDateString();
          });

          return (
            <div
              key={day}
              className="h-24 border border-gray-200 dark:border-gray-600 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
              onClick={() => {
                setSelectedDate(currentDate);
                setShowEventForm(true);
              }}
            >
              <div className="font-semibold text-gray-900 dark:text-white">{day}</div>
              {dayEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-blue-100 dark:bg-blue-900 dark:text-white p-1 rounded mt-1"
                >
                  {event.time} - {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">New Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">Time</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                  placeholder="Event description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowEventForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={addEvent}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Events</h3>
        {events.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">
            No events scheduled. Click on any date or the "New Event" button to add an event.
          </div>
        ) : (
          <div className="space-y-2">
            {events
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(event => (
                <div key={event.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-600">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{event.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    {event.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{event.description}</div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarApp;