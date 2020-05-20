import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Popover, IconButton } from '@material-ui/core';

import PeaButton from './PeaButton';
import PeaIcon from './PeaIcon';
import PeaSwitch from './PeaSwitch';
import PeaLoadingSpinner from './PeaLoadingSpinner';
import PeaSocialAvatar from './PeaSocialAvatar';

const styles = ({ palette }) => ({
  heading: {
    color: palette.secondary.main,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
    marginTop: 20,
  },
  categoryHeading: {
    margin: '16px 0px',
    color: palette.grey[500],
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'left',
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
    overflow: 'hidden',
    overflowX: 'scroll',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar-thumb': {
      width: '0px',
      boxShadow: 'none',
      background: 'transparent',
    },
  },
  settingsHeading: {
    margin: '0px 0px 10px 0px',
    color: palette.secondary.main,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
  },
  loadMoreButton: {
    minHeight: '60px',
    minWidth: '60px',
  },
  loadMoreLabel: {
    margin: '16px 0px',
    color: palette.grey[500],
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'left',
  },
  socialButtons: {
    marginTop: '5px',
  },
});

const PeaConnections = ({
  classes,
  allowToConnect,
  followers,
  following,
  friends,
  interests,
  groups,
  onLinkSocial,
  loading,
  connectionsCount,
  onLoadMoreConnections,
}) => {
  const [connect, setConnect] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const rows = [
    {
      title: 'Followers',
      rowType: 'followers',
      data: followers,
    },
    {
      title: 'Following',
      rowType: 'following',
      data: following,
    },
    {
      title: 'Friends',
      rowType: 'friends',
      data: friends,
    },
    {
      title: 'Interests',
      rowType: 'interests',
      data: interests,
    },
    {
      title: 'Groups',
      rowType: 'groups',
      data: groups,
    },
  ];

  const socialMedias = [
    {
      provider: 'twitter',
      icon: 'fab fa-twitter',
    },
    {
      provider: 'facebook',
      icon: 'fab fa-facebook-f',
    },
    {
      provider: 'meetup',
      icon: 'fab fa-meetup',
    },
    {
      provider: 'linkedIn',
      icon: 'fab fa-linkedin',
    },
    {
      provider: 'snapchat',
      icon: 'fab fa-snapchat',
    },
  ];

  const settingsOpen = Boolean(anchorEl);
  const settingsPopoverId = settingsOpen ? 'settings-popover' : undefined;

  const onConnectionsSetting = event => {
    setAnchorEl(event.currentTarget);
  };

  const onSettingsClose = () => {
    setAnchorEl(null);
  };

  const onSocialClick = (provider, connect) => {
    setAnchorEl(null);
    onLinkSocial(provider, connect);
  };

  return (
    <Grid container>
      <Grid container alignItems="center" justify="space-between">
        <Typography className={classes.heading}>
          {allowToConnect ? 'Connections' : 'Mutual Connections'}
        </Typography>
        {loading ? (
          <PeaLoadingSpinner size={20} />
        ) : (
          <>
            {allowToConnect && (
              <IconButton
                aria-describedby={settingsPopoverId}
                onClick={onConnectionsSetting}
              >
                <PeaIcon
                  icon={'settings'}
                  color="secondary"
                  bgColor={'white'}
                  size={'small'}
                  shadow={false}
                />
              </IconButton>
            )}
          </>
        )}
      </Grid>

      {loading ? null : (
        <>
          {rows.map(({ title, rowType, data }) =>
            data.length ? (
              <Grid container direction="column">
                <Grid item>
                  <Typography className={classes.categoryHeading}>
                    {title}
                  </Typography>
                </Grid>

                <Grid container className={classes.gridList} spacing={2}>
                  {data.map(item => (
                    <Grid key={item.name} item>
                      <a
                        href={`https://${item.social}.com/${item.unique}`}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <PeaSocialAvatar {...item} />
                      </a>
                    </Grid>
                  ))}

                  {connectionsCount[rowType] === data.length ? null : (
                    <PeaButton
                      className={classes.loadMoreButton}
                      onClick={() => onLoadMoreConnections(rowType)}
                    >
                      <Typography className={classes.loadMoreLabel}>
                        Load more
                      </Typography>
                    </PeaButton>
                  )}
                </Grid>
              </Grid>
            ) : null,
          )}
        </>
      )}

      <Popover
        id={settingsPopoverId}
        open={settingsOpen}
        anchorEl={anchorEl}
        onClose={onSettingsClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            minHeight: 100,
            minWidth: 310,
            padding: 12,
          },
        }}
      >
        <Grid container direction="column">
          <Grid container alignItems="center" justify="space-between">
            <Typography className={classes.settingsHeading}>
              {connect ? 'Connect Account' : 'Disconnect Account'}
            </Typography>
            <PeaSwitch
              checked={connect}
              onChange={({ target }) => setConnect(target.checked)}
            />
          </Grid>

          <Grid className={classes.socialButtons} container spacing={3}>
            {socialMedias.map(({ provider, icon }) => (
              <Grid item>
                <PeaButton
                  onClick={() => onSocialClick(provider, connect)}
                  size="small"
                  color={connect ? 'secondary' : 'danger'}
                  icon={icon}
                  variant="contained"
                  shape="circular"
                  shadowless
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Popover>
    </Grid>
  );
};

PeaConnections.propTypes = {
  classes: PropTypes.shape({
    categoryHeading: PropTypes.string,
  }).isRequired,
  allowToConnect: PropTypes.bool,
  followers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      unique: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      social: PropTypes.string,
    }).isRequired,
  ),
  following: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      unique: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      social: PropTypes.string,
    }).isRequired,
  ),
  friends: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      unique: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      social: PropTypes.string,
    }).isRequired,
  ),
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      unique: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      social: PropTypes.string,
    }).isRequired,
  ),
  interests: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      unique: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      social: PropTypes.string,
    }).isRequired,
  ),
  onLinkSocial: PropTypes.func,
  connectionsCount: PropTypes.shape({
    followers: PropTypes.number.isRequired,
    following: PropTypes.number.isRequired,
    friends: PropTypes.number.isRequired,
    groups: PropTypes.number.isRequired,
    interests: PropTypes.number,
  }).isRequired,
  onLoadMoreConnections: PropTypes.func.isRequired,
};

PeaConnections.defaultProps = {
  followers: [],
  following: [],
  groups: [],
  interests: [],
};

PeaConnections.metadata = {
  name: 'Pea Connections',
};

PeaConnections.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default withStyles(styles, { name: 'PeaConnections' })(PeaConnections);
