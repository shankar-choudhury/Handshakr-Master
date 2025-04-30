import { render, screen } from '@testing-library/react';
import RootLayout from '../app/layout';

describe('RootLayout', () => {
  it('renders children inside body and sets language', () => {
    const testText = 'Test content';

    render(
      <RootLayout>
        <div>{testText}</div>
      </RootLayout>
    );

    // Check that the content is rendered
    expect(screen.getByText(testText)).toBeInTheDocument();

    // Check that the html tag has lang="en"
    const html = document.documentElement;
    expect(html.lang).toBe('en');

    // Check that the body has the correct class
    const body = document.body;
    expect(body.className).toBe('appearance-none');
  });
});
