import { alpha, createTheme, ThemeProvider } from '@mui/material';
import { blue, orange } from '@mui/material/colors';
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import App from 'client/components/App';

import './index.pcss';

const theme = createTheme({
  palette: {
    primary: orange,
    secondary: blue,
  },
});

const globalCssVars = {
  '--primaryMainColor': theme.palette.primary.main,
  '--primaryMainColorTransparent': alpha(theme.palette.primary.main, 0.3),
  '--primaryDarkColor': theme.palette.primary.dark,
  '--secondaryMainColor': theme.palette.secondary.main,
  '--errorColor': theme.palette.error.main,
  '--textColor': theme.palette.text.primary,
};

Object.entries(globalCssVars).forEach(([name, value]) => {
  document.body.style.setProperty(name, value);
});

ReactDom.render(
  <ThemeProvider theme={theme}>
    <RecoilRoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </ThemeProvider>,
  document.getElementById('root'),
);
