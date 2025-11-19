import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiClock, FiBarChart2, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const SubjectDetail = () => {
  const { slug } = useParams();
  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchSubjectData = async () => {
    try {
      const subjectRes = await axios.get(`http://localhost:5000/api/subjects/${slug}`);
      setSubject(subjectRes.data);
      
      const topicsRes = await axios.get(`http://localhost:5000/api/topics/subject/${subjectRes.data._id}`);
      setTopics(topicsRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/subjects"
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Subjects
        </Link>

        {/* Subject Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-8 md:p-12 mb-12 text-center"
        >
          <div className="text-7xl mb-6">{subject.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {subject.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
            {subject.description}
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg font-semibold capitalize">
              {subject.category}
            </span>
            <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-semibold capitalize">
              {subject.level}
            </span>
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg font-semibold">
              {topics.length} Topics
            </span>
          </div>
        </motion.div>

        {/* Topics Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Course Topics
          </h2>
          
          {topics.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                No topics available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {topics.map((topic, index) => (
                <motion.div
                  key={topic._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={`/learn/${subject.slug}`}
                    className="card card-hover p-6 flex items-start gap-6 group"
                  >
                    {/* Topic Number */}
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>

                    {/* Topic Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {topic.description}
                      </p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FiClock className="mr-1.5 w-4 h-4" />
                          {topic.estimatedTime} mins
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${getDifficultyColor(topic.difficulty)}`}>
                          <FiBarChart2 className="mr-1.5 w-4 h-4" />
                          {topic.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            What You'll Learn
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Comprehensive understanding of core concepts',
              'Hands-on practice with real examples',
              'Step-by-step guided learning path',
              'Track your progress as you learn'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <FiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubjectDetail;
