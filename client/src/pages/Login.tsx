import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import { Formik, Form, Field } from 'formik';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { useClientContext } from '../providers/ClientProvider';
import Header from '../components/Header';

const createClasses = makeStyles((theme) => ({
  container: {
    height: '100%'
  },
  formContainer: {
    minWidth: '300px',
    minHeight: '200px'
  },
  form: {
    padding: '30px',
    gridGap: theme.spacing(2)
  },
  button: {
    borderRadius: '30px',
    width: '100%',
    top: '12px'
  }
}));

const LoginPage = () => {
  const classes = createClasses();
  const history = useHistory();
  const [error, toggleError] = useState(false);
  const { locale, login } = useClientContext();

  const onSubmit = useCallback(
    async (values) => {
      const loginRes = await login(values);
      if (loginRes) {
        history.push('/editor');
      } else {
        toggleError(true);
      }
    },
    [history, login]
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
      <Header />
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
                <Grid
                  component={Form}
                  container
                  direction="column"
                  className={classes.form}
                >
                  <Field
                    onChange={handleChange}
                    name="username"
                    as={TextField}
                    label={locale.username}
                    variant="outlined"
                  />
                  <Field
                    onChange={handleChange}
                    name="password"
                    as={TextField}
                    label={locale.password}
                    type="password"
                    variant="outlined"
                  />
                  <Grid container justify="center">
                    <Grid component={Box} position="absolute" item xs={7}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        {locale.login}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              );
            }}
          </Formik>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default LoginPage;
