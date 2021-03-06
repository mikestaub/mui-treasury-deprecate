/* eslint-disable react/forbid-prop-types */

import React, { memo, useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import { useScroll } from 'react-use';

import PeaButton from './PeaButton';
import PeaIcon from './PeaIcon';
import PeaAvatar from './PeaAvatar';
import PeaStatistic from './PeaStatistic';
import PeaText from './PeaTypography';
import PeaTag from './PeaTag';
import PeaProfileEditor from './PeaProfileEditor';
import PeaUserSettings from './PeaUserSettings';
import PeaConfirmation from './PeaConfirmation';
import PeaInvitationDialog from './PeaInvitationDialog';
import PeaSwipeableTabs from './PeaSwipeableTabs';
import PeaGroupSelector from './PeaGroupSelector';

const AVATAR_SCROLL_FACTOR = 0.0055;

const useStyles = makeStyles(() => ({
  scrollHeader: {
    display: 'flex',
    alignItems: 'center',
    height: 60,
    boxShadow: '3px 1px 20px rgba(0,0,0,0.2)',
    padding: '0 10px',
    position: 'sticky',
    top: 0,
    width: '100%',
    zIndex: 10,
    background: '#fff',
    transform: 'translateY(-100px)',
    transition: 'transform .5s',
  },
  backBox: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  topAvatar: {
    margin: '0 5px',
    marginLeft: 22,
    marginRight: 22,
  },
}));

const PeaAccountProfile = ({
  isCurrentUser,
  cover,
  image,
  name,
  userName,
  email,
  phoneNumber,
  bio,
  location,
  locationInput,
  birthday,
  gender,
  pods,
  invitableGroups,
  followableGroups,
  tags,
  podsCount,
  groupsCount,
  reputation,
  followersCount,
  followingCount,
  isPrivate,
  eventList,
  groupList,
  podList,
  followingList,
  followersList,
  onChange,
  onSubmit,
  editing,
  isUpdating,
  isDeleting,
  setEditing,
  loadingInvitableList,
  invitingIds,
  invitedIds,
  followLoading,
  currentUserFollowing,
  followerState,
  acceptFollowLoading,
  onChangeCoverPhotoClicked,
  onChangeProfilePhotosClicked,
  onAcceptFollowRequest,
  deleteProfile,
  onInvitePod,
  onInviteGroup,
  onInviteClicked,
  onCreateGroupClicked,
  onFollow,
  onReport,
  isMobile,
  activeTabIndex,
  onTabChange,
  onLinkSocial,
  onChangeAccountStatus,
  onChangeSettings,
  onLogout,
}) => {
  const classes = useStyles();

  const [anchorEl, setAnchor] = useState(null);
  const [followAnchorEl, setFollowAnchorEl] = useState(null);
  const [delModalOpen, setDelModalOpen] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [followButtonText, setFollowButtonText] = useState('Follow');
  const [confirmText, setConfirmText] = useState('Follow');
  const [tabIndex, setTabIndex] = useState(0);

  const scrollRef = useRef();
  const hostingRef = useRef();
  const podsRef = useRef();
  const aboutRef = useRef();
  const groupsRef = useRef();
  const followersRef = useRef();
  const followingRef = useRef();

  const tabs = [
    {
      id: 'profile-tab-about',
      ref: aboutRef,
      label: 'About',
      count: undefined,
    },
    { id: 'profile-tab-pods', ref: podsRef, label: 'Pods', count: podsCount },
    {
      id: 'profile-tab-groups',
      ref: groupsRef,
      label: 'Groups',
      count: groupsCount,
    },
    {
      id: 'profile-tab-followers',
      ref: followersRef,
      label: 'Followers',
      count: followersCount,
    },
    {
      id: 'profile-tab-following',
      ref: followingRef,
      label: 'Following',
      count: followingCount,
    },
  ];

  const isFollower = followerState === 'FOLLOWING';
  const followerRequested = followerState === 'PENDING_APPROVAL';

  const isFollowing = currentUserFollowing === 'FOLLOWING';
  const followRequested = currentUserFollowing === 'PENDING_APPROVAL';

  const needsGroups = !isFollowing && !followRequested;

  const open = Boolean(anchorEl);
  const groupSelectorOpen = Boolean(followAnchorEl) && needsGroups;
  const followAriaId = followAnchorEl ? 'follow-popover' : undefined;
  const followBtnDisabled = followLoading;

  const { y } = useScroll(scrollRef);

  let avatarScale = 1;
  let showTopBar = false;

  avatarScale = 1 - y * AVATAR_SCROLL_FACTOR;

  if (avatarScale < 0.31) {
    avatarScale = 0.31;
    showTopBar = true;
  }

  const updateFollowButtonText = useCallback(() => {
    let value = isFollowing ? 'Following' : 'Follow';

    if (followRequested) {
      value = 'Follow Requested';
    }

    setFollowButtonText(value);
  }, [setFollowButtonText, isFollowing, followRequested]);

  useEffect(updateFollowButtonText, [currentUserFollowing]);

  const scrollToTop = () => (scrollRef.current.scrollTop = 0);

  const onMouseOver = () => {
    if (!currentUserFollowing) {
      setConfirmText('Follow');
      return;
    }

    const text =
      currentUserFollowing === 'FOLLOWING' ? 'Unfollow' : 'Delete Request';

    setFollowButtonText(text);
    setConfirmText(text);
  };

  const onMouseOut = () => {
    if (followAnchorEl) {
      setTimeout(updateFollowButtonText, 200);
    } else {
      updateFollowButtonText();
    }
  };

  const onReportClick = () => {
    setAnchor(null);
    onReport();
  };

  const onActivateClick = () => {
    setAnchor(null);
    onChangeAccountStatus({ accountStatus: 'ACTIVE' });
  };

  // const onAccountBanClick = () => {
  //   setAnchor(null);
  //   // TODO: display Account Ban Form
  // };

  const onInviteClick = () => {
    if (onInviteClicked) {
      onInviteClicked();
    }
    setOpenInviteDialog(true);
  };

  const onFollowPopClose = () => {
    setFollowAnchorEl(null);
  };

  const handleOnFollow = async (groupIds) => {
    await onFollow(groupIds);
    onFollowPopClose();
  };

  const onFollowBtnClick = (event) => {
    if (needsGroups) {
      setFollowAnchorEl(event.currentTarget);
    } else {
      handleOnFollow({});
    }
  };

  const onNotificationsChange = (enabled) => {
    onChangeSettings({
      pushNotificationsDisabled: enabled ? !!enabled : null,
    });
  };

  const onReceiveEmailChange = (enabled) => {
    onChangeSettings({
      emailNotificationsDisabled: enabled ? !!enabled : null,
    });
  };

  const onContactSupport = () => {
    const supportEmail = 'support@peapods.com';
    window.open(`mailto:${supportEmail}`);
  };

  const onScroll = useCallback(
    (e) => {
      const content = scrollRef.current;

      const offset = content.scrollHeight - content.clientHeight;
      const shouldUpdateTab = content.scrollTop >= offset;

      const { ref } = tabs[tabIndex];

      ref.current.style.overflow = shouldUpdateTab ? 'auto' : 'hidden';
    },
    [tabIndex, tabs],
  );

  const handleTabChanged = (newIndex) => {
    setTabIndex(newIndex);

    if (onTabChange) {
      onTabChange(newIndex);
    }
  };

  useEffect(() => {
    if (activeTabIndex !== undefined) {
      setTabIndex(activeTabIndex);
    }
  }, [activeTabIndex]);

  if (editing) {
    return (
      <PeaProfileEditor
        cover={cover}
        image={image}
        name={name}
        userName={userName}
        email={email}
        phoneNumber={phoneNumber}
        tags={tags}
        bio={bio}
        location={location}
        locationInput={locationInput}
        birthday={birthday}
        gender={gender}
        isPrivate={isPrivate}
        onSubmit={onSubmit}
        isUpdating={isUpdating}
        onChange={onChange}
        onCancel={() => setEditing(false)}
        onChangeCoverPhotoClicked={onChangeCoverPhotoClicked}
        onChangeProfilePhotosClicked={onChangeProfilePhotosClicked}
        onLinkSocial={onLinkSocial}
      />
    );
  }
  const renderMenu = () => (
    <Menu
      id="long-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={() => setAnchor(null)}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        style: {
          minWidth: 240,
        },
      }}
    >
      <MenuItem onClick={() => setAnchor(null)}>
        <ListItemText disableTypography>
          <PeaText color={'error'} variant={'body1'} weight={'bold'}>
            Block {`@${userName}`}
          </PeaText>
        </ListItemText>
      </MenuItem>

      <Divider variant={'middle'} />

      <MenuItem onClick={onReportClick}>
        <ListItemText disableTypography>
          <PeaText color={'error'} variant={'body1'} weight={'bold'}>
            Report {`@${userName}`}
          </PeaText>
        </ListItemText>
      </MenuItem>

      {onChangeAccountStatus && (
        <>
          <MenuItem onClick={onActivateClick}>
            <ListItemText disableTypography>
              <PeaText color={'error'} variant={'body1'} weight={'bold'}>
                Activate Account
              </PeaText>
            </ListItemText>
          </MenuItem>

          {/* <MenuItem onClick={onAccountBanClick}>
            <ListItemText disableTypography>
              <PeaText color={'error'} variant={'body1'} weight={'bold'}>
                Ban Account
              </PeaText>
            </ListItemText>
          </MenuItem> */}
        </>
      )}
    </Menu>
  );

  return (
    <Card
      elevation={isMobile ? 0 : 1}
      className={'PeaAccountProfile-root'}
      onScroll={onScroll}
      ref={scrollRef}
    >
      <Grid
        className={classes.scrollHeader}
        style={showTopBar ? { transform: 'translateY(0)' } : {}}
      >
        <Box className={classes.backBox} onClick={scrollToTop}>
          <PeaIcon color={'secondary'} size={'small'}>
            arrow_upward
          </PeaIcon>
          <PeaAvatar src={image} size={'small'} className={classes.topAvatar} />
          <PeaText color={'secondary'}>{name}</PeaText>
        </Box>
      </Grid>

      <CardMedia className={'MuiCardMedia-root'} image={cover} />

      <CardContent className={'MuiCardContent-root'}>
        <PeaAvatar
          className={'MuiAvatar-root-profilePic'}
          src={image}
          style={{
            transform: `translateY(-60%) scale(${avatarScale})`,
            transformOrigin: 33,
          }}
        />

        {followerRequested && (
          <PeaButton
            variant={'contained'}
            color={'primary'}
            size={'small'}
            disabled={acceptFollowLoading}
            loading={acceptFollowLoading}
            onClick={onAcceptFollowRequest}
          >
            {'Accept Follow Request'}
          </PeaButton>
        )}

        <Grid className={'MuiGrid-container -actions'} container spacing={1}>
          <Grid item>
            {isCurrentUser ? (
              <>
                <PeaUserSettings
                  onNotificationsChange={onNotificationsChange}
                  onReceiveEmailChange={onReceiveEmailChange}
                  onEditProfile={() => setEditing(true)}
                  onContactSupport={onContactSupport}
                  onLogout={onLogout}
                  onDeleteProfile={() => setDelModalOpen(true)}
                />

                <PeaConfirmation
                  title={'Delete Account'}
                  content={'Are you sure?'}
                  submitLabel={'Delete'}
                  open={delModalOpen}
                  onClose={() => setDelModalOpen(false)}
                  onSubmit={() => deleteProfile()}
                  submitting={isDeleting}
                />
              </>
            ) : (
              <>
                <PeaButton
                  variant={'contained'}
                  color={'primary'}
                  size={'small'}
                  disabled={followBtnDisabled}
                  loading={followLoading}
                  onClick={onFollowBtnClick}
                  onMouseOver={onMouseOver}
                  onMouseOut={onMouseOut}
                  onFocus={() => {}}
                  onBlur={() => {}}
                >
                  {followButtonText}
                </PeaButton>

                <Popover
                  id={followAriaId}
                  open={groupSelectorOpen}
                  anchorEl={followAnchorEl}
                  onClose={onFollowPopClose}
                >
                  <PeaGroupSelector
                    followButtonText={confirmText}
                    followableGroups={
                      followButtonText === 'Follow'
                        ? followableGroups
                        : undefined
                    }
                    followLoading={followLoading}
                    onCreateGroupClicked={onCreateGroupClicked}
                    onSubmit={handleOnFollow}
                  />
                </Popover>
              </>
            )}
          </Grid>

          {!isCurrentUser && (
            <>
              <Grid item>
                <PeaButton
                  variant={'outlined'}
                  color={'primary'}
                  size={'small'}
                  onClick={onInviteClick}
                >
                  Invite
                </PeaButton>
              </Grid>

              <Grid item>
                <PeaButton
                  icon={'email'}
                  size={'small'}
                  shape={'circular'}
                  tooltip="message"
                />
              </Grid>

              <Grid item>
                <PeaButton
                  icon={'more_vert'}
                  size={'small'}
                  shape={'circular'}
                  tooltip="more"
                  onClick={(e) => setAnchor(e.currentTarget)}
                />
                {renderMenu()}
              </Grid>
            </>
          )}
        </Grid>

        <Box mt={2}>
          <PeaText variant={'h5'} weight={'bold'}>
            {name}
          </PeaText>
          <PeaText gutterBottom>{`@${userName}`}</PeaText>
          {isFollower && <PeaText gutterBottom>{'follows you'}</PeaText>}
        </Box>
      </CardContent>

      <PeaSwipeableTabs
        activeIndex={tabIndex}
        tabs={tabs}
        enableFeedback={isMobile}
        hasPadding={!isMobile}
        onTabChange={handleTabChanged}
        stickyOffset={60}
      >
        <Box p={2} textAlign={'left'}>
          <PeaText gutterBottom>
            <PeaText link underline={'none'}>
              <b>Bio :</b>
            </PeaText>{' '}
            {bio}
          </PeaText>
          <br />
          <PeaText link underline={'none'} gutterBottom>
            <b>Tags</b>
          </PeaText>
          <PeaText gutterBottom />
          <Grid container spacing={1}>
            {tags.map((item) => (
              <Grid item key={item.label}>
                <PeaTag
                  color={'secondary'}
                  label={`#${item.label}`}
                  onClick={() => {}}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box>{podList}</Box>

        <Box>{groupList}</Box>

        <Box>{followersList}</Box>

        <Box>{followingList}</Box>
      </PeaSwipeableTabs>

      <PeaInvitationDialog
        person={userName}
        pods={pods}
        groups={invitableGroups}
        loading={loadingInvitableList}
        onInvitePod={onInvitePod}
        onInviteGroup={onInviteGroup}
        invitingIds={invitingIds}
        invitedIds={invitedIds}
        open={openInviteDialog}
        onClose={() => setOpenInviteDialog(false)}
      />
    </Card>
  );
};

PeaAccountProfile.propTypes = {
  loadingInvitableList: PropTypes.bool,
  image: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  userName: PropTypes.string,
  bio: PropTypes.string,
  location: PropTypes.object,
  locationInput: PropTypes.func,
  birthday: PropTypes.string,
  gender: PropTypes.string,
  pods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  invitableGroups: PropTypes.arrayOf(PropTypes.shape({})),
  followableGroups: PropTypes.arrayOf(PropTypes.shape({})),
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  reputation: PropTypes.number,
  podsCount: PropTypes.number,
  isCurrentUser: PropTypes.bool,
  email: PropTypes.string,
  phoneNumber: PropTypes.string,
  groupsCount: PropTypes.number,
  followersCount: PropTypes.number,
  followingCount: PropTypes.number,
  isPrivate: PropTypes.bool,
  groupList: PropTypes.object,
  podList: PropTypes.object,
  followersList: PropTypes.object,
  followingList: PropTypes.object,
  editing: PropTypes.bool,
  isUpdating: PropTypes.bool,
  isDeleting: PropTypes.bool,
  followLoading: PropTypes.bool,
  currentUserFollowing: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  setEditing: PropTypes.func,
  onChangeCoverPhotoClicked: PropTypes.func.isRequired,
  onChangeProfilePhotosClicked: PropTypes.func.isRequired,
  deleteProfile: PropTypes.func,
  onFollow: PropTypes.func,
  onReport: PropTypes.func,
  onInvitePod: PropTypes.func.isRequired,
  onInviteGroup: PropTypes.func.isRequired,
  onCreateGroupClicked: PropTypes.func.isRequired,
  onInviteClicked: PropTypes.func.isRequired,
  onAcceptFollowRequest: PropTypes.func.isRequired,
  onLinkSocial: PropTypes.func.isRequired,
  onChangeAccountStatus: PropTypes.func,
  onLogout: PropTypes.func.isRequired,
  onChangeSettings: PropTypes.func,
  invitingIds: PropTypes.object,
  invitedIds: PropTypes.object,
  followerState: PropTypes.string,
  acceptFollowLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  activeTabIndex: PropTypes.number,
  onTabChange: PropTypes.func.isRequired,
};

PeaAccountProfile.defaultProps = {
  isMobile: true,
  activeTabIndex: 0,
  loadingInvitableList: false,
  userName: '',
  bio: '',
  location: undefined,
  locationInput: undefined,
  birthday: undefined,
  gender: undefined,
  pods: [],
  invitableGroups: [],
  followableGroups: [],
  tags: [],
  reputation: 0,
  podsCount: 0,
  isCurrentUser: false,
  email: '',
  phoneNumber: undefined,
  followersCount: 0,
  followingCount: 0,
  isPrivate: false,
  editing: false,
  isUpdating: false,
  isDeleting: false,
  podList: undefined,
  groupList: undefined,
  followersList: undefined,
  followingList: undefined,
  followLoading: false,
  currentUserFollowing: undefined,
  onChange: () => {},
  onSubmit: () => {},
  setEditing: () => {},
  deleteProfile: () => {},
  onFollow: () => {},
  onReport: () => {},
  invitingIds: {},
  invitedIds: {},
  followerState: undefined,
  acceptFollowLoading: false,
  onChangeAccountStatus: undefined,
  onChangeSettings: undefined,
};

PeaAccountProfile.metadata = {
  name: 'Pea Account Profile',
};

PeaAccountProfile.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default memo(PeaAccountProfile);
