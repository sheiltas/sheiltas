import React, { memo } from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { useClientContext } from '../providers/ClientProvider';

const createClasses = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.paper,
    height: '100px',
    justifyContent: 'center',
    top: '0'
  }
}));

const Header = () => {
  const classes = createClasses();
  const { selectedLanguage } = useClientContext();

  return (
    <>
      <Box height="130px" />

      <AppBar position="fixed" className={classes.appBar}>
        <Typography variant="h1" align="center" color="secondary">
          {selectedLanguage === 'he' && '!'}
          Sheilta`S
          {selectedLanguage !== 'he' && '!'}
        </Typography>
      </AppBar>
    </>
  );
};

export default memo(Header);
