import React, { memo, useMemo } from 'react';
import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider as MuiThemeProvider,
  StylesProvider,
  jssPreset
} from '@material-ui/core/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';

import responsiveFontSizes from '@material-ui/core/styles/responsiveFontSizes';
import createPalette from '@material-ui/core/styles/createPalette';

import { ChildrenProps } from '../types';
import { useClientContext } from './ClientProvider';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const palette = createPalette({
  background: {
    default: '#fff8ed',
    paper: '#ffedcf'
  },
  primary: {
    main: '#b49a6f',
    light: '#cebda1',
    dark: '#a28453'
  },
  secondary: {
    main: '#1f3c64',
    light: '#4e6692',
    dark: '#001739'
  },
  text: {
    primary: '#061324'
  }
});

const ThemeProvider = (props: ChildrenProps) => {
  const { children } = props;
  const { selectedLanguage } = useClientContext();

  const direction = useMemo(() => (selectedLanguage === 'he' ? 'rtl' : 'ltr'), [
    selectedLanguage
  ]);

  const theme = useMemo(
    () =>
      responsiveFontSizes(
        createMuiTheme({
          palette,
          overrides: {
            MuiInputBase: {
              root: {
                backgroundColor: palette.background.default
              }
            },
            MuiButton: {
              root: {
                textTransform: 'capitalize',
                color: palette.background.default
              }
            }
          },
          direction
        })
      ),
    [direction]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <StylesProvider jss={jss}>
        <div dir={direction}>{children}</div>
      </StylesProvider>
    </MuiThemeProvider>
  );
};

export default memo(ThemeProvider);
