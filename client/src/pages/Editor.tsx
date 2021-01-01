import React, { useCallback, memo, useMemo } from 'react';
import { Formik, Form, Field, useFormikContext } from 'formik';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useClientProvider } from '../providers/ClientProvider';
import { AppBar } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MuiSelect from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { categoriesKeys, subcategoriesHebrew } from '../types';
import {
  categoriesKeysArray,
  mapCategoriesKeysToHebrewSubcategories
} from '../utils';

const createClasses = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.paper,
    minHeight: '70px',
    marginBottom: '30px'
  },
  paper: {
    backgroundColor: '#ccbb9e !important'
  }
}));

const useMapKeyToOption = () => {
  const { locale } = useClientProvider();

  return (withLocale = true) => (key: string) => ({
    value: key,
    name: withLocale ? locale[key] : key
  });
};

interface SelectOption {
  name: string;
  value: string;
}

interface SelectProps {
  data: {
    label: string;
    name: string;
    options: SelectOption[];
  };
}

const Select = memo((props: SelectProps) => {
  const { data } = props;
  const { label, name, options } = data;
  const { handleChange } = useFormikContext();
  return (
    <FormControl>
      <InputLabel>
        <Typography>{label}</Typography>
      </InputLabel>
      <Field
        name={name}
        as={MuiSelect}
        onChange={handleChange}
        MenuProps={{
          disablePortal: true
        }}
      >
        {options.map((option) => {
          const { value, name } = option;
          return (
            <MenuItem key={value} value={value}>
              <Typography>{name}</Typography>
            </MenuItem>
          );
        })}
      </Field>
    </FormControl>
  );
});

interface FormikValues {
  title: string;
  category: categoriesKeys | '';
  subcategory: subcategoriesHebrew | '';
  content: string;
}

const FormikForm = memo(() => {
  const { handleChange, values } = useFormikContext<FormikValues>();
  const { locale } = useClientProvider();

  const { category } = values;

  const mapKeyToOption = useMapKeyToOption();

  const categoriesData = useMemo(
    () => [
      {
        label: locale.category,
        name: 'category',
        options: categoriesKeysArray.map(mapKeyToOption())
      },
      {
        label: locale.subcategory,
        name: 'subcategory',
        options:
          mapCategoriesKeysToHebrewSubcategories[
            category as categoriesKeys
          ]?.map(mapKeyToOption(false)) || []
      }
    ],
    [category, locale.category, locale.subcategory, mapKeyToOption]
  );

  return (
    <Form>
      <Grid container direction="column">
        <Field
          name="title"
          as={TextField}
          onChange={handleChange}
          label={locale.articleName}
        />
        {categoriesData.map((data) => (
          <Select key={data.label} data={data} />
        ))}
      </Grid>
    </Form>
  );
});

const EditorPage = () => {
  const classes = createClasses();
  const { locale, selectedLanguage } = useClientProvider();
  const onSubmit = useCallback(() => {}, []);

  const initialValues: FormikValues = useMemo(
    () => ({
      title: '',
      category: '',
      subcategory: '',
      content: ''
    }),
    []
  );

  return (
    <Grid container justify="center" alignItems="center">
      <AppBar position="relative" className={classes.appBar}>
        <Typography variant="h1" align="center" color="textSecondary">
          {selectedLanguage === 'he' && '!'}Sheilta`S
          {selectedLanguage !== 'he' && '!'}
        </Typography>
      </AppBar>
      <Paper className={classes.paper}>
        <Typography>{locale.editorPageTitle}:</Typography>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <FormikForm />
        </Formik>
      </Paper>
    </Grid>
  );
};

export default memo(EditorPage);
