import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SectionItem } from './SectionItem';

describe('SectionItem', () => {
    const defaultProps = {
        title: 'Test Title',
        subtitle: 'Test Subtitle',
        image: 'test.jpg',
    };

    test('renders title, subtitle and image', () => {
        render(<SectionItem {...defaultProps} />);

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Subtitle')).toBeInTheDocument();

        const image = screen.getByAltText('profile');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'test.jpg');
    });

    test('calls onImageChange when subtitle is clicked', () => {
        const onImageChange = jest.fn();

        render(<SectionItem {...defaultProps} onImageChange={onImageChange} />);

        const subtitle = screen.getByText('Test Subtitle');
        fireEvent.click(subtitle);

        expect(onImageChange).toHaveBeenCalledTimes(1);
    });

    test('subtitle has pointer cursor when onImageChange is provided', () => {
        const onImageChange = jest.fn();

        render(<SectionItem {...defaultProps} onImageChange={onImageChange} />);

        const subtitle = screen.getByText('Test Subtitle');
        expect(subtitle).toHaveStyle('cursor: pointer');
    });

    test('subtitle has default cursor when onImageChange is not provided', () => {
        render(<SectionItem {...defaultProps} />);

        const subtitle = screen.getByText('Test Subtitle');
        expect(subtitle).toHaveStyle('cursor: default');
    });
});
