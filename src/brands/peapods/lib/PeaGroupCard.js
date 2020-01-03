import React, { useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import { startCase } from 'lodash';
import humanFormat from 'human-format';
import normalizeWheel from 'normalize-wheel';

import PeaButton from './PeaButton';
import PeaIcon from './PeaIcon';
import PeaText from './PeaTypography';

const useStyles = makeStyles(() => ({
  scrollHeader: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    boxShadow: '3px 1px 20px rgba(0,0,0,0.2)',
    padding: '0 10px',
    position: 'sticky',
    top: 0,
    zIndex: 9999,
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

const PeaGroupCard = ({
  isMember,
  isLoading,
  name,
  memberCount,
  image,
  type,
  onJoin,
  onLeave,
  onEdit,
  onDelete,
  onReport,
  onMessage,
  actionText,
  hasBorderRadius,
  children,
  selectedTab,
  scrollSupported,
}) => {
  const classes = useStyles();

  const [showTopBar, setShowTopBar] = useState(false);

  const lastTouchRef = useRef();
  const contentRef = useRef();

  const [anchorEl, setAnchor] = useState(null);
  const open = Boolean(anchorEl);

  const joinButtonProps = {
    size: 'small',
    style: { marginLeft: 8, minWidth: 120 },
    onClick: () => (isMember ? onLeave() : onJoin()),
  };

  const iconByType = {
    PERSONAL: 'fas fa-user',
    EXCLUSIVE: 'fas fa-lock',
    PUBLIC: 'fas fa-globe-americas',
  };

  const onEditClicked = () => {
    setAnchor(null);
    onEdit();
  };

  const onDeleteClicked = () => {
    setAnchor(null);
    onDelete();
  };

  const onReportClicked = () => {
    setAnchor(null);
    onReport();
  };

  const onTouchStart = e => {
    [lastTouchRef.current] = e.touches;
  };

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
      const { ref } = selectedTab;

      const offset = content.scrollHeight - content.clientHeight;

      const shouldUpdateTab = content.scrollTop >= offset;
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
    [selectedTab],
  );

  const scrollToTop = () => {
    contentRef.current.scrollTo(0, 0);
    setShowTopBar(false);
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
      {onEdit && (
        <MenuItem onClick={onEditClicked}>
          <ListItemText disableTypography>
            <PeaText variant={'body1'} weight={'bold'}>
              Edit
            </PeaText>
          </ListItemText>
        </MenuItem>
      )}

      <Divider variant={'middle'} />

      {onDelete && (
        <MenuItem onClick={onDeleteClicked}>
          <ListItemText disableTypography>
            <PeaText color={'error'} variant={'body1'} weight={'bold'}>
              Delete
            </PeaText>
          </ListItemText>
        </MenuItem>
      )}

      <Divider variant={'middle'} />

      <MenuItem onClick={onReportClicked}>
        <ListItemText disableTypography>
          <PeaText color={'error'} variant={'body1'} weight={'bold'}>
            Report
          </PeaText>
        </ListItemText>
      </MenuItem>
    </Menu>
  );

  return (
    <Card
      className={
        hasBorderRadius ? 'PeaGroupProfile-root' : 'PeaProfileCard-root'
      }
      style={
        scrollSupported
          ? {
              display: 'block',
              overflow: 'hidden',
              paddingTop: showTopBar ? 50 : 0,
            }
          : {}
      }
      onWheel={scrollSupported ? onContentWheel : null}
      onTouchStart={scrollSupported ? onTouchStart : null}
      onTouchMove={scrollSupported ? onContentWheel : null}
      ref={contentRef}
    >
      {scrollSupported && (
        <Grid
          className={classes.scrollHeader}
          style={showTopBar ? { transform: 'translateY(-50px)' } : {}}
        >
          <Box className={classes.backBox} onClick={scrollToTop}>
            <PeaIcon color={'secondary'} size={'small'}>
              arrow_back
            </PeaIcon>
            <PeaText color={'secondary'} className={classes.backTitle}>
              {name}
            </PeaText>
          </Box>
        </Grid>
      )}

      <CardMedia className={'MuiCardMedia-root'} image={image} />

      <CardContent className={'MuiCardContent-root'}>
        <Grid container direction="column">
          <Grid item container alignItems={'center'} xs>
            <PeaText variant={'h6'} weight={'bold'}>
              {name}
            </PeaText>
          </Grid>

          <Grid item>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <PeaText>
                  <PeaIcon push={'right'} color={'secondary'} size={'small'}>
                    {iconByType[type]}
                  </PeaIcon>
                  {startCase(type.toLowerCase())}
                </PeaText>
                <PeaText>{`${humanFormat(memberCount || 0, {
                  decimals: 0,
                })} member${memberCount === 1 ? '' : 's'}`}</PeaText>
              </Grid>

              <Grid item>
                <PeaButton
                  shape={'circular'}
                  icon={'email'}
                  size={'small'}
                  onClick={onMessage}
                >
                  message
                </PeaButton>

                <PeaButton
                  shape={'circular'}
                  icon={'more_vert'}
                  size={'small'}
                  style={{ marginLeft: 8 }}
                  onClick={e => setAnchor(e.currentTarget)}
                />

                {renderMenu()}

                {type !== 'PERSONAL' && (
                  <PeaButton
                    variant={'contained'}
                    color={isMember ? 'primary' : 'danger'}
                    style={{ marginLeft: 8, minWidth: 120 }}
                    loading={isLoading}
                    {...joinButtonProps}
                  >
                    {actionText}
                  </PeaButton>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      {children}
    </Card>
  );
};

PeaGroupCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  memberCount: PropTypes.number.isRequired,
  onReport: PropTypes.func.isRequired,
  onMessage: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  actionText: PropTypes.string,
  isMember: PropTypes.bool,
  isLoading: PropTypes.bool,
  onJoin: PropTypes.func,
  onLeave: PropTypes.func,
  children: PropTypes.node,
  selectedTab: PropTypes.shape({
    ref: PropTypes.object,
    label: PropTypes.string,
  }),
  hasBorderRadius: PropTypes.bool,
  scrollSupported: PropTypes.bool,
};

PeaGroupCard.defaultProps = {
  onEdit: undefined,
  onDelete: undefined,
  onJoin: undefined,
  onLeave: undefined,
  actionText: 'Join',
  isMember: false,
  isLoading: false,
  children: undefined,
  selectedTab: undefined,
  hasBorderRadius: false,
  scrollSupported: false,
};

PeaGroupCard.metadata = {
  name: 'Pea Group Card',
};

PeaGroupCard.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default PeaGroupCard;
