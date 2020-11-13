import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Slide,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { IRouteRoutesPlace } from '../../../models/Route';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AmountDialogProps {
  handleClose: () => void;
  handleConfirm: (region: IRouteRoutesPlace, amount: string) => void;
  region: IRouteRoutesPlace;
}

function AmountDialog({
  handleClose,
  handleConfirm,
  region,
}: AmountDialogProps) {
  const [amount, setAmount] = useState(region.amount || '');

  return (
    <Dialog
      open={true}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <FormControl fullWidth>
            <InputLabel htmlFor="budget">
              {region.place_name} 사용금액
            </InputLabel>
            <Input
              id="budget"
              type={'number'}
              defaultValue={region.amount}
              onChange={(e) => {
                const amount = e.target.value;
                setAmount(amount);
              }}
              startAdornment={
                <InputAdornment position="start">₩</InputAdornment>
              }
            />
          </FormControl>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          취소
        </Button>
        <Button color="primary" onClick={() => handleConfirm(region, amount)}>
          수정
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AmountDialog;
