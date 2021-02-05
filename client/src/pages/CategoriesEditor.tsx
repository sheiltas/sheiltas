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
import { categoriesApi, localesApi } from '../api';
import { useClientContext } from '../providers/ClientProvider';
import { ClientCategory, ClientSubcategory, isType, Locale } from '../types';

type SelectValues = 'category' | 'subcategory';

const createClasses = makeStyles((theme) => ({
  paper: {
    width: '75%',
    padding: theme.spacing(4),
    alignSelf: 'center'
  }
}));

interface EditorRowProps {
  label: string;
  editType: SelectValues | '';
}

const EditorRow = (props: EditorRowProps) => {
  const { label } = props;
  const { locale } = useClientContext();
  return (
    <Grid container item>
      <Grid item xs>
        {editType === 'category' ? (
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
            >
              {categoriesLocalesOptions[0].options.map(({ name, value }) => (
                <MenuItem value={value} key={value}>
                  <Typography>{name}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Grid>

      <Grid container item xs justify="center">
        <Button
          onClick={handleEditClick('category')}
          variant="contained"
          color="secondary"
          disabled={!selectedCategoryLocaleKey || !!editValue}
        >
          <Typography>{locale.edit}</Typography>
        </Button>

        <Button
          onClick={handleUpdate}
          disabled={editType !== 'category'}
          variant="contained"
          color="secondary"
        >
          <Typography>{locale.update}</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

const CategoriesEditor: FC = () => {
  const classes = createClasses();
  const { locale, setLocalsData } = useClientContext();
  const { data: categoriesData } = useGet(categoriesApi);

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

  const handleEditClick = (value: SelectValues | '') => () => {
    const curEditLocale = categoriesData?.find?.(
      (curCategory) => curCategory.name.key === selectedCategoryLocaleKey
    )?.name || { _id: '', key: '' };
    setEditValue(locale[selectedCategoryLocaleKey]);
    setSelectedLocaleEdit(curEditLocale);
    setEditType(value);
  };

  const handleCategoryChange = (e: any) =>
    setSelectedCategoryLocaleKey(e.target.value);

  const { mutate: putLocale } = useMutation(localesApi.put, {
    onSuccess: (data) => {
      if (isType<Locale>(data, 'translation')) {
        setLocalsData((prevState) => {
          // eslint-disable-next-line no-param-reassign
          prevState.he[selectedCategoryLocaleKey] = data.translation.he;
          return prevState;
        });
        setEditValue('');
        setSelectedLocaleEdit({ _id: '', key: '' });
        setEditType('');
      }
    }
  });

  const handleUpdate = () =>
    putLocale({
      _id: selectedLocaleEdit._id,
      translation: { he: editValue, en: editValue }
    });

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
              (categoryData) => categoryData._id === selectedCategoryLocaleKey
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
        <EditorRow />
      </Grid>
    </Paper>
  );
};

export default memo(CategoriesEditor);
