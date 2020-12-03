import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';

interface ISimpleDialogProps {
  handleClose: () => void;
  message: string;
}

function SimpleDialog({ handleClose, message }: ISimpleDialogProps) {
  return ReactDOM.createPortal(
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <DialogContent dividers>
        <Typography gutterBottom>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          닫기
        </Button>
      </DialogActions>
    </Dialog>,
    document.body
  );
}

export default SimpleDialog;
