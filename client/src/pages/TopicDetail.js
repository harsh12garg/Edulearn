import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock, FiBarChart2, FiBookOpen } from 'react-icons/fi';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const TopicDetail = () => {
  const { slug } = useParams();
  const [topic, setTopic] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchTopicData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchTopicData = async () => {
    try {
      const topicRes = await axios.get(`http://localhost:5000/api/topics/${slug}`);
      setTopic(topicRes.data);
      
      const contentRes = await axios.get(`http://localhost:5000/api/content/topic/${topicRes.data._id}`);
      setContent(contentRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Topic not found</h2>
          <Link to="/subjects" className="text-primary-600 dark:text-primary-400 hover:underline">
            Back to Subjects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to={`/subject/${topic.subject?.slug}`}
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to {topic.subject?.name}
        </Link>

        {/* Topic Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {topic.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {topic.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold capitalize ${getDifficultyColor(topic.difficulty)}`}>
              <FiBarChart2 className="mr-2 w-4 h-4" />
              {topic.difficulty}
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-semibold">
              <FiClock className="mr-2 w-4 h-4" />
              {topic.estimatedTime} mins
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-semibold">
              <FiBookOpen className="mr-2 w-4 h-4" />
              {content.length} Sections
            </span>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6">
          {content.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="card p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {item.title}
              </h2>
              
              {item.type === 'text' && (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              )}
              
              {item.type === 'code' && (
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <SyntaxHighlighter 
                    language={item.codeLanguage} 
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
                <div className="mt-8 space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <span className="w-2 h-8 bg-primary-600 rounded-full mr-3"></span>
                    Examples
                  </h3>
                  {item.examples.map((ex, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <h4 className="text-lg font-bold text-primary-600 dark:text-primary-400 mb-3">
                        {ex.title}
                      </h4>
                      <div className="rounded-lg overflow-hidden mb-4">
                        <SyntaxHighlighter 
                          language={item.codeLanguage} 
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
                        <span className="font-semibold text-gray-900 dark:text-white">Explanation: </span>
                        {ex.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Navigation Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 card p-6 flex items-center justify-between"
        >
          <Link
            to={`/subject/${topic.subject?.slug}`}
            className="btn btn-secondary"
          >
            ← Back to Topics
          </Link>
          <button className="btn btn-primary">
            Mark as Complete
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TopicDetail;
