import React, { FC, memo, useMemo, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import useGet from '../hooks/api/useGet';
import { categoriesApi } from '../api';
import useMapKeyToOption from '../hooks/useMapKeyToOption';
import { useClientContext } from '../providers/ClientProvider';

type SelectValues = 'category' | 'subcategory';

const CategoriesEditor: FC = () => {
  const mapKeyToOption = useMapKeyToOption();
  const { locale } = useClientContext();
  const { data: categoriesData } = useGet(categoriesApi);
  const [editType, setEditType] = useState<SelectValues | ''>('');
  const [editValue, setEditValue] = useState('');
  const handleEditClick = (value: SelectValues | '') => () => {
    setEditValue(
      categoriesData.find?.((curCategory) => curCategory._id === categoryId)
        ?.name.tra || ''
    );
    setEditType(value);
  };

  const [categoryId, setCategoryId] = useState('');
  const handleCategoryChange = (e: any) => setCategoryId(e.target.value);

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
            ?.find((categoryData) => categoryData._id === categoryId)
            ?.subcategories.map(mapKeyToOption) || []
      }
    ],
    [
      categoriesData,
      categoryId,
      locale.category,
      locale.subcategory,
      mapKeyToOption
    ]
  );

  return (
    <Paper elevation={3}>
      <Grid container direction="column">
        <Grid container item>
          <Grid item xs>
            {editType === 'category' ? (
              <TextField value={categoriesData[0]} />
            ) : (
              <Select value={categoryId} onChange={handleCategoryChange}>
                {categoriesOptions[0].options.map(({ name, value }) => (
                  <MenuItem value={value}>
                    <Typography>{name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            )}
          </Grid>
          <Grid container item xs>
            <Button onClick={handleEditClick('category')}>
              <Typography>{locale.edit}</Typography>
            </Button>
            <Button disabled={editType !== 'category'}>
              <Typography>{locale.update}</Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default memo(CategoriesEditor);
