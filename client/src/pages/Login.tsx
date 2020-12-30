import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import { Formik, Form, Field } from 'formik';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { login } from '../api';
import { useClientProvider } from '../providers/ClientProvider';

const createClasses = makeStyles((theme) => ({
  container: {
    height: '100%'
  },
  formContainer: {
    minWidth: '300px',
    minHeight: '200px'
  },
  button: {
    borderRadius: '30px',
    width: '100%',
    top: '50px'
  }
}));

const LoginPage = () => {
  const classes = createClasses();
  const history = useHistory();
  const [error, toggleError] = useState(false);
  const { locale } = useClientProvider();

  const onSubmit = useCallback(
    async (values) => {
      const loginRes = await login(values);
      if (loginRes) {
        history.push('/editor');
      } else {
        toggleError(true);
      }
    },
    [history]
  );

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.container}
      item
      xs
    >
      <Paper elevation={3} className={classes.formContainer}>
        <Grid
          container
          item
          justify="center"
          alignItems="center"
          className={classes.formContainer}
          direction="column"
        >
          {error && <Typography>שם משתמש או סיסמא שגויים</Typography>}
          <Formik
            initialValues={{
              username: '',
              password: ''
            }}
            onSubmit={onSubmit}
          >
            {(formikProps) => {
              const { handleChange } = formikProps;
              return (
                <Form>
                  <Grid container direction="column">
                    <Field
                      onChange={handleChange}
                      name="username"
                      as={TextField}
                      label={locale.username}
                    />
                    <Field
                      onChange={handleChange}
                      name="password"
                      as={TextField}
                      label={locale.password}
                      type="password"
                    />
                    <Grid container justify="center">
                      <Grid item xs={7}>
                        <Button type="submit" className={classes.button}>
                          {locale.login}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default LoginPage;
