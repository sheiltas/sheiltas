import React, { memo, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import MuiListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { useHistory } from 'react-router-dom';

import { useClientContext } from '../providers/ClientProvider';
import { ClientRoutes } from '../types';

const createClasses = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.paper,
    justifyContent: 'center',
    top: '0'
  }
}));

interface ListItemProps {
  path: ClientRoutes;
  clickHandler: (path: ClientRoutes) => (e: React.MouseEvent) => void;
  listItemText: string;
}

const ListItem = memo((props: ListItemProps) => {
  const { clickHandler, listItemText, path } = props;

  return (
    <MuiListItem button onClick={clickHandler(path)}>
      <ListItemText>{listItemText}</ListItemText>
    </MuiListItem>
  );
});

const listItems: Array<Omit<ListItemProps, 'clickHandler'>> = [
  { listItemText: 'sheilta', path: ClientRoutes.EDITOR_SHEILTA },
  { listItemText: 'article', path: ClientRoutes.EDITOR_SHEILTA },
  { listItemText: 'categories', path: ClientRoutes.EDITOR_CATEGORIES }
];

const Header = () => {
  const classes = createClasses();
  const history = useHistory();
  const { selectedLanguage, locale, isAuthorized } = useClientContext();

  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  const goTo = (path: ClientRoutes) => () => history.push(path);

  return (
    <Grid container>
      <Box height="130px" width="100%" />

      <Drawer anchor="left" open={open} onClose={toggleOpen}>
        {listItems.map(({ path, listItemText }) => (
          <ListItem
            key={path}
            path={path}
            clickHandler={goTo}
            listItemText={locale[listItemText]}
          />
        ))}
      </Drawer>

      <AppBar position="fixed" className={classes.appBar}>
        <Grid container direction="row" alignItems="center">
          <Grid container item xs justify="flex-start">
            {isAuthorized && (
              <Box component={IconButton} mx={2} onClick={toggleOpen}>
                <MenuRoundedIcon />
              </Box>
            )}
          </Grid>
          <Grid item xs>
            <Typography variant="h1" align="center" color="secondary">
              {selectedLanguage === 'he' && '!'}
              Sheilta`S
              {selectedLanguage !== 'he' && '!'}
            </Typography>
          </Grid>

          <Grid item xs />
        </Grid>
      </AppBar>
    </Grid>
  );
};

export default memo(Header);
