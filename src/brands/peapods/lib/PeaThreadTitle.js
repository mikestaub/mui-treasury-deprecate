import React, { memo } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import PeaAvatar from './PeaAvatar';
import PeaText from './PeaTypography';
import PeaButton from './PeaButton';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    position: 'relative',
    textAlign: 'center',
  },
  avatar: {
    justifyContent: 'center',
  },
  status: {
    color: '#A4A4A4',
  },
  textContainer: {
    paddingTop: spacing(3),
    paddingBottom: spacing(3),
  },
  title: {
    lineHeight: 1,
  },
  avatarGroupContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: spacing(2),
  },
}));

const PeaThreadTitle = ({
  title,
  subtitle,
  avatars,
  isPeasShown,
  showPeas,
}) => {
  const classes = useStyles();

  const maxAvatarCount = 5;

  return (
    <Grid container classes={{ container: classes.root }}>
      <Grid item xs={12}>
        <div className={classes.textContainer}>
          <PeaText
            variant="h6"
            className={classes.title}
            color="secondary"
            weight="bold"
          >
            {title}
          </PeaText>

          <PeaText variant="caption" className={classes.status}>
            {subtitle}
          </PeaText>
        </div>

        <div className={classes.avatarGroupContainer}>
          <PeaAvatar.Group
            images={avatars.slice(0, maxAvatarCount)}
            className={classes.avatar}
            more={
              avatars.length > maxAvatarCount
                ? avatars.length - maxAvatarCount
                : undefined
            }
          />
          {title &&
            (isPeasShown ? (
              <PeaButton
                variant="contained"
                color="secondary"
                icon="fas fa-arrow-left"
                size="small"
                onClick={showPeas}
              >
                Back
              </PeaButton>
            ) : (
              <PeaButton
                variant="contained"
                color="secondary"
                size="small"
                onClick={showPeas}
              >
                View Peas
              </PeaButton>
            ))}
        </div>
      </Grid>
    </Grid>
  );
};

PeaThreadTitle.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  avatars: PropTypes.arrayOf(PropTypes.string),
  isPeasShown: PropTypes.bool,
  showPeas: PropTypes.func,
};

PeaThreadTitle.defaultProps = {
  title: 'Unknown',
  subtitle: 'unknown',
  avatars: [],
  isPeasShown: false,
  showPeas: () => {},
};

PeaThreadTitle.metadata = {
  name: 'Thread title',
  description: '',
};

export default memo(PeaThreadTitle);
