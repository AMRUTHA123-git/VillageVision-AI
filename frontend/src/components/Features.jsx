import React from 'react';
import { Camera, Cpu, BarChart3, Users2 } from 'lucide-react';

export default function Features() {
  const featureItems = [
    {
      icon: <Camera size={26} />,
      title: "Report Community Issues",
      description: "Quickly capture and upload photo reports of broken roads, water shortages, sanitation needs, or power outages with automatic location tagging."
    },
    {
      icon: <Cpu size={26} />,
      title: "AI-Powered Categorization",
      description: "Advanced Machine Learning model analyzes report details, assigns severity priority ratings, and routes tasks automatically to the correct local authorities."
    },
    {
      icon: <BarChart3 size={26} />,
      title: "Community Insights",
      description: "Interactive analytics dashboard displaying real-time problem heatmaps, village budget utilization, and resolution velocity for maximum accountability."
    },
    {
      icon: <Users2 size={26} />,
      title: "Stakeholder Collaboration",
      description: "Seamless bridge connecting villagers, Gram Panchayat leaders, contractors, and district officials to ensure rapid approval and execution."
    }
  ];

  return (
    <section id="features" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Core Features</span>
          <h2 className="section-title">Built for Modern Smart Villages</h2>
          <p className="section-desc">
            Discover how VillageVision AI bridges grassroots reporting with intelligent automated administrative action.
          </p>
        </div>

        <div className="features-grid">
          {featureItems.map((item, index) => (
            <div key={index} className="feature-card">
              <div className="icon-wrapper">
                {item.icon}
              </div>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-text">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
