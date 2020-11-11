import React from 'react';
import './styles/App.css';
import RouterProvider from './pages/router';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#1D04BF',
    },
  },
  props: {
    MuiToolbar: {
      'aria-setsize': 2,
    },
    MuiIcon: {
      fontSize: 'small',
    },
  },
  typography: {
    fontFamily: 'Spoqa Han Sans',
    fontSize: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider />
    </ThemeProvider>
  );
}

export default withRouter(App);
