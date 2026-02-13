
import React from 'react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20">
      <div className="space-y-4">
        <Link to="/" className="inline-flex items-center text-[#CBB8A9] hover:text-[#E6B18A] font-bold transition-colors mb-4">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-[#F5EFEA] tracking-tight">Privacy Policy</h1>
        <p className="text-[#CBB8A9]">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-[#241814] rounded-[2.5rem] border border-[#3A2A23] p-8 sm:p-12 space-y-10 text-[#CBB8A9] leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F5EFEA]">1. Introduction</h2>
          <p>
            Welcome to Open Shelf Library ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F5EFEA]">2. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as when you create an account, add a book to the library, or interact with our AI Librarian. This may include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account credentials (username, password).</li>
            <li>Book metadata and descriptions provided by you.</li>
            <li>Conversational data from the AI chat interface.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F5EFEA]">3. AI Processing and Google Gemini</h2>
          <p>
            Our service utilizes the Google Gemini API to provide intelligent summaries and librarian assistance. When you interact with AI features:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Text prompts and book descriptions are sent to Google's servers for processing.</li>
            <li>This data is used solely to generate the requested response.</li>
            <li>We do not use your personal private library data to train public AI models.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F5EFEA]">4. Local Storage</h2>
          <p>
            We use browser Local Storage to store your library data and authentication state. This data stays on your device and is not synced to a central server unless you explicitly integrate with a backend service (currently an MVP feature).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F5EFEA]">5. Contact Us</h2>
          <p>
            If you have questions or comments about this policy, you may contact us at support@openshelf.example.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
