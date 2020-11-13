import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import RegionCard from '../_common/items/RegionCard';
import { FormikProps } from 'formik';
import { IRouteRoutesPlace } from '../../models/Route';
import EditDialog from '../_common/dialogs/EditDialog';

function Regions({ setFieldValue, values }: FormikProps<any>) {
  const { regions } = values;
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(values.regions[0]);

  const handleOpenDialog = (region: IRouteRoutesPlace) => {
    setRegion(region);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleChangeCard = (region: IRouteRoutesPlace, time: string) => {
    const reMakeRegions = values.regions.map(
      (valueRegion: IRouteRoutesPlace) => {
        if (valueRegion.id === region.id) {
          return {
            ...valueRegion,
            time,
          };
        }
        return valueRegion;
      }
    );
    setFieldValue('regions', reMakeRegions);
    handleCloseDialog();
  };

  const handleRemoveRegion = (id: string) => {
    if (window.confirm(`정말 삭제하시겠습니까?`)) {
      const filterRegions = values.regions.filter(
        (regionFilter: IRouteRoutesPlace) => {
          return regionFilter.id !== id;
        }
      );
      setFieldValue('regions', filterRegions);
    }
  };

  const moveCard = (id: string, atIndex: number) => {
    const { card, index } = findCard(id);
    setFieldValue(
      'regions',
      update(regions, {
        $splice: [
          [index, 1],
          [atIndex, 0, card],
        ],
      })
    );
  };

  const findCard = (id: string) => {
    const card = regions.filter((c: IRouteRoutesPlace) => `${c.id}` === id)[0];
    return {
      card,
      index: regions.indexOf(card),
    };
  };

  const [, drop] = useDrop({ accept: 'card' });

  return (
    <div ref={drop} style={{ width: 400 }}>
      {regions?.map((region: IRouteRoutesPlace, index: number) => (
        <RegionCard
          key={index}
          id={index.toString()}
          time={region.time}
          placeUrl={region.place_url}
          text={region.place_name}
          moveCard={moveCard}
          findCard={findCard}
          handleOpenDialog={() => handleOpenDialog(region)}
          handleRemove={handleRemoveRegion}
        />
      ))}
      {open && (
        <EditDialog
          region={region}
          handleCloseDialog={handleCloseDialog}
          handleConfirmDialog={handleChangeCard}
        />
      )}
    </div>
  );
}

export default Regions;
