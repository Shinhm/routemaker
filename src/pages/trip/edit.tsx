import React, { useCallback, useEffect, useState } from 'react';
import FirebaseService, {
  FireStoreSchema,
} from '../../services/FirebaseService';
import { useHistory, useParams } from 'react-router-dom';
import { IRoute, IRouteRoutes } from '../../models/Route';
import EncryptService from '../../services/EncryptService';
import Layout from '../../components/_common/layout/Layout';
import {
  Container,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  LinearProgress,
  TextField,
} from '@material-ui/core';
import { format } from 'date-fns';
import { Form, Formik, FormikProps } from 'formik';
import Map from '../../components/trip/Map';
import BottomNavigation from '../../components/_common/groups/BottomNavigation';
import { useEditStyle } from './edit.style';
import useQuery from '../../hooks/useQuery';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setRoute } from '../../store/RouteStore';

export enum EDIT_ENTRY {
  write = 'write',
  edit = 'edit',
}

function Edit() {
  const classes = useEditStyle();
  const { id, edit }: { id: string; edit: string } = useParams();
  const { query } = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const [pending, setPending] = useState(true);
  const [submitPending, setSubmitPending] = useState(false);
  const { route, routes: rootRoutes } = useSelector(
    (state: IRootState) => state.route
  );

  const { routes } = rootRoutes || {};

  const handleSubmit = async (formData: IRouteRoutes) => {
    const result = await FirebaseService.getDoc(FireStoreSchema.route, id);
    const { routes = [], notice = '' } = result.data() || {};
    if (!formData.date) {
      return alert('날짜를 입력해주세요.');
    }
    const filter = routes
      .filter((routeFilter: IRouteRoutes) => routeFilter.date === formData.date)
      .pop();
    if (!formData.regions.length) {
      return alert('지역을 추가하셔야 합니다.');
    }
    if (edit === EDIT_ENTRY.write && filter) {
      return alert('이미 해당날짜에 일정을 등록했습니다.');
    }
    setSubmitPending(true);
    try {
      if (edit === EDIT_ENTRY.write) {
        await FirebaseService.setCollection(
          FireStoreSchema.route,
          {
            notice: notice,
            routes: routes.concat({
              date: formData.date,
              regions: formData.regions,
              budget: formData.budget,
            }),
          },
          id
        );
      } else {
        const updateRoutes = routes.map((route: IRouteRoutes) => {
          if (route.date === formData.date) {
            return {
              date: formData.date,
              regions: formData.regions,
              budget: formData.budget,
            };
          }
          return route;
        });
        await FirebaseService.setCollection(
          FireStoreSchema.route,
          {
            notice: notice,
            routes: updateRoutes,
          },
          id
        );
      }
      history.goBack();
    } catch (e) {
      console.log(e);
    } finally {
      setSubmitPending(false);
    }
  };

  const fetchRoute = useCallback(
    async (searchField: string) => {
      if (routes) {
        const getRoutesWithSearchField = routes
          .filter((route) => {
            return route.date === searchField;
          })
          .pop();
        if (getRoutesWithSearchField) {
          dispatch(setRoute(getRoutesWithSearchField));
        }
        return setPending(false);
      }
      try {
        const result = await FirebaseService.getDoc(FireStoreSchema.route, id);
        const { routes } = result.data() as IRoute;
        const getRoutesWithSearchField = routes
          .filter((route) => {
            return route.date === searchField;
          })
          .pop();
        if (getRoutesWithSearchField) {
          dispatch(setRoute(getRoutesWithSearchField));
        }
      } catch (e) {
        console.log(e);
      } finally {
        setPending(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (edit !== EDIT_ENTRY.edit && edit !== EDIT_ENTRY.write) {
      return history.replace(`/${id}/trip`);
    }
    if (edit === EDIT_ENTRY.edit) {
      const q = EncryptService.decrypt(query.q.toString());
      fetchRoute(q).then((r) => r);
    } else {
      setPending(false);
    }
  }, [history, edit, fetchRoute, id, query.q]);

  return (
    <Layout
      appBar={{
        title: edit === EDIT_ENTRY.edit ? '수정' : '추가',
        id: id,
        enabledPrevButton: true,
      }}
    >
      {pending ? (
        <LinearProgress />
      ) : (
        <Container className={classes.root}>
          <Formik
            initialValues={{
              budget: route?.budget || '',
              regions: route?.regions || [],
              date: route?.date || '',
            }}
            enableReinitialize={true}
            onSubmit={handleSubmit}
          >
            {(props: FormikProps<any>) => {
              const { setFieldValue, values, submitForm } = props;
              const { budget, date } = values;
              return (
                <Form>
                  <Grid container spacing={3}>
                    <Grid container item xs={6}>
                      <TextField
                        label="일정"
                        type="date"
                        onChange={(e) => {
                          const date = e.target.value;
                          setFieldValue(
                            'date',
                            format(new Date(date), 'yyyy-MM-dd')
                          );
                        }}
                        defaultValue={date}
                        style={{ width: '100%' }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid container item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="budget">하루예산</InputLabel>
                        <Input
                          id="budget"
                          defaultValue={budget}
                          type={'number'}
                          onChange={(e) => {
                            const budget = e.target.value;
                            setFieldValue('budget', budget);
                          }}
                          startAdornment={
                            <InputAdornment position="start">₩</InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid container item xs={12}>
                      <Map {...props} />
                    </Grid>
                  </Grid>
                  <BottomNavigation
                    pending={submitPending}
                    enabledPrevButton={true}
                    enabledActionButton={true}
                    onClick={submitForm}
                    label={edit === EDIT_ENTRY.edit ? '수정' : '등록'}
                  />
                </Form>
              );
            }}
          </Formik>
        </Container>
      )}
    </Layout>
  );
}

export default Edit;
