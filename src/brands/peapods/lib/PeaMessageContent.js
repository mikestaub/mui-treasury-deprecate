import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

import PeaAvatar from './PeaAvatar';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    padding: spacing(1),
    alignItems: 'center',
    justifyContent: ({ isCurrentUser }) =>
      isCurrentUser ? 'flex-end' : 'flex-start',
  },
  contentContainer: {
    marginLeft: spacing(1),
  },
  name: {
    fontSize: 12,
  },
  content: {
    padding: spacing(1),
    backgroundColor: palette.secondary.main,
    color: palette.common.white,
    borderRadius: 12,
  },
}));

const PeaMessageContent = ({ name, profilePhoto, content, isCurrentUser }) => {
  const classes = useStyles({ isCurrentUser });

  return (
    <Grid container className={classes.root}>
      {isCurrentUser ? (
        <Typography className={classes.content}>{content}</Typography>
      ) : (
        <>
          <PeaAvatar src={profilePhoto} />
          <Grid className={classes.contentContainer}>
            <Typography className={classes.name}>{name}</Typography>
            <Typography className={classes.content}>{content}</Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
};

PeaMessageContent.propTypes = {
  name: PropTypes.string,
  content: PropTypes.string,
  profilePhoto: PropTypes.string,
  isCurrentUser: PropTypes.bool,
};

PeaMessageContent.defaultProps = {
  name: undefined,
  content: undefined,
  profilePhoto: undefined,
  isCurrentUser: false,
};

PeaMessageContent.metadata = {
  name: 'Pea Message content',
};

export default PeaMessageContent;
