import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';

import PeaButton from './PeaButton';
import PeaIcon from './PeaIcon';
import PeaAvatar from './PeaAvatar';
import PeaStatistic from './PeaStatistic';
import PeaText from './PeaTypography';

const PeaGroupCard = ({
  isMember,
  name,
  cover,
  image,
  type,
  tag,
  AvatarProps,
  onJoin,
  onLeave,
  onEdit,
  onDelete,
  onReport,
  actionText,
}) => {
  const [anchorEl, setAnchor] = useState(null);
  const open = Boolean(anchorEl);

  const joinButtonProps = {
    size: 'small',
    style: { marginLeft: 8, minWidth: 120 },
    onClick: () => (isMember ? onLeave() : onJoin()),
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
              Edit {tag}
            </PeaText>
          </ListItemText>
        </MenuItem>
      )}

      <Divider variant={'middle'} />

      {onDelete && (
        <MenuItem onClick={onDeleteClicked}>
          <ListItemText disableTypography>
            <PeaText color={'error'} variant={'body1'} weight={'bold'}>
              Delete {tag}
            </PeaText>
          </ListItemText>
        </MenuItem>
      )}

      <Divider variant={'middle'} />

      <MenuItem onClick={onReportClicked}>
        <ListItemText disableTypography>
          <PeaText color={'error'} variant={'body1'} weight={'bold'}>
            Report {tag}
          </PeaText>
        </ListItemText>
      </MenuItem>
    </Menu>
  );

  return (
    <Card className={'PeaProfileCard-root'}>
      <CardMedia className={'MuiCardMedia-root'} image={cover}>
        <PeaAvatar src={image} size={'large'} {...AvatarProps} />
      </CardMedia>

      <CardContent className={'MuiCardContent-root'}>
        <div className={'PeaProfileCard-actions'}>
          {type !== 'PERSONAL' && (
            <PeaButton
              variant={'contained'}
              color={isMember ? 'primary' : 'danger'}
              {...joinButtonProps}
            >
              {actionText}
            </PeaButton>
          )}
          <IconButton
            className={'MuiIconButton--tiny'}
            style={{ marginLeft: 8 }}
            onClick={e => setAnchor(e.currentTarget)}
          >
            <PeaIcon>more_vert</PeaIcon>
          </IconButton>
          {renderMenu()}
        </div>

        <Typography className={'MuiTypography--heading'}>{name}</Typography>

        <Typography className={'MuiTypography--subheading'}>{tag}</Typography>

        <Grid container justify={'space-between'}>
          <Grid item>
            <PeaStatistic label={'Pods'} value={2} />
          </Grid>
          <Grid item>
            <PeaStatistic label={'Following'} value={48} />
          </Grid>
          <Grid item>
            <PeaStatistic label={'Followers'} value={5} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

PeaGroupCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onReport: PropTypes.func.isRequired,
  tag: PropTypes.string,
  AvatarProps: PropTypes.shape({}),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  actionText: PropTypes.string,
  isMember: PropTypes.bool,
  onJoin: PropTypes.func,
  onLeave: PropTypes.func,
};

PeaGroupCard.defaultProps = {
  tag: '',
  AvatarProps: {},
  onEdit: undefined,
  onDelete: undefined,
  onJoin: undefined,
  onLeave: undefined,
  actionText: 'Join',
  isMember: false,
};

PeaGroupCard.metadata = {
  name: 'Pea Profile Card',
};

PeaGroupCard.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default PeaGroupCard;
