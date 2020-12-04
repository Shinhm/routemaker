import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Avatar,
  createStyles,
  IconButton,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setKakaoAuth } from '../../../store/UserStore';
import { IRootState } from '../../../store';
import SimpleDialog from '../dialogs/SimpleDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: theme.breakpoints.width('sm'),
      [theme.breakpoints.up('sm')]: {
        maxWidth: theme.breakpoints.width('lg'),
        paddingTop: 70,
      },
      paddingTop: 50,
      margin: 'auto',
      marginBottom: 60,
      textAlign: 'center',
    },
    appBar: {
      width: theme.breakpoints.width('lg'),
      left: '50%',
      marginLeft: -(theme.breakpoints.width('lg') / 2),
      [theme.breakpoints.down('sm')]: {
        height: 50,
        margin: 0,
        left: 0,
        width: '100%',
      },
    },
    toolBar: {
      minHeight: 50,
    },
    menuButton: {
      // color: '#fff',
    },
    title: {
      flexGrow: 1,
      textAlign: 'left',
      // color: '#fff',
      paddingLeft: 16,
    },
  })
);

interface IAppBarProps {
  title: string;
  id?: string;
  enabledPrevButton?: boolean;
}

interface ILayoutProps {
  children: React.ReactNode;
  appBar: IAppBarProps;
}

function Layout({ children, appBar }: ILayoutProps) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { title, enabledPrevButton = false } = appBar;

  const { kakaoAuth } = useSelector((state: IRootState) => state.user);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const handleCloseDialog = () => {
    setOpenDialog(false);
    history.push('/enter');
  };

  const handleOpenDialog = (message: string) => {
    setDialogMessage(message);
    setOpenDialog(true);
  };

  useEffect(() => {
    setTimeout(async () => {
      if (kakaoAuth) {
        return;
      }
      if (window.Kakao?.isInitialized()) {
        try {
          const me = await window.Kakao.API.request({
            url: '/v2/user/me',
          });
          dispatch(setKakaoAuth(me));
        } catch (e) {
          if (
            location.pathname === '/user' &&
            JSON.parse(JSON.parse(e)).code === -401
          ) {
            handleOpenDialog('로그인이 만료되었습니다.');
          }
        }
      }
    }, 500);
  }, [location, kakaoAuth, dispatch]);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          {enabledPrevButton && (
            <IconButton
              onClick={() => {
                history.goBack();
              }}
              edge="start"
              className={classes.menuButton}
              aria-label="menu"
            >
              <NavigateBeforeIcon />
            </IconButton>
          )}
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          {location.pathname !== '/user' && (
            <IconButton
              onClick={() => {
                if (kakaoAuth) {
                  history.push('/user');
                } else {
                  handleOpenDialog('로그인 먼저 진행해주세요.');
                }
              }}
            >
              <Avatar
                alt="Remy Sharp"
                src={kakaoAuth?.properties?.profile_image}
              />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {children}
      {openDialog && (
        <SimpleDialog handleClose={handleCloseDialog} message={dialogMessage} />
      )}
    </div>
  );
}

export default Layout;
