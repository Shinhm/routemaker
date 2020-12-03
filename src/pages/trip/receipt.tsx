import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../components/_common/layout/Layout';
import {
  Button,
  ButtonGroup,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from '@material-ui/core';
import FirebaseService, {
  FireStoreSchema,
} from '../../services/FirebaseService';
import { IRoute, IRouteRoutes, IRouteRoutesPlace } from '../../models/Route';
import EncryptService from '../../services/EncryptService';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { useReceiptStyles } from './receipt.style';
import useQuery from '../../hooks/useQuery';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';

function Receipt() {
  const classes = useReceiptStyles();
  const { id }: { id: string } = useParams();
  const { query } = useQuery();

  const { routes: rootRoutes } = useSelector(
    (state: IRootState) => state.route
  );

  const { routes } = rootRoutes || {};

  const [pending, setPending] = useState(true);
  const [receiptInfo, setReceiptInfo] = useState<IRouteRoutes>();
  const [totalAmount, setTotalAmount] = useState(0);
  const [personCount, setPersonCount] = useState(1);

  const setUnitField = (routes: IRouteRoutes[], searchField: string) => {
    const getRoutesWithSearchField = routes
      .filter((route) => {
        return route.date === searchField;
      })
      .pop();
    if (getRoutesWithSearchField) setReceiptInfo(getRoutesWithSearchField);
    let routesTotalAmount: number = 0;
    getRoutesWithSearchField?.regions.forEach((a: IRouteRoutesPlace) => {
      routesTotalAmount += a.amount ? parseInt(a.amount) : 0;
    });
    setTotalAmount(routesTotalAmount);
  };

  const fetchRoute = useCallback(
    async (searchField: string) => {
      if (routes) {
        setUnitField(routes, searchField);
        return setPending(false);
      }
      try {
        const result = await FirebaseService.getDoc(FireStoreSchema.route, id);
        const { routes } = result.data() as IRoute;
        setUnitField(routes, searchField);
      } catch (e) {
        console.log(e);
      } finally {
        setPending(false);
      }
    },
    [routes, id]
  );

  const handlePersonCount = (action: string) => {
    let person = personCount;
    if (action === 'plus' && person < 9) {
      person++;
    }
    if (action === 'minus' && person !== 1) {
      person--;
    }
    setPersonCount(person);
  };

  useEffect(() => {
    if (!query.q) {
      alert('정상접근이 아닙니다.');
      return window.location.replace(`/enter`);
    }

    const q = EncryptService.decrypt(query.q.toString());
    fetchRoute(q).then((r) => r);
  }, [fetchRoute, query.q]);

  return (
    <Layout appBar={{ title: '영수증', id: id, enabledPrevButton: true }}>
      {pending && <LinearProgress />}
      {!pending && receiptInfo && (
        <>
          <Paper className={classes.root} elevation={3}>
            <Grid
              container
              direction="row"
              justify="space-around"
              alignItems="center"
              spacing={3}
            >
              <Grid item xs={12}>
                <h4 style={{ paddingLeft: 8 }}>
                  {format(new Date(receiptInfo.date), 'yyyy년 MM월 dd일')}
                </h4>
                <h1>
                  {totalAmount.toLocaleString()}
                  <span className={classes.amountUnit}>원</span>
                </h1>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  direction="row"
                  justify="space-around"
                  alignItems="center"
                >
                  <Grid item xs={receiptInfo.budget ? 6 : 12}>
                    <ButtonGroup
                      className={classes.buttonGroup}
                      size="small"
                      aria-label="small outlined button group"
                    >
                      <Button
                        onClick={() => {
                          handlePersonCount('minus');
                        }}
                      >
                        <RemoveIcon />
                      </Button>
                      <Button>{personCount}명</Button>
                      <Button
                        onClick={() => {
                          handlePersonCount('plus');
                        }}
                      >
                        <AddIcon />
                      </Button>
                    </ButtonGroup>
                  </Grid>
                  {receiptInfo.budget && (
                    <Grid item xs={6} className={classes.budgetField}>
                      하루예산: {parseInt(receiptInfo.budget).toLocaleString()}
                      원
                    </Grid>
                  )}
                </Grid>
                <Divider className={classes.solidDivider} variant="middle" />
              </Grid>
              <Grid item xs={12}>
                <List dense={true}>
                  {receiptInfo.regions.map((region) => {
                    if (!region.amount) return false;
                    return (
                      <ListItem>
                        <ListItemText
                          className={classes.listItem}
                          primary={region.place_name}
                          secondary={region.address_name}
                        />
                        <ListItemSecondaryAction>
                          <span style={{ fontWeight: 'bold' }}>
                            {parseInt(region.amount || '0').toLocaleString()}원
                          </span>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
              <Grid item xs={12}>
                <List dense={true}>
                  <ListItem>
                    <ListItemText
                      className={classes.totalItem}
                      primary={'총 금액'}
                    />
                    <ListItemSecondaryAction>
                      <span className={classes.totalAmount}>
                        {totalAmount.toLocaleString()} 원
                      </span>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      className={classes.totalItem}
                      primary={'1인당 금액'}
                    />
                    <ListItemSecondaryAction>
                      <span className={classes.totalAmount}>
                        {parseInt(
                          (totalAmount / personCount).toFixed(0)
                        ).toLocaleString()}{' '}
                        원
                      </span>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                <p
                  style={{
                    textAlign: 'center',
                    opacity: 0.6,
                    padding: '10px 0 5px',
                  }}
                >
                  * 1인당 금액은 인원변경이 되면 자동으로 계산됩니다.
                </p>
              </Grid>
            </Grid>
          </Paper>
          <Link to={`/${id}/trip`}>
            <Button variant="outlined" color="primary">
              확인
            </Button>
          </Link>
        </>
      )}
    </Layout>
  );
}

export default Receipt;
