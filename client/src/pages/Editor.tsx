import React, { useCallback } from 'react';
import { Formik, Form, Field } from 'formik';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useClientProvider } from '../providers/ClientProvider';

const EditorPage = () => {
  const { locale } = useClientProvider();
  const onSubmit = useCallback(() => {}, []);

  return (
    <Grid container justify="center" alignItems="center">
      <Typography>{locale.editorPageTitle}</Typography>
      <Paper>
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

export default EditorPage;
