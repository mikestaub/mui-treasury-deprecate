import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
  },
}));

const PeaLoadingSpinner = ({ noMargin, ...props }) => {
  const classes = useStyles();

  const className = noMargin ? undefined : classes.progress;

  return <CircularProgress className={className} {...props} />;
};

PeaLoadingSpinner.propTypes = {
  noMargin: PropTypes.bool,
};

PeaLoadingSpinner.defaultProps = {
  noMargin: false,
};

PeaLoadingSpinner.metadata = {
  name: 'Pea Loading Spinner',
  libraries: [
    {
      text: 'clsx',
      link: 'https://github.com/lukeed/clsx',
    },
  ],
};

PeaLoadingSpinner.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default PeaLoadingSpinner;
