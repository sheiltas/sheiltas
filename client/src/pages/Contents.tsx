import React, { memo } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { useQuery } from 'react-query';

import { isType, User } from '../types';
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

          return (
            <Grid key={title}>
              <Grid container alignItems="baseline">
                <Typography variant="h2">{title}</Typography>
                <Typography variant="subtitle1"> / {updatedAt}</Typography>
              </Grid>
              <Typography variant="subtitle1">{`${locale.category}: ${locale[category]}`}</Typography>
              {subcategory && (
                <Typography variant="subtitle1">
                  {`${locale.subcategory}: ${
                    locale[subcategory] || subcategory
                  }`}
                </Typography>
              )}
              <Typography variant="subtitle1">
                {`${locale.author}: ${fullName}`}
              </Typography>
              <Typography>{textContent}</Typography>
            </Grid>
          );
        })}
    </Grid>
  );
};

export default memo(ContentsPage);
