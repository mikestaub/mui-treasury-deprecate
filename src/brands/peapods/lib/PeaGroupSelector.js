import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { pickBy } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import PeaButton from './PeaButton';
import PeaCategoryToggle from './PeaCategoryToggle';

const useStyles = makeStyles(theme => ({
  followPopover: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  followGroupContainer: {
    display: 'flex',
    minWidth: 400,
    maxWidth: 400,
    maxHeight: 250,
    overflowY: 'auto',
    marginBottom: theme.spacing(2),
  },
  followButton: {
    width: 160,
  },
  createGroupButton: {
    width: 200,
  },
}));

const PeaGroupSelector = ({
  followButtonText,
  followableGroups,
  followLoading,
  onCreateGroupClicked,
  onSubmit,
  showFollowBack,
}) => {
  const classes = useStyles();

  const [followDisabled, setFollowDisabled] = useState(true);
  const [checkedFollowGroup, setCheckedFollowGroup] = useState({});

  const onFollowGroupChange = id => () => {
    const followGroups = {
      ...checkedFollowGroup,
      [id]: !checkedFollowGroup[id],
    };
    setCheckedFollowGroup(followGroups);
    const hasOneChecked = !!Object.keys(pickBy(followGroups)).length;
    setFollowDisabled(!hasOneChecked);
  };

  useEffect(() => {
    // TODO: this is brittle
    const validValues = ['Delete Request', 'Unfollow'];

    const value = !validValues.includes(followButtonText);

    setFollowDisabled(value);
  }, [followButtonText, setFollowDisabled]);

  const onFollowByGroupIds = followBack => async () => {
    const groupIds = Object.keys(checkedFollowGroup).filter(
      key => checkedFollowGroup[key],
    );
    onSubmit({ groupIds, followBack });
  };

  useEffect(() => setCheckedFollowGroup({}), []);

  return (
    <Paper className={classes.followPopover}>
      {!!followableGroups.length && (
        <Grid container spacing={1} className={classes.followGroupContainer}>
          {followableGroups.map(({ id, name: groupName, profilePhoto }) => (
            <Grid item key={id} xs={12}>
              <PeaCategoryToggle
                isHorizontal
                label={groupName}
                src={profilePhoto}
                checked={checkedFollowGroup[id]}
                onChange={onFollowGroupChange(id)}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Grid container alignItems="center" justify="center">
              <PeaButton
                className={classes.createGroupButton}
                variant={'contained'}
                color={'primary'}
                size={'small'}
                onClick={onCreateGroupClicked}
              >
                Create Personal Group
              </PeaButton>
            </Grid>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={2} justify="center">
        {!followableGroups.length && followDisabled && (
          <Grid item>
            <PeaButton
              className={classes.createGroupButton}
              variant={'contained'}
              color={'primary'}
              size={'small'}
              onClick={onCreateGroupClicked}
            >
              Create Personal Group
            </PeaButton>
          </Grid>
        )}

        <Grid item>
          <PeaButton
            className={classes.followButton}
            disabled={followDisabled}
            variant={'contained'}
            color={'primary'}
            size={'small'}
            loading={followLoading}
            onClick={onFollowByGroupIds(false)}
          >
            {followButtonText}
          </PeaButton>
        </Grid>

        {showFollowBack && (
          <Grid item>
            <PeaButton
              className={classes.followButton}
              disabled={followDisabled}
              variant={'contained'}
              color={'primary'}
              size={'small'}
              loading={followLoading}
              onClick={onFollowByGroupIds(true)}
            >
              Accept and Follow
            </PeaButton>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

PeaGroupSelector.propTypes = {
  followButtonText: PropTypes.string,
  followableGroups: PropTypes.arrayOf({}),
  followLoading: PropTypes.bool,
  onCreateGroupClicked: PropTypes.func,
  onSubmit: PropTypes.func,
  showFollowBack: PropTypes.bool,
};

PeaGroupSelector.defaultProps = {
  followButtonText: 'Follow',
  followableGroups: [],
  followLoading: false,
  onCreateGroupClicked: () => {},
  onSubmit: () => {},
  showFollowBack: false,
};

export default memo(PeaGroupSelector);
