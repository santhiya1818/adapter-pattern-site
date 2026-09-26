import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { FlowScrubber } from './components/FlowScrubber';
import { HeroAndIntent } from './components/HeroAndIntent';
import { ApplicabilitySection } from './components/ApplicabilitySection';
import { StructureVisualizer } from './components/StructureVisualizer';
import { ParticipantsAndCollaborations } from './components/ParticipantsAndCollaborations';
import { SampleCodeAndKnownUses } from './components/SampleCodeAndKnownUses';
import { CommandPatternDeepDive } from './components/CommandPatternDeepDive';
import { Footer } from './components/Footer';
import { FLOW_SECTIONS } from './data/adapterData';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('intent');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll listener to update active section in the scrubber
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of FLOW_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* 3-Zone Top Navigation */}
      <Navigation
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Sticky Flow Scrubber */}
      <FlowScrubber
        activeSection={activeSection}
        onSelectSection={scrollToSection}
      />

      {/* Main Content Area following GoF Section Flow */}
      <main className="flex-1">
        {/* Sections 01, 02, 03: Intent, Also Known As, Motivation */}
        <HeroAndIntent
          onExploreStructure={() => scrollToSection('structure')}
          onExploreCode={() => scrollToSection('sample-code')}
        />

        {/* Section 04: Applicability */}
        <ApplicabilitySection />

        {/* Section 05: Structure */}
        <StructureVisualizer />

        {/* Sections 06, 07, 08: Participants, Collaborations, Implementation */}
        <ParticipantsAndCollaborations />

        {/* Sections 09, 10: Sample Code & Known Uses */}
        <SampleCodeAndKnownUses />

        {/* Section 11: Related Patterns (with special focus on Command Pattern) */}
        <CommandPatternDeepDive />
      </main>

      {/* Architectural Reference Footer */}
      <Footer
        onScrollToTop={scrollToTop}
        onNavigate={scrollToSection}
      />
    </div>
  );
}
