import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import SwipeableViews from 'react-swipeable-views';
import AutoSizer from 'react-virtualized-auto-sizer';

const PeaSwipeableTabs = ({
  tabIndex,
  tabs,
  onTabChange,
  enableFeedback,
  children,
  customStyle,
  hasPadding,
  stickyOffset,
  ...props
}) => {
  const [index, setIndex] = useState(tabIndex);
  const [fineIndex, setFineIndex] = useState(tabIndex);

  const indicatorRef = useRef(null);

  const getLeft = () => {
    const indicatorDOM = indicatorRef.current;
    if (!indicatorDOM) return {};
    const { clientWidth } = indicatorDOM;
    return { left: fineIndex * clientWidth };
  };

  const onChange = useCallback(
    i => {
      if (i === undefined) {
        return;
      }
      setIndex(i);
      setFineIndex(i);
      onTabChange(i);
    },
    [setIndex, setFineIndex, onTabChange],
  );

  const onSwitching = !enableFeedback
    ? undefined
    : (i, type) => {
        setFineIndex(i);
        if (type === 'end') {
          onChange(i);
        }
      };

  useEffect(onChange, [tabIndex]);

  return (
    <Grid
      container
      direction="column"
      {...props}
      style={{
        ...customStyle,
        height: '100%',
      }}
    >
      <Grid
        item
        style={{
          width: '100%',
          position: 'sticky',
          background: 'white',
          height: 50,
          top: stickyOffset,
          zIndex: 1,
        }}
      >
        <Tabs
          variant={'fullWidth'}
          centered
          value={index}
          TabIndicatorProps={{
            ref: indicatorRef,
            style: {
              ...getLeft(),
              ...(index !== fineIndex && { transition: 'none' }),
            },
          }}
          onChange={(e, val) => onChange(val)}
        >
          {tabs.map(tab => (
            <Tab key={tab.label} disableRipple {...tab} />
          ))}
        </Tabs>
      </Grid>

      <div
        style={{
          height: stickyOffset,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      <Grid
        item
        style={{
          flex: 1,
        }}
      >
        <AutoSizer>
          {({ height, width }) => (
            <SwipeableViews
              style={{
                height,
                width,
              }}
              containerStyle={{
                height: '100%',
              }}
              slideStyle={{
                height: '100%',
                overflow: 'hidden',
              }}
              enableMouseEvents={enableFeedback}
              index={index}
              onSwitching={onSwitching}
            >
              {React.Children.map(children, (child, idx) => (
                <div
                  style={{
                    padding: hasPadding ? 16 : 0,
                    overflowY: 'auto',
                    height: 'calc(100% - 32px)',
                    minHeight: 'calc(100% - 32px)',
                  }}
                  ref={tabs[idx].ref}
                >
                  {child}
                </div>
              ))}
            </SwipeableViews>
          )}
        </AutoSizer>
      </Grid>
    </Grid>
  );
};

PeaSwipeableTabs.propTypes = {
  hasPadding: PropTypes.bool,
  tabIndex: PropTypes.number,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number,
      ref: PropTypes.object,
      label: PropTypes.node.isRequired,
    }),
  ).isRequired,
  children: PropTypes.node.isRequired,
  customStyle: PropTypes.shape({}),
  // disable feedback to increase performance
  enableFeedback: PropTypes.bool,
  onTabChange: PropTypes.func,
  stickOffset: PropTypes.number,
};

PeaSwipeableTabs.defaultProps = {
  hasPadding: true,
  tabIndex: 0,
  enableFeedback: true,
  customStyle: {},
  onTabChange: () => {},
  stickyOffset: 0,
};

PeaSwipeableTabs.metadata = {
  name: 'Pea Swipeable Tabs',
};

export default memo(PeaSwipeableTabs);
