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
  const [activeSteps, setActiveSteps] = useState(() => new Set());

  useEffect(() => {
    let frame = null;

    // Live, scroll-driven highlight: whichever step the user is currently
    // scrolled next to lights up its gold border. It re-measures on every
    // scroll, so the highlight follows the user's position (and re-matches
    // from the top when they scroll back up) instead of latching on once.
    const measure = () => {
      frame = null;
      const focal = window.innerHeight / 2;
      const reach = window.innerHeight / 2;
      const distances = stepRefs.current.map((el) => {
        if (!el) return Infinity;
        const rect = el.getBoundingClientRect();
        return Math.abs(rect.top + rect.height / 2 - focal);
      });
      const nearest = Math.min(...distances);
      const next = new Set();
      if (nearest <= reach) {
        // Mark the step(s) nearest the focal line. On a stacked mobile layout
        // that's one step that changes as you scroll; on a desktop row the
        // whole row shares the focal line and lights together.
        distances.forEach((d, i) => {
          if (d <= nearest + 14) next.add(i);
        });
      }
      setActiveSteps((prev) => {
        if (prev.size === next.size && [...next].every((i) => prev.has(i))) return prev;
        return next;
      });
    };

    const onScroll = () => {
      if (frame == null) frame = requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    measure();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame != null) cancelAnimationFrame(frame);
    };
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
              className={`step-card${activeSteps.has(index) ? ' step-active' : ''}`}
              key={step.number}
              ref={(el) => { stepRefs.current[index] = el; }}
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
