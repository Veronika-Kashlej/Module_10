import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import theme from './theme';
import { ThemeProvider } from '@mui/material';

interface RowData {
    name: string;
    col2: number;
    col3: number;
}

function createData(name: string, col2: number, col3: number): RowData {
    return { name, col2, col3 };
}

const rows: RowData[] = [
    createData('Row1', 123, 456),
    createData('Row2', 123, 456),
    createData('Row3', 123, 456),
    createData('Row4', 123, 456),
    createData('Row5', 123, 456),
    createData('Row6', 123, 456),
    createData('Row7', 123, 456),
];

export function BasicTable() {
    const innerBoxPadding = '24px';
    const colGap = '36px';
    const colDataWidth = '40px';

    const col1Sx = {
        textAlign: 'left',
        paddingLeft: 0,
        paddingRight: '24px',
        width: 'auto',
    };

    const col2Sx = {
        width: colDataWidth,
        textAlign: 'right',
        paddingLeft: '0',
        paddingRight: colGap,
    };

    const col3Sx = {
        width: colDataWidth,
        textAlign: 'right',
        paddingLeft: '0',
        paddingRight: '0',
    };

    return (
        <ThemeProvider theme={theme}>
            <TableContainer sx={{ maxWidth: 575, margin: '0 auto' }}>
                <Box sx={{ p: innerBoxPadding }}>
                    <Typography
                        variant="h6"
                        sx={{ marginBottom: '16px', textAlign: 'left' }}
                    >
                        Title
                    </Typography>

                    <Table aria-label="styled table" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={col1Sx}>Col1</TableCell>
                                <TableCell align="right" sx={col2Sx}>
                                    Col2
                                </TableCell>
                                <TableCell align="right" sx={col3Sx}>
                                    Col3
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            borderBottom: 0,
                                        },
                                    }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        sx={col1Sx}
                                    >
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right" sx={col2Sx}>
                                        {row.col2}
                                    </TableCell>
                                    <TableCell align="right" sx={col3Sx}>
                                        {row.col3}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </TableContainer>
        </ThemeProvider>
    );
}
