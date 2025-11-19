import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import { AdminContext } from '../context/AdminContext';
import { FiBook, FiFileText, FiLayers, FiLogOut, FiUpload, FiPlus, FiDownload, FiTrash, FiEdit, FiUsers } from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ subjects: 0, topics: 0, contents: 0, notes: 0, totalDownloads: 0 });
  const [recentNotes, setRecentNotes] = useState([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [bulkData, setBulkData] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '📚',
    category: 'programming',
    level: 'beginner',
    order: 1
  });
  const navigate = useNavigate();
  const { admin, logout } = useContext(AdminContext);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
    fetchRecentNotes();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
        headers: { 'x-auth-token': token }
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchRecentNotes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notes?limit=5`);
      setRecentNotes(res.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL}/api/notes/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchRecentNotes();
      fetchStats();
    } catch (err) {
      console.error(err);
      alert('Failed to delete note');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleBulkUpload = async () => {
    try {
      setUploading(true);
      setMessage('');
      
      const data = JSON.parse(bulkData);
      const token = localStorage.getItem('adminToken');
      
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/bulk-upload`,
        data,
        { headers: { 'x-auth-token': token } }
      );
      
      setMessage('✅ ' + res.data.msg);
      setBulkData('');
      fetchStats();
      setTimeout(() => setShowBulkUpload(false), 2000);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.msg || err.message || 'Upload failed'));
    }
    setUploading(false);
  };

  const handleSubjectFormChange = (e) => {
    const { name, value } = e.target;
    setSubjectForm({ ...subjectForm, [name]: value });
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setSubjectForm(prev => ({ ...prev, slug }));
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      setMessage('');
      
      const token = localStorage.getItem('adminToken');
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/subjects`,
        subjectForm,
        { headers: { 'x-auth-token': token } }
      );
      
      setMessage('✅ Subject added successfully!');
      setSubjectForm({
        name: '',
        slug: '',
        description: '',
        icon: '📚',
        category: 'programming',
        level: 'beginner',
        order: 1
      });
      fetchStats();
      setTimeout(() => {
        setShowAddSubject(false);
        setMessage('');
      }, 2000);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.msg || err.message || 'Failed to add subject'));
    }
    setUploading(false);
  };

  const exampleData = {
    subjects: [
      {
        name: "JavaScript Programming",
        slug: "javascript-programming",
        description: "Learn JavaScript from basics to advanced",
        icon: "🟨",
        category: "programming",
        level: "beginner",
        order: 1,
        topics: [
          {
            title: "Introduction to JavaScript",
            slug: "intro-to-javascript",
            description: "Get started with JavaScript basics",
            order: 1,
            estimatedTime: 15,
            difficulty: "easy",
            contents: [
              {
                title: "What is JavaScript?",
                type: "text",
                content: "JavaScript is a programming language that enables interactive web pages. It's an essential part of web applications.",
                order: 1
              },
              {
                title: "Your First JavaScript Code",
                type: "code",
                content: "console.log('Hello, World!');",
                codeLanguage: "javascript",
                order: 2,
                examples: [
                  {
                    title: "Printing to Console",
                    code: "console.log('Welcome to JavaScript!');",
                    explanation: "This code prints a message to the browser console."
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const adminData = admin || JSON.parse(localStorage.getItem('adminData') || '{}');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Welcome, {adminData.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Subjects</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.subjects}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FiBook className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Topics</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.topics}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FiLayers className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Contents</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.contents}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Notes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.notes || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <FaFilePdf className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Downloads</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalDownloads || 0}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <FiDownload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Notes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/manage')}
                className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg transition-colors"
              >
                <FiBook className="w-5 h-5" />
                <span className="font-medium">Manage Content</span>
              </button>
              <button
                onClick={() => navigate('/admin/notes')}
                className="w-full flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg transition-colors"
              >
                <FaFilePdf className="w-5 h-5" />
                <span className="font-medium">Manage Notes</span>
              </button>
              <button
                onClick={() => setShowBulkUpload(!showBulkUpload)}
                className="w-full flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg transition-colors"
              >
                <FiUpload className="w-5 h-5" />
                <span className="font-medium">Bulk Upload</span>
              </button>
              <button
                onClick={() => setShowAddSubject(!showAddSubject)}
                className="w-full flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                <span className="font-medium">Add Subject</span>
              </button>
            </div>
          </div>

          {/* Recent Notes */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Notes</h2>
              <button
                onClick={() => navigate('/admin/notes')}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                View All
              </button>
            </div>
            
            {recentNotes.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FaFilePdf className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No notes uploaded yet</p>
                <button
                  onClick={() => navigate('/admin/notes')}
                  className="mt-3 text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  Upload your first note
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <div
                    key={note._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg flex-shrink-0">
                        <FaFilePdf className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {note.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">
                            {note.subject}
                          </span>
                          <span>{formatFileSize(note.fileSize)}</span>
                          <span className="flex items-center gap-1">
                            <FiDownload className="w-3 h-3" />
                            {note.downloads}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        onClick={() => navigate('/admin/notes')}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Single Subject Form */}
        {showAddSubject && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Subject</h3>
            
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subject Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={subjectForm.name}
                    onChange={handleSubjectFormChange}
                    required
                    placeholder="e.g., Python Programming"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slug (URL-friendly) *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={subjectForm.slug}
                    onChange={handleSubjectFormChange}
                    required
                    placeholder="e.g., python-programming"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    name="icon"
                    value={subjectForm.icon}
                    onChange={handleSubjectFormChange}
                    placeholder="e.g., 🐍"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={subjectForm.category}
                    onChange={handleSubjectFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="programming">Programming</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="languages">Languages</option>
                    <option value="science">Science</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Level *
                  </label>
                  <select
                    name="level"
                    value={subjectForm.level}
                    onChange={handleSubjectFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all">All Levels</option>
                  </select>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={subjectForm.order}
                    onChange={handleSubjectFormChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={subjectForm.description}
                  onChange={handleSubjectFormChange}
                  required
                  rows="3"
                  placeholder="Brief description of the subject..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${
                  message.startsWith('✅') 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Adding...' : 'Add Subject'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSubject(false);
                    setMessage('');
                  }}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Note:</h4>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                After adding a subject, you can add topics and content using the bulk upload feature with JSON format.
              </p>
            </div>
          </div>
        )}

        {/* Bulk Upload Section */}
        {showBulkUpload && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Bulk Upload JSON Data</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Paste JSON Data
              </label>
              <textarea
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                placeholder={JSON.stringify(exampleData, null, 2)}
                className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {message && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.startsWith('✅') 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              }`}>
                {message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleBulkUpload}
                disabled={uploading || !bulkData}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Data'}
              </button>
              <button
                onClick={() => setBulkData(JSON.stringify(exampleData, null, 2))}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Load Example
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">JSON Format Guide:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                <li>• subjects: Array of subject objects</li>
                <li>• Each subject contains: name, slug, description, icon, category, level, order</li>
                <li>• topics: Array of topic objects within each subject</li>
                <li>• contents: Array of content objects within each topic</li>
                <li>• Content types: "text", "code", "example", "exercise", "quiz"</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
