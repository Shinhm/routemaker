import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import RegionCard from '../_common/items/RegionCard';
import { FormikProps } from 'formik';
import { IRouteRoutesRegion } from '../../models/Route';
import EditDialog from '../_common/dialogs/EditDialog';

function Regions({ setFieldValue, values }: FormikProps<any>) {
  const { regions } = values;
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(values.regions[0]);

  const handleOpenDialog = (region: IRouteRoutesRegion) => {
    setRegion(region);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleChangeCard = (region: IRouteRoutesRegion) => {
    findCard(region.id);
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
    const card = regions.filter((c: IRouteRoutesRegion) => `${c.id}` === id)[0];
    return {
      card,
      index: regions.indexOf(card),
    };
  };

  const [, drop] = useDrop({ accept: 'card' });

  return (
    <div ref={drop} style={{ width: 400 }}>
      {regions?.map((region: IRouteRoutesRegion) => (
        <RegionCard
          key={region.id}
          id={`${region.id}`}
          text={region.place_name}
          moveCard={moveCard}
          findCard={findCard}
          handleOpenDialog={() => handleOpenDialog(region)}
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
