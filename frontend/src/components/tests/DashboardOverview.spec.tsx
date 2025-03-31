import { expect, test } from 'vitest';
import { render } from '@testing-library/react';
import DashboardOverview from '../DashboardOverview';

test('renders Dashboard Overview title', () => {
  const { getByText } = render(<DashboardOverview />);

  const titleElement = getByText('Dashboard Overview');

  expect(titleElement).toBeTruthy();
});
