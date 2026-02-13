
import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20">
      <div className="space-y-4">
        <Link to="/" className="inline-flex items-center text-[#CBB8A9] hover:text-[#E6B18A] font-bold transition-colors mb-4">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-[#F5EFEA] tracking-tight">Terms of Service</h1>
        <p className="text-[#CBB8A9]">Effective Date: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-[#241814] rounded-[2.5rem] border border-[#3A2A23] p-8 sm:p-12 space-y-10 text-[#CBB8A9] leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F5EFEA]">1. Agreement to Terms</h2>
          <p>
            By accessing or using Open Shelf Library, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F5EFEA]">2. Intellectual Property</h2>
          <p>
            The software, design, and AI integrations are the property of Open Shelf Library. Users retain rights to the specific metadata and descriptions they input, but grant us a license to process this data to provide the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F5EFEA]">3. AI Usage Disclaimer</h2>
          <p>
            Our AI features (summaries, librarian chat) are powered by the Google Gemini API. While we strive for accuracy, AI-generated content can occasionally be incorrect or misleading.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>AI outputs should be verified by the user.</li>
            <li>We are not responsible for errors in AI-generated book summaries.</li>
            <li>Users must not use the AI interface for generating illegal or harmful content.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F5EFEA]">4. Limitation of Liability</h2>
          <p>
            In no event shall Open Shelf Library, its creators, or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F5EFEA]">5. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Effective Date" at the top of this page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
