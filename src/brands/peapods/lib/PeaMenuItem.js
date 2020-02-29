import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import PeaIcon from './PeaIcon';

const styles = ({ palette, breakpoints }) => {
  const root = {
    color: palette.secondary.main,
    [breakpoints.down('md')]: {
      color: palette.grey[600],
    },
    transition: 'transform 0.2s',
    '&:hover': {
      cursor: 'pointer',
      transform: 'scale(1.1)',
      color: palette.primary.main,
      '& .PeaMenuItem-label': {
        color: palette.primary.main,
      },
    },
    '& .PeaMenuItem-label': {
      color: palette.secondary.main,
      fontWeight: 'bold',
      lineHeight: 1,
    },
  };

  const selected = {
    ...root,
    color: palette.primary.main,
    transform: 'scale(1.1)',
    [breakpoints.down('md')]: {
      color: palette.primary.main,
    },
    '& .PeaMenuItem-label': {
      color: palette.primary.main,
      fontWeight: 'bold',
      lineHeight: 1,
    },
  };

  return {
    root,
    selected,
  };
};

const PeaMenuItem = ({
  className,
  classes,
  label,
  icon,
  badgeShowed,
  badgeContent,
  BadgeProps,
  IconProps,
  labelProps,
  onClick,
  isVertical,
  isSelected,
  ...props
}) => {
  const renderIcon = () => icon && <PeaIcon icon={icon} {...IconProps} />;

  const localClass = isSelected
    ? clsx(classes.selected, className)
    : clsx(classes.root, className);

  return (
    <Box className={localClass} display={'flex'} onClick={onClick} {...props}>
      {badgeShowed ? (
        <Badge badgeContent={badgeContent} color="error" {...BadgeProps}>
          {renderIcon()}
        </Badge>
      ) : (
        renderIcon()
      )}

      {isVertical ? (
        <Typography className={'PeaMenuItem-label'} {...labelProps}>
          {label}
        </Typography>
      ) : (
        <Box px={1} display={'flex'} alignItems={'center'}>
          <Typography className={'PeaMenuItem-label'} {...labelProps}>
            {label}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

PeaMenuItem.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  classes: PropTypes.shape({
    label: PropTypes.string,
    root: PropTypes.string,
  }).isRequired,
  badgeShowed: PropTypes.bool,
  badgeContent: PropTypes.number,
  BadgeProps: PropTypes.shape({}),
  IconProps: PropTypes.shape({}),
  label: PropTypes.string,
  labelProps: PropTypes.shape({}),
  isVertical: PropTypes.bool,
  isSelected: PropTypes.bool,
};

PeaMenuItem.defaultProps = {
  onClick: () => {},
  BadgeProps: {},
  IconProps: {},
  labelProps: {},
  badgeShowed: false,
  badgeContent: undefined,
  label: '',
  className: '',
  isVertical: false,
  isSelected: false,
  icon: undefined,
};

PeaMenuItem.metadata = {
  name: 'Pea Menu Item',
  libraries: [
    {
      text: 'clsx',
      link: 'https://github.com/lukeed/clsx',
    },
  ],
};

PeaMenuItem.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default withStyles(styles, { name: 'PeaMenuItem' })(PeaMenuItem);
