import { render } from '@testing-library/react';
import { SectionItemSkeleton } from './SectionItemSkeleton';

test('renders skeleton of section item', () => {
    const { container } = render(<SectionItemSkeleton />);
    expect(container.firstChild).toBeTruthy();
});
