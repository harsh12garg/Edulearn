import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCode, FiBook, FiGlobe, FiTrendingUp, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const Home = () => {
  const features = [
    { 
      icon: <FiCode className="w-8 h-8" />, 
      title: 'Programming', 
      desc: 'Learn coding from scratch with hands-on examples',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    },
    { 
      icon: <FiBook className="w-8 h-8" />, 
      title: 'Mathematics', 
      desc: 'Class 1-12 complete syllabus with detailed solutions',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    },
    { 
      icon: <FiGlobe className="w-8 h-8" />, 
      title: 'Languages', 
      desc: 'Master English grammar and communication skills',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
    },
    { 
      icon: <FiTrendingUp className="w-8 h-8" />, 
      title: 'Track Progress', 
      desc: 'Monitor your learning journey with detailed analytics',
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
    }
  ];

  const benefits = [
    'Completely free education for all',
    'Learn at your own pace',
    'Expert-curated content',
    'Interactive code examples',
    'Progress tracking',
    'Mobile-friendly platform'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Free Education for{' '}
              <span className="text-primary-600 dark:text-primary-400">
                Every Indian Student
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              Learn programming, mathematics, English, and more - completely free with expert-curated content
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/subjects" className="btn btn-primary text-lg px-8 py-4 inline-flex items-center justify-center group">
                Start Learning
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register" className="btn btn-outline text-lg px-8 py-4 inline-flex items-center justify-center">
                Sign Up Free
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose EduLearn?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to succeed in your learning journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="card card-hover p-8 text-center"
              >
                <div className={`inline-flex p-4 rounded-xl ${feature.color} mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Learn Without Limits
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Access high-quality educational content designed specifically for Indian students. No hidden fees, no subscriptions - just pure learning.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-3"
                  >
                    <FiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-lg text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="card p-8 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <FiCode className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">12+ Subjects</h4>
                    <p className="text-gray-600 dark:text-gray-300">Comprehensive curriculum</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <FiBook className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">50+ Topics</h4>
                    <p className="text-gray-600 dark:text-gray-300">In-depth learning modules</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <FiTrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Track Progress</h4>
                    <p className="text-gray-600 dark:text-gray-300">Monitor your growth</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-10">
              Join thousands of students learning for free
            </p>
            <Link to="/subjects" className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all group">
              Explore Subjects
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
