import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import React from 'react';

interface IConformDialogProps {
  handleClose: () => void;
  handleConfirm: () => void;
}

function ConfirmDialog({ handleClose, handleConfirm }: IConformDialogProps) {
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          정말 삭제하시겠습니까?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          아니오
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          예
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
