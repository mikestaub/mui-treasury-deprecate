/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField/TextField';
import CardMedia from '@material-ui/core/CardMedia';
import ButtonBase from '@material-ui/core/ButtonBase';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import PeaDialog from './PeaDialog';
import PeaButton from './PeaButton';
import PeaLoadingSpinner from './PeaLoadingSpinner';
import PeaIcon from './PeaIcon';
import PeaSocialAvatar from './PeaSocialAvatar';

// TODO: render group members

const PeaGroupDialog = ({
  dialogTitle,
  actionText,
  name,
  description,
  type,
  inviteInput,
  typeInput,
  tagsInput,
  profilePhoto,
<<<<<<< HEAD
  members,
  submitting,
=======
  loading,
>>>>>>> e70b8667c8adc8aba6ac357390e5f8fadb4b23e9
  onChangeCoverPhotoClicked,
  onChange,
  onClose,
  onSave,
  ...props
}) => (
  <PeaDialog
    className={'PeaDialog'}
    title={dialogTitle}
    titleVariant={'secondaryCentered'}
    content={
      <>
<<<<<<< HEAD
        <FormLabel component="legend">Cover Picture</FormLabel>

        <Box
          style={{
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          <CardMedia
            className={'MuiCardMedia-root'}
            image={profilePhoto}
            style={profilePhoto && { border: 'none' }}
            onClick={onChangeCoverPhotoClicked}
          >
            <ButtonBase className={'PeaGroup-coverImgBtn'}>
              <PeaIcon
                inverted
                icon={'add'}
                shape={'square'}
                style={{ fontSize: 100 }}
              />
            </ButtonBase>
          </CardMedia>
        </Box>

        {inviteInput}

        {members && members.length > 0 && (
          <Grid item>
            <FormLabel component="legend">Members</FormLabel>
            <Grid container>
              {members.map(member => (
                <Grid item key={member.id}>
                  <PeaSocialAvatar
                    name={member.name}
                    src={member.profilePhoto}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

=======
>>>>>>> e70b8667c8adc8aba6ac357390e5f8fadb4b23e9
        <TextField
          required
          fullWidth
          margin={'normal'}
          label={'Name'}
          InputLabelProps={{
            shrink: true,
          }}
          value={name}
          onChange={onChange('name')}
        />

        <FormControl margin={'normal'} fullWidth>
          <FormLabel component="legend">Cover Picture</FormLabel>

          <Box
            style={{
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            <CardMedia
              className={'MuiCardMedia-root'}
              image={profilePhoto}
              style={{
                position: 'relative',
                minHeight: 200,
                border: profilePhoto && 'none',
              }}
              onClick={onChangeCoverPhotoClicked}
            >
              <ButtonBase className={'PeaGroupForm-photoBtn'}>
                <PeaIcon
                  inverted
                  icon={'add'}
                  shape={'square'}
                  style={{ fontSize: 100 }}
                />
              </ButtonBase>
            </CardMedia>
          </Box>
        </FormControl>

        <TextField
          fullWidth
          margin={'normal'}
          label={'Description'}
          InputLabelProps={{
            shrink: true,
          }}
          value={description || ''}
          onChange={onChange('description')}
        />

        {inviteInput}

        {tagsInput}

        {typeInput}
      </>
    }
    actions={[
      <PeaButton onClick={onClose}>Cancel</PeaButton>,
      <PeaButton
        color={'primary'}
        variant={'contained'}
        disabled={loading}
        onClick={onSave}
      >
        {loading ? (
          <PeaLoadingSpinner size={20} style={{ margin: 0 }} />
        ) : (
          actionText
        )}
      </PeaButton>,
    ]}
    onClose={onClose}
    {...props}
  />
);

PeaGroupDialog.metadata = {
  name: 'Pea Group Dialog',
};

PeaGroupDialog.propTypes = {
  dialogTitle: PropTypes.string,
  actionText: PropTypes.string,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  type: PropTypes.string.isRequired,
  inviteInput: PropTypes.node.isRequired,
  tagsInput: PropTypes.node.isRequired,
  typeInput: PropTypes.node.isRequired,
  profilePhoto: PropTypes.string,
<<<<<<< HEAD
  members: PropTypes.arrayOf(PropTypes.object),
  submitting: PropTypes.bool,
=======
  loading: PropTypes.bool,
>>>>>>> e70b8667c8adc8aba6ac357390e5f8fadb4b23e9
  onChangeCoverPhotoClicked: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

PeaGroupDialog.defaultProps = {
  dialogTitle: 'Create Group',
  actionText: 'Create',
  loading: false,
  description: '',
  profilePhoto: undefined,
  members: undefined,
  onChangeCoverPhotoClicked: () => {},
};

export default PeaGroupDialog;
