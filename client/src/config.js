// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('render.com')
    ? 'https://edulearn-backend-y6s3.onrender.com'
    : process.env.NODE_ENV === 'production' 
      ? 'https://edulearn-backend-y6s3.onrender.com' 
      : 'http://localhost:5000');

console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔧 REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

export default API_BASE_URL;
