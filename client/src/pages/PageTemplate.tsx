import React, { memo, ReactNode } from 'react';
import { Grid } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Header from '../components/Header';

interface Props {
  children: ReactNode;
}

const createClasses = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.default
  }
}));

const PageTemplate = (props: Props) => {
  const { children } = props;
  const classes = createClasses();
  return (
    <Grid container direction="column" className={classes.container}>
      <Header />

      {children}
    </Grid>
  );
};

export default memo(PageTemplate);
