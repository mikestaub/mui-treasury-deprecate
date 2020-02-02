import React, { useRef, useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import cx from 'classnames';
import normalizeWheel from 'normalize-wheel';

import PeaButton from './PeaButton';
import PeaText from './PeaTypography';
import PeaAvatar from './PeaAvatar';
import PeaIcon from './PeaIcon';
import PeaTag from './PeaTag';
import PeaSwipeableTabs from './PeaSwipeableTabs';
import PeaShareContent from './PeaShareContent';

// TODO: this can be cleaned up and refactored
// Much of this can be reused for GroupDetails

const useStyles = makeStyles(() => ({
  scrollHeader: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    boxShadow: '3px 1px 20px rgba(0,0,0,0.2)',
    padding: '0 10px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: '#fff',
    transform: 'translateY(-100px)',
    transition: 'transform .5s',
  },
  backBox: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: '100%',
  },
  backTitle: {
    marginLeft: 5,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

const renderAboutDetails = ({
  profile,
  timeString,
  mapOrigin,
  location,
  podCount,
  attendingCount,
  interestedCount,
  limit,
}) => [
  {
    key: '0',
    icon: (
      <img
        alt="event-host"
        src={profile.image}
        style={{ width: '100%', height: '100%' }}
      />
    ),
    renderText: () => (
      <span>
        Hosted by{' '}
        <Link target="_blank" href={profile.link}>
          {profile.name}
        </Link>
      </span>
    ),
  },
  {
    key: '1',
    icon: 'fas fa-calendar-alt',
    text: timeString,
  },
  {
    key: '2',
    icon: 'location_on',
    renderText: () => {
      // eslint-disable-next-line max-len
      const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${mapOrigin}&destination=${location}&travelMode=driving`;
      return (
        <Link href={mapDirectionsUrl} target="blank" rel="noopener">
          {location}
        </Link>
      );
    },
  },
  {
    key: '3',
    icon: 'fas fa-users',
    renderText: () => (
      <>
        {!!limit && (
          <span>
            limit <b>{limit} - </b>
          </span>
        )}
        <b>{podCount}</b> pods, <b>{attendingCount}</b> going, and{' '}
        <b>{interestedCount}</b> interested
      </>
    ),
  },
];

const PeaEventDetails = ({
  id,
  profile,
  title,
  description,
  tags,
  cover,
  timeAgo,
  timeString,
  sourceImage,
  sourceLink,
  podCount,
  mapOrigin,
  location,
  stats,
  isPodMember,
  shareLink,
  shareText,
  facebookAppId,
  onCreatePodClicked,
  onEditEventClicked,
  onShareEventClicked,
  renderPods,
  renderConnections,
  isMobile,
  onChangeTab,
  isLoading,
  onReport,
  onAddToCalendar,
  renderMap,
}) => {
  const classes = useStyles();

  const [showTopBar, setShowTopBar] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const lastTouchRef = useRef();
  const contentRef = useRef();
  const podsRef = useRef();
  const aboutRef = useRef();
  const connectionRef = useRef();

  const tabs = [
    { ref: podsRef, label: 'Pods' },
    { ref: aboutRef, label: 'About' },
    { ref: connectionRef, label: 'Connections' },
  ];

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
      const { ref } = tabs[tabIndex];

      const offset = content.scrollHeight - content.clientHeight;

      const extraPadding = showTopBar ? 50 : 0;
      const shouldUpdateTab = content.scrollTop + extraPadding >= offset;
      const tabScrollTop = ref.current.scrollTop;
      const shouldUpdateContent =
        content.scrollTop < offset ||
        (content.scrollTop >= offset && tabScrollTop === 0);

      if (shouldUpdateContent) {
        content.scrollTop += deltaY;
      }

      setShowTopBar(shouldUpdateTab);

      if (shouldUpdateTab) {
        ref.current.style.overflow = 'auto';
        ref.current.scrollTop += deltaY;
      } else {
        ref.current.style.overflow = 'hidden';
      }
    },
    [tabIndex, tabs, showTopBar],
  );

  const onTabChange = index => {
    if (onChangeTab) {
      onChangeTab(tabs[index].label);
    }
  };

  const handleTabChanged = newIndex => {
    setTabIndex(newIndex);

    if (onTabChange) {
      onTabChange(newIndex);
    }
  };

  const buttonText = isPodMember ? 'Edit Pod' : 'Create Pod';

  const [anchorEl, setAnchor] = useState(null);
  const open = Boolean(anchorEl);

  const onReportClicked = () => {
    onReport();
    setAnchor(null);
  };

  const onAddToCalendarClicked = () => {
    onAddToCalendar();
    setAnchor(null);
  };

  const editEvent = () => {
    setAnchor(null);
    onEditEventClicked();
  };

  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const shareAriaId = shareAnchorEl ? 'event-details-share' : undefined;

  const handleShareClick = event => {
    event.stopPropagation();

    if (window.navigator.share) {
      window.navigator
        .share({
          title: shareText,
          url: shareLink,
        })
        .then(() => {
          onShareEventClicked('native');
        });
    } else if (!shareAnchorEl) {
      setShareAnchorEl(event.currentTarget);
    }
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleShareItemClick = item => () => {
    onShareEventClicked(item);
    handleShareClose();
  };

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
      {timeString && (
        <MenuItem onClick={onAddToCalendarClicked}>
          <ListItemText disableTypography>
            <PeaText variant={'body1'} weight={'bold'}>
              Add to Calendar
            </PeaText>
          </ListItemText>
        </MenuItem>
      )}

      <MenuItem onClick={onReportClicked}>
        <ListItemText disableTypography>
          <PeaText variant={'body1'} weight={'bold'}>
            Report
          </PeaText>
        </ListItemText>
      </MenuItem>

      {onEditEventClicked && (
        <MenuItem onClick={() => editEvent()}>
          <ListItemText disableTypography>
            <PeaText color={'secondary'} variant={'body1'} weight={'bold'}>
              Edit Event
            </PeaText>
          </ListItemText>
        </MenuItem>
      )}
    </Menu>
  );

  const scrollToTop = () => {
    contentRef.current.scrollTo(0, 0);
    setShowTopBar(false);
  };

  return (
    <Card
      className={'PeaGroupProfile-root'}
      style={{ display: 'block', overflow: 'hidden' }}
      onWheel={onContentWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onContentWheel}
      ref={contentRef}
    >
      <Grid
        className={classes.scrollHeader}
        style={showTopBar ? { transform: 'translateY(0)' } : {}}
      >
        <Box className={classes.backBox} onClick={scrollToTop}>
          <PeaIcon color={'secondary'} size={'small'}>
            arrow_back
          </PeaIcon>
          <PeaText color={'secondary'} className={classes.backTitle}>
            {title}
          </PeaText>
        </Box>
      </Grid>
      <CardMedia className={'MuiCardMedia-root'} image={cover} />

      <CardContent className={'MuiCardContent-root'}>
        <Grid container direction="column">
          <Grid item container alignItems={'center'} xs>
            <PeaText variant={'h6'} weight={'bold'}>
              {title}
            </PeaText>
          </Grid>

          <Grid item>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <PeaText gutterBottom>
                  <PeaIcon
                    push={'right'}
                    color={'secondary'}
                    size={'small'}
                    shape="square"
                  >
                    fas fa-clock
                  </PeaIcon>
                  created {timeAgo}
                </PeaText>
              </Grid>

              <Grid item>
                {sourceImage && (
                  <button
                    type="button"
                    className="MuiButtonBase-root"
                    href={sourceLink}
                  >
                    <PeaAvatar src={sourceImage} />
                  </button>
                )}

                <PeaButton
                  shape={'circular'}
                  icon={'share'}
                  size={'small'}
                  style={{ marginLeft: 8 }}
                  onClick={handleShareClick}
                >
                  <Popover
                    id={shareAriaId}
                    open={shareAnchorEl}
                    anchorEl={shareAnchorEl}
                    onClose={handleShareClose}
                  >
                    <Paper>
                      <PeaShareContent
                        title={title}
                        shareLink={shareLink}
                        shareText={shareText}
                        facebookAppId={facebookAppId}
                        onShare={handleShareItemClick}
                      />
                    </Paper>
                  </Popover>
                </PeaButton>

                <PeaButton
                  shape={'circular'}
                  icon={'more_vert'}
                  size={'small'}
                  style={{ marginLeft: 8 }}
                  onClick={e => setAnchor(e.currentTarget)}
                />
                {renderMenu()}

                <PeaButton
                  onClick={() => onCreatePodClicked(id)}
                  variant={'contained'}
                  color={'primary'}
                  size="small"
                  loading={isLoading}
                  style={{ marginLeft: 8, minWidth: 120 }}
                >
                  {buttonText}
                </PeaButton>
              </Grid>
            </Grid>
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
        {renderPods()}

        <>
          {isMobile && renderMap()}
          <PeaText color={'secondary'} gutterBottom>
            <b>Details</b>
          </PeaText>

          <Grid container direction="row">
            <Grid container direction="column">
              {renderAboutDetails({
                profile,
                timeString,
                mapOrigin,
                location,
                podCount,
                attendingCount: stats ? stats.attending : null,
                interestedCount: stats ? stats.interested : null,
                limit: stats ? stats.limit : null,
              }).map(item => (
                <Grid key={item.key} container spacing={1} wrap={'nowrap'}>
                  <Grid item>
                    {typeof item.icon === 'string' ? (
                      <PeaIcon
                        size={'big'}
                        color={'secondary'}
                        icon={item.icon}
                        shape="square"
                      />
                    ) : (
                      <div
                        style={{
                          fontSize: '28px',
                        }}
                        className={cx(
                          'MuiIcon-root',
                          '-size-big',
                          '-shape-circular',
                        )}
                      >
                        {item.icon}
                      </div>
                    )}
                  </Grid>
                  <Grid item xs>
                    <Typography color={'textSecondary'} variant={'caption'}>
                      {item.renderText ? item.renderText() : item.text}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <PeaText color={'secondary'} gutterBottom>
            <b>Description</b>
          </PeaText>

          {description && (
            <div className={cx('MuiTypography-root', 'MuiTypography-body1')}>
              {typeof description === 'string' ? (
                <PeaText>{description}</PeaText>
              ) : (
                React.Children.map(description, text => (
                  <div
                    style={{
                      marginBottom: 20,
                    }}
                  >
                    {text}
                  </div>
                ))
              )}
            </div>
          )}

          <PeaText color={'secondary'} gutterBottom>
            <b>Tags</b>
          </PeaText>

          <PeaText gutterBottom />
          <Grid container wrap="wrap" spacing={1}>
            {tags.map(tag => (
              <Grid item key={tag}>
                <PeaTag
                  color={'secondary'}
                  label={`#${tag}`}
                  onClick={() => {}}
                />
              </Grid>
            ))}
          </Grid>
        </>

        {renderConnections()}
      </PeaSwipeableTabs>
    </Card>
  );
};

PeaEventDetails.propTypes = {
  id: PropTypes.string.isRequired,
  isPodMember: PropTypes.bool.isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  cover: PropTypes.string.isRequired,
  timeAgo: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  sourceImage: PropTypes.string,
  sourceLink: PropTypes.string,
  onCreatePodClicked: PropTypes.func.isRequired,
  onEditEventClicked: PropTypes.func,
  onShareEventClicked: PropTypes.func.isRequired,
  renderConnections: PropTypes.func.isRequired,
  renderPods: PropTypes.func.isRequired,
  podCount: PropTypes.number,
  timeString: PropTypes.string.isRequired,
  mapOrigin: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  stats: PropTypes.shape({
    interested: PropTypes.number.isRequired,
    attending: PropTypes.number.isRequired,
    limit: PropTypes.number,
  }).isRequired,
  isMobile: PropTypes.bool,
  onChangeTab: PropTypes.func,
  isLoading: PropTypes.bool,
  onReport: PropTypes.func,
  onAddToCalendar: PropTypes.func,
  shareLink: PropTypes.string,
  shareText: PropTypes.string,
  facebookAppId: PropTypes.string,
  renderMap: PropTypes.func,
};

PeaEventDetails.defaultProps = {
  podCount: 0,
  description: undefined,
  tags: [],
  sourceImage: undefined,
  sourceLink: undefined,
  isMobile: true,
  onChangeTab: undefined,
  onEditEventClicked: undefined,
  isLoading: false,
  shareLink: undefined,
  shareText: undefined,
  facebookAppId: '',
  onReport: () => {},
  onAddToCalendar: () => {},
  renderMap: () => {},
};

PeaEventDetails.metadata = {
  name: 'Pea Event Details',
};

export default memo(PeaEventDetails);
