import React, { memo, ReactNode } from 'react';
import { Grid } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

interface Props {
  children: ReactNode;
}

const createClasses = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.default,
    height: '100vh'
  }
}));

const PageTemplate = (props: Props) => {
  const { children } = props;
  const classes = createClasses();
  return (
    <Grid container direction="column" className={classes.container}>
      {children}
    </Grid>
  );
};

export default memo(PageTemplate);
