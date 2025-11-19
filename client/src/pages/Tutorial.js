import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ThemeContext } from '../context/ThemeContext';
import { FiMenu, FiX, FiChevronRight, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const Tutorial = () => {
  const { slug } = useParams();
  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2); // Show 2 content sections per page by default
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchSubjectData();
  }, [slug]);

  useEffect(() => {
    if (selectedTopic) {
      fetchTopicContent(selectedTopic._id);
      setSidebarOpen(false);
      setCurrentPage(1); // Reset to first page when topic changes
    }
  }, [selectedTopic]);

  const fetchSubjectData = async () => {
    try {
      const subjectRes = await axios.get(`${API_BASE_URL}/api/subjects/${slug}`);
      setSubject(subjectRes.data);
      
      const topicsRes = await axios.get(`${API_BASE_URL}/api/topics/subject/${subjectRes.data._id}`);
      setTopics(topicsRes.data);
      
      if (topicsRes.data.length > 0) {
        setSelectedTopic(topicsRes.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchTopicContent = async (topicId) => {
    try {
      const contentRes = await axios.get(`${API_BASE_URL}/api/content/topic/${topicId}`);
      setContent(contentRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const getCurrentTopicIndex = () => {
    return topics.findIndex(t => t._id === selectedTopic?._id);
  };

  const goToNextTopic = () => {
    const currentIndex = getCurrentTopicIndex();
    if (currentIndex < topics.length - 1) {
      setSelectedTopic(topics[currentIndex + 1]);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousTopic = () => {
    const currentIndex = getCurrentTopicIndex();
    if (currentIndex > 0) {
      setSelectedTopic(topics[currentIndex - 1]);
      window.scrollTo(0, 0);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContent = content.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(content.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Subject not found</h2>
          <Link to="/subjects" className="text-primary-600 dark:text-primary-400 hover:underline">
            Back to Subjects
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = getCurrentTopicIndex();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-primary-600 text-white rounded-lg shadow-lg hover:bg-primary-700 transition-colors"
      >
        {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ top: '64px', height: 'calc(100vh - 64px)' }}
      >
        {/* Subject Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <Link
            to="/subjects"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-3 transition-colors"
          >
            <FiArrowLeft className="mr-1" />
            All Subjects
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{subject.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{subject.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{topics.length} Topics</p>
            </div>
          </div>
        </div>

        {/* Topics List */}
        <nav className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
            Course Content
          </h3>
          <ul className="space-y-1">
            {topics.map((topic, index) => (
              <li key={topic._id}>
                <button
                  onClick={() => handleTopicSelect(topic)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-start gap-3 group ${
                    selectedTopic?._id === topic._id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedTopic?._id === topic._id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm leading-tight">{topic.title}</span>
                  {selectedTopic?._id === topic._id && (
                    <FiChevronRight className="flex-shrink-0 w-5 h-5" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          style={{ top: '64px' }}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {selectedTopic ? (
            <>
              {/* Topic Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  {selectedTopic.title}
                </h1>
                {selectedTopic.description && (
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {selectedTopic.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    selectedTopic.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    selectedTopic.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {selectedTopic.difficulty}
                  </span>
                  {selectedTopic.estimatedTime && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium">
                      {selectedTopic.estimatedTime} min read
                    </span>
                  )}
                </div>
              </div>

              {/* Content Sections with Pagination */}
              <div className="space-y-8">
                {content.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No content available yet.</p>
                  </div>
                ) : (
                  currentContent.map((item) => (
                    <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {item.title}
                      </h2>
                      
                      {item.type === 'text' && (
                        <div className="prose dark:prose-invert max-w-none">
                          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {item.content}
                          </p>
                        </div>
                      )}
                      
                      {item.type === 'code' && (
                        <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                          <SyntaxHighlighter 
                            language={item.codeLanguage || 'javascript'} 
                            style={theme === 'dark' ? vscDarkPlus : vs}
                            customStyle={{
                              margin: 0,
                              padding: '1.5rem',
                              fontSize: '0.95rem',
                              lineHeight: '1.6'
                            }}
                            showLineNumbers
                          >
                            {item.content}
                          </SyntaxHighlighter>
                        </div>
                      )}
                      
                      {item.examples && item.examples.length > 0 && (
                        <div className="mt-6 space-y-4">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                            <span className="w-1.5 h-6 bg-primary-600 rounded-full mr-3"></span>
                            Examples
                          </h3>
                          {item.examples.map((ex, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                              <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-3">
                                {ex.title}
                              </h4>
                              <div className="rounded-lg overflow-hidden mb-3">
                                <SyntaxHighlighter 
                                  language={item.codeLanguage || 'javascript'} 
                                  style={theme === 'dark' ? vscDarkPlus : vs}
                                  customStyle={{
                                    margin: 0,
                                    padding: '1rem',
                                    fontSize: '0.9rem'
                                  }}
                                >
                                  {ex.code}
                                </SyntaxHighlighter>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                <span className="font-semibold">Explanation: </span>
                                {ex.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Controls */}
              {content.length > 1 && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  {/* Page Info and Items Per Page Selector */}
                  <div className="flex items-center gap-4 flex-wrap justify-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages} • Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, content.length)} of {content.length} sections
                    </div>
                    
                    {/* Items per page selector */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        Sections per page:
                      </label>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={content.length}>All</option>
                      </select>
                    </div>
                  </div>

                  {/* Pagination Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === 1
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => goToPage(pageNumber)}
                              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                                currentPage === pageNumber
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span key={pageNumber} className="px-2 text-gray-500 dark:text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === totalPages
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Topic Navigation Footer */}
              <div className="mt-12 flex items-center justify-between gap-4 pb-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={goToPreviousTopic}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    currentIndex === 0
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiArrowLeft />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                  <FiCheckCircle />
                  <span className="hidden sm:inline">Mark Complete</span>
                </button>

                <button
                  onClick={goToNextTopic}
                  disabled={currentIndex === topics.length - 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    currentIndex === topics.length - 1
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <FiChevronRight />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Select a topic from the sidebar to begin learning
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tutorial;
