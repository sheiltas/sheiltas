import React, { memo } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { useQuery } from 'react-query';

import { Category, isType, User } from '../types';
import { articlesApi } from '../api';
import Header from '../components/Header';
import { useClientContext } from '../providers/ClientProvider';

const ContentsPage = () => {
  const { data: contents } = useQuery([articlesApi.name, {}], articlesApi.get);
  const { locale } = useClientContext();

  return (
    <Grid>
      <Header />

      {contents?.length &&
        contents.map((content) => {
          const {
            author,
            title,
            content: textContent,
            category,
            subcategory,
            updatedAt
          } = content;

          const { fullName } = isType<User>(author, 'fullName')
            ? author
            : ({} as any);

          const date = new Date(updatedAt.toString());
          const dateText = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;

          return (
            isType<Category>(category, 'name') && (
              <Grid key={title}>
                <Grid container alignItems="baseline">
                  <Typography variant="h2">{title}</Typography>
                  <Typography variant="subtitle1"> | {dateText}</Typography>
                </Grid>
                <Typography variant="subtitle1">{`${locale.category}: ${
                  locale[category.name.key]
                }`}</Typography>
                {subcategory && (
                  <Typography variant="subtitle1">
                    {`${locale.subcategory}: ${locale[subcategory.name.key]}`}
                  </Typography>
                )}
                <Typography variant="subtitle1">
                  {`${locale.author}: ${fullName}`}
                </Typography>
                <Typography>{textContent}</Typography>
              </Grid>
            )
          );
        })}
    </Grid>
  );
};

export default memo(ContentsPage);
