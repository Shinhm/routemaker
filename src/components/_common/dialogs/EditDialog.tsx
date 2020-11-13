import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { IRouteRoutesPlace } from '../../../models/Route';
import { format } from 'date-fns';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface SimpleDialogProps {
  handleCloseDialog: () => void;
  handleConfirmDialog: (region: IRouteRoutesPlace, time: string) => void;
  region: IRouteRoutesPlace;
}

function EditDialog({
  handleCloseDialog,
  handleConfirmDialog,
  region,
}: SimpleDialogProps) {
  const [time, setTime] = useState(region.time || format(new Date(), 'HH:mm'));

  return (
    <Dialog
      open={true}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        <a href={region.place_url} target={'_blank'} rel="noreferrer">
          {region.place_name}
        </a>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <TextField
            id="time"
            label="방문예정시간"
            type="time"
            style={{ width: 200 }}
            defaultValue={region.time || format(new Date(), 'HH:mm')}
            onChange={(e) => {
              const time = e.target.value;
              setTime(time);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleCloseDialog}>
          취소
        </Button>
        <Button
          color="primary"
          onClick={() => handleConfirmDialog(region, time)}
        >
          수정
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditDialog;
