import React, { useCallback, memo, useMemo } from 'react';
import { Formik, Form, Field, useFormikContext } from 'formik';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MuiSelect from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { articlesApi, categoriesApi } from '../api';
import { useClientContext } from '../providers/ClientProvider';
import { isType, subcategoriesHebrew } from '../types';
import { Article } from '../types';
import Header from '../components/Header';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';

const createClasses = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.paper,
    minHeight: '70px',
    marginBottom: '30px'
  },
  paper: {
    padding: '30px'
  },
  input: {
    backgroundColor: theme.palette.background.default
  }
}));

const useMapKeyToOption = () => {
  const { locale } = useClientContext();

  return (option: any) => ({
    value: option._id,
    name: locale[option.name.key]
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
  category: string;
  subcategory: subcategoriesHebrew | '';
  content: string;
}

type selectValues = 'category' | 'subcategory';

const Select = memo((props: SelectProps<selectValues>) => {
  const { data } = props;
  const classes = createClasses();
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
        inputProps={{
          className: classes.input
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

const FormikForm = () => {
  const {
    handleChange,
    values,
    errors,
    touched
  } = useFormikContext<FormikValues>();
  const { locale } = useClientContext();
  const classes = createClasses();

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
        name: 'category' as selectValues,
        options: categoriesData?.map(mapKeyToOption) || []
      },
      {
        label: locale.subcategory,
        name: 'subcategory' as selectValues,
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
            InputProps={{
              className: classes.input
            }}
          />
        </Grid>
        {categoriesOptions.map((data) => (
          <Grid container component={Box} my={1} key={data.name}>
            <Select data={data} />
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
            InputProps={{
              className: classes.input
            }}
          />
        </Grid>
        <Button variant="contained" color="secondary" type="submit">
          <Typography>{locale.upload}</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

const EditorPage = () => {
  const classes = createClasses();
  const { locale } = useClientContext();
  const history = useHistory();

  const initialValues: FormikValues = useMemo(
    () => ({
      title: '',
      category: '',
      subcategory: '',
      content: ''
    }),
    []
  );

  const goToContentsPage = useCallback(() => {
    history.push('/contents');
  }, [history]);

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
    <Grid container justify="center" alignItems="center">
      <Header />
      <Box className={classes.paper} component={Paper} width="100%" mx={2}>
        <Grid container alignItems="center" justify="space-between">
          <Typography> {locale.editorPageTitle}:</Typography>
          <Button
            variant="contained"
            onClick={goToContentsPage}
            color="primary"
          >
            <Typography>{locale.toContentsPage}</Typography>
          </Button>
        </Grid>
        <Formik
          validate={validate}
          initialValues={initialValues}
          onSubmit={onSubmit}
        >
          <FormikForm />
        </Formik>
      </Box>
    </Grid>
  );
};

export default memo(EditorPage);
