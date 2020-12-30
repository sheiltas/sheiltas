import React, { memo, useMemo } from 'react';
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider
} from '@material-ui/core/styles';

import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';

import { ChildrenProps } from '../../../types';
import { useClientProvider } from './ClientProvider';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const palette = {
  background: {
    default: '#fff8ed',
    paper: '#ffedcf'
  },
  info: {
    main: '#000000'
  }
};

const ThemeProvider = (props: ChildrenProps) => {
  const { children } = props;
  const { selectedLanguage } = useClientProvider();

  const direction = useMemo(() => (selectedLanguage === 'he' ? 'rtl' : 'ltr'), [
    selectedLanguage
  ]);

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette,
        overrides: {
          MuiButton: {
            root: {
              textTransform: 'capitalize',
              color: palette.background.default,
              backgroundColor: '#1f3c64',
              '&:hover': {
                backgroundColor: '#001739'
              }
            }
          }
        },
        direction
      }),
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
