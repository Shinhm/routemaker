import React, { useState } from 'react';
import RegionCard from '../_common/items/RegionCard';
import { FormikProps } from 'formik';
import { IRouteRoutesPlace } from '../../models/Route';
import EditDialog from '../_common/dialogs/EditDialog';
import ConfirmDialog from '../_common/dialogs/ConfirmDialog';

function Regions({ setFieldValue, values }: FormikProps<any>) {
  const { regions } = values;
  const [open, setOpen] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [region, setRegion] = useState(values.regions[0]);
  const [removeRegionId, setRemoveRegionId] = useState<string>();

  const handleOpenRemoveDialog = (id: string) => {
    setRemoveRegionId(id);
    setOpenRemoveDialog(true);
  };

  const handleCloseRemoveDialog = () => {
    setOpenRemoveDialog(false);
  };

  const handleOpenDialog = (region: IRouteRoutesPlace) => {
    setRegion(region);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleChangeCard = (region: IRouteRoutesPlace, time: string) => {
    const reMakeRegions = values.regions
      .map((valueRegion: IRouteRoutesPlace) => {
        if (valueRegion.id === region.id) {
          return {
            ...valueRegion,
            time,
          };
        }
        return valueRegion;
      })
      .sort((a: IRouteRoutesPlace, b: IRouteRoutesPlace) => {
        console.log(a.time, b.time);
        if (a.time && b.time) {
          return (
            parseInt(a.time.replace(':', '')) -
            parseInt(b.time.replace(':', ''))
          );
        }
      });
    setFieldValue('regions', reMakeRegions);
    handleCloseDialog();
  };

  const handleRemoveRegion = () => {
    if (!removeRegionId) {
      return alert('삭제할 대상이 없습니다.');
    }
    const filterRegions = values.regions.filter(
      (regionFilter: IRouteRoutesPlace) => {
        console.log(removeRegionId, regionFilter.id);
        return regionFilter.id !== removeRegionId;
      }
    );
    setFieldValue('regions', filterRegions);
    handleCloseRemoveDialog();
  };

  return (
    <div style={{ width: '100%' }}>
      {regions?.map((region: IRouteRoutesPlace, index: number) => (
        <RegionCard
          key={index}
          id={index.toString()}
          time={region.time}
          placeUrl={region.place_url}
          text={region.place_name}
          handleOpenDialog={() => handleOpenDialog(region)}
          handleOpenRemoveDialog={handleOpenRemoveDialog}
        />
      ))}
      {open && (
        <EditDialog
          region={region}
          handleCloseDialog={handleCloseDialog}
          handleConfirmDialog={handleChangeCard}
        />
      )}
      {openRemoveDialog && (
        <ConfirmDialog
          handleClose={handleCloseRemoveDialog}
          handleConfirm={handleRemoveRegion}
        />
      )}
    </div>
  );
}

export default Regions;
