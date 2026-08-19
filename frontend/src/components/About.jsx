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
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-teal)' }}>
              Project Vision & Impact
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.7' }}>
              "To transform rural communities into smart, connected, and self-sustaining ecosystems where every citizen's voice is heard and every public issue is addressed with speed and accountability."
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <Zap size={22} style={{ color: 'var(--primary-emerald)', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Instant Triage</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automated department routing</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <ShieldCheck size={22} style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Audit Trail</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Immutable resolution logs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
