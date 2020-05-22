import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import PeaAvatar from './PeaAvatar';

const useStyles = makeStyles(({ palette, spacing }) => {
  const radius = spacing(2.5);

  return {
    root: {
      alignItems: 'center',
      justifyContent: ({ isCurrentUser }) =>
        isCurrentUser ? 'flex-end' : 'flex-start',
    },
    avatar: {
      position: 'absolute',
    },
    contentContainer: {
      marginLeft: ({ isCurrentUser }) =>
        isCurrentUser ? `0` : `${spacing(6)}px`,
      marginRight: ({ isCurrentUser }) =>
        isCurrentUser ? `${spacing(2)}px` : `0`,
    },
    name: {
      fontSize: 12,
    },
    content: {
      padding: spacing(1, 2, 1.25),
      borderRadius: 4,
      marginBottom: 4,
      display: 'inline-block',
      wordBreak: 'break-word',
    },
    left: {
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      backgroundColor: palette.grey[100],
    },
    right: {
      borderTopLeftRadius: radius,
      borderBottomLeftRadius: radius,
      backgroundColor: palette.secondary.main,
      color: palette.common.white,
    },
    leftFirst: {
      borderTopLeftRadius: radius,
    },
    leftLast: {
      borderBottomLeftRadius: radius,
    },
    rightFirst: {
      borderTopRightRadius: radius,
    },
    rightLast: {
      borderBottomRightRadius: radius,
    },
    skeleton: {
      borderRadius: 16,
      margin: '8px 0',
      backgroundColor: palette.grey[100],
    },
  };
});

const PeaMessageContent = ({
  name,
  profilePhoto,
  content,
  isCurrentUser,
  showAvatar,
  isFirst,
  isLast,
  skeleton,
}) => {
  const classes = useStyles({ isCurrentUser });

  const side = isCurrentUser ? 'right' : 'left';

  const attachClass = () => {
    let classString = '';

    if (isFirst) {
      classString += ` ${classes[`${side}First`]}`;
    }
    if (isLast) {
      classString += ` ${classes[`${side}Last`]}`;
    }

    return classString;
  };

  if (skeleton) {
    return (
      <Grid container className={classes.root}>
        <Skeleton
          variant="rect"
          width={100 + Math.random() * 100}
          height={50 + Math.random() * 50}
          className={`${classes.skeleton} ${classes[side]} ${attachClass()}`}
        />
      </Grid>
    );
  }

  return (
    <Grid container className={classes.root}>
      {isCurrentUser ? (
        <Grid className={classes.contentContainer}>
          <Typography
            variant={'body2'}
            className={`${classes.content} ${classes[side]} ${attachClass()}`}
          >
            {content}
          </Typography>
        </Grid>
      ) : (
        <>
          {showAvatar && (
            <PeaAvatar className={classes.avatar} src={profilePhoto} />
          )}

          <Grid className={classes.contentContainer}>
            {showAvatar && (
              <Typography className={classes.name}>{name}</Typography>
            )}

            <Typography
              variant={'body2'}
              className={`${classes.content} ${classes[side]} ${attachClass()}`}
            >
              {content}
            </Typography>
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
  showAvatar: PropTypes.bool,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
};

PeaMessageContent.defaultProps = {
  name: undefined,
  content: undefined,
  profilePhoto: undefined,
  isCurrentUser: false,
  showAvatar: false,
  isLast: false,
  isFirst: false,
};

PeaMessageContent.metadata = {
  name: 'Pea Message content',
};

export default PeaMessageContent;
