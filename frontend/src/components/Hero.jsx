import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero({ onNavigateToLogin }) {
  const handleGetStarted = (e) => {
    e.preventDefault();
    if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="badge">
          <Sparkles size={14} /> Next-Generation Rural Empowerment
        </div>

        <h1 className="hero-title">
          AI-powered community problem reporting and <span className="gradient-text">development platform</span>
        </h1>

        <p className="hero-subtitle">
          Empowering villagers with intelligent issue submission, automated categorization, and real-time project tracking to foster transparent local governance and rapid rural development.
        </p>

        <div className="hero-cta">
          <button className="btn btn-primary" onClick={handleGetStarted}>
            Get Started <ArrowRight size={18} />
          </button>
          <a href="#features" className="btn btn-secondary">
            Explore Features
          </a>
        </div>

        {/* Hero Preview Interactive Showcase */}
        <div className="hero-preview">
          <div className="preview-grid">
            <div className="stat-box">
              <div className="stat-val">98.4%</div>
              <div className="stat-lbl">AI Classification Accuracy</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">3.5x</div>
              <div className="stat-lbl">Faster Issue Resolution</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">100%</div>
              <div className="stat-lbl">Transparent Status Tracking</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">24/7</div>
              <div className="stat-lbl">Community Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
