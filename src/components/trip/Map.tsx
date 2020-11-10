import React, { useCallback, useEffect, useState } from 'react';
import { createStyles, Snackbar, TextField, Theme } from '@material-ui/core';
import { IRouteRoutesRegion } from '../../models/Route';
import { renderToString } from 'react-dom/server';
import CustomMarker from '../_common/map/CustomMarker';
import { makeStyles } from '@material-ui/core/styles';
import { FormikProps } from 'formik';
import { TouchBackend } from 'react-dnd-touch-backend';
import Regions from './Regions';
import { DndProvider } from 'react-dnd';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    map: {
      width: '100%',
      height: 350,
    },
    mapBottom: {
      backgroundColor: 'rgba(0, 0, 0, 0.09)',
      height: 15,
      width: '100%',
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 4,
    },
    dnd: {
      paddingTop: 30,
    },
  })
);

function Map(formikProps: FormikProps<any>) {
  const { setFieldValue, values } = formikProps;
  const classes = useStyles();
  const kakao = (window as any).kakao;
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [map, setMap] = useState<any>();
  let overlays: any[] = [];

  const handleOpenSnackBar = (message: string) => {
    setMessage(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  const searchPlaces = (keyword: string) => {
    document.getElementById('standard-basic')?.blur();
    const ps = new kakao.maps.services.Places();

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
      handleOpenSnackBar('검색어를 입력해주세요.');
      return;
    }

    ps.keywordSearch(keyword, placesSearch);
  };

  const handleClick = (e: any) => {
    if (e.target.className?.split(' ').pop() === 'custom_marker_click') {
      const keywordInputEl = document.getElementById(
        'standard-basic'
      ) as HTMLInputElement;
      let bucketArray: IRouteRoutesRegion[] = values.regions;
      const region = JSON.parse(e.target.dataset.region) as IRouteRoutesRegion;
      const findRegion = values?.regions
        ?.filter((filterRegion: IRouteRoutesRegion) => {
          return filterRegion.id === region.id;
        })
        .pop();
      if (findRegion) {
        handleOpenSnackBar(`${region.place_name}은 이미 담겨있습니다.`);
        keywordInputEl.value = '';
        keywordInputEl.focus();
        return;
      }
      bucketArray.push(region);
      keywordInputEl.value = '';
      keywordInputEl.focus();
      handleOpenSnackBar(`${region.place_name}을 담았습니다.`);
      setFieldValue('regions', bucketArray);
    }
  };

  const placesSearch = (data: any, status: string) => {
    if (status === kakao.maps.services.Status.OK) {
      document.removeEventListener('click', handleClick);
      displayPlaces(data);
    }
  };

  const removeMarker = () => {
    for (let i = 0; i < overlays.length; i++) {
      overlays[i].setMap(null);
    }
    overlays = [];
  };

  const addMarker = (position: string, place: IRouteRoutesRegion) => {
    const content = renderToString(<CustomMarker region={place} />);
    const customOverlay = new kakao.maps.CustomOverlay({
      position: position,
      content: content,
    });
    customOverlay.setMap(map);
    overlays.push(customOverlay);
    return customOverlay;
  };

  const displayPlaces = (places: IRouteRoutesRegion[]) => {
    const bounds = new kakao.maps.LatLngBounds();
    removeMarker();
    places.forEach((place) => {
      const placePosition = new kakao.maps.LatLng(place.y, place.x);
      addMarker(placePosition, place);
      bounds.extend(placePosition);
    });
    (() => {
      document.addEventListener('click', handleClick);
    })();
    map.setBounds(bounds);
  };

  const loadMap = useCallback(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 4,
    };
    const map = new kakao.maps.Map(container, options);
    setMap(map);
  }, [kakao.maps.LatLng, kakao.maps.Map]);

  useEffect(() => {
    loadMap();
  }, [loadMap]);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        message={message}
      />
      <TextField
        id="standard-basic"
        label="검색어를 입력해주세요."
        style={{ width: '100%' }}
        variant={'filled'}
        onKeyPress={(e: any) => {
          const keyword = e.target.value;
          if (e.key === 'Enter') {
            searchPlaces(keyword);
          }
        }}
      />
      <div id={'map'} className={classes.map} />
      <div className={classes.mapBottom} />
      <DndProvider backend={TouchBackend}>
        <Regions {...formikProps} />
      </DndProvider>
    </>
  );
}

export default Map;
