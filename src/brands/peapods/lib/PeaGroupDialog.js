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
import PeaInfoTooltip from './PeaInfoTooltip';

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
  loading,
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
        <Grid container alignItems={'flex-start'} wrap={'nowrap'}>
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
          <Box mt={2}>
            <PeaInfoTooltip description={'The name of group'} />
          </Box>
        </Grid>
        <FormControl margin={'normal'} fullWidth>
          <Grid
            container
            alignItems={'center'}
            justify={'space-between'}
            wrap={'nowrap'}
          >
            <FormLabel component="legend">Cover Picture</FormLabel>
            <Box mb={0.5}>
              <PeaInfoTooltip description={'The cover picture of group'} />
            </Box>
          </Grid>

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

        <Grid container alignItems={'flex-start'} wrap={'nowrap'}>
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
          <Box mt={2}>
            <PeaInfoTooltip description={'The description of group'} />
          </Box>
        </Grid>

        <Grid container alignItems={'flex-start'} wrap={'nowrap'}>
          {inviteInput}
          <Box mt={2}>
            <PeaInfoTooltip description={'The members of group'} />
          </Box>
        </Grid>

        <Grid container alignItems={'flex-start'} wrap={'nowrap'}>
          {tagsInput}
          <Box mt={2}>
            <PeaInfoTooltip description={'The tags of group'} />
          </Box>
        </Grid>

        <Grid container alignItems={'flex-start'} wrap={'nowrap'}>
          {typeInput}
          <Box mt={2}>
            <PeaInfoTooltip description={'The type of group'} />
          </Box>
        </Grid>
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
  loading: PropTypes.bool,
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
  onChangeCoverPhotoClicked: () => {},
};

export default PeaGroupDialog;
