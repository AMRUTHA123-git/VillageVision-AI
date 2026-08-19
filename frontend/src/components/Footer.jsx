import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="brand-logo">
              <div className="logo-icon">
                <Sparkles size={20} />
              </div>
              <span>VillageVision <span className="gradient-text">AI</span></span>
            </a>
            <p>
              AI-powered community problem reporting and development platform for smart rural transformation.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Platform</a></li>
              <li><a href="#features">Key Features</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">College Project</h4>
            <ul className="footer-links">
              <li><a href="#home">Prototype v1.0</a></li>
              <li><a href="#home">React + Vite + Flask</a></li>
              <li><a href="#home">SQLite Database</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} VillageVision AI. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Built for Academic Project Demonstration
          </div>
        </div>
      </div>
    </footer>
  );
}
