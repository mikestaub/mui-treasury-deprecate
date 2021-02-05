import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PeaButton from './PeaButton';
import PeaIcon from './PeaIcon';
import PeaAvatar from './PeaAvatar';
import PeaStatistic from './PeaStatistic';

const PeaProfileCard = ({ cover, image, name, tag, AvatarProps, onUserClick }) => (
  <Card className={'PeaProfileCard-root'}>
    <CardMedia className={'MuiCardMedia-root'} image={cover}>
      <PeaAvatar src={image} size={'large'} {...AvatarProps} onClick={onUserClick} />
    </CardMedia>
    <CardContent className={'MuiCardContent-root'}>
      <div className={'PeaProfileCard-actions'}>
        <PeaButton size={'small'} icon={'settings'}>
          Settings
        </PeaButton>
        <IconButton className={'MuiIconButton--tiny'} style={{ marginLeft: 8 }}>
          <PeaIcon>more_vert</PeaIcon>
        </IconButton>
      </div>
      <Typography className={'MuiTypography--heading'} onClick={onUserClick}>{name}</Typography>
      <Typography className={'MuiTypography--subheading'} onClick={onUserClick}>{tag}</Typography>
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

PeaProfileCard.propTypes = {
  image: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  tag: PropTypes.string,
  AvatarProps: PropTypes.shape({}),
  onUserClick: PropTypes.func,
};
PeaProfileCard.defaultProps = {
  tag: '',
  AvatarProps: {},
  onUserClick: () => {},
};
PeaProfileCard.metadata = {
  name: 'Pea Profile Card',
};
PeaProfileCard.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default PeaProfileCard;
