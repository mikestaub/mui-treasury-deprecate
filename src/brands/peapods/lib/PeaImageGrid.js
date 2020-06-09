import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  GridList,
  GridListTile,
  ListSubheader,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(({ palette, white }) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: white,
  },
  heading: {
    color: palette.secondary.main,
    width: '100%',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
    marginBottom: '20px',
  },
  gridList: {
    width: 500,
    height: 450,
  },
  gridItem: {
    borderRadius: 5,
  },
}));

function PeaImageGrid({ title, images }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.heading}>{title}</Typography>
      <GridList cellHeight={180} className={classes.gridList}>
        {images.map(tile => (
          <GridListTile key={tile.img}>
            <img className={classes.gridItem} src={tile.img} alt={tile.alt} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

export default PeaImageGrid;
