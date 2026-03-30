
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Browse from './pages/Browse.tsx';
import BookDetails from './pages/BookDetails.tsx';
import Admin from './pages/Admin.tsx';
import Login from './pages/Login.tsx';
import Privacy from './pages/Privacy.tsx';
import Terms from './pages/Terms.tsx';
import LibrarianChat from './components/LibrarianChat.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { db } from './firebase.ts';
import { doc, getDocFromServer } from 'firebase/firestore';

const App: React.FC = () => {
  useEffect(() => {
    async function testConnection() {
      try {
        // Test connection to Firestore using the diagnostic path allowed in rules
        const testDoc = doc(db, 'test', 'connection');
        await getDocFromServer(testDoc);
        console.log("Firebase connection successful: Firestore is reachable.");
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('the client is offline')) {
            console.error("Firebase connection failed: The client is offline. Please check your network and Firebase configuration.");
          } else if (error.message.includes('Missing or insufficient permissions')) {
            // This is actually a good sign - it means we reached the server and it rejected us based on rules
            console.log("Firebase connection reachable: Server responded with permission check.");
          } else {
            console.warn("Firebase connection diagnostic returned an unexpected error:", error.message);
          }
        }
      }
    }
    testConnection();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </Layout>
        <LibrarianChat />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
