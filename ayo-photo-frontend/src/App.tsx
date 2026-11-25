import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Archive from './pages/Archive';
// import About from './pages/About';
import Services from './components/Service';
import Footer from './components/Footer';

// New page -> start at the top. New page with a #hash (e.g. /#contact from the
// navbar) -> scroll to that section once the page has rendered.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Wait for the target section to exist, then scroll to it, leaving room
    // for the fixed navbar (64px) so the section heading isn't hidden.
    const id = hash.slice(1);
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      const el = document.getElementById(id);
      if (el) {
        window.clearInterval(timer);
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      } else if (tries > 20) {
        window.clearInterval(timer);
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<Archive />} />
            {/* <Route path="/about" element={<About />} /> */}
            <Route path="/services" element={<Services />} />
            {/* Any old /contact link (footer, bookmarks, old buttons) goes to the Contact section */}
            <Route path="/contact" element={<Navigate to="/#contact" replace />} />
            {/* Unknown URLs go home instead of showing an empty page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;