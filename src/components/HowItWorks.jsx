import { useEffect, useRef, useState } from 'react';
import '../styles/HowItWorks.css';
import useReveal from '../hooks/useReveal';

const steps = [
  {
    number: '1',
    title: 'Choose a Design',
    description: 'Browse our curated collection of cinematic invitation themes and pick the one that matches your vision.',
  },
  {
    number: '2',
    title: 'Personalize',
    description: 'Send us your details — names, date, venue, and photos. We craft your custom invitation.',
  },
  {
    number: '3',
    title: 'Review & Approve',
    description: 'Preview your invitation on any device. Request free edits until it\'s perfect. No extra charges, ever.',
  },
  {
    number: '4',
    title: 'Share & Track',
    description: 'Get your unique link. Share via WhatsApp, social media, or email. Track RSVPs in real-time from your dashboard.',
  },
];

export default function HowItWorks() {
  const headerRef = useReveal();
  const stepRefs = useRef([]);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let highest = -1;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            if (index > highest) highest = index;
          }
        });
        // Mark every step up to the furthest one reached, so the gold
        // fill advances in sequence as the user scrolls and never regresses.
        if (highest >= 0) {
          setActiveCount((prev) => Math.max(prev, highest + 1));
        }
      },
      { threshold: 0.6, rootMargin: '0px 0px -15% 0px' }
    );

    const nodes = stepRefs.current.filter(Boolean);
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section how-section" id="how-it-works">
      <div className="container">
        <div className="section-header reveal" ref={headerRef}>
          <span className="section-label">How It Works</span>
          <h2 className="section-title">From choosing to sharing in minutes</h2>
          <p className="section-subtitle">
            We handle everything. You just pick your style and share the link with your guests.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div
              className={`step-card${index < activeCount ? ' step-active' : ''}`}
              key={step.number}
              ref={(el) => { stepRefs.current[index] = el; }}
              data-index={index}
              style={{ '--step-index': index }}
            >
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
