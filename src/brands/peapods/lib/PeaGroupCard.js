import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
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
  isMember,
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
}) => {
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
    <Card className={'PeaProfileCard-root'}>
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
                <PeaText>{`${humanFormat(memberCount, { decimals: 0 })} member${
                  memberCount === 1 ? '' : 's'
                }`}</PeaText>
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
  onJoin: PropTypes.func,
  onLeave: PropTypes.func,
};

PeaGroupCard.defaultProps = {
  onEdit: undefined,
  onDelete: undefined,
  onJoin: undefined,
  onLeave: undefined,
  actionText: 'Join',
  isMember: false,
};

PeaGroupCard.metadata = {
  name: 'Pea Group Card',
};

PeaGroupCard.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default PeaGroupCard;
