import React, { useEffect } from 'react';
import './styles/App.css';
import RouterProvider from './pages/router';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import UserAgentService from './services/UserAgentService';

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
  breakpoints: {
    values: {
      xl: 700,
      lg: 700,
      md: 700,
      xs: 400,
      sm: 400,
    },
  },
});

function App() {
  useEffect(() => {
    UserAgentService.setUserAgent(navigator.userAgent);
    const script = document.createElement('script');

    script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
    script.async = true;
    script.onload = () => {
      (window as any).Kakao.init('a848dd4558f2f5285f1fa2cadd40bca6');
    };

    document.head.appendChild(script);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider />
    </ThemeProvider>
  );
}

export default withRouter(App);
