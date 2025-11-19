import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      loadAdmin();
    } else {
      setLoading(false);
    }
  }, []);

  const loadAdmin = async () => {
    try {
      const adminData = localStorage.getItem('adminData');
      if (adminData) {
        setAdmin(JSON.parse(adminData));
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
    localStorage.setItem('adminToken', res.data.token);
    localStorage.setItem('adminData', JSON.stringify(res.data.admin));
    setAdmin(res.data.admin);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
