import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

test('renders footer with correct text', () => {
    render(<Footer />);
    expect(screen.getByText('© 2026 sidekick')).toBeInTheDocument();
});
