import { expect, test } from 'vitest';
import { render } from '@testing-library/react';
import AnalyticsVisualization from '../AnalyticsVisualization';

test('renders Analytics Visualization title', () => {
  const { getByText } = render(<AnalyticsVisualization />);

  const titleElement = getByText('Analytics Visualization');

  expect(titleElement).toBeTruthy();
});
