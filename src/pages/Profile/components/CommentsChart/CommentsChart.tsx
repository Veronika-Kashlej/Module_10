import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import { BarChart } from './Bar';

const rows = ['500', '400', '300', '200', '100', '0'];
const dates = ['Jen', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

export function CommentsChart() {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ maxWidth: 575, margin: '0 auto' }}>
                <TableContainer sx={{ position: 'relative', width: '100%' }}>
                    <Box sx={{ p: '24px' }}>
                        <Typography
                            variant="h6"
                            sx={{ marginBottom: '16px', textAlign: 'left' }}
                        >
                            Title
                        </Typography>

                        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row} sx={{ height: '55px' }}>
                                        <TableCell
                                            colSpan={dates.length}
                                            sx={{
                                                padding: '8px 0 0 0',
                                                textAlign: 'left',
                                                borderBottom:
                                                    '1px solid var(--border-color)',
                                                height: '43px',
                                                position: 'relative',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    borderBottom:
                                                        '1px solid var(--border-color)',
                                                    opacity: 0.3,
                                                }}
                                            />
                                            {row}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                <TableRow sx={{ height: '15px' }}>
                                    {dates.map((date) => (
                                        <TableCell
                                            key={date}
                                            sx={{
                                                textAlign: 'right',
                                                padding: '6px 0',
                                                borderBottom: 'none',
                                                position: 'relative',
                                                width: '30px',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {date}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                    <BarChart />
                </TableContainer>
            </Box>
        </ThemeProvider>
    );
}
