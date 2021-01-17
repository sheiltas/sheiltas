import React, { useMemo, memo, useCallback } from 'react';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { useQuery } from 'react-query';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { articlesApi, categoriesApi } from '../api';
import { useClientContext } from '../providers/ClientProvider';
import { Article, isType } from '../types';
import Select from './Select';

type SelectValues = 'category' | 'subcategory';

interface FormikValues {
  title: string;
  category: string;
  subcategory: string;
  content: string;
}

const useMapKeyToOption = () => {
  const { locale } = useClientContext();

  return (option: { _id: string; name: { key: string } }) => ({
    value: option._id,
    name: locale[option.name.key]
  });
};

const FormikForm = memo(() => {
  const {
    handleChange,
    values,
    errors,
    touched
  } = useFormikContext<FormikValues>();
  const { locale } = useClientContext();

  const { category } = values;

  const mapKeyToOption = useMapKeyToOption();

  const { data: categoriesData } = useQuery(
    categoriesApi.name,
    categoriesApi.get
  );

  const categoriesOptions = useMemo(
    () => [
      {
        label: locale.category,
        name: 'category' as SelectValues,
        options: categoriesData?.map(mapKeyToOption) || []
      },
      {
        label: locale.subcategory,
        name: 'subcategory' as SelectValues,
        options:
          categoriesData
            ?.find((categoryData) => categoryData._id === category)
            ?.subcategories.map(mapKeyToOption) || []
      }
    ],
    [
      categoriesData,
      category,
      locale.category,
      locale.subcategory,
      mapKeyToOption
    ]
  );

  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const rows = useMemo(() => (isMdDown ? 5 : 10), [isMdDown]);

  return (
    <Grid container component={Form}>
      <Grid container>
        <Grid component={Box} container my={1}>
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
        </Grid>
        {categoriesOptions.map((data) => (
          <Grid container component={Box} my={1} key={data.name}>
            <Select<FormikValues> data={data} />
          </Grid>
        ))}
        <Grid container component={Box} my={1}>
          <Field
            name="content"
            as={TextField}
            multiline
            onChange={handleChange}
            label={locale.content}
            variant="outlined"
            fullWidth
            rows={rows}
            helperText={touched.content && errors.content}
            error={errors.content && touched.content}
          />
        </Grid>
        <Button variant="contained" color="secondary" type="submit">
          <Typography>{locale.upload}</Typography>
        </Button>
      </Grid>
    </Grid>
  );
});

const ArticleForm = () => {
  const { locale } = useClientContext();

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

  const onSubmit = useCallback(
    async (values: FormikValues) => {
      if (isType<Omit<Article, '_id'>>(values, ['content', 'category'])) {
        const res = await articlesApi.post(values);
        alert(
          typeof res !== 'string'
            ? locale.articleAddedSuccessfully
            : locale.serverError
        );
      }
    },
    [locale.articleAddedSuccessfully, locale.serverError]
  );

  return (
    <Formik
      validate={validate}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <FormikForm />
    </Formik>
  );
};

export default memo(ArticleForm);
