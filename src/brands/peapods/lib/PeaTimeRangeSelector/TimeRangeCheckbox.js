import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import HelpIcon from '@material-ui/icons/Help';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => {
  return {
    warning: {
      color: theme.palette.secondary.main,
    },
    error: {
      color: theme.palette.error.main,
    },
  };
});

const TimeRangeCheckbox = ({
  isChecked,
  isIndeterminate,
  isMaybe,
  isUnavailable,
  onChange,
  value,
}) => {
  const classes = useStyles();

  let icon;
  let colorClass;
  let label = 'available';

  if (isMaybe) {
    icon = <HelpIcon />;
    colorClass = classes.warning;
    label = 'maybe';
  } else if (isUnavailable) {
    icon = <CancelIcon />;
    colorClass = classes.error;
    label = 'unavailable';
  }

  return (
    <FormControlLabel
      control={
        <Checkbox
          classes={{
            colorPrimary: colorClass,
          }}
          color="primary"
          icon={icon}
          checked={isChecked}
          onChange={onChange}
          name={value}
          indeterminate={isIndeterminate}
        />
      }
      label={label}
    />
  );
};

TimeRangeCheckbox.propTypes = {
  isChecked: PropTypes.bool,
  isIndeterminate: PropTypes.bool,
  isMaybe: PropTypes.bool,
  isUnavailable: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

TimeRangeCheckbox.defaultProps = {
  isChecked: false,
  isIndeterminate: false,
  isMaybe: false,
  isUnavailable: false,
};

export default TimeRangeCheckbox;
