import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

import Container from '@material-ui/core/Container';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import PeaIcon from './PeaIcon';

const useStyles = makeStyles(() => ({
  motion: {
    top: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    zIndex: 1000,
    '&:before': {
      content: '" "',
      display: 'block',
      height: 50,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      background: 'white',
    },
  },
}));

const MotionWrapper = forwardRef(({ open, children, ...rest }, ref) => {
  const classes = useStyles();

  const closed = { y: '100%', height: '100%' };

  const variants = {
    open: {
      height: '30%',
    },
    closed,
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          exit={closed}
          initial={closed}
          variants={variants}
          animate={open ? 'open' : 'closed'}
          transition={{ duration: 0.5 }}
          className={classes.motion}
          {...rest}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

const renderContent = ({
  titleVariant,
  title,
  closeButtonHidden,
  content,
  actions,
  onClose,
}) => {
  return (
    <>
      <DialogTitle
        className={cx(
          titleVariant === 'contained' && 'DialogTitle--contained',
          titleVariant === 'secondaryCentered' &&
            'DialogTitle--secondaryCentered',
        )}
      >
        {title}

        {!closeButtonHidden && (
          <IconButton className={'DialogCloseButton'} onClick={onClose}>
            <PeaIcon icon={'close'} />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent className={'DialogContent--root'}>
        {typeof content === 'string' ? (
          <Typography align={'center'}>{content}</Typography>
        ) : (
          content
        )}
      </DialogContent>

      <DialogActions className={'DialogActions-root'}>
        {React.Children.toArray(actions)}
      </DialogActions>
    </>
  );
};

const PeaDialog = ({
  className,
  title,
  titleVariant,
  closeButtonHidden,
  content,
  actions,
  open,
  onClose,
  ...props
}) => {
  const theme = useTheme();
  const { md } = theme.breakpoints.values;
  const isMobile = useMediaQuery(`(max-width:${md}px)`);

  const contentProps = {
    titleVariant,
    title,
    closeButtonHidden,
    content,
    actions,
    onClose,
  };

  const onScroll = e => e.stopPropagation();

  return isMobile ? (
    <div onScroll={onScroll} onWheel={onScroll} onTouchMove={onScroll}>
      <Backdrop open={open} transitionDuration={500} onClick={onClose} />

      <MotionWrapper open={open}>
        <Container
          className={cx(
            'MuiDialog-root',
            'PeaDialog',
            'PeaEventDialog',
            'PeaGroupDialog',
            className,
          )}
        >
          {renderContent(contentProps)}
        </Container>
      </MotionWrapper>
    </div>
  ) : (
    <Dialog
      open={open}
      className={cx('PeaDialog', className)}
      onClose={onClose}
      {...props}
    >
      {renderContent(contentProps)}
    </Dialog>
  );
};

PeaDialog.propTypes = {
  titleVariant: PropTypes.oneOf(['contained', 'secondaryCentered']),
  closeButtonHidden: PropTypes.bool,
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  actions: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};

PeaDialog.defaultProps = {
  titleVariant: 'secondaryCentered',
  closeButtonHidden: false,
  className: '',
  title: '',
  content: '',
  actions: [],
  open: false,
};

PeaDialog.metadata = {
  name: 'Pea Confirmation',
  libraries: [
    {
      text: 'clsx',
      link: 'https://github.com/lukeed/clsx',
    },
  ],
};

PeaDialog.BlockedActions = (
  onSubmit = () => alert('Blocked!'),
  onCancel = () => alert('Canceled!'),
) => [
  <Button onClick={onCancel}>Cancel</Button>,
  <Button className={'MuiButton--danger'} onClick={onSubmit}>
    Block
  </Button>,
];

export default PeaDialog;
