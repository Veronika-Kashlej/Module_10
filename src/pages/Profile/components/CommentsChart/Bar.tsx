import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';

const uData = [90, 45, 80, 50, 60, 55, 76, 23, 65];
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
    'Page H',
    'Page I',
];

export function BarChart() {
    return (
        <ChartContainer
            series={[{ data: uData, label: 'uv', type: 'bar' }]}
            xAxis={[{ scaleType: 'band', data: xLabels }]}
            sx={{
                position: 'absolute',
                bottom: 10,
                left: 0,
                right: 0,
                height: '300px',
                '& .MuiBarElement-root': {
                    fill: 'var(--diagram-color)',
                },
            }}
        >
            <BarPlot />
        </ChartContainer>
    );
}
