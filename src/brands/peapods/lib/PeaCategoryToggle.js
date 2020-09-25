/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => {
  const blurLength = 5;
  const imageSize = 100;
  const mobileImageSize = 80;

  return {
    root: {},
    horizontal: {
      maxHeight: mobileImageSize,
      display: 'flex',
      flex: 1,
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.grey[100],
        '& .MuiTypography-body2': {
          transition: 'color 0.2s linear',
          color: theme.palette.secondary.main,
        },
      },
    },
    imageWrapper: {
      position: 'relative',
      marginBottom: theme.spacing(1),
    },
    imageWrapperHorizontal: {
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
    },
    imageButton: {
      padding: 0,
      border: 'none',
      transition: 'transform ease 0.3s',
      '&:hover': {
        transform: 'scale(1.1)',
      },
    },
    imageHorizontal: {
      display: 'block',
      width: mobileImageSize,
      objectFit: 'cover',
      cursor: 'pointer',
    },
    image: {
      display: 'block',
      width: imageSize,
      objectFit: 'cover',
      cursor: 'pointer',
      [theme.breakpoints.only('xs')]: {
        width: mobileImageSize,
      },
    },
    mainImage: {
      position: 'relative',
      zIndex: 1,
    },
    blurredImage: {
      position: 'absolute',
      top: 4,
      '-webkit-filter': `blur(${blurLength}px)`,
      filter: `blur(${blurLength}px)`,
    },
    formLabelRoot: {
      marginRight: 0,
    },
    formLabelRootHorizontal: {
      marginRight: 0,
      width: '100%',
    },
    formLabelLabel: {
      fontWeight: 500,
      color: theme.palette.secondary.main,
    },
  };
};

const PeaCategoryToggle = withStyles(styles, { name: 'PeaCategoryToggle' })(
  ({
    src,
    classes,
    FormControlLabelProps,
    CheckboxProps,
    label,
    checked,
    onChange,
    value,
    isHorizontal,
  }) => {
    const checkElement = useRef(null);

    const handleImageClick = () => {
      if (checkElement.current) {
        checkElement.current.click();
      }
    };

    return (
      <div
        className={cx(
          'PeaCategoryToggle-root',
          classes.root,
          isHorizontal ? classes.horizontal : undefined,
        )}
      >
        <div
          className={cx(
            'PeaCategoryToggle-imageWrapper',
            isHorizontal
              ? classes.imageWrapperHorizontal
              : classes.imageWrapper,
          )}
        >
          <button
            type="button"
            onClick={handleImageClick}
            className={classes.imageButton}
          >
            <img
              alt={'main'}
              src={src}
              className={cx(
                isHorizontal ? classes.imageHorizontal : classes.image,
                classes.mainImage,
              )}
            />
            <img
              alt={'blur'}
              src={src}
              className={cx(
                isHorizontal ? classes.imageHorizontal : classes.image,
                classes.blurredImage,
              )}
            />
          </button>
        </div>

        <FormControlLabel
          control={
            <Checkbox
              id={`event-category-${label.toLowerCase()}-toggle`}
              color={'primary'}
              {...CheckboxProps}
              checked={checked}
              onChange={onChange}
              ref={checkElement}
              value={value}
            />
          }
          label={label}
          {...FormControlLabelProps}
          classes={{
            root: isHorizontal
              ? classes.formLabelRootHorizontal
              : classes.formLabelRoot,
            label: classes.formLabelLabel,
            ...FormControlLabelProps.classes,
          }}
        />
      </div>
    );
  },
);

PeaCategoryToggle.propTypes = {
  label: PropTypes.string,
  src: PropTypes.string.isRequired,
  FormControlLabelProps: PropTypes.shape({}),
  CheckboxProps: PropTypes.shape({}),
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
  isHorizontal: PropTypes.bool,
};

PeaCategoryToggle.defaultProps = {
  label: '',
  FormControlLabelProps: {},
  CheckboxProps: {},
  checked: false,
  onChange: () => {},
  value: undefined,
  isHorizontal: false,
};

PeaCategoryToggle.metadata = {
  name: 'Pea Category Toggle',
  libraries: [
    {
      text: 'clsx',
      link: 'https://github.com/lukeed/clsx',
    },
  ],
};

PeaCategoryToggle.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default PeaCategoryToggle;
