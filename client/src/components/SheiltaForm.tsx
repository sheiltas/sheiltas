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

import { sheiltasApi, categoriesApi } from '../api';
import { useClientContext } from '../providers/ClientProvider';
import { ClientSheilta, isType, Sheilta } from '../types';
import Select from './Select';

type SelectValues = 'category' | 'subcategory';

interface FormikValues {
  title: string;
  category: string;
  subcategory: string;
  question: string;
  answer: string;
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
        <Grid container component={Box} my={1}>
          <Field
            name="title"
            as={TextField}
            onChange={handleChange}
            label={locale.title}
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
            name="question"
            as={TextField}
            onChange={handleChange}
            label={locale.question}
            variant="outlined"
            fullWidth
            helperText={touched.question && errors.question}
            error={errors.question && touched.question}
          />
        </Grid>
        <Grid container component={Box} my={1}>
          <Field
            name="answer"
            as={TextField}
            multiline
            onChange={handleChange}
            label={locale.answer}
            variant="outlined"
            fullWidth
            rows={rows}
            helperText={touched.answer && errors.answer}
            error={errors.answer && touched.answer}
          />
        </Grid>
        <Button variant="contained" color="secondary" type="submit">
          <Typography>{locale.upload}</Typography>
        </Button>
      </Grid>
    </Grid>
  );
});

const SheiltaForm = () => {
  const { locale, selectedEdit, setSelectedEdit } = useClientContext();

  const initialValues: FormikValues = useMemo(
    () =>
      isType<ClientSheilta>(selectedEdit, ['title', 'question'])
        ? {
            title: selectedEdit.title,
            category: selectedEdit.category._id,
            subcategory: selectedEdit.subcategory._id,
            answer: selectedEdit.answer,
            question: selectedEdit.question
          }
        : {
            title: '',
            category: '',
            subcategory: '',
            answer: '',
            question: ''
          },
    [selectedEdit]
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
      if (
        isType<Omit<Sheilta, '_id'>>(values, ['question', 'answer', 'category'])
      ) {
        const res = isType<ClientSheilta>(selectedEdit, ['title', 'question'])
          ? await sheiltasApi.put({ ...values, _id: selectedEdit._id })
          : await sheiltasApi.post(values);

        setSelectedEdit(null);
        alert(
          typeof res !== 'string'
            ? locale.sheiltaAddedSuccessfully
            : locale.serverError
        );
      }
    },
    [
      selectedEdit,
      setSelectedEdit,
      locale.sheiltaAddedSuccessfully,
      locale.serverError
    ]
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

export default memo(SheiltaForm);
