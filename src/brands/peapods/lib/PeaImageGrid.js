import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  GridList,
  GridListTile,
  ListSubheader,
  Typography,
  Dialog,
} from '@material-ui/core';
import PeaLoadingSpinner from './PeaLoadingSpinner';
import PeaImageCarousel from './PeaImageCarousel';

const useStyles = makeStyles(({ palette, white, breakpoints }) => ({
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
    marginTop: 20,
    marginBottom: 10,
  },
  gridListTile: {
    transition: '200ms linear',
    '&:hover': {
      cursor: 'pointer',
      transform: 'scale(1.05)',
    },
    height: 150,
    [breakpoints.up('xs')]: {
      height: 130,
    },
    overflow: 'hidden',
    borderRadius: 10,
  },
  gridList: {
    width: '100%',
    height: 450,
    paddingBottom: '30px',
  },
  gridItem: {
    height: '100%',
    resize: 'cover',
  },
  loader: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function PeaImageGrid({ title, loading, feed }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const onGridItemOpen = itemIndex => {
    setOpenIndex(itemIndex);
    setOpen(true);
  };

  const carouselData = feed.map((post, index) => ({ id: index, image: post }));

  return (
    <div className={classes.root}>
      {loading ? (
        <div className={classes.loader}>
          <PeaLoadingSpinner size={20} />
        </div>
      ) : (
        <>
          {!!feed.length ? (
            <>
              <Typography className={classes.heading}>{title}</Typography>
              <GridList cols={3} cellHeight={130} className={classes.gridList}>
                {feed.map((post, index) => (
                  <GridListTile
                    onClick={() => onGridItemOpen(index)}
                    key={post}
                    className={classes.gridListTile}
                  >
                    <img
                      className={classes.gridItem}
                      src={post}
                      alt="instagram post"
                    />
                  </GridListTile>
                ))}
              </GridList>
              <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={'md'}
                aria-labelledby="instagram feed carousel"
                aria-describedby="instagram feed carousel"
              >
                <PeaImageCarousel
                  data={carouselData}
                  initialIndex={openIndex}
                />
              </Dialog>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

PeaImageGrid.propTypes = {
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  feed: PropTypes.arrayOf(PropTypes.string),
};

PeaImageGrid.defaultProps = {
  title: 'Instagram Activity',
  loading: true,
  feed: [],
};

export default PeaImageGrid;
