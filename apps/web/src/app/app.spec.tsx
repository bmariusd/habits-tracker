import type { HabitFacade as HabitFacadeContract } from '@org/contracts';
import { DIProvider } from '@org/di';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Container } from 'inversify';
import { BrowserRouter } from 'react-router-dom';
import App from './app';

function renderApp() {
  const habitFacade = {
    listHabits: jest.fn().mockResolvedValue([]),
    getCalendarSummary: jest.fn().mockResolvedValue([]),
  } as unknown as HabitFacadeContract;
  const container = {
    get: jest.fn(() => habitFacade),
  } as unknown as Container;

  return render(
    <BrowserRouter>
      <DIProvider container={container}>
        <App />
      </DIProvider>
    </BrowserRouter>,
  );
}

describe('Habits app', () => {
  it('renders the dashboard and its working section links', async () => {
    renderApp();

    const title = await screen.findByRole('heading', { level: 1 });
    expect(title.textContent).toContain('Good things take practice');
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'My habits' }).getAttribute('href')).toBe('#habits');

    const activityLink = screen.getByRole('link', { name: 'Activity' });
    fireEvent.click(activityLink);
    expect(activityLink.getAttribute('aria-current')).toBe('location');
    expect(screen.queryByRole('button', { name: 'My profile' })).toBeNull();
  });
});
