import React, {
  memo,
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
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

import PeaButton from './PeaButton';
import PeaIcon from './PeaIcon';
import PeaText from './PeaTypography';

const PeaGroupCard = ({
  isMobile,
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
  onScrollToTop,
  onScroll,
  actionText,
  hasBorderRadius,
  children,
  selectedTab,
  scrollSupported,
  innerRef,
  renderTopBar,
}) => {
  const lastTouchRef = useRef();
  const contentRef = useRef();

  const [anchorEl, setAnchor] = useState(null);
  const open = Boolean(anchorEl);

  const joinButtonProps = {
    size: 'small',
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
        <MenuItem id="group-delete-option" onClick={onDeleteClicked}>
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
      elevation={isMobile ? 0 : 1}
      className={
        hasBorderRadius ? 'PeaGroupProfile-root' : 'PeaProfileCard-root'
      }
      ref={innerRef}
      onScroll={onScroll}
    >
      {renderTopBar && renderTopBar()}

      <CardMedia className={'MuiCardMedia-root'} image={image} />

      <CardContent className={'MuiCardContent-root'}>
        <Grid container direction="column">
          <Grid
            container
            justify="space-between"
            alignItems="center"
            spacing={1}
          >
            <Grid item alignItems={'center'} xs>
              <PeaText variant={'h6'} weight={'bold'}>
                {name}
              </PeaText>
            </Grid>

            <Grid item>
              {type !== 'PERSONAL' && (
                <PeaButton
                  variant={'contained'}
                  color={isMember ? 'primary' : 'danger'}
                  style={{ minWidth: 100 }}
                  loading={isLoading}
                  {...joinButtonProps}
                >
                  {actionText}
                </PeaButton>
              )}
            </Grid>

            <Grid item>
              <PeaButton
                shape={'circular'}
                icon={'email'}
                size={'small'}
                onClick={onMessage}
                tooltip="message"
              />
            </Grid>

            <Grid item>
              <PeaButton
                id={`${name.replace(/\s/g, '')}-more-options`}
                shape={'circular'}
                icon={'more_vert'}
                size={'small'}
                onClick={e => setAnchor(e.currentTarget)}
                tooltip="more"
              />

              {renderMenu()}
            </Grid>
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
  onScrollToTop: PropTypes.func,
  onScroll: PropTypes.func,
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
  onScrollToTop: () => {},
  onScroll: () => {},
};

PeaGroupCard.metadata = {
  name: 'Pea Group Card',
};

PeaGroupCard.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default memo(
  forwardRef((props, ref) => <PeaGroupCard innerRef={ref} {...props} />),
);
