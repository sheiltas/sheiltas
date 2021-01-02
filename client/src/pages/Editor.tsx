import React, { useCallback, memo, useMemo } from 'react';
import { Formik, Form, Field, useFormikContext } from 'formik';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AppBar } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MuiSelect from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import { articlesApi } from '../api';
import { useClientProvider } from '../providers/ClientProvider';
import { categoriesKeys, isType, subcategoriesHebrew } from '../types';
import {
  categoriesKeysArray,
  mapCategoriesKeysToHebrewSubcategories
} from '../utils';
import { Article } from '../../../server/src/models/articles';
import FormHelperText from '@material-ui/core/FormHelperText';

const createClasses = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.paper,
    minHeight: '70px',
    marginBottom: '30px'
  },
  paper: {
    backgroundColor: '#ccbb9e !important',
    padding: '30px'
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

interface SelectProps<T = string> {
  data: {
    label: string;
    name: T;
    options: SelectOption[];
  };
}

interface FormikValues {
  title: string;
  category: categoriesKeys | '';
  subcategory: subcategoriesHebrew | '';
  content: string;
}

type selectValues = 'category' | 'subcategory';

const Select = memo((props: SelectProps<selectValues>) => {
  const { data } = props;
  const { label, name, options } = data;
  const { handleChange, errors, touched } = useFormikContext<FormikValues>();
  const error = useMemo(() => touched[name] && errors[name], [
    errors,
    name,
    touched
  ]);
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel>
        <Typography>{label}</Typography>
      </InputLabel>
      <Field
        name={name}
        label={label}
        as={MuiSelect}
        onChange={handleChange}
        error={error}
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
      <FormHelperText error={!!error}>{error}</FormHelperText>
    </FormControl>
  );
});

const FormikForm = memo(() => {
  const {
    handleChange,
    values,
    errors,
    touched
  } = useFormikContext<FormikValues>();
  const { locale } = useClientProvider();

  const { category } = values;

  const mapKeyToOption = useMapKeyToOption();

  const categoriesData = useMemo(
    () => [
      {
        label: locale.category,
        name: 'category' as selectValues,
        options: categoriesKeysArray.map(mapKeyToOption())
      },
      {
        label: locale.subcategory,
        name: 'subcategory' as selectValues,
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
        <Box my={1}>
          <Field
            name="title"
            as={TextField}
            onChange={handleChange}
            label={locale.articleName}
            variant="outlined"
            fullWidth
            helperText={touched.title && errors.title}
            error={errors.title && touched.title}
          />
        </Box>
        {categoriesData.map((data) => (
          <Box my={1} key={data.label}>
            <Select data={data} />
          </Box>
        ))}
        <Box my={1}>
          <Field
            name="content"
            as={TextField}
            multiline
            onChange={handleChange}
            label={locale.content}
            variant="outlined"
            helperText={touched.content && errors.content}
            error={errors.content && touched.content}
          />
        </Box>
        <Button type="submit">
          <Typography>{locale.upload}</Typography>
        </Button>
      </Grid>
    </Form>
  );
});

const EditorPage = () => {
  const classes = createClasses();
  const { locale, selectedLanguage } = useClientProvider();

  const initialValues: FormikValues = useMemo(
    () => ({
      title: '',
      category: '',
      subcategory: '',
      content: ''
    }),
    []
  );

  const validate = useCallback(
    (values: FormikValues) =>
      Object.entries(values).reduce((acc, [key, value]) => {
        if (!value && key !== 'subcategory') {
          acc[key] = locale.requiredField;
        }
        return acc;
      }, {} as Record<string, string>),
    [locale.requiredField]
  );

  const onSubmit = useCallback(async (values: FormikValues) => {
    if (isType<Omit<Article, '_id'>>(values, ['content', 'category'])) {
      console.log('wut');
      const res = await articlesApi.post({ ...values, author: 'Me' });
      console.log('res', res);
    }
  }, []);

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
        <Formik
          validate={validate}
          initialValues={initialValues}
          onSubmit={onSubmit}
        >
          <FormikForm />
        </Formik>
      </Paper>
    </Grid>
  );
};

export default memo(EditorPage);
