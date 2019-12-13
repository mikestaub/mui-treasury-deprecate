import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import SwipeableViews from 'react-swipeable-views';
import AutoSizer from 'react-virtualized-auto-sizer';

class SwipeableSlider extends PureComponent {
  componentDidUpdate() {
    setTimeout(() => {
      const { swipeableViews } = this.context;
      swipeableViews.slideUpdateHeight();
    });
  }

  render() {
    const { children } = this.props;

    return (
      <div
        style={{
          padding: 16,
        }}
      >
        {children}
      </div>
    );
  }
}

SwipeableSlider.contextTypes = {
  swipeableViews: PropTypes.node.isRequired,
};

SwipeableSlider.propTypes = {
  children: PropTypes.node.isRequired,
};

const PeaSwipeableTabs = ({
  tabIndex,
  tabs,
  onTabChange,
  onSwipe,
  onTabClick,
  enableFeedback,
  scrollEnabled,
  isStickyShown,
  children,
  ...props
}) => {
  const [index, setIndex] = useState(tabIndex);
  const [fineIndex, setFineIndex] = useState(index);

  const indicatorRef = useRef(null);

  const getLeft = () => {
    const indicatorDOM = indicatorRef.current;
    if (!indicatorDOM) return {};
    const { clientWidth } = indicatorDOM;
    return { left: fineIndex * clientWidth };
  };

  const onChange = useCallback(
    i => {
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

  const onChangeIndex = (indexCurrent, indexLatest, meta) => {
    if (meta && meta.reason === 'swipe') {
      onSwipe({
        indexCurrent,
        indexLatest,
      });
    }
  };

  useEffect(() => onChange(tabIndex), [onChange, tabIndex]);

  return (
    <Grid
      container
      direction="column"
      {...props}
      style={scrollEnabled ? { height: '100%' } : { position: 'relative' }}
    >
      <Grid
        item
        style={
          isStickyShown
            ? {
                width: '100%',
                position: 'sticky',
                top: 50,
                zIndex: 9999,
                backgroundColor: '#fff',
                boxShadow: '3px 10px 10px rgba(0,0,0,0.2)',
              }
            : {
                width: '100%',
              }
        }
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
          style={{ color: 'red' }}
          onChange={(e, val) => onChange(val)}
        >
          {tabs.map(tab => (
            <Tab key={tab.label} disableRipple onClick={onTabClick} {...tab} />
          ))}
        </Tabs>
      </Grid>

      {scrollEnabled ? (
        <Grid item style={{ flex: 1 }}>
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
                }}
                enableMouseEvents={enableFeedback}
                index={index}
                onSwitching={onSwitching}
                onChangeIndex={onChangeIndex}
              >
                {React.Children.map(children, child => (
                  <div
                    style={{
                      height: 'calc(100% - 32px)',
                      minHeight: 'calc(100% - 32px)',
                      padding: 16,
                    }}
                  >
                    {child}
                  </div>
                ))}
              </SwipeableViews>
            )}
          </AutoSizer>
        </Grid>
      ) : (
        <Grid item style={{ width: '100%' }}>
          <SwipeableViews
            animateHeight
            enableMouseEvents={enableFeedback}
            index={index}
            onSwitching={onSwitching}
            onChangeIndex={onChangeIndex}
          >
            {React.Children.map(children, child => (
              <SwipeableSlider>{child}</SwipeableSlider>
            ))}
          </SwipeableViews>
        </Grid>
      )}
    </Grid>
  );
};

PeaSwipeableTabs.propTypes = {
  tabIndex: PropTypes.number,
  tabs: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.node }))
    .isRequired,
  children: PropTypes.node.isRequired,
  // disable feedback to increase performance
  enableFeedback: PropTypes.bool,
  scrollEnabled: PropTypes.bool,
  isStickyShown: PropTypes.bool,
  onTabChange: PropTypes.func,
  onSwipe: PropTypes.func,
  onTabClick: PropTypes.func,
};

PeaSwipeableTabs.defaultProps = {
  tabIndex: 0,
  enableFeedback: true,
  scrollEnabled: true,
  isStickyShown: false,
  onTabChange: () => {},
  onSwipe: () => {},
  onTabClick: () => {},
};

PeaSwipeableTabs.metadata = {
  name: 'Pea Swipeable Tabs',
};

export default memo(PeaSwipeableTabs);
