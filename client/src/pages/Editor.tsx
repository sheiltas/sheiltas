import React, { useCallback } from 'react';
import { Formik, Form, Field } from 'formik';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const EditorPage = () => {
  const onSubmit = useCallback(() => {}, []);

  return (
    <Container>
      {/*<Grid container justify="center" alignItems="center">*/}
      <Paper>
        {/*<Grid item container justify="center" alignItems="center">*/}
        <Formik initialValues={{}} onSubmit={onSubmit}>
          {(formikProps) => {
            const { handleChange } = formikProps;
            return (
              <Form>
                <Container>
                  <Field as={TextField} onChange={handleChange} />
                </Container>
              </Form>
            );
          }}
        </Formik>
        {/*</Grid>*/}
      </Paper>
      {/*</Grid>*/}
    </Container>
  );
};

export default EditorPage;
