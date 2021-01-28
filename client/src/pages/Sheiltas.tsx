import React, { memo } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

import { Category, ClientRoutes, ClientSheilta, isType } from '../types';
import { sheiltasApi } from '../api';
import { useClientContext } from '../providers/ClientProvider';

const Sheiltas = () => {
  const history = useHistory();
  const { data: contents } = useQuery([sheiltasApi.name, {}], sheiltasApi.get);
  const { locale, user, setSelectedEdit } = useClientContext();
  const handleEdit = (content: ClientSheilta) => () => {
    setSelectedEdit(content);
    history.push(ClientRoutes.EDITOR_SHEILTA);
  };

  return (
    <Grid>
      {!!contents?.length &&
        contents.map((content) => {
          const {
            author,
            title,
            category,
            subcategory,
            question,
            answer,
            updatedAt
          } = content;

          const { fullName, _id: authorId } = author || {};

          const date = new Date(updatedAt.toString());
          const dateText = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;

          return (
            isType<Category>(category, 'name') && (
              <Grid key={title}>
                <Grid container alignItems="baseline">
                  <Grid container item xs alignItems="baseline" spacing={1}>
                    <Grid item>
                      <Typography variant="h2">{title}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">
                        {` | ${dateText}`}
                      </Typography>
                    </Grid>
                  </Grid>
                  {authorId === user._id && (
                    <Grid container item xs justify="flex-end">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleEdit(content)}
                      >
                        {locale.edit}
                      </Button>
                    </Grid>
                  )}
                </Grid>
                <Typography variant="subtitle1">
                  {`${locale.category}: ${locale[category.name.key]}`}
                </Typography>
                {subcategory && (
                  <Typography variant="subtitle1">
                    {`${locale.subcategory}: ${locale[subcategory.name.key]}`}
                  </Typography>
                )}
                {fullName && (
                  <Typography variant="subtitle1">
                    {`${locale.author}: ${fullName}`}
                  </Typography>
                )}
                <Typography variant="h6">{locale.question}</Typography>
                <Typography>{question}</Typography>
                <Typography variant="h6">{locale.answer}</Typography>
                <Typography>{answer}</Typography>
              </Grid>
            )
          );
        })}
    </Grid>
  );
};

export default memo(Sheiltas);
