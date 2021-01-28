import React, { FC, memo } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import { Link } from 'react-router-dom';

import { useClientContext } from '../providers/ClientProvider';
import { ClientRoutes } from '../types';

const createClasses = makeStyles(() => ({
  paper: {
    padding: '30px'
  }
}));

interface Props {
  Form: FC;
  data: { titleKey: string; toPageKey: string; link: ClientRoutes };
}

const EditorPage = (props: Props) => {
  const { Form, data } = props;
  const { link, titleKey, toPageKey } = data;
  const classes = createClasses();
  const { locale } = useClientContext();

  return (
    <Grid container justify="center" alignItems="center">
      <Box className={classes.paper} component={Paper} width="100%" mx={2}>
        <Grid container alignItems="center" justify="space-between">
          <Typography>{`${locale[titleKey]}:`}</Typography>
          <Button variant="contained" color="primary">
            <Link to={link}>
              <Typography>{locale[toPageKey]}</Typography>
            </Link>
          </Button>
        </Grid>
        <Form />
      </Box>
    </Grid>
  );
};

export default memo(EditorPage);
