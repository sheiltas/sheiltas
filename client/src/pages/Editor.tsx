import React, { useCallback, memo } from 'react';
import { Formik, Form, Field } from 'formik';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useClientProvider } from '../providers/ClientProvider';
import { AppBar } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

const createClasses = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.paper
  },
  paper: {
    backgroundColor: '#ccbb9e !important'
  }
}));

const EditorPage = () => {
  const classes = createClasses();
  const { locale } = useClientProvider();
  const onSubmit = useCallback(() => {}, []);

  return (
    <Grid container justify="center" alignItems="center">
      <AppBar position="relative" className={classes.appBar}>
        <Typography align="center" color="textSecondary">
          Sheilta`S!
        </Typography>
      </AppBar>
      <Paper className={classes.paper}>
        <Typography>:{locale.editorPageTitle}</Typography>
        {/*<Grid item container justify="center" alignItems="center">*/}
        <Formik initialValues={{}} onSubmit={onSubmit}>
          {(formikProps) => {
            const { handleChange } = formikProps;
            return (
              <Form>
                <Field name="" as={TextField} onChange={handleChange} />
              </Form>
            );
          }}
        </Formik>
        {/*</Grid>*/}
      </Paper>
    </Grid>
  );
};

export default memo(EditorPage);
