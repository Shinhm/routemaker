import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Button,
  createStyles,
  Fab,
  IconButton,
  Snackbar,
  SnackbarOrigin,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import EncryptService from '../../../services/EncryptService';
import ClipboardJS from 'clipboard';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      paddingBottom: 150,
      paddingTop: 40,
    },
    appBar: {
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
  enabledMenuButton?: boolean;
  enabledAddButton?: boolean;
}

interface ILayoutProps {
  children: React.ReactNode;
  appbar: IAppBarProps;
}

function Layout({ children, appbar }: ILayoutProps) {
  const classes = useStyles();
  const {
    title,
    id,
    enabledPrevButton = false,
    enabledMenuButton = false,
    enabledAddButton = false,
  } = appbar;
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const clipboardUrl = new ClipboardJS('.copy_url_btn');
    clipboardUrl.on('success', function (e) {
      e.clearSelection();
    });
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
          {enabledPrevButton && (
            <Link to={`/${id}/trip`}>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <NavigateBeforeIcon />
              </IconButton>
            </Link>
          )}
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          {enabledMenuButton && (
            <>
              <Button
                color="inherit"
                className={'copy_url_btn'}
                data-clipboard-text={`${window.location.origin}${
                  window.location.pathname
                }?sr=${EncryptService.encrypt('codeEnabled')}`}
                onClick={() => {
                  setOpen(true);
                  setTimeout(() => {
                    setOpen(false);
                  }, 1000);
                }}
              >
                <LinkIcon />
              </Button>
              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                message="공유 URL이 복사되었습니다."
              />
            </>
          )}
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
