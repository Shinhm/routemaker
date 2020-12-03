import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';

interface IConformDialogProps {
  handleClose?: () => void;
  handleConfirm?: () => void;
  confirmText?: string;
  closeText?: string;
  message: string;
}

function ConfirmDialog({
  handleClose,
  handleConfirm,
  confirmText,
  closeText,
  message,
}: IConformDialogProps) {
  return ReactDOM.createPortal(
    <Dialog
      open={true}
      onClose={handleClose}
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      {(handleClose || handleConfirm) && (
        <DialogActions>
          {handleClose && (
            <Button onClick={handleClose} color="primary">
              {closeText || '아니오'}
            </Button>
          )}
          {handleConfirm && (
            <Button onClick={handleConfirm} color="primary" autoFocus>
              {confirmText || '예'}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>,
    document.body
  );
}

export default ConfirmDialog;
