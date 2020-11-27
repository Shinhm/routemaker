import React from 'react';
import {
  AppBar,
  Button,
  createStyles,
  Grid,
  IconButton,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: theme.breakpoints.width('sm'),
      [theme.breakpoints.up('sm')]: {
        maxWidth: theme.breakpoints.width('lg'),
        paddingTop: 50,
      },
      margin: 'auto',
      textAlign: 'center',
    },
    appBar: {
      width: 700,
      left: '50%',
      marginLeft: -350,
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
  id: string;
  enabledPrevButton?: boolean;
}

interface ILayoutProps {
  children: React.ReactNode;
  appBar: IAppBarProps;
}

function Layout({ children, appBar }: ILayoutProps) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { title, id, enabledPrevButton = false } = appBar;

  return (
    <div className={classes.root}>
      {!isMobile && (
        <AppBar position="fixed" className={classes.appBar}>
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
      )}
      {children}
    </div>
  );
}

export default Layout;
