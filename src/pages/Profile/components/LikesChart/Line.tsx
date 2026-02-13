import { ChartContainer } from '@mui/x-charts/ChartContainer';
import {
    LinePlot,
    MarkPlot,
    lineElementClasses,
    markElementClasses,
} from '@mui/x-charts/LineChart';
import { Box } from '@mui/material';

const pData = [2600, 2500, 2450, 2908, 2700, 2800, 2700];
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
];

export function LineChart() {
    const lineSeries = [
        {
            type: 'line' as const,
            data: pData,
            showMark: ({ index }: { index: number }) =>
                index === pData.length - 1,
        },
    ];

    return (
        <Box
            sx={{
                p: 2,
                boxShadow: 3,
                position: 'absolute',
                zIndex: 10,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }}
        >
            <ChartContainer
                series={lineSeries}
                xAxis={[
                    { scaleType: 'point', data: xLabels, position: 'none' },
                ]}
                yAxis={[{ position: 'none' }]}
                sx={{
                    [`& .${lineElementClasses.root}`]: {
                        stroke: 'var(--diagram-color)',
                        strokeWidth: 4,
                    },
                    [`& .${markElementClasses.root}`]: {
                        r: 6,
                        fill: 'var(--text-color)',
                        strokeWidth: 26,
                        stroke: 'var(--diagram-color)',
                        strokeOpacity: '50%',
                        paintOrder: 'stroke',
                    },
                }}
                disableAxisListener
            >
                <LinePlot />
                <MarkPlot />
            </ChartContainer>
        </Box>
    );
}
