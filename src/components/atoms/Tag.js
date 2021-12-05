import React from 'react';
import cx from 'clsx';
import Color from 'color';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Icon from 'extensions/Icon';

const useStyles = makeStyles(({ spacing, palette }) => {
  const initialBgColor = palette.grey[100];
  const shade = palette.primary;
  const hoveredBgColor = shade.light;
  const hoveredTextColor = shade.dark;
  return {
    root: {
      backgroundColor: initialBgColor,
      '&:hover': {
        backgroundColor: hoveredBgColor,
        color: hoveredTextColor,
        '& .MuiIcon-root': {
          color: hoveredTextColor,
          marginLeft: spacing(1),
          visibility: 'visible',
          opacity: 1,
        },
        '& .Tag-overline': {
          color: Color(hoveredTextColor).fade(0.3).toString(),
        },
      },
    },
    label: {
      transition: '0.2s',
      textTransform: 'initial',
    },
    icon: {
      fontSize: 18,
      visibility: 'hidden',
      opacity: 0,
      transition: '0.3s',
      color: palette.common.white,
      marginLeft: -spacing(1.5),
      '& .MuiIcon--fa': {
        padding: 0,
      },
    },
    overline: {
      display: 'block',
      lineHeight: 1,
      fontSize: 10,
      textAlign: 'left',
      textTransform: 'uppercase',
      marginTop: 4,
      color: palette.text.secondary,
    },
  };
});

const Tag = ({ className, children, icon, overline, ...props }) => {
  const classes = useStyles();
  return (
    <Button
      className={cx('Tag-root', classes.root, className)}
      {...props}
      classes={{ label: classes.label }}
    >
      {overline ? (
        <div>
          <span className={cx('Tag-overline', classes.overline)}>
            {overline}
          </span>
          {children}
        </div>
      ) : (
        children
      )}
      {icon && <Icon className={classes.icon}>{icon}</Icon>}
    </Button>
  );
};

Tag.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  icon: PropTypes.string,
  overline: PropTypes.string,
};
Tag.defaultProps = {
  className: '',
  icon: '',
  overline: '',
};

export default Tag;
