import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Button,
  createStyles,
  Fab,
  Grid,
  IconButton,
  Snackbar,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import ClipboardJS from 'clipboard';
import AddIcon from '@material-ui/icons/Add';
import { Link, useHistory } from 'react-router-dom';
import UserAgentService from '../../../services/UserAgentService';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      paddingTop: 40,
      maxWidth: 700,
      margin: 'auto',
      textAlign: 'center',
    },
    rootMobile: {
      flexGrow: 1,
      paddingBottom: 150,
      paddingTop: 40,
      maxWidth: 400,
      margin: 'auto',
      textAlign: 'center',
    },
    appBar: {
      width: 700,
      left: '50%',
      marginLeft: -350,
    },
    appBarMobile: {
      width: 400,
      left: '50%',
      marginLeft: -200,
    },
    menuButton: {
      color: '#fff',
    },
    title: {
      flexGrow: 1,
      textAlign: 'left',
      color: '#fff',
    },
    floatButton: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 999999,
    },
  })
);

interface IAppBarProps {
  title: string;
  id: string;
  enabledPrevButton?: boolean;
  enabledAddButton?: boolean;
}

interface ILayoutProps {
  children: React.ReactNode;
  appBar: IAppBarProps;
}

function Layout({ children, appBar }: ILayoutProps) {
  const classes = useStyles();
  const history = useHistory();
  const {
    title,
    id,
    enabledPrevButton = false,
    enabledAddButton = false,
  } = appBar;

  useEffect(() => {
    const clipboardUrl = new ClipboardJS('.copy_url_btn');
    clipboardUrl.on('success', function (e) {
      e.clearSelection();
    });
  }, []);

  return (
    <div
      className={
        UserAgentService.isMobile() ? classes.rootMobile : classes.root
      }
    >
      <AppBar
        position="fixed"
        className={
          UserAgentService.isMobile() ? classes.appBarMobile : classes.appBar
        }
      >
        <Toolbar variant="dense">
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={1}>
              {enabledPrevButton && (
                <IconButton
                  onClick={() => {
                    history.goBack();
                  }}
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
                >
                  <NavigateBeforeIcon />
                </IconButton>
              )}
            </Grid>
            <Grid item xs={11}>
              <Typography variant="h6" className={classes.title}>
                {title}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {children}
      {enabledAddButton && (
        <Link to={`/${id}/write`}>
          <Fab className={classes.floatButton} color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </Link>
      )}
    </div>
  );
}

export default Layout;
