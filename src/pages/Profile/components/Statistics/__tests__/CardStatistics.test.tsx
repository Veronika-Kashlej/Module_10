import { render, screen } from '@testing-library/react';
import { CardStatistics } from '../CardStatisticsList';

describe('CardStatistics', () => {
    test('renders title, count and progress', () => {
        render(<CardStatistics title="Posts" count={150} progress="+20%" />);

        expect(screen.getByText('Posts')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('+20%')).toBeInTheDocument();
    });
});
