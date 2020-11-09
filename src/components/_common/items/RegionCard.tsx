import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { createStyles, Grid, Paper, Theme } from '@material-ui/core';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

export interface CardProps {
  id: string;
  text: string;
  moveCard: (id: string, to: number) => void;
  findCard: (id: string) => { index: number };
  handleOpenDialog: () => void;
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
  moveCard,
  findCard,
  handleOpenDialog,
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
        <Grid item xs={8}>
          <div>{text}</div>
        </Grid>
        <Grid item xs={2}>
          <AddAlarmIcon onClick={handleOpenDialog} fontSize={'small'} />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default RegionCard;
