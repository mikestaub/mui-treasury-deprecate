import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';

import PeaButton from './PeaButton';
import PeaAvatar from './PeaAvatar';
import PeaIcon from './PeaIcon';
import Logo from './assets/peapods-logo-circle.svg';
import PeaLoadingSpinner from './PeaLoadingSpinner';
import PeaGroupSelector from './PeaGroupSelector';

const PeaNotificationItem = ({
  id,
  src,
  name,
  text,
  time,
  type,
  actions,
  unread,
  actionLoading,
  onAction,
  followableGroups,
  onCreateGroupClicked,
  needGroups,
}) => {
  const count = Array.isArray(src) ? src.length : 0;

  const [followAnchorEl, setFollowAnchorEl] = useState(null);

  const openFollowPopover = Boolean(followAnchorEl);
  const followAriaId = openFollowPopover ? 'follow-popover' : undefined;

  const stickers = {
    follow: 'person',
    pea_request: 'pea',
    pea_invite: 'pea',
    cancel: 'clear',
    accept: 'check',
    left: 'remove',
    followed: 'added',
    group: 'person',
  };

  const renderSticker = () => {
    if (!stickers[type]) return null;
    if (stickers[type] === 'pea') {
      return (
        <img src={Logo} alt="pea-invite" className={'MuiIcon-root -pea'} />
      );
    }
    return (
      <PeaIcon className={'-sticker'} shape={'circular'}>
        {stickers[type]}
      </PeaIcon>
    );
  };

  const onFollowBtnClick = actionId => event => {
    if (needGroups) {
      setFollowAnchorEl(event.currentTarget);
    } else {
      onAction({ id: actionId, type: 'accept' });
    }
  };

  const onFollowPopClose = () => {
    setFollowAnchorEl(null);
  };

  const handleOnFollow = actionId => async groupIds => {
    await onAction({ id: actionId, type: 'accept', groupIds });
    onFollowPopClose();
  };

  return (
    <ListItem className={cx('PeaNotificationItem-root', unread && '-unread')}>
      <Box position={'relative'}>
        {type === 'group' ? (
          <PeaAvatar.Group
            images={src.slice(0, 3)}
            more={count - 2}
            avatarProps={{ size: 'big' }}
            overlap={-32}
          />
        ) : (
          <PeaAvatar src={src} size={'big'} />
        )}
        {renderSticker()}
      </Box>
      <ListItemText
        classes={{
          primary: 'MuiListItemText-primary',
          secondary: 'MuiListItemText-secondary',
        }}
        primary={
          <span>
            <b>{type === 'group' ? name.slice(0, 2).join(', ') : name}</b>{' '}
            {text}
          </span>
        }
        primaryTypographyProps={{
          gutterBottom: true,
        }}
        secondary={time}
      />
      {actions && (
        <Grid
          container
          spacing={1}
          className={'PeaNotificationItem-actions'}
          justify={'flex-end'}
          wrap="nowrap"
        >
          <Grid item>
            <PeaButton
              className={'PeaButton-ignore'}
              size={'small'}
              onClick={() => onAction({ id, type: 'deny' })}
              disabled={actionLoading[id] && actionLoading[id].deny}
            >
              {actionLoading[id] && actionLoading[id].deny ? (
                <PeaLoadingSpinner size={20} style={{ margin: 0 }} />
              ) : (
                'Deny'
              )}
            </PeaButton>
          </Grid>
          <Grid item>
            <PeaButton
              size={'small'}
              elongated={false}
              variant={'contained'}
              color={'primary'}
              onClick={onFollowBtnClick(id)}
              disabled={actionLoading[id] && actionLoading[id].accept}
            >
              {actionLoading[id] && actionLoading[id].accept ? (
                <PeaLoadingSpinner size={20} style={{ margin: 0 }} />
              ) : (
                'Accept'
              )}
            </PeaButton>

            {needGroups && (
              <Popover
                id={followAriaId}
                open={openFollowPopover}
                anchorEl={followAnchorEl}
                onClose={onFollowPopClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <PeaGroupSelector
                  followButtonText={'Accept'}
                  followableGroups={followableGroups}
                  followLoading={actionLoading[id] && actionLoading[id].accept}
                  onCreateGroupClicked={onCreateGroupClicked}
                  onSubmit={handleOnFollow(id)}
                />
              </Popover>
            )}
          </Grid>
        </Grid>
      )}
    </ListItem>
  );
};

PeaNotificationItem.propTypes = {
  id: PropTypes.string.isRequired,
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  type: PropTypes.oneOf([
    'follow',
    'pea_invite',
    'pea_request',
    'cancel',
    'accept',
    'left',
    'followed',
    'group',
  ]).isRequired,
  time: PropTypes.string.isRequired,
  actions: PropTypes.bool,
  unread: PropTypes.bool,
  actionLoading: PropTypes.shape({}),
  onAction: PropTypes.func,
  followableGroups: PropTypes.arrayOf({}),
  onCreateGroupClicked: PropTypes.func,
  needGroups: PropTypes.bool,
};

PeaNotificationItem.defaultProps = {
  actions: false,
  unread: false,
  actionLoading: {},
  onAction: () => {},
  onCreateGroupClicked: () => {},
  followableGroups: [],
  needGroups: false,
};

PeaNotificationItem.metadata = {
  name: 'Pea Notification Item',
};

PeaNotificationItem.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default PeaNotificationItem;
