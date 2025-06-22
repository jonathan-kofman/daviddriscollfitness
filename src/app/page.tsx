"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

// CUSTOMIZATION SETTINGS - Edit these to customize your Calendly embed
const CALENDLY_CONFIG = {
  // Your Calendly URL
  url: 'https://calendly.com/davidpdriscoll8/consultation',
  
  // Appearance Customization
  hideEventDetails: true,        // Hide event description/details
  hideGdprBanner: true,         // Hide cookie consent banner
  hideLandingPageDetails: true, // Hide additional event info
  
  // Color Scheme (use hex colors without #)
  primaryColor: 'ef4444',   // Red to match your brand
  textColor: '374151',      // Dark gray for text
  backgroundColor: 'ffffff', // White background
  linkColor: 'ef4444',      // Red for links
  
  // Pre-fill Settings
  prefillData: {
    name: '',
    email: '',
    // Add any custom question pre-fills here
  },
  
  // UTM Tracking
  utmTracking: {
    utmSource: 'website',
    utmMedium: 'popup',
    utmCampaign: 'fitness_consultation',
    utmContent: 'hero_cta'
  },
  
  // Modal Settings
  modalSize: {
    maxWidth: '4xl',      // Tailwind class: sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl
    height: '80vh'        // CSS height value
  }
};

// SOCIAL MEDIA LINKS - Update these with your actual social media URLs
const SOCIAL_LINKS = {
  tiktok: 'https://www.tiktok.com/@daviddriscoll18',
  instagram: 'https://www.instagram.com/daviddriscoll18'
};

// Type definitions
interface CalendlyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Extend Window interface for Calendly
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (config: {
        url: string;
        parentElement: HTMLElement | null;
        prefill?: object;
        utm?: object;
      }) => void;
    };
  }
}

// Helper function to build Calendly URL with customizations
const buildCalendlyUrl = () => {
  const params = new URLSearchParams();
  
  // Add appearance parameters
  if (CALENDLY_CONFIG.hideEventDetails) params.append('hide_event_details', '1');
  if (CALENDLY_CONFIG.hideGdprBanner) params.append('hide_gdpr_banner', '1');
  if (CALENDLY_CONFIG.hideLandingPageDetails) params.append('hide_landing_page_details', '1');
  
  // Add color parameters
  if (CALENDLY_CONFIG.primaryColor) params.append('primary_color', CALENDLY_CONFIG.primaryColor);
  if (CALENDLY_CONFIG.textColor) params.append('text_color', CALENDLY_CONFIG.textColor);
  if (CALENDLY_CONFIG.backgroundColor) params.append('background_color', CALENDLY_CONFIG.backgroundColor);
  if (CALENDLY_CONFIG.linkColor) params.append('link_color', CALENDLY_CONFIG.linkColor);
  
  return `${CALENDLY_CONFIG.url}?${params.toString()}`;
};

// Calendly Popup Component
const CalendlyPopup = ({ isOpen, onClose }: CalendlyPopupProps) => {
  React.useEffect(() => {
    if (isOpen) {
      // Load Calendly script
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);

      // Load Calendly CSS
      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      return () => {
        // Clean up scripts when modal closes
        try {
          document.head.removeChild(script);
          document.head.removeChild(link);
        } catch {
          // Scripts may have already been removed
        }
      };
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && window.Calendly) {
      // Initialize Calendly widget with custom configuration
      window.Calendly.initInlineWidget({
        url: buildCalendlyUrl(),
        parentElement: document.getElementById('calendly-widget'),
        prefill: CALENDLY_CONFIG.prefillData,
        utm: CALENDLY_CONFIG.utmTracking
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg w-full max-w-${CALENDLY_CONFIG.modalSize.maxWidth} relative shadow-2xl`}
           style={{ height: CALENDLY_CONFIG.modalSize.height }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors shadow-lg"
          aria-label="Close calendar"
        >
          <X className="w-6 h-6" />
        </button>
        <div 
          id="calendly-widget" 
          className="w-full h-full rounded-lg overflow-hidden"
          style={{ minWidth: '320px', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default function Home() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const openCalendly = () => setIsCalendlyOpen(true);
  const closeCalendly = () => setIsCalendlyOpen(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-[family-name:var(--font-geist-sans)]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            The ultimate{' '}
            <span className="text-red-500">1:1 coaching</span>{' '}
            experience{' '}
            <span className="text-red-500">SHRED FAT</span>, build{' '}
            <span className="text-red-500">LEAN MUSCLE</span>, and build unbreakable{' '}
            <span className="text-red-500">DISCIPLINE</span>.
          </h1>
          {/* CTA Button */}
          <div className="mt-8">
            <button 
              onClick={openCalendly}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Schedule Free Consultation
            </button>
          </div>
          
          {/* Social Media Links */}
          <div className="mt-12 flex justify-center space-x-6">
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-500 transition-colors duration-300 transform hover:scale-110"
              aria-label="Follow us on TikTok"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-500 transition-colors duration-300 transform hover:scale-110"
              aria-label="Follow us on Instagram"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-8 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Here&apos;s What My Clients Have To Say
          </h2>
          <p className="text-gray-600 text-center mb-12 text-lg">Testimonials</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
              </div>
              <h3 className="text-red-500 font-bold text-xl mb-3">&quot;I lost 15 pounds&quot;</h3>
              <p className="text-gray-700 leading-relaxed">
                &quot;I lost 15 pounds of fat, and it&apos;s made me a better man&quot;
              </p>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
              </div>
              <h3 className="text-red-500 font-bold text-xl mb-3">&quot;Awesome mentor&quot;</h3>
              <p className="text-gray-700 leading-relaxed">
                &quot;Evan has been an awesome mentor and has helped me understand nutrition and training better than ever before.&quot;
              </p>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
              </div>
              <h3 className="text-red-500 font-bold text-xl mb-3">&quot;I had no experience&quot;</h3>
              <p className="text-gray-700 leading-relaxed">
                &quot;He has taught me the implications of my food, water intake, and cardio. I can&apos;t thank him enough! I&apos;m in the best shape of my life.&quot;
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button 
              onClick={openCalendly}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Book Your Consultation
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">FAQ</h2>
          <p className="text-gray-600 text-center mb-12 text-lg">Everything you need to know.</p>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-3 text-red-500">
                How do I know I&apos;ll even see results?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our proven track record speaks for itself. With personalized coaching and accountability, 
                you&apos;ll see measurable results within the first 30 days or we&apos;ll work with you until you do.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-3 text-red-500">
                Are there any guarantees?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Yes! We guarantee that if you follow the program exactly as prescribed, 
                you will see significant changes in your physique and mindset within 90 days.
              </p>
            </div>
            <div className="pb-6">
              <h3 className="text-xl font-semibold mb-3 text-red-500">
                What makes this different from other programs?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                This isn&apos;t just about workouts and meal plans. We focus on building unbreakable discipline 
                and mental toughness that will transform every area of your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 sm:px-8 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Ready to change your physique forever?
          </h2>
          <button 
            onClick={openCalendly}
            className="bg-white hover:bg-gray-100 text-red-500 font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-red-500"
          >
            Start Your Transformation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-8 bg-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
          </div>
          
          {/* Social Media Links in Footer */}
          <div className="flex items-center gap-4">
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-500 transition-colors duration-300 transform hover:scale-110"
              aria-label="Follow us on TikTok"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-500 transition-colors duration-300 transform hover:scale-110"
              aria-label="Follow us on Instagram"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
          
          <p className="text-gray-600 text-sm">
            © 2025 Fitness Coaching. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* Calendly Popup Modal */}
      <CalendlyPopup isOpen={isCalendlyOpen} onClose={closeCalendly} />
    </div>
  );
}