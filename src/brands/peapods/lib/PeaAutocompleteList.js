/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import AsyncCreatable from 'react-select/async-creatable';
import Creatable from 'react-select/creatable';
import cx from 'clsx';
import { uniqBy } from 'lodash';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';

import PeaTag from './PeaTag';
import PeaSearchInputControl from './PeaSearchInputControl';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 360,
    padding: (props) => (props.removeSpacing ? 0 : 4),
    '&.fullWidth': {
      width: '100%',
    },
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
  },
  valueContainer: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
    marginLeft: (props) => (props.removeSpacing ? 0 : 10),
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 34,
    bottom: 7,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    left: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function NoOptionsMessage({ children, innerProps, selectProps }) {
  return (
    <Typography
      color="textSecondary"
      className={selectProps.classes.noOptionsMessage}
      {...innerProps}
    >
      {children}
    </Typography>
  );
}

NoOptionsMessage.defaultProps = {
  children: null,
  innerProps: null,
};

NoOptionsMessage.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
};

function Option({ children, innerRef, innerProps, isFocused, isSelected }) {
  return (
    <MenuItem
      ref={innerRef}
      selected={isFocused}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
      {...innerProps}
    >
      {children}
    </MenuItem>
  );
}

Option.defaultProps = {
  children: null,
  innerProps: null,
  innerRef: () => {},
  isFocused: false,
  isSelected: false,
};

Option.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool,
};

function MultiValue({ children, removeProps, data }) {
  const node = data && data.node;

  let src;
  if (node) {
    src = node.profilePhoto || (node.profilePhotos && node.profilePhotos[0]);
  }

  return (
    <PeaTag
      tabIndex={-1}
      src={src}
      label={children}
      onDelete={removeProps.onClick}
      onClick={removeProps.onClick}
      color="primary"
    />
  );
}

MultiValue.propTypes = {
  children: PropTypes.node.isRequired,
  removeProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    onTouchEnd: PropTypes.func.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
    node: PropTypes.shape({
      id: PropTypes.string,
      profilePhoto: PropTypes.string,
      profilePhotos: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

MultiValue.defaultProps = {
  data: undefined,
};

function ValueContainer({ selectProps, children }) {
  return <div className={selectProps.classes.valueContainer}>{children}</div>;
}

ValueContainer.defaultProps = {
  children: null,
};

ValueContainer.propTypes = {
  children: PropTypes.node,
  selectProps: PropTypes.object.isRequired,
};

const PeaAutocompleteList = ({
  label,
  noOptionsMessage,
  placeholder,
  canCreate,
  suggestions,
  getSuggestions,
  InputControl,
  OptionComponent,
  onChange,
  onBlur: onBlurProp,
  isMulti,
  isLoading,
  isClearable,
  fullWidth,
  hideSuggestions,
  clearAfterEnter,
  value: propValue,
  removeSpacing,
  menuPlacement,
  autoFocus,
}) => {
  const classes = useStyles({ removeSpacing, isUpsideDown: true });

  const theme = useTheme();

  const selectRef = useRef(null);

  const [preserveFocus, setPreserveFocus] = useState(false);
  const [value, setValue] = useState(propValue);
  const [inputValue, setInputValue] = useState('');
  const isAsync = !!getSuggestions;

  const focusInput = useCallback(() => {
    // TODO: this is hacky
    // we have to manage the focus states because of this issue: https://github.com/JedWatson/react-select/issues/3832
    if (preserveFocus && selectRef.current) {
      selectRef?.current?.inputRef?.focus();
    }
  }, [preserveFocus]);

  const blurInput = () => {
    selectRef?.current?.inputRef?.blur();
  };

  useEffect(() => {
    focusInput();
  }, [inputValue, focusInput]);

  function handleSelectChange(val) {
    let newValue = val;
    if (Array.isArray(val)) {
      newValue = uniqBy(val, 'value');
    }
    if (!clearAfterEnter) {
      setValue(newValue);
    }
    onChange(newValue);
    blurInput();
    if (!val) {
      focusInput();
    }
  }

  const selectStyles = {
    input: (base) => ({
      ...base,
      position: 'relative',
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
        position: 'absolute',
        left: 0,
        right: 0,
      },
    }),
    menuList: (base) => ({
      ...base,
      overflowX: 'hidden',
    }),
    placeholder: (base) => ({
      ...base,
      position: 'absolute',
      left: 0,
      right: 0,
      marginLeft: 8,
    }),
    singleValue: (base) => ({
      ...base,
      position: 'absolute',
      left: 0,
      right: 0,
      marginLeft: 8,
    }),
    valueContainer: (base) => ({
      ...base,
      position: 'relative',
    }),
    clearIndicator: (base) => ({
      color: 'blue',
      '& :hover': {
        cursor: 'pointer',
      },
    }),
  };

  const components = {
    NoOptionsMessage,
    Option: OptionComponent,
    MultiValue,
    ValueContainer,
    Control: InputControl,
    DropdownIndicator: null,
  };

  const handleKeyDown = (event) => {
    if (!canCreate) {
      return;
    }
    const newVal = { label: inputValue, value: inputValue };

    const codes = [
      13, // enter
      9, // tab
      32, // space
    ];

    const isNewValue =
      inputValue && !value.map((i) => i.value).includes(inputValue.trim());

    if (isNewValue && codes.includes(event.keyCode)) {
      event.preventDefault();
      setInputValue('');
      if (isMulti) {
        handleSelectChange([...value, newVal]);
      } else {
        handleSelectChange(newVal);
      }
    }
  };

  const handleInputChange = (val) => {
    setInputValue(val);
  };

  const syncProps = isAsync
    ? {}
    : {
        menuIsOpen: !canCreate || hideSuggestions ? false : undefined,
        onKeyDown: handleKeyDown,
        onInputChange: handleInputChange,
        options: suggestions,
      };

  let SelectComponent = canCreate ? Creatable : Select;

  if (isAsync) {
    SelectComponent = canCreate ? AsyncCreatable : AsyncSelect;
  }

  const key = value && value.length ? JSON.stringify(value) : inputValue;

  const onBlur = (e) => {
    if (inputValue) {
      const newVal = { label: inputValue, value: inputValue };
      if (isMulti) {
        handleSelectChange([...value, newVal]);
      } else {
        handleSelectChange(newVal);
      }
    }
    if (onBlurProp) {
      onBlurProp(e);
    }
  };

  const onFocus = () => {
    setPreserveFocus(true);
  };

  return (
    <div className={cx(classes.root, fullWidth && 'fullWidth')}>
      <SelectComponent
        key={key}
        ref={(ref) => {
          selectRef.current = ref;
        }}
        classes={classes}
        styles={selectStyles}
        inputId="react-select-single"
        placeholder={placeholder}
        autoFocus={autoFocus}
        value={value}
        // TODO: verify this prop is working when we upgrade packages
        // https://github.com/JedWatson/react-select/pull/3690
        isLoading={isLoading}
        inputValue={inputValue.length ? inputValue : undefined}
        isClearable={isClearable}
        openMenuOnClick={!isAsync}
        cacheOptions={isAsync}
        loadOptions={getSuggestions}
        noOptionsMessage={() => noOptionsMessage}
        components={components}
        onChange={handleSelectChange}
        onBlur={onBlur}
        onFocus={onFocus}
        isMulti={isMulti}
        menuShouldScrollIntoView
        menuPlacement={menuPlacement}
        TextFieldProps={{
          label,
        }}
        {...syncProps}
      />
    </div>
  );
};

PeaAutocompleteList.defaultProps = {
  noOptionsMessage: 'No results found',
  label: undefined,
  canCreate: true,
  placeholder: '',
  fullWidth: true,
  isLoading: false,
  isClearable: false,
  clearOnFocus: true,
  getSuggestions: undefined,
  hideSuggestions: false,
  clearAfterEnter: false,
  suggestions: [],
  value: [],
  isMulti: false,
  InputControl: PeaSearchInputControl,
  OptionComponent: Option,
  removeSpacing: false,
  menuPlacement: 'auto',
  autoFocus: false,
  onBlur: undefined,
};

PeaAutocompleteList.propTypes = {
  noOptionsMessage: PropTypes.string,
  label: PropTypes.string,
  canCreate: PropTypes.bool,
  value: PropTypes.arrayOf(PropTypes.object),
  isMulti: PropTypes.bool,
  isLoading: PropTypes.bool,
  isClearable: PropTypes.bool,
  getSuggestions: PropTypes.func,
  placeholder: PropTypes.string,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    }),
  ),
  fullWidth: PropTypes.bool,
  clearOnFocus: PropTypes.bool,
  InputControl: PropTypes.func,
  OptionComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  hideSuggestions: PropTypes.bool,
  clearAfterEnter: PropTypes.bool,
  removeSpacing: PropTypes.bool,
  menuPlacement: PropTypes.string,
  autoFocus: PropTypes.bool,
};

PeaAutocompleteList.metadata = {
  name: 'Pea AutocompleteList',
};
PeaAutocompleteList.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default memo(PeaAutocompleteList);
