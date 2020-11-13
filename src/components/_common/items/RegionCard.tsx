import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { createStyles, Grid, Paper, Theme } from '@material-ui/core';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import { makeStyles } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import clsx from 'clsx';

export interface CardProps {
  id: string;
  text: string;
  time?: string;
  placeUrl?: string;
  moveCard: (id: string, to: number) => void;
  findCard: (id: string) => { index: number };
  handleOpenDialog: () => void;
  handleRemove: (id: string) => void;
}

interface Item {
  type: string;
  id: string;
  originalIndex: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 30,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    isDragging: {
      borderColor: 'rgba(0, 0, 0, 0.09)',
    },
  })
);

function RegionCard({
  id,
  text,
  time,
  placeUrl,
  moveCard,
  findCard,
  handleOpenDialog,
  handleRemove,
}: CardProps) {
  const classes = useStyles();
  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'card', id, originalIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (dropResult, monitor) => {
      const { id: droppedId, originalIndex } = monitor.getItem();
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        moveCard(droppedId, originalIndex);
      }
    },
  });

  const [, drop] = useDrop({
    accept: 'card',
    canDrop: () => false,
    hover({ id: draggedId }: Item) {
      console.log(id);
      if (draggedId !== id) {
        const { index: overIndex } = findCard(id);
        moveCard(draggedId, overIndex);
      }
    },
  });

  return (
    <Paper
      className={clsx(classes.root, {
        [classes.isDragging]: isDragging,
      })}
      elevation={isDragging ? 4 : 1}
    >
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <span ref={(node) => drag(drop(node))}>
            <SwapVertIcon fontSize={'small'} />
          </span>
        </Grid>
        <Grid item xs={7}>
          <div>
            <a href={placeUrl} target={'_blank'} rel="noreferrer">
              {text}
            </a>{' '}
            {time && `(${time} 방문예정)`}
          </div>
        </Grid>
        <Grid item xs={3}>
          <AddAlarmIcon
            style={{ marginRight: 10 }}
            onClick={handleOpenDialog}
            fontSize={'small'}
          />
          <DeleteForeverIcon
            onClick={() => handleRemove(id)}
            fontSize={'small'}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default RegionCard;
