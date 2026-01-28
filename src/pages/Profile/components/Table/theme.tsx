import { createTheme, ThemeOptions } from '@mui/material/styles';

const customThemeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        background: {
            default: 'var(--bg-primary-color)',
            paper: 'var(--bg-primary-color)',
        },
        text: {
            primary: 'var(--text-color)',
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: 16,
        body1: {
            fontWeight: 500,
        },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid var(--border-color)',
                    padding: 0,
                    fontWeight: 500,
                },
                head: {
                    color: '#8791B7',
                    fontWeight: 500,
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    height: '48px',
                },
                head: {
                    height: '24px',
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary-color)',
                    overflow: 'hidden',
                    padding: '0',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'var(--bg-primary-color)',
                },
            },
        },
        MuiTypography: {
            variants: [
                {
                    props: { variant: 'h6' },
                    style: {
                        color: 'var(--text-color)',
                        fontWeight: 600,
                        fontSize: '16px',
                    },
                },
            ],
        },
    },
};

const theme = createTheme(customThemeOptions);

export default theme;
