import React from 'react';
import { CheckCircle2, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <span className="section-tag">About The Platform</span>
            <h2>Bridging Villages & Governance with Artificial Intelligence</h2>
            <p>
              VillageVision AI is designed to solve the critical gap in rural infrastructure maintenance and public grievance resolution. Traditional paper-based complaint filing often leads to delays, unassigned tasks, and lack of transparency.
            </p>
            <p>
              Our platform uses smart AI algorithms to streamline complaint logging, triage priority based on urgency, and keep citizens informed at every step of the development cycle.
            </p>

            <ul className="check-list">
              <li className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                Geo-tagged submission verifying issue authentications.
              </li>
              <li className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                AI automated priority scoring (Urgent vs Standard).
              </li>
              <li className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                Public progress timeline for complete transparency.
              </li>
            </ul>
          </div>

          <div className="about-card-box">
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: '#047857' }}>
              Project Vision & Impact
            </h3>
            <p style={{ color: '#334155', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.7' }}>
              "To transform rural communities into smart, connected, and self-sustaining ecosystems where every citizen's voice is heard and every public issue is addressed with speed and accountability."
            </p>

            <div className="form-two-col">
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
                <Zap size={22} style={{ color: '#059669', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>Instant Triage</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Automated department routing</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
                <ShieldCheck size={22} style={{ color: '#0284c7', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>Audit Trail</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Immutable resolution logs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
