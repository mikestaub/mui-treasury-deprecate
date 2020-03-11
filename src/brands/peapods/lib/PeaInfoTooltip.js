import React from 'react';
import PropTypes from 'prop-types';
import HelpIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';

const PeaInfoTooltip = ({ description }) => {
  return (
    <Tooltip title={description}>
      <HelpIcon color={'primary'} />
    </Tooltip>
  );
};

PeaInfoTooltip.propTypes = {
  description: PropTypes.string,
};

PeaInfoTooltip.defaultProps = {
  description: '',
};

PeaInfoTooltip.metadata = {
  name: 'Pea Info Tooltip',
  libraries: [
    {
      text: 'clsx',
      link: 'https://github.com/lukeed/clsx',
    },
  ],
};

PeaInfoTooltip.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default PeaInfoTooltip;
