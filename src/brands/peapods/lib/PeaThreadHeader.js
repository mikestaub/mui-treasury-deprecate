import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

import PeaAvatar from './PeaAvatar';
import PeaText from './PeaTypography';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    padding: `${spacing(1)}px ${spacing(2)}px`,
    backgroundColor: ({ selected }) => selected && palette.primary.main,
    cursor: 'pointer',
  },
  flex: {
    flex: 1,
    marginLeft: spacing(2),
  },
  avatar: {
    width: 56,
    height: 56,
  },
  skeletonPrimary: {
    marginBottom: 4,
    marginTop: 0,
  },
  skeletonSecondary: {
    margin: 0,
  },
}));

const noop = () => false;

const PeaThreadHeader = ({
  avatar,
  title,
  subtitle,
  timestamp,
  selected,
  onClick,
  skeleton,
}) => {
  const classes = useStyles({ selected });
  if (skeleton) {
    return (
      <Grid
        container
        alignItems="center"
        className={classes.root}
        onClick={onClick}
      >
        <Grid item>
          <Skeleton variant="circle" width={56} height={56} />
        </Grid>

        <Grid item classes={{ item: classes.flex }}>
          <Skeleton
            variant="text"
            width={100 + Math.random() * 100}
            height={24}
            className={classes.skeletonPrimary}
          />
          <Skeleton
            variant="text"
            width={50 + Math.random() * 100}
            height={16}
            className={classes.skeletonSecondary}
          />
        </Grid>

        <Grid item>
          <Skeleton
            variant="text"
            width={100}
            height={16}
            className={classes.skeletonSecondary}
          />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid
      container
      alignItems="center"
      className={classes.root}
      onClick={onClick}
    >
      <Grid item>
        <PeaAvatar src={avatar} className={classes.avatar} />
      </Grid>

      <Grid item classes={{ item: classes.flex }}>
        <PeaText align={'left'} variant="subtitle2" weight={600}>
          {title}
        </PeaText>
        <PeaText align={'left'} variant="body2">
          {subtitle}
        </PeaText>
      </Grid>

      <Grid item>
        <PeaText align="right" variant="body2">
          {timestamp}
        </PeaText>
      </Grid>
    </Grid>
  );
};

PeaThreadHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};

PeaThreadHeader.defaultProps = {
  selected: false,
  onClick: noop,
  avatar: undefined,
};

PeaThreadHeader.metadata = {
  name: 'Pea thread header',
};

PeaThreadHeader.getTheme = () => ({
  'Mui{Component}': {
    // this object will be injected to 'overrides' section
    root: {},
    // ...
  },
});

export default PeaThreadHeader;
