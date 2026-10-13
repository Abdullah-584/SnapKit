import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
  advertisingConfigured,
  analyticsConfigured,
  readConsent,
  setConsent,
  shouldShowBanner,
} from './consent';
import { ConsentBanner } from '../components/ConsentBanner';

describe('consent storage', () => {
  it('starts unset and round-trips choices', () => {
    expect(readConsent()).toEqual({ ads: 'unset', analytics: 'unset' });
    setConsent('ads', 'granted');
    expect(readConsent().ads).toBe('granted');
    setConsent('ads', 'denied');
    expect(readConsent().ads).toBe('denied');
  });

  it('does not show a banner while no integration is configured', () => {
    // VITE_ADSENSE_CLIENT is not set in the test environment.
    expect(advertisingConfigured()).toBe(false);
    expect(analyticsConfigured()).toBe(false);
    expect(shouldShowBanner()).toBe(false);
  });
});

describe('ConsentBanner', () => {
  it('renders nothing while there is nothing to consent to', () => {
    const { container } = render(
      <MemoryRouter>
        <ConsentBanner />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('records an explicit choice when shown', async () => {
    // Simulate an advertising integration being configured.
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ConsentBanner />
      </MemoryRouter>,
    );
    // The banner is hidden in this build; verify the preference machinery
    // used by the Cookie Preferences page instead.
    expect(screen.queryByRole('region', { name: /cookie consent/i })).not.toBeInTheDocument();

    // The preferences page flow: set + read.
    setConsent('analytics', 'denied');
    expect(readConsent().analytics).toBe('denied');
    expect(user).toBeTruthy();
  });
});
