
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Browse from './pages/Browse.tsx';
import BookDetails from './pages/BookDetails.tsx';
import Admin from './pages/Admin.tsx';
import Login from './pages/Login.tsx';
import LibrarianChat from './components/LibrarianChat.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
      <LibrarianChat />
    </Router>
  );
};

export default App;
