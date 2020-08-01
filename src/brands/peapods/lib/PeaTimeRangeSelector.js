import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  every,
  some,
  uniqBy,
  isEqualWith,
  isEqual,
  sortBy,
  keyBy,
} from 'lodash';
import moment from 'moment';
import {
  Box,
  Checkbox,
  Grid,
  FormControlLabel,
  Tooltip,
  Badge,
} from '@material-ui/core';
import { Calendar, Views, momentLocalizer, Navigate } from 'react-big-calendar';

import PeaButton from './PeaButton';
import PeaAvatar from './PeaAvatar';
import PeaIcon from './PeaIcon';

import 'react-big-calendar/lib/css/react-big-calendar.css';

// TODO: remove momemnt dep
const localizer = momentLocalizer(moment);

// TODO: use array for selection not object
// TODO: don't delete our timeRanges when unchecked

// eslint-disable-next-line
function renderCheckbox({ isChecked, isIndeterminate, onChange, value }) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={isChecked}
          onChange={onChange}
          name={value}
          indeterminate={isIndeterminate}
        />
      }
      label="Available"
    />
  );
}

// TODO: handle MAYBE states for timeRanges

const PeaTimeRangeSelector = ({
  timeRangeOptions,
  selection,
  onChange,
  onEditModeChange,
  userId,
  users,
}) => {
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);

  const usersById = keyBy(users, 'id');

  const [isEditMode, setIsEditMode] = useState(false);
  const [localTimeRanges, setLocalTimeRanges] = useState(selection);
  const [viewingDate, setViewingDate] = useState(new Date());
  const [timeRangeMap, setTimeRangeMap] = useState({});
  const [dayMap, setDayMap] = useState({});

  const optionSet = uniqBy(
    [...timeRangeOptions, ...localTimeRanges, ...selection],
    option => {
      const { start, end } = option.timeRange;
      const key = `${start}_${end}`;
      return key;
    },
  )
    .map(option => ({
      ...option,
      ...option.timeRange,
      title: 'Test Event',
      // TODO: handle all day events?
    }))
    .filter(option => {
      const now = new Date();
      return option.timeRange.start > now;
    });

  const selectedOptions = selection.reduce((prev, option) => {
    const { start, end } = option.timeRange;
    const key = `${start}_${end}`;
    // eslint-disable-next-line
    prev[key] = option.state;
    return prev;
  }, {});

  const isDayChecked = day => {
    const map = dayMap[day];
    if (!map) {
      return false;
    }

    return every(Object.values(map));
  };

  const isDayIndeterminate = day => {
    const map = dayMap[day];
    if (!map) {
      return false;
    }

    return !isDayChecked(day) && some(Object.values(map));
  };

  function toggleTimeRange(timeRange) {
    const { start, end } = timeRange;
    const key = `${start}_${end}`;

    const [foundTimeRange] = selection.filter(option => {
      // eslint-disable-next-line
      const { start, end } = option.timeRange;
      const timeRangeKey = `${start}_${end}`;

      return key === timeRangeKey;
    });

    let newSelection;
    if (foundTimeRange) {
      newSelection = selection.filter(option => {
        // eslint-disable-next-line
        const { start, end } = option.timeRange;
        const timeRangeKey = `${start}_${end}`;

        return key !== timeRangeKey;
      });
    } else {
      newSelection = [
        ...selection,
        {
          timeRange,
          userId,
          // TODO: handle MAYBE state
          state: 'AVAILABLE',
        },
      ];
    }

    onChange(newSelection);
  }

  function toggleDay(day) {
    const map = dayMap[day];
    if (!map) {
      return false;
    }
    const isCheck = isDayChecked(day);
    const isIndeterminate = isDayIndeterminate(day);

    const subValues = !isCheck || isIndeterminate;

    const newTimeRangeMap = Object.keys(map).reduce((prev, next) => {
      // eslint-disable-next-line
      prev[next] = subValues;
      return prev;
    }, {});

    let newSelection;

    if (!isCheck) {
      newSelection = uniqBy(
        [
          ...selection,
          ...Object.keys(map).map(key => {
            const [start, end] = key.split('_');
            return {
              timeRange: {
                start,
                end,
              },
              userId,
              state: 'AVAILABLE',
            };
          }),
        ],
        option => {
          const { start, end } = option.timeRange;
          const key = `${start}_${end}`;
          return key;
        },
      );
    } else {
      newSelection = selection.filter(option => {
        const { start, end } = option.timeRange;
        const key = `${start}_${end}`;
        return !Object.keys(map).includes(key);
      });
    }

    setLocalTimeRanges([]);
    setTimeRangeMap(newTimeRangeMap);
    onChange(newSelection);

    return true;
  }

  const hasTimeRange = useCallback(
    ({ start, end }) => {
      const key = `${start}_${end}`;
      return selectedOptions[key] === 'AVAILABLE';
    },
    [selectedOptions],
  );

  const onTimeRangeOptionsChanged = () => {
    if (!timeRangeOptions?.length) {
      return;
    }

    const now = new Date();

    const newMap = timeRangeOptions.reduce((prev, next) => {
      const { start, end } = next.timeRange;
      const key = `${start}_${end}`;
      if (start > now) {
        // eslint-disable-next-line
        prev[key] = true;
      }
      return prev;
    }, {});

    setTimeRangeMap(newMap);
  };

  const onTimeRangeMapChanges = () => {
    const newMap = Object.keys(timeRangeMap).reduce((prev, next) => {
      const timeRange = {
        start: new Date(next.split('_')[0]),
        end: new Date(next.split('_')[1]),
      };

      const day = timeRange.start;
      const normalizedDay = new Date(day);
      normalizedDay.setHours(0, 0, 0, 0);

      const dayKey = normalizedDay;

      // eslint-disable-next-line
      prev[dayKey] = {
        ...prev[dayKey],
        [next]: hasTimeRange(timeRange),
      };

      return prev;
    }, {});

    setDayMap(newMap);
  };

  const onCancelEditTimeRanges = () => {
    onEditModeChange(!isEditMode);
    setLocalTimeRanges([]);
    setIsEditMode(!isEditMode);
  };

  const onEditTimeRanges = () => {
    if (isEditMode && !isEqualWith(selection, localTimeRanges, isEqual)) {
      onChange([...localTimeRanges, ...selection]);
      setLocalTimeRanges([]);
    }
    onCancelEditTimeRanges();
  };

  const onSelectingSlot = ({ start }) => new Date(start) > new Date();

  const onSelectSlot = ({ start, end }) => {
    setLocalTimeRanges([
      ...localTimeRanges,
      {
        timeRange: {
          start,
          end,
        },
        userId,
        state: 'AVAILABLE',
      },
    ]);
  };

  const onNavigate = useCallback(
    action => () => {
      let newDate = new Date(viewingDate);
      let offset;

      if (action === Navigate.TODAY) {
        newDate = new Date();
        offset = 0;
      } else if (action === Navigate.PREVIOUS) {
        offset = -7;
      } else if (action === Navigate.NEXT) {
        offset = 7;
      }

      newDate.setDate(newDate.getDate() + offset);

      setViewingDate(newDate);
    },
    [viewingDate],
  );

  useEffect(onTimeRangeMapChanges, [timeRangeMap]);
  useEffect(onTimeRangeOptionsChanged, [timeRangeOptions]);

  // function Event({ event }) {
  //   return <span>{event.title}</span>;
  // }

  // eslint-disable-next-line react/prop-types
  function DateAgenda({ day, label }) {
    const normalizedDay = new Date(day);
    normalizedDay.setHours(0, 0, 0, 0);
    day = normalizedDay; // eslint-disable-line

    return (
      <>
        <div>{label}</div>
        {renderCheckbox({
          isChecked: isDayChecked(day),
          isIndeterminate: isDayIndeterminate(day),
          value: day,
          onChange: () => toggleDay(day),
        })}
      </>
    );
  }

  // eslint-disable-next-line
  function TimeAgenda({ event, day, label }) {
    // eslint-disable-next-line
    const { timeRange } = event;
    // eslint-disable-next-line
    const { start, end } = timeRange;

    let timeString = label;
    // eslint-disable-next-line
    if (end.getDay() + end.getDate() !== end.getDay() + start.getDate()) {
      timeString = ` ${moment(start).format('H:mm a ddd')} – ${moment(
        end,
      ).format('H:mm a ddd')}`;
    }

    return (
      <>
        <div>{timeString}</div>
        {renderCheckbox({
          isChecked: hasTimeRange(timeRange),
          value: timeRange,
          onChange: () => toggleTimeRange(timeRange),
        })}
      </>
    );
  }

  // eslint-disable-next-line
  function EventAgenda({ event }) {
    // eslint-disable-next-line
    const { start, end } = event.timeRange;
    const key = `${start}_${end}`;

    // eslint-disable-next-line
    const userIds = timeRangeOptions.filter(({ timeRange, userId, state }) => {
      // eslint-disable-next-line
      return key === `${timeRange.start}_${timeRange.end}` && usersById[userId];
    });

    const peas = usersById
      ? // eslint-disable-next-line
        userIds.map(({ userId, state }) => ({
          id: usersById[userId].id,
          name: usersById[userId].name,
          src: usersById[userId].profilePhoto,
          state,
        }))
      : [];

    return (
      <Grid container spacing={1}>
        {peas.map(pea => (
          <Grid item key={pea.id}>
            <Tooltip title={pea.name} arrow>
              <Badge
                overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                badgeContent={
                  pea.state === 'MAYBE' ? (
                    <Box
                    // TODO: add border
                    // style={{
                    //   border: '2px solid white',
                    // }}
                    >
                      <PeaIcon icon="help" shape="circular" color="secondary" />
                    </Box>
                  ) : null
                }
              >
                <PeaAvatar alt={pea.name} src={pea.src} size="big" />
              </Badge>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    );
  }

  // eslint-disable-next-line
  const renderToolbar = ({ label }) => {
    return (
      <Grid container justify="space-between">
        <Grid item>
          <div className="rbc-toolbar">
            <span className="rbc-btn-group">
              <button type="button" onClick={onNavigate(Navigate.TODAY)}>
                today
              </button>
              <button type="button" onClick={onNavigate(Navigate.PREVIOUS)}>
                previous week
              </button>
              <button type="button" onClick={onNavigate(Navigate.NEXT)}>
                next week
              </button>
            </span>
          </div>

          <div>{label}</div>
        </Grid>

        <Grid item>
          {isEditMode && (
            <PeaButton
              color="error"
              variant="contained"
              onClick={onCancelEditTimeRanges}
            >
              cancel
            </PeaButton>
          )}

          <PeaButton
            color="primary"
            variant="contained"
            onClick={onEditTimeRanges}
          >
            {isEditMode ? 'save' : 'edit'}
          </PeaButton>
        </Grid>
      </Grid>
    );
  };

  // TODO: create custom Agenda view ( sorting, column names, multi-day times )

  const viewMode = isEditMode ? Views.WEEK : Views.AGENDA;
  const messages = {
    time: 'Time Range',
    event: 'Peas',
  };

  return (
    <div
      style={{
        maxHeight: 400,
      }}
    >
      <Calendar
        length={7}
        messages={messages}
        date={viewingDate}
        selectable
        onSelectSlot={onSelectSlot}
        onSelecting={onSelectingSlot}
        events={sortBy(optionSet, ({ start }) => start.toString())}
        localizer={localizer}
        // TODO: custom styles
        view={viewMode}
        defaultView={viewMode}
        // dayPropGetter={customDayPropGetter}
        // slotPropGetter={customSlotPropGetter}
        components={{
          // event: Event,
          toolbar: renderToolbar,
          agenda: {
            event: EventAgenda,
            time: TimeAgenda,
            date: DateAgenda,
          },
        }}
      />
    </div>
  );
};

PeaTimeRangeSelector.propTypes = {
  timeRangeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      timeRange: PropTypes.shape({
        start: PropTypes.instanceOf(Date).isRequired,
        end: PropTypes.instanceOf(Date).isRequired,
      }),
      state: PropTypes.string.isRequired,
    }),
  ),
  selection: PropTypes.arrayOf(PropTypes.Object),
  onChange: PropTypes.func.isRequired,
  onEditModeChange: PropTypes.func,
  userId: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      profilePhoto: PropTypes.string,
    }),
  ),
};

PeaTimeRangeSelector.defaultProps = {
  timeRangeOptions: [],
  selection: [],
  users: [],
  onEditModeChange: () => {},
};

PeaTimeRangeSelector.metadata = {
  name: 'Pea Time Range Selector',
  libraries: [
    {
      text: 'clsx',
      link: 'https://github.com/lukeed/clsx',
    },
  ],
};

PeaTimeRangeSelector.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default PeaTimeRangeSelector;
