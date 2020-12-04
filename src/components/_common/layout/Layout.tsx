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
      color: '#fff',
    },
    title: {
      flexGrow: 1,
      textAlign: 'left',
      color: '#fff',
      paddingLeft: 16,
    },
    floatButton: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 999999,
    },
    bottomMenuBar: {
      width: '100%',
      height: 45,
      left: 0,
      [theme.breakpoints.up('sm')]: {
        left: '50%',
        width: theme.breakpoints.width('lg'),
        marginLeft: -(theme.breakpoints.width('lg') / 2),
      },
      position: 'fixed',
      bottom: 0,
      zIndex: 99999,
      borderRadius: '40px 40px 0 0',
    },
    bottomMainActionButton: {
      width: '95%',
      background: '#fff',
      border: '1px solid',
      borderColor: theme.palette.primary.main,
      borderRadius: 50,
      marginTop: -11,
    },
    bottomSideActionButtonLeft: {
      zIndex: 100,
      backgroundColor: theme.palette.primary.main,
      borderRadius: '39px 80px 0 0',
    },
    bottomSideActionButtonRight: {
      zIndex: 100,
      backgroundColor: theme.palette.primary.main,
      borderRadius: '80px 39px 0 0',
    },
    bottomLineField: {
      width: '90%',
      bottom: 0,
      height: 110,
      position: 'absolute',
      borderBottom: '40px solid #1d04bf',
      borderRadius: '35%',
      marginLeft: '-20%',
      marginBottom: -26,
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
              color="inherit"
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
