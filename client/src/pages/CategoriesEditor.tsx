import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { StandardTextFieldProps, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useMutation } from 'react-query';
import useGet from '../hooks/api/useGet';
import { categoriesApi, localesApi, subcategoriesApi } from '../api';
import { useClientContext } from '../providers/ClientProvider';
import {
  ClientCategory,
  ClientSubcategory,
  isType,
  Languages,
  Locale
} from '../types';
import { languages } from '../utils';

type SelectValues = 'category' | 'subcategory';

const createClasses = makeStyles((theme) => ({
  paper: {
    width: '75%',
    padding: theme.spacing(4),
    alignSelf: 'center'
  }
}));

interface EditorRowProps {
  label: SelectValues;
  editType: SelectValues | '';
  editValue: string;
  handleTextFieldChange: StandardTextFieldProps['onChange'];
  categoriesLocalesOptions: {
    label: string;
    name: SelectValues;
    options: { name: string; value: string }[];
  };
  selectedCategoryLocaleKey: string;
  handleCategoryChange: (e: any) => void;
  handleEditClick: () => void;
  handleUpload: (type: SelectValues | 'update') => () => void;
  isNew: boolean;
  handleNewClick: () => void;
  newDisabled: boolean;
}

const EditorRow = memo((props: EditorRowProps) => {
  const {
    label,
    editType,
    editValue,
    handleTextFieldChange,
    categoriesLocalesOptions,
    selectedCategoryLocaleKey,
    handleCategoryChange,
    handleEditClick,
    handleUpload,
    handleNewClick,
    isNew,
    newDisabled
  } = props;
  const { locale } = useClientContext();

  return (
    <Grid container item>
      <Grid item xs>
        {editType === label ? (
          <TextField
            fullWidth
            label={locale[label]}
            value={editValue}
            variant="outlined"
            onChange={handleTextFieldChange}
          />
        ) : (
          <FormControl variant="outlined" fullWidth>
            <InputLabel>
              <Typography>{locale[label]}</Typography>
            </InputLabel>
            <Select
              value={selectedCategoryLocaleKey}
              onChange={handleCategoryChange}
              MenuProps={{
                disablePortal: true
              }}
            >
              {categoriesLocalesOptions.options.map(({ name, value }) => (
                <MenuItem value={value} key={value}>
                  <Typography>{name}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Grid>

      <Grid container item xs justify="center">
        <Grid item>
          <Button
            onClick={handleNewClick}
            variant="contained"
            color="secondary"
            disabled={newDisabled}
          >
            <Typography>{locale.new}</Typography>
          </Button>
        </Grid>

        <Grid item>
          <Button
            onClick={handleEditClick}
            variant="contained"
            color="secondary"
            disabled={!selectedCategoryLocaleKey || !!editValue || isNew}
          >
            <Typography>{locale.edit}</Typography>
          </Button>
        </Grid>

        <Grid>
          <Button
            onClick={handleUpload(isNew ? label : 'update')}
            disabled={editType !== label || !editValue}
            variant="contained"
            color="secondary"
          >
            <Typography>{locale.upload}</Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
});

const CategoriesEditor: FC = () => {
  const classes = createClasses();
  const { locale, setLocalsData, localesData } = useClientContext();
  const [categoriesData, setCategoriesData] = useState<ClientCategory[]>([]);

  useGet(categoriesApi, {
    onSuccess: (data) => setCategoriesData(data)
  });

  // To determine if a select field should transform into text field
  const [editType, setEditType] = useState<SelectValues | ''>('');

  const [editValue, setEditValue] = useState('');
  const handleTextFieldChange: StandardTextFieldProps['onChange'] = (e) =>
    setEditValue(e.target.value);

  // For the locale _id and key
  const [selectedLocaleEdit, setSelectedLocaleEdit] = useState({
    _id: '',
    key: ''
  });
  const [selectedCategoryLocaleKey, setSelectedCategoryLocaleKey] = useState(
    ''
  );
  const [
    selectedSubcategoryLocaleKey,
    setSelectedSubcategoryLocaleKey
  ] = useState('');

  const [isNew, setIsNew] = useState(false);

  const handleNewClick = (type: SelectValues) => () => {
    setIsNew(true);
    setEditValue('');
    setEditType(type);
    return type === 'category'
      ? setSelectedCategoryLocaleKey('')
      : setSelectedSubcategoryLocaleKey('');
  };

  const handleEditClick = (value: SelectValues | '') => () => {
    let localeKey: string;
    let editLocale: { _id: string; key: string };
    // eslint-disable-next-line default-case
    switch (value) {
      case 'category':
        localeKey = selectedCategoryLocaleKey;
        editLocale = categoriesData?.find?.(
          (curCategory) => curCategory.name.key === localeKey
        )?.name || { _id: '', key: '' };
        break;
      case 'subcategory':
        localeKey = selectedSubcategoryLocaleKey;
        editLocale = categoriesData
          ?.find?.(
            (curCategory) => curCategory.name.key === selectedCategoryLocaleKey
          )
          ?.subcategories.find(
            (subcategory) =>
              subcategory.name.key === selectedSubcategoryLocaleKey
          )?.name || { _id: '', key: '' };
        break;
      default:
        localeKey = '';
        editLocale = { _id: '', key: '' };
    }
    setEditValue(locale[localeKey]);
    setSelectedLocaleEdit(editLocale);
    setEditType(value);
  };

  const handleSelectChange = (changeValue: SelectValues) => (e: any) => {
    const changeFunc =
      changeValue === 'category'
        ? setSelectedCategoryLocaleKey
        : setSelectedSubcategoryLocaleKey;
    changeFunc(e.target.value);
    if (changeValue === 'category') {
      setSelectedSubcategoryLocaleKey('');
    }
  };

  const { mutate: putLocale } = useMutation(localesApi.put, {
    onSuccess: (data) => {
      if (isType<Locale>(data, 'translation')) {
        const compareLocaleKey =
          editType === 'category'
            ? selectedCategoryLocaleKey
            : selectedSubcategoryLocaleKey;
        setLocalsData((prevState) =>
          Object.entries(prevState).reduce((acc, [language, localeData]) => {
            acc[language] = Object.entries(localeData).reduce(
              (innerAcc, [localeKey, localeValue]) => {
                // eslint-disable-next-line no-param-reassign
                innerAcc[localeKey] =
                  localeKey === compareLocaleKey
                    ? data.translation.he
                    : localeValue;
                return innerAcc;
              },
              {} as any
            );
            return acc;
          }, {} as any)
        );
        setEditValue('');
        setSelectedLocaleEdit({ _id: '', key: '' });
        setEditType('');
      }
    }
  });

  const { mutate: postCategory } = useMutation(categoriesApi.post as any, {
    onSuccess: (data: [ClientCategory, Locale]) => {
      const [categoryRes, localeRes] = data;
      setCategoriesData(categoriesData.concat(categoryRes));

      const newLocales = Object.entries(localesData).reduce(
        (acc, [language, value]) => ({
          ...acc,
          [language]: Object.entries(value).reduce(
            (innerAcc, [key, word]) => ({
              ...innerAcc,
              [key]: word
            }),
            {
              [localeRes.key]: localeRes.translation[language as Languages]
            }
          )
        }),
        {
          // TODO fix generic
          he: {},
          en: {}
        }
      );
      setLocalsData(newLocales);
      setSelectedCategoryLocaleKey(localeRes.key);
      setEditType('');
      setEditValue('');
      setIsNew(false);
    }
  });

  const { mutate: postSubcategory } = useMutation(
    subcategoriesApi.post as any,
    {
      onSuccess: (data: [ClientSubcategory, Locale, ClientCategory]) => {
        const [subcategoryRes, localeRes] = data;

        const newCategories = categoriesData.map((category) => {
          if (category.name.key === selectedCategoryLocaleKey) {
            category.subcategories.push(subcategoryRes);
          }
          return category;
        });
        setCategoriesData(newCategories);

        const newLocales = Object.entries(localesData).reduce(
          (acc, [language, value]) => ({
            ...acc,
            [language]: Object.entries(value).reduce(
              (innerAcc, [key, word]) => ({
                ...innerAcc,
                [key]: word
              }),
              {
                [localeRes.key]: localeRes.translation[language as Languages]
              }
            )
          }),
          {
            // TODO fix generic
            he: {},
            en: {}
          }
        );
        setLocalsData(newLocales);

        setSelectedSubcategoryLocaleKey(subcategoryRes.name.key);
        setEditType('');
        setEditValue('');
        setIsNew(false);
      }
    }
  );

  const handleUpload = (type: SelectValues | 'update') => () => {
    switch (type) {
      case 'category':
        // eslint-disable-next-line
        // @ts-ignore
        postCategory({ word: editValue });
        break;
      case 'subcategory':
        // eslint-disable-next-line
        // @ts-ignore
        postSubcategory({
          word: editValue,
          categoryId: categoriesData.find(
            (category) => category.name.key === selectedCategoryLocaleKey
          )?._id
        });
        break;
      case 'update':
        putLocale({
          _id: selectedLocaleEdit._id,
          translation: { he: editValue, en: editValue }
        });
        break;
      default:
    }
  };

  const mapKeyToOption = useCallback(
    (category: ClientCategory | ClientSubcategory) => ({
      name: locale[category.name.key],
      value: category.name.key
    }),
    [locale]
  );

  const categoriesLocalesOptions = useMemo(
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
            ?.find(
              (categoryData) =>
                categoryData.name.key === selectedCategoryLocaleKey
            )
            ?.subcategories.map(mapKeyToOption) || []
      }
    ],
    [
      categoriesData,
      selectedCategoryLocaleKey,
      locale.category,
      locale.subcategory,
      mapKeyToOption
    ]
  );

  return (
    <Paper elevation={3} className={classes.paper}>
      <Grid container direction="column">
        <EditorRow
          handleTextFieldChange={handleTextFieldChange}
          label="category"
          categoriesLocalesOptions={categoriesLocalesOptions[0]}
          editType={editType}
          editValue={editValue}
          handleCategoryChange={handleSelectChange('category')}
          handleEditClick={handleEditClick('category')}
          handleUpload={handleUpload}
          selectedCategoryLocaleKey={selectedCategoryLocaleKey}
          handleNewClick={handleNewClick('category')}
          isNew={isNew}
          newDisabled={isNew}
        />
        <EditorRow
          editType={editType}
          label="subcategory"
          editValue={editValue}
          handleTextFieldChange={handleTextFieldChange}
          categoriesLocalesOptions={categoriesLocalesOptions[1]}
          selectedCategoryLocaleKey={selectedSubcategoryLocaleKey}
          handleCategoryChange={handleSelectChange('subcategory')}
          handleEditClick={handleEditClick('subcategory')}
          handleUpload={handleUpload}
          handleNewClick={handleNewClick('subcategory')}
          isNew={isNew}
          newDisabled={isNew || !selectedCategoryLocaleKey}
        />
      </Grid>
    </Paper>
  );
};

export default memo(CategoriesEditor);
