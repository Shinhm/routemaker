import React, { useEffect } from 'react';
import './styles/App.css';
import RouterProvider from './pages/router';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import UserAgentService from './services/UserAgentService';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './store';
import { CssBaseline, useMediaQuery } from '@material-ui/core';

const store = createStore(rootReducer);

function App() {
  useEffect(() => {
    UserAgentService.setUserAgent(navigator.userAgent);
    const script = document.createElement('script');

    script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
    script.async = true;
    script.onload = () => {
      window.Kakao.init('a848dd4558f2f5285f1fa2cadd40bca6');
    };

    document.head.appendChild(script);
  }, []);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
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
        },
        breakpoints: {
          values: {
            xl: 700,
            lg: 700,
            md: 500,
            xs: 400,
            sm: 400,
          },
        },
      }),
    [prefersDarkMode]
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <RouterProvider />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
