import React, { useCallback, useEffect, useState } from 'react';
import { createStyles, Snackbar, TextField, Theme } from '@material-ui/core';
import { IRouteRoutesPlace } from '../../models/Route';
import CustomMarker from '../_common/map/CustomMarker';
import { makeStyles } from '@material-ui/core/styles';
import { FormikProps } from 'formik';
import Regions from './Regions';
import { useParams } from 'react-router-dom';
import { EDIT_ENTRY } from '../../pages/trip/edit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    map: {
      width: '100%',
      height: 200,
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
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  })
);

enum SEARCH_TYPE {
  PLACES,
}

function Map(formikProps: FormikProps<any>) {
  const { setFieldValue, values } = formikProps;
  const classes = useStyles();
  const kakao = (window as any).kakao;
  const { edit }: { edit: string } = useParams();
  const [openMap, setOpenMap] = useState(edit === EDIT_ENTRY.write);
  const [message, setMessage] = useState('');
  const [pickRegion, setPickRegion] = useState<IRouteRoutesPlace>();
  const [open, setOpen] = useState(false);
  const [map, setMap] = useState<any>();
  const [markers, setMarkers] = useState<any[]>([]);

  const handleOpenSnackBar = (message: string) => {
    setMessage(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  const handleSearch = (keyword: string, type: SEARCH_TYPE) => {
    document.getElementById('standard-basic')?.blur();
    setOpenMap(true);

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
      handleOpenSnackBar('검색어를 입력해주세요.');
      return;
    }

    if (type && type === SEARCH_TYPE.PLACES) {
      searchGeoCoder(keyword);
    } else {
      searchPlaces(keyword);
    }
  };

  const searchPlaces = (keyword: string) => {
    const pc = new kakao.maps.services.Places();

    setPickRegion(undefined);
    pc.keywordSearch(keyword, placesSearch);
  };

  const searchGeoCoder = (keyword: string) => {
    const gc = new kakao.maps.services.Geocoder();

    setPickRegion(undefined);
    gc.addressSearch(keyword, placesSearch);
  };

  const handleSelect = (region: IRouteRoutesPlace) => {
    const keywordInputEl = document.getElementById(
      'standard-basic'
    ) as HTMLInputElement;
    let bucketArray: IRouteRoutesPlace[] = values.regions;

    const findRegion = values?.regions
      ?.filter((filterRegion: IRouteRoutesPlace) => {
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

    handleOpenSnackBar(`${region.place_name}을 담았습니다.`);
    keywordInputEl.value = '';
    keywordInputEl.focus();
    setFieldValue('regions', bucketArray);
  };

  const placesSearch = (data: any, status: string) => {
    if (status === kakao.maps.services.Status.OK) {
      displayPlaces(data);
    }
  };

  const removeMarker = useCallback(() => {
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    setMarkers([]);
  }, [markers]);

  const addMarker = (position: string, place: IRouteRoutesPlace) => {
    const marker = new kakao.maps.Marker({
      position: position,
    });
    marker.setMap(map);
    markers.push(marker);
    kakao.maps.event.addListener(marker, 'click', () => setPickRegion(place));
    return marker;
  };

  const displayPlaces = (places: IRouteRoutesPlace[]) => {
    const bounds = new kakao.maps.LatLngBounds();
    removeMarker();
    let markerArray: any[] = [];
    places.forEach((place) => {
      const placePosition = new kakao.maps.LatLng(place.y, place.x);
      markerArray.push(addMarker(placePosition, place));
      bounds.extend(placePosition);
    });
    setMarkers(markerArray);
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
    if (openMap) {
      loadMap();
    }
  }, [loadMap, openMap]);

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
        onClick={() => {
          setOpenMap(true);
        }}
        onKeyPress={(e: any) => {
          const keyword = e.target.value;
          if (e.key === 'Enter') {
            handleSearch(keyword, SEARCH_TYPE.PLACES);
          }
        }}
      />
      {openMap && <div id={'map'} className={classes.map} />}
      {pickRegion && (
        <CustomMarker region={pickRegion} handleSelect={handleSelect} />
      )}
      <div className={classes.mapBottom} />
      <Regions {...formikProps} />
    </>
  );
}

export default Map;
