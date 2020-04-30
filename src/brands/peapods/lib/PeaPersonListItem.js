import React from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import PeaButton from './PeaButton';
import PeaAvatar from './PeaAvatar';

const useStyles = makeStyles(() => ({
  skeletonRoot: {
    padding: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonName: {
    marginBottom: 4,
    marginTop: 0,
  },
  skeletonUserName: {
    margin: 0,
  },
  skeletonBtn: {
    borderRadius: 24,
  },
}));

const PeaPersonListItem = ({
  src,
  name,
  tag,
  onClick,
  ListItemProps,
  AvatarProps,
  ListItemTextProps,
  ButtonProps,
  isButtonShown,
  loading,
}) => {
  const classes = useStyles();

  if (loading) {
    return (
      <Grid className={classes.skeletonRoot}>
        <Skeleton variant="circle" width={40} height={40} />
        <Grid>
          <Skeleton
            variant="text"
            width={100}
            height={24}
            className={classes.skeletonName}
          />
          <Skeleton
            variant="text"
            width={60}
            height={16}
            className={classes.skeletonUserName}
          />
        </Grid>
        <Skeleton
          variant="rect"
          width={80}
          height={32}
          className={classes.skeletonBtn}
        />
      </Grid>
    );
  }
  return (
    <ListItem {...ListItemProps} onClick={!isButtonShown ? onClick : null}>
      <PeaAvatar src={src} {...AvatarProps} />
      <ListItemText
        primaryTypographyProps={{ noWrap: true }}
        secondaryTypographyProps={{ noWrap: true }}
        primary={name}
        secondary={tag}
        {...ListItemTextProps}
      />
      {isButtonShown && (
        <PeaButton
          variant={'contained'}
          color={'primary'}
          onClick={onClick}
          {...ButtonProps}
        >
          Follow
        </PeaButton>
      )}
    </ListItem>
  );
};

PeaPersonListItem.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  ListItemProps: PropTypes.shape({}),
  AvatarProps: PropTypes.shape({}),
  ListItemTextProps: PropTypes.shape({}),
  ButtonProps: PropTypes.shape({}),
  isButtonShown: PropTypes.bool,
  loading: PropTypes.bool,
};
PeaPersonListItem.defaultProps = {
  ListItemProps: {},
  AvatarProps: {},
  ListItemTextProps: {},
  ButtonProps: {},
  isButtonShown: true,
  loading: false,
};
PeaPersonListItem.metadata = {
  name: 'Pea Person List Item',
};
PeaPersonListItem.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default PeaPersonListItem;
