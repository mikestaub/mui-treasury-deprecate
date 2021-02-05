import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';

import PeaButton from './PeaButton';
import PeaAvatar from './PeaAvatar';
import PeaGroupSelector from './PeaGroupSelector';

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
  followableGroups,
  followLoading,
  onCreateGroupClicked,
  onFollow,
}) => {
  const [followAnchorEl, setFollowAnchorEl] = useState(null);
  const followAriaId = followAnchorEl ? 'follow-popover' : undefined;
  const groupSelectorOpen = Boolean(followAnchorEl);

  const onFollowBtnClick = event => {
    setFollowAnchorEl(event.currentTarget);
  };

  const onFollowPopClose = () => {
    setFollowAnchorEl(null);
  };

  const handleOnFollow = async groupIds => {
    await onFollow(groupIds);
    onFollowPopClose();
  };

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
        <>
          <PeaButton
            variant={'contained'}
            color={'primary'}
            onClick={onFollowBtnClick}
            loading={followLoading}
            {...ButtonProps}
          >
            Follow
          </PeaButton>
          <Popover
            id={followAriaId}
            open={groupSelectorOpen}
            anchorEl={followAnchorEl}
            onClose={onFollowPopClose}
          >
            <PeaGroupSelector
              followButtonText={'Follow'}
              followableGroups={followableGroups}
              followLoading={followLoading}
              onCreateGroupClicked={onCreateGroupClicked}
              onSubmit={handleOnFollow}
            />
          </Popover>
        </>
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
  followableGroups: PropTypes.arrayOf(PropTypes.shape({})),
  onCreateGroupClicked: PropTypes.func,
  onFollow: PropTypes.func,
};
PeaPersonListItem.defaultProps = {
  ListItemProps: {},
  AvatarProps: {},
  ListItemTextProps: {},
  ButtonProps: {},
  isButtonShown: true,
  followableGroups: [],
  onCreateGroupClicked: () => {},
  onFollow: () => {},
};
PeaPersonListItem.metadata = {
  name: 'Pea Person List Item',
};
PeaPersonListItem.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default PeaPersonListItem;
