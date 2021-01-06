import React, { memo, useMemo } from 'react';
import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider as MuiThemeProvider
} from '@material-ui/core/styles';

import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';

import { ChildrenProps } from '../types';
import { useClientProvider } from './ClientProvider';
import responsiveFontSizes from '@material-ui/core/styles/responsiveFontSizes';
import createPalette from '@material-ui/core/styles/createPalette';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

// declare module '@material-ui/core/styles/createPalette' {
//   interface Palette {
//     neutral: Palette['primary'];
//   }
//   interface PaletteOptions {
//     neutral: PaletteOptions['primary'];
//   }
// }

const palette = createPalette({
  background: {
    default: '#fff8ed',
    paper: '#ffedcf'
  },
  // info: {
  //   main: '#000000'
  // },
  primary: {
    //   main: '#ffedcf',
    //   light: '#fff9ef',
    //   dark: '#ccbb9e'
    // },
    main: 'rgba(0, 0, 0, 0.54)',
    light: '#fff9ef',
    dark: '#ccbb9e'
  },
  secondary: {
    main: '#1f3c64',
    light: '#4e6692',
    dark: '#001739'
  }
  // text: {
  //   primary: '#000000',
  //   secondary: '#ffffff'
  // }

  // info: {
  //   main: 'rgba(0, 0, 0, 0.54)'
  // }
});

const ThemeProvider = (props: ChildrenProps) => {
  const { children } = props;
  const { selectedLanguage } = useClientProvider();

  const direction = useMemo(() => (selectedLanguage === 'he' ? 'rtl' : 'ltr'), [
    selectedLanguage
  ]);

  const theme: any = useMemo(
    () =>
      responsiveFontSizes(
        createMuiTheme({
          palette,
          overrides: {
            MuiInputBase: {
              root: { backgroundColor: palette.background.default }
            },
            // @ts-ignore
            MuiOutlinedInput: {
              root: {
                '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  // border: `1px solid ${palette.info.main}`
                }
              }
            },
            MuiButton: {
              root: {
                textTransform: 'capitalize',
                color: palette.background.default,
                // backgroundColor: palette.secondary.main,
                '&:hover': {
                  // backgroundColor: palette.secondary.dark
                }
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
