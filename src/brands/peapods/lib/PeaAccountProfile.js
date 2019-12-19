/* eslint-disable react/forbid-prop-types */

import React, { useRef, useState, useEffect, useCallback } from 'react';
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
import normalizeWheel from 'normalize-wheel';

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

const useStyles = makeStyles(() => ({
  followButton: {
    width: 160,
  },
  scrollHeader: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    boxShadow: '3px 1px 20px rgba(0,0,0,0.2)',
    padding: '0 10px',
    position: 'sticky',
    top: 0,
    width: '100%',
    zIndex: 9999,
    background: '#fff',
  },
  backBox: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  topAvatar: {
    margin: '0 5px',
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
  age,
  gender,
  pods,
  invitableGroups,
  followableGroups,
  tags,
  podsCount,
  reputation,
  followersCount,
  followingCount,
  isPrivate,
  eventList,
  groupList,
  podList,
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

  const [showTopBar, setShowTopBar] = useState(false);
  const [anchorEl, setAnchor] = useState(null);
  const [followAnchorEl, setFollowAnchorEl] = useState(null);
  const [delModalOpen, setDelModalOpen] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [followButtonText, setFollowButtonText] = useState('Follow');
  const [confirmText, setConfirmText] = useState('Follow');
  const [tabIndex, setTabIndex] = useState(0);

  const lastTouchRef = useRef();
  const contentRef = useRef();
  const hostingRef = useRef();
  const podsRef = useRef();
  const aboutRef = useRef();
  const groupsRef = useRef();
  const avatarRef = useRef();

  const tabs = [
    { ref: hostingRef, label: 'Hosting' },
    { ref: podsRef, label: 'Pods' },
    { ref: aboutRef, label: 'About' },
    { ref: groupsRef, label: 'Groups' },
  ];

  const isFollower = followerState === 'FOLLOWING';
  const followerRequested = followerState === 'PENDING_APPROVAL';

  const isFollowing = currentUserFollowing === 'FOLLOWING';
  const followRequested = currentUserFollowing === 'PENDING_APPROVAL';

  const needsGroups = !isFollowing && !followRequested && !isFollower;

  const open = Boolean(anchorEl);
  const groupSelectorOpen = Boolean(followAnchorEl) && needsGroups;
  const followAriaId = followAnchorEl ? 'follow-popover' : undefined;
  const followBtnDisabled = followLoading;

  const updateFollowButtonText = useCallback(() => {
    let value = isFollowing ? 'Following' : 'Follow';

    if (followRequested) {
      value = 'Follow Requested';
    }

    setFollowButtonText(value);
  }, [setFollowButtonText, isFollowing, followRequested]);

  useEffect(updateFollowButtonText, [currentUserFollowing]);

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

  const handleOnFollow = async groupIds => {
    await onFollow(groupIds);
    onFollowPopClose();
  };

  const onFollowBtnClick = event => {
    if (needsGroups) {
      setFollowAnchorEl(event.currentTarget);
    } else {
      handleOnFollow({});
    }
  };

  const onNotificationsChange = enabled => {
    onChangeSettings({
      pushNotificationsDisabled: enabled ? !!enabled : null,
    });
  };

  const onReceiveEmailChange = enabled => {
    onChangeSettings({
      emailNotificationsDisabled: enabled ? !!enabled : null,
    });
  };

  const onContactSupport = () => {
    const supportEmail = 'support@peapods.com';
    window.open(`mailto:${supportEmail}`);
  };

  const onTouchStart = e => {
    [lastTouchRef.current] = e.touches;
  };

  // we micromange the scrolling to provide a better UX
  const onContentWheel = useCallback(
    e => {
      let deltaY = 0;

      if (e.changedTouches && lastTouchRef.current) {
        const currentTouch = e.changedTouches[0];
        deltaY = lastTouchRef.current.pageY - currentTouch.pageY;
        lastTouchRef.current = currentTouch;
      } else {
        const normalized = normalizeWheel(e);
        deltaY = normalized.pixelY;
      }

      const content = contentRef.current;

      let avatarScale = Math.min(1 - content.scrollTop / 80, 1);
      if (avatarScale < 0.4) {
        avatarScale = 0.4;
        setShowTopBar(true);
      } else {
        setShowTopBar(false);
      }
      const avatarElement = avatarRef.current.firstChild;
      avatarElement.style.transform = `translateY(-60%) scale(${avatarScale})`;
      avatarElement.style.transition = 'transform .2s';

      const { ref } = tabs[tabIndex];

      const offset = content.scrollHeight - content.clientHeight;

      const shouldUpdateTab = content.scrollTop >= offset;
      const tabScrollTop = ref.current.scrollTop;
      const shouldUpdateContent =
        content.scrollTop < offset ||
        (content.scrollTop >= offset && tabScrollTop === 0);

      if (shouldUpdateContent) {
        content.scrollTop += deltaY;
      }

      if (shouldUpdateTab) {
        ref.current.style.overflow = 'auto';
        ref.current.scrollTop += deltaY;
      } else {
        ref.current.style.overflow = 'hidden';
      }
    },
    [tabIndex, tabs],
  );

  const handleTabChanged = newIndex => {
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

  const scrollToTop = () => {
    const avatarElement = avatarRef.current.firstChild;
    avatarElement.style.transform = 'translateY(-60%)';
    contentRef.current.scrollTo(0, 0);
    setShowTopBar(false);
  };

  return (
    <Card
      className={'PeaAccountProfile-root'}
      style={{ display: 'block', overflow: 'hidden' }}
      onWheel={onContentWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onContentWheel}
      ref={contentRef}
    >
      {showTopBar && (
        <Grid className={classes.scrollHeader}>
          <Box className={classes.backBox} onClick={scrollToTop}>
            <PeaIcon color={'secondary'} size={'small'}>
              arrow_back
            </PeaIcon>
            <PeaAvatar
              src={image}
              size={'small'}
              className={classes.topAvatar}
            />
            <PeaText color={'secondary'}>{name}</PeaText>
          </Box>
        </Grid>
      )}
      <CardMedia className={'MuiCardMedia-root'} image={cover} />

      <CardContent className={'MuiCardContent-root'}>
        <Grid container justify={'space-between'} spacing={2}>
          <Grid item style={{ height: 0 }} ref={avatarRef}>
            <PeaAvatar className={'MuiAvatar-root-profilePic'} src={image} />
          </Grid>
          <Hidden only={'xs'}>
            <Grid item>
              <PeaStatistic label={'Pods'} value={podsCount} />
            </Grid>
            <Grid item>
              <PeaStatistic label={'Following'} value={followingCount} />
            </Grid>
            <Grid item>
              <PeaStatistic label={'Followers'} value={followersCount} />
            </Grid>
          </Hidden>
          <Grid item className={'MuiGrid-item -reputation'}>
            <PeaText color={'secondary'} weight={'bold'} align={'center'}>
              Reputation: {reputation}
            </PeaText>
          </Grid>
        </Grid>

        <Box mt={4} mb={3}>
          {followerRequested && (
            <Grid container spacing={2} justify="center">
              <Grid item>
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
              </Grid>
            </Grid>
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
                    className={classes.followButton}
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
                  <PeaButton icon={'email'} size={'small'} shape={'circular'}>
                    message
                  </PeaButton>
                </Grid>

                <Grid item>
                  <PeaButton
                    icon={'more_vert'}
                    size={'small'}
                    shape={'circular'}
                    onClick={e => setAnchor(e.currentTarget)}
                  >
                    more
                  </PeaButton>
                  {renderMenu()}
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        <Hidden smUp>
          <Grid container justify={'space-evenly'}>
            <Grid item>
              <PeaStatistic label={'Pods'} value={podsCount} />
            </Grid>
            <Grid item>
              <PeaStatistic label={'Following'} value={48} />
            </Grid>
            <Grid item>
              <PeaStatistic label={'Followers'} value={5} />
            </Grid>
          </Grid>
          <br />
        </Hidden>

        <Hidden only={'xs'}>
          <div style={{ marginTop: -32 }} />
        </Hidden>

        <PeaText variant={'h5'} weight={'bold'}>
          {name}
        </PeaText>

        <PeaText gutterBottom>{`@${userName}`}</PeaText>
        {isFollower && <PeaText gutterBottom>{'follows you'}</PeaText>}
        <br />

        <Grid container wrap={'nowrap'} spacing={1}>
          <Grid item>
            <PeaIcon color={'secondary'} size={'small'}>
              info
            </PeaIcon>
          </Grid>
          <Grid item>
            <PeaText gutterBottom>{bio}</PeaText>
          </Grid>
        </Grid>
        <Grid container wrap={'nowrap'} spacing={1}>
          <Grid item>
            <PeaIcon color={'secondary'} size={'small'}>
              location_on
            </PeaIcon>
          </Grid>
          <Grid item>
            <PeaText gutterBottom>
              {location ? location.formattedAddress : 'Unknown'}
            </PeaText>
          </Grid>
        </Grid>
      </CardContent>

      <PeaSwipeableTabs
        activeIndex={tabIndex}
        tabs={tabs}
        enableFeedback={isMobile}
        onTabChange={handleTabChanged}
        customStyle={{ paddingTop: showTopBar ? 50 : 0 }}
      >
        <Box>{eventList}</Box>

        <Box>{podList}</Box>

        <Box p={2} textAlign={'left'}>
          <PeaText gutterBottom variant={'subtitle1'} weight={'bold'}>
            About
          </PeaText>
          <PeaText gutterBottom>
            <PeaText link underline={'none'}>
              <b>Age :</b>
            </PeaText>{' '}
            {age}
          </PeaText>
          <PeaText gutterBottom>
            <PeaText link underline={'none'}>
              <b>Gender :</b>
            </PeaText>{' '}
            {gender}
          </PeaText>
          <PeaText link underline={'none'} gutterBottom>
            <b>Groups</b>
          </PeaText>
          <PeaText gutterBottom />
          <br />
          <PeaText link underline={'none'} gutterBottom>
            <b>Tags</b>
          </PeaText>
          <PeaText gutterBottom />
          <Grid container spacing={1}>
            {tags.map(item => (
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

        <Box>{groupList}</Box>
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
  age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
  followersCount: PropTypes.number,
  followingCount: PropTypes.number,
  isPrivate: PropTypes.bool,
  groupList: PropTypes.object,
  podList: PropTypes.object,
  editing: PropTypes.bool,
  isUpdating: PropTypes.bool,
  isDeleting: PropTypes.bool,
  followLoading: PropTypes.bool,
  currentUserFollowing: PropTypes.string,
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
  eventList: PropTypes.arrayOf(PropTypes.shape({})),
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
  age: undefined,
  gender: undefined,
  eventList: [],
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
  groupList: undefined,
  followLoading: false,
  currentUserFollowing: undefined,
  podList: undefined,
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

export default PeaAccountProfile;
