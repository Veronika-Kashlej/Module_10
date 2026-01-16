import { render, screen } from '@testing-library/react';
import { PostDescription } from './PostDescription';

it('renders the content passed as prop', () => {
    render(<PostDescription content="Post description" />);
    expect(screen.getByText('Post description')).toBeInTheDocument();
});
