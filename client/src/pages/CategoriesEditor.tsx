import React, { FC, memo, useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import useGet from '../hooks/api/useGet';
import { categoriesApi } from '../api';
import useMapKeyToOption from '../hooks/useMapKeyToOption';
import { useClientContext } from '../providers/ClientProvider';

type SelectValues = 'category' | 'subcategory';

const CategoriesEditor: FC = () => {
  const mapKeyToOption = useMapKeyToOption();
  const { locale } = useClientContext();
  const { data: categoriesData } = useGet(categoriesApi);
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

  return (
    <Grid container direction="column">
      {categoriesOptions.map((data) => (
        <Grid container component={Box} my={1} key={data.name} />
      ))}
    </Grid>
  );
};

export default memo(CategoriesEditor);
