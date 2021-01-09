import React, { memo } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useQuery } from 'react-query';
import { articlesApi } from '../api';
import Header from '../components/Header';

const ContentsPage = () => {
  const { data: contents } = useQuery([articlesApi.name, {}], articlesApi.get);
  console.log('contents', contents);
  return (
    <Grid>
      <Header />
      {contents?.length &&
        contents.map((content) => {
          const { author } = content;
          return <Typography>{author}</Typography>;
        })}
    </Grid>
  );
};

export default memo(ContentsPage);
