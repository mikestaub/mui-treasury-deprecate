import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Icon from 'extensions/Icon';

const Copier = ({ text, children }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (t, result) => {
    if (result) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return (
    <CopyToClipboard onCopy={handleCopy} text={text}>
      {children({ copied })}
    </CopyToClipboard>
  );
};

Copier.Text = ({ text, ...props }) => (
  <Copier text={text}>
    {({ copied }) => (
      <Icon
        size={'small'}
        {...props}
        link={!copied}
        color={copied ? 'success' : 'secondary'}
      >
        {copied ? 'check_circle' : 'file_copy'}
      </Icon>
    )}
  </Copier>
);
Copier.Text.propTypes = {
  text: PropTypes.string.isRequired,
};

Copier.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default Copier;
