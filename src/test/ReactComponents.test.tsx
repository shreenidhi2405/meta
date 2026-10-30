import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoryProvider } from '../engine/StoryContext';
import { LandingHero } from '../components/landing/LandingHero';
import { PerspectiveSwitcher } from '../components/player/PerspectiveSwitcher';
import { ClueHotspotOverlay } from '../components/player/ClueHotspotOverlay';
import { DecisionRoom } from '../components/decision/DecisionRoom';
import { canonicalStory } from '../data/caseArchives';

describe('React Cinematic UI Components', () => {
  it('renders LandingHero with tagline and launch buttons', () => {
    render(
      <StoryProvider>
        <LandingHero />
      </StoryProvider>
    );

    const titleElements = screen.getAllByText(/DIRECTOR'S CUT/i);
    expect(titleElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/Every perspective tells a different truth/i)).toBeInTheDocument();
    expect(screen.getByTestId('landing-launch-btn')).toBeInTheDocument();
  });

  it('renders PerspectiveSwitcher and fires callback on perspective selection', () => {
    const onSelect = vi.fn();
    render(
      <PerspectiveSwitcher
        perspectives={canonicalStory.perspectives}
        activePerspective="witness"
        onSelectPerspective={onSelect}
      />
    );

    // Should display all 3 character names
    expect(screen.getByText(/Marcus Ward/i)).toBeInTheDocument();
    expect(screen.getByText(/Julian Mercer/i)).toBeInTheDocument();
    expect(screen.getByText(/Elena Vance/i)).toBeInTheDocument();

    // Click suspect perspective button
    const suspectBtn = screen.getByTestId('perspective-btn-suspect');
    fireEvent.click(suspectBtn);
    expect(onSelect).toHaveBeenCalledWith('suspect');
  });

  it('renders ClueHotspotOverlay when clues are visible and fires onClueClick', () => {
    const onClueClick = vi.fn();
    const testClue = canonicalStory.clues[0];

    render(
      <ClueHotspotOverlay
        visibleClues={[testClue]}
        discoveredClueIds={[]}
        onClueClick={onClueClick}
      />
    );

    const hotspot = screen.getByTestId(`clue-hotspot-${testClue.id}`);
    expect(hotspot).toBeInTheDocument();

    fireEvent.click(hotspot);
    expect(onClueClick).toHaveBeenCalledWith(testClue.id);
  });

  it('renders DecisionRoom and displays all 3 verdict choices', () => {
    render(
      <StoryProvider>
        <DecisionRoom />
      </StoryProvider>
    );

    expect(screen.getByTestId('verdict-option-accident')).toBeInTheDocument();
    expect(screen.getByTestId('verdict-option-murder')).toBeInTheDocument();
    expect(screen.getByTestId('verdict-option-manipulation')).toBeInTheDocument();
    expect(screen.getByTestId('lock-in-verdict-btn')).toBeInTheDocument();
  });
});
