import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../config';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiBook, FiCheckCircle, FiClock, FiAward, FiTrendingUp } from 'react-icons/fi';

const Profile = () => {
  const { user, loading } = useContext(AuthContext);
  const [progress, setProgress] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    if (user) {
      fetchProgress();
    }
  }, [user, loading, navigate]);

  const fetchProgress = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/progress`);
      setProgress(res.data);
    } catch (err) {
      console.error(err);
    }
    setProgressLoading(false);
  };

  if (loading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const completedTopics = progress.filter(p => p.completed).length;
  const totalTopics = progress.length;
  const completionRate = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-8 md:p-12 mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
            <FiUser className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {user.name}
          </h1>
          <p className="flex items-center justify-center text-lg text-gray-600 dark:text-gray-300">
            <FiMail className="mr-2 w-5 h-5" />
            {user.email}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FiBook className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalTopics}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Topics Started
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your learning journey
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {completedTopics}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Completed
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Topics finished
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <FiClock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalTopics - completedTopics}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              In Progress
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Keep learning
            </p>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="card p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FiTrendingUp className="mr-3 w-7 h-7 text-primary-600 dark:text-primary-400" />
              Overall Progress
            </h2>
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="h-full bg-primary-600 dark:bg-primary-500 rounded-full"
            />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            You've completed {completedTopics} out of {totalTopics} topics. Keep up the great work!
          </p>
        </motion.div>

        {/* Learning Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="card p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FiAward className="mr-3 w-7 h-7 text-primary-600 dark:text-primary-400" />
            Your Learning Progress
          </h2>
          
          {progress.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <FiBook className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
                You haven't started any topics yet
              </p>
              <Link to="/subjects" className="btn btn-primary">
                Start Learning Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {progress.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                      item.completed 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-orange-100 dark:bg-orange-900/30'
                    }`}>
                      {item.completed ? (
                        <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <FiClock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {item.topic?.title || 'Topic'}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Last accessed: {new Date(item.lastAccessed).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${
                    item.completed
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                  }`}>
                    {item.completed ? 'Completed' : 'In Progress'}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
