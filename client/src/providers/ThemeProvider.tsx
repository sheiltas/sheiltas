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

const ThemeProvider = (props: ChildrenProps) => {
  const { children } = props;
  const { selectedLanguage } = useClientProvider();

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          background: {
            default: '#fff8ed',
            paper: '#ffedcf'
          },
          info: {
            main: '#000000'
          }
        },
        overrides: {
          MuiButton: {
            root: {
              textTransform: 'capitalize'
            }
          }
        },
        direction: selectedLanguage === 'he' ? 'rtl' : 'ltr'
      }),
    [selectedLanguage]
  );

  return (
    <StylesProvider jss={jss}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
    </StylesProvider>
  );
};

export default memo(ThemeProvider);
