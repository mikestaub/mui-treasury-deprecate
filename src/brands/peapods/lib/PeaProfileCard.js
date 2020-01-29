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
import ListItemText from '@material-ui/core/ListItemText';

import PeaButton from './PeaButton';
import PeaIcon from './PeaIcon';
import PeaAvatar from './PeaAvatar';
import PeaStatistic from './PeaStatistic';

const PeaProfileCard = ({
  cover,
  image,
  name,
  tag,
  AvatarProps,
  moreMenus,
}) => {
  const [anchorEl, setAnchor] = useState(null);

  const open = Boolean(anchorEl);

  const onMenuClick = click => () => {
    setAnchor(null);
    if (click) click();
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
      {moreMenus.map(({ label, handleClick }) => (
        <MenuItem onClick={onMenuClick(handleClick)}>
          <ListItemText disableTypography>{label}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <Card className={'PeaProfileCard-root'}>
      <CardMedia className={'MuiCardMedia-root'} image={cover}>
        <PeaAvatar src={image} size={'large'} {...AvatarProps} />
      </CardMedia>
      <CardContent className={'MuiCardContent-root'}>
        <div className={'PeaProfileCard-actions'}>
          <PeaButton size={'small'} icon={'settings'}>
            Settings
          </PeaButton>
          <IconButton
            className={'MuiIconButton--tiny'}
            style={{ marginLeft: 8 }}
            onClick={e => setAnchor(e.currentTarget)}
          >
            <PeaIcon>more_vert</PeaIcon>
          </IconButton>
          {moreMenus && renderMenu()}
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

PeaProfileCard.propTypes = {
  image: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  tag: PropTypes.string,
  moreMenus: PropTypes.arrayOf(PropTypes.shape({})),
  AvatarProps: PropTypes.shape({}),
};
PeaProfileCard.defaultProps = {
  tag: '',
  AvatarProps: {},
  moreMenus: undefined,
};
PeaProfileCard.metadata = {
  name: 'Pea Profile Card',
};
PeaProfileCard.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default PeaProfileCard;
