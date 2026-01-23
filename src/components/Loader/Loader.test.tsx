import { render, screen } from '@testing-library/react';
import { Loader } from './Loader';

test('renders loader with correct message', () => {
    render(<Loader message="Please, wait..." />);
    expect(screen.getByText('Please, wait...')).toBeInTheDocument();
});

test('renders loader with default message', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
});
