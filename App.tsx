import React, { useEffect, useState } from 'react';
import AbstractBackground from 'D:/New_Project/safe-connect/components/AbstractBackground.tsx';
import FeatureBox from 'D:/New_Project/safe-connect/components/FeatureBox.tsx';
import Footer from 'D:/New_Project/safe-connect/components/Footer.tsx';
import ForgotPasswordPage from 'D:/New_Project/safe-connect/components/ForgotPasswordPage.tsx';
import Header from 'D:/New_Project/safe-connect/components/Header.tsx';
import { ArrowRightEndOnRectangleIcon, BellAlertIcon, DevicePhoneMobileIcon, MapPinIcon, ShieldCheckIcon, UserPlusIcon } from 'D:/New_Project/safe-connect/components/IconComponents.tsx';
import LoginPage from 'D:/New_Project/safe-connect/components/LoginPage.tsx';
import PrivacyPolicyPage from 'D:/New_Project/safe-connect/components/PrivacyPolicyPage.tsx';
import RegistrationPage from 'D:/New_Project/safe-connect/components/RegistrationPage.tsx';
import Section from 'D:/New_Project/safe-connect/components/Section.tsx';
import TermsOfServicePage from 'D:/New_Project/safe-connect/components/TermsOfServicePage.tsx';

import { auth, firebase } from 'D:/New_Project/safe-connect/.firebase';

// Image URLs - user should place these in the project root folder
const idCardDetailUrl = './safe-connect-id-detail.jpg'; 
const boothAndCardUrl = './safe-connect-booth-card.jpg';

export type PageName = 'main' | 'privacy' | 'terms' | 'register' | 'login' | 'forgot-password';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageName>('main');
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      // If user logs in/out and they are on an auth page, redirect to main
      if (user && (currentPage === 'login' || currentPage === 'register' || currentPage === 'forgot-password')) {
        navigateTo('main');
      }
      if (!user && (currentPage !== 'main' && currentPage !== 'privacy' && currentPage !== 'terms' && currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'forgot-password')) {
        // If user logs out and is on a page that requires auth (hypothetically), redirect.
        // For now, this setup doesn't have such pages beyond the auth pages themselves.
      }
    });
    return () => unsubscribe();
  }, [currentPage]);

  const navigateTo = (page: PageName, sectionId?: string) => {
    setCurrentPage(page);
    if (sectionId) {
      if (page === 'main') {
        setTargetSection(sectionId.startsWith('#') ? sectionId.substring(1) : sectionId);
      } else {
        setTargetSection(null); 
      }
    } else {
      setTargetSection(null); 
    }
    window.scrollTo(0, 0); 
  };

  useEffect(() => {
    if (currentPage === 'main' && targetSection) {
      const element = document.getElementById(targetSection);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          setTargetSection(null); 
        }, 100);
      } else {
        setTargetSection(null); 
      }
    }
  }, [currentPage, targetSection]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null); // Explicitly set to null, though onAuthStateChanged will also trigger
      navigateTo('main'); // Navigate to home page after logout
      console.log("User logged out successfully");
    } catch (error) {
      const typedError = error as any;
      console.error("Error logging out. Message:", typedError.message, "Code:", typedError.code);
      // Handle logout error (e.g., display a message)
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    console.log('Form data submitted (contact form):', data);

    setSubmissionStatus('success');
    setSubmissionMessage('Message sent successfully! Thank you for reaching out.');
    (event.target as HTMLFormElement).reset();

    setTimeout(() => {
      setSubmissionMessage(null);
      setSubmissionStatus(null);
    }, 5000);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-lightBg">
        <div className="text-xl text-primary font-semibold">Loading Safe-Connect...</div>
        {/* You could add a spinner here */}
      </div>
    );
  }

  if (currentPage === 'privacy') {
    return (
      <div className="flex flex-col min-h-screen bg-lightBg">
        <Header navigateTo={navigateTo} currentPage={currentPage} currentUser={currentUser} handleLogout={handleLogout} />
        <PrivacyPolicyPage navigateTo={navigateTo} />
        <Footer navigateTo={navigateTo} currentPage={currentPage} />
      </div>
    );
  }

  if (currentPage === 'terms') {
    return (
      <div className="flex flex-col min-h-screen bg-lightBg">
        <Header navigateTo={navigateTo} currentPage={currentPage} currentUser={currentUser} handleLogout={handleLogout} />
        <TermsOfServicePage navigateTo={navigateTo} />
        <Footer navigateTo={navigateTo} currentPage={currentPage} />
      </div>
    );
  }
  
  // Prevent access to auth pages if already logged in
  if (currentUser && (currentPage === 'login' || currentPage === 'register' || currentPage === 'forgot-password')) {
     // This useEffect in onAuthStateChanged already handles this, but as a fallback:
     navigateTo('main');
     return null; // Or a loading indicator while redirecting
  }


  if (currentPage === 'register') {
    return (
      <div className="flex flex-col min-h-screen bg-lightBg">
        <Header navigateTo={navigateTo} currentPage={currentPage} currentUser={currentUser} handleLogout={handleLogout} />
        <RegistrationPage navigateTo={navigateTo} />
        <Footer navigateTo={navigateTo} currentPage={currentPage} />
      </div>
    );
  }

  if (currentPage === 'login') { 
    return (
      <div className="flex flex-col min-h-screen bg-lightBg">
        <Header navigateTo={navigateTo} currentPage={currentPage} currentUser={currentUser} handleLogout={handleLogout} />
        <LoginPage navigateTo={navigateTo} />
        <Footer navigateTo={navigateTo} currentPage={currentPage} />
      </div>
    );
  }

  if (currentPage === 'forgot-password') {
    return (
      <div className="flex flex-col min-h-screen bg-lightBg">
        <Header navigateTo={navigateTo} currentPage={currentPage} currentUser={currentUser} handleLogout={handleLogout} />
        <ForgotPasswordPage navigateTo={navigateTo} />
        <Footer navigateTo={navigateTo} currentPage={currentPage} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-lightBg">
      <Header navigateTo={navigateTo} currentPage={currentPage} currentUser={currentUser} handleLogout={handleLogout} />
      <main className="flex-grow">
        <Section 
          id="home" 
          className="relative bg-gradient-to-br from-primary-dark via-primary to-accent/60 text-white min-h-[calc(100vh-80px)] flex items-center !py-0 overflow-hidden animated-gradient"
          containerClassName="text-center z-10"
          titleClassName="!text-white"
        >
          <AbstractBackground />
          <div className="max-w-3xl mx-auto py-12 md:py-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Welcome to Safe<span className="text-secondary-DEFAULT">Connect</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-10 text-slate-100/90">
              Reimagining public communication for students and the elderly – no mobile required!
            </p>
            {!currentUser && (
              <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
                <button
                  onClick={() => navigateTo('register')}
                  className="w-full sm:w-auto inline-flex items-center justify-center py-3.5 px-8 rounded-lg font-semibold text-white 
                             bg-gradient-to-b from-accent-light to-accent 
                             hover:from-accent hover:to-accent-dark
                             border border-accent-dark shadow-md hover:shadow-xl 
                             active:shadow-inner active:scale-95
                             transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-accent-DEFAULT focus:ring-offset-2 focus:ring-offset-primary-dark text-lg"
                  aria-label="Register Now"
                >
                  <UserPlusIcon className="w-5 h-5 mr-2 -ml-1" />
                  Register Now
                </button>
                <button
                  onClick={() => navigateTo('login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center py-3.5 px-8 rounded-lg font-semibold text-primary-dark 
                             bg-white hover:bg-slate-100
                             border border-slate-300 shadow-md hover:shadow-xl 
                             active:shadow-inner active:scale-95
                             transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-primary-dark text-lg"
                  aria-label="Login to your account"
                >
                   <ArrowRightEndOnRectangleIcon className="w-5 h-5 mr-2 -ml-1" />
                  Login
                </button>
              </div>
            )}
            {currentUser && (
              <div className="text-center">
                <p className="text-xl md:text-2xl mb-6 text-slate-100/90">
                  Welcome back, {currentUser.email || 'User'}!
                </p>
                {/* You can add more user-specific CTAs here, e.g., "Go to Dashboard" */}
              </div>
            )}
            <a
              href="#how"
              onClick={(e) => {
                const targetElement = document.getElementById('how');
                if (targetElement) {
                  e.preventDefault();
                  targetElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="mt-12 inline-block py-3 px-8 rounded-lg font-medium text-slate-200 
                         hover:text-white hover:bg-white/10
                         border border-transparent hover:border-white/30
                         transition-all duration-300 transform text-md"
            >
              Learn More About SafeConnect
            </a>
          </div>
        </Section>

        <Section id="how" title="How SafeConnect Works" className="bg-slate-50">
          <div className="space-y-16 md:space-y-24">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="md:order-last">
                <img 
                  src={idCardDetailUrl} 
                  alt="Safe-Connect NFC/QR ID Card detail" 
                  className="rounded-xl shadow-2xl w-full max-w-md mx-auto aspect-[3/4] object-cover hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-semibold text-primary-dark mb-4">The Safe-Connect ID Card</h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Each user is equipped with a personalized Safe-Connect ID card. This durable card features both a QR code and embedded NFC technology. 
                </p>
                <p className="text-slate-700 leading-relaxed mb-3">
                  It securely stores essential identification and emergency contact information, ready to be accessed instantly when needed.
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Unique QR Code for quick scans.</li>
                  <li>NFC chip for tap-and-go functionality.</li>
                  <li>Holds crucial user and emergency details.</li>
                  <li>Designed for all ages, simple and robust.</li>
                </ul>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <img 
                  src={boothAndCardUrl} 
                  alt="Safe-Connect Smart Booth with ID Card" 
                  className="rounded-xl shadow-2xl w-full max-w-md mx-auto aspect-square object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-semibold text-primary-dark mb-4">Accessible Smart Booths</h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Our Smart Communication Booths are strategically placed in key public locations like schools, markets, and community centers.
                </p>
                <p className="text-slate-700 leading-relaxed mb-3">
                  To make a call, users simply tap their Safe-Connect ID card on the booth's reader. The system instantly verifies the card and connects the call to pre-authorized contacts or emergency services.
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Easy tap-to-call activation.</li>
                  <li>Located in high-traffic, accessible areas.</li>
                  <li>Instant connection, no personal phone needed.</li>
                  <li>Ensures reliable communication for everyone.</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <Section id="features" title="Our Core Features" className="bg-white">
          <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
            <FeatureBox
              icon={<DevicePhoneMobileIcon className="w-10 h-10 text-accent" />}
              title="No Mobile Needed"
              description="Perfect for children, seniors, or in areas with poor mobile signal. Ensures everyone stays connected when it matters most."
            />
            <FeatureBox
              icon={<MapPinIcon className="w-10 h-10 text-accent" />}
              title="Location-Based Access"
              description="Booths are thoughtfully positioned near schools, markets, community centers, and public transport hubs for maximum accessibility."
            />
            <FeatureBox
              icon={<BellAlertIcon className="w-10 h-10 text-accent" />}
              title="Real-Time Notifications"
              description="Guardians or pre-set emergency contacts receive instant alerts with location details when a call is initiated by their dependant."
            />
            <FeatureBox
              icon={<ShieldCheckIcon className="w-10 h-10 text-accent" />}
              title="Secure and Private"
              description="User data is encrypted and protected with industry-leading security standards, prioritizing privacy, safety, and data integrity."
            />
          </div>
        </Section>

        <Section id="about" title="About Us" className="bg-slate-50">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
             <div className="md:order-last">
                <img 
                  src={boothAndCardUrl} 
                  alt="Safe-Connect system empowering communities" 
                  className="rounded-xl shadow-xl mx-auto w-full max-w-lg aspect-square object-cover" 
                />
              </div>
            <div className="text-center md:text-left">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Safe-Connect is founded with a dedicated mission: to provide dependable and secure communication alternatives for individuals, especially those without consistent access to smartphones.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Our innovative system is designed to ensure connectivity, enhance safety, and offer unparalleled ease of use for everyone in the community. We believe in bridging communication gaps with technology that is accessible, reliable, and trustworthy.
              </p>
            </div>
          </div>
        </Section>

        <Section id="contact" title="Get In Touch" className="bg-gradient-to-br from-primary-dark via-primary to-accent/60 animated-gradient">
          <div className="max-w-xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
            <h3 className="text-2xl font-semibold text-darkText mb-8 text-center">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-darkText mb-1">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  placeholder="e.g. Jane Doe" 
                  required 
                  aria-required="true"
                  className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-200" 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-darkText mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  placeholder="e.g. jane.doe@example.com" 
                  required 
                  aria-required="true"
                  className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-200"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-darkText mb-1">Your Message</label>
                <textarea 
                  id="message"
                  name="message"
                  rows={5} 
                  placeholder="Tell us how we can help or provide feedback..." 
                  required
                  aria-required="true"
                  className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-200"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 px-6 rounded-lg font-semibold text-white 
                           bg-gradient-to-b from-primary-light to-primary 
                           hover:from-primary hover:to-primary-dark
                           border border-primary-dark shadow-md hover:shadow-lg 
                           active:shadow-inner active:scale-95
                           transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 focus:ring-offset-white text-lg"
              >
                Send Message
              </button>
              {submissionMessage && (
                <div 
                  role="status"
                  aria-live="polite"
                  className={`mt-4 text-center p-3 rounded-md text-sm
                    ${submissionStatus === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : ''}
                    ${submissionStatus === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : ''}
                  `}
                >
                  {submissionMessage}
                </div>
              )}
            </form>
          </div>
        </Section>
      </main>
      <Footer navigateTo={navigateTo} currentPage={currentPage} />
    </div>
  );
};

export default App;