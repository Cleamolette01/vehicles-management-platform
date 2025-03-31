import { expect, test } from 'vitest';
import { render } from '@testing-library/react';
import VehicleManagement from '../VehicleManagement';

test('renders Vehicle Management title', () => {
  const { getByText } = render(<VehicleManagement />);

  const titleElement = getByText('Vehicle Management');

  expect(titleElement).toBeTruthy();
});
