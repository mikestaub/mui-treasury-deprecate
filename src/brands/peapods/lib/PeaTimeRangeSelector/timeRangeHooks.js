import { useState, useCallback, useEffect } from 'react';
import {
  every,
  some,
  uniq,
  uniqBy,
  groupBy,
  isEqualWith,
  isEqual,
  sortBy,
  keyBy,
} from 'lodash';
import { Navigate } from 'react-big-calendar';

const useTimeRangeHooks = ({
  timeRangeOptions,
  selection,
  users,
  userId,
  onChange,
  onEditModeChange,
}) => {
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);

  const usersById = keyBy(users, 'id');

  const [isEditMode, setIsEditMode] = useState(false);
  const [localTimeRanges, setLocalTimeRanges] = useState(selection);
  const [viewingDate, setViewingDate] = useState(new Date());
  const [timeRangeMap, setTimeRangeMap] = useState({});
  const [dayMap, setDayMap] = useState({});

  const allOptions = [
    ...timeRangeOptions,
    ...localTimeRanges,
    ...selection,
  ].filter(option => {
    const now = new Date();
    return option.timeRange.start > now;
  });

  const events = sortBy(
    uniqBy(allOptions, option => {
      const { start, end } = option.timeRange;
      const key = `${start}_${end}`;
      return key;
    }).map(option => ({
      ...option,
      ...option.timeRange,
    })),
    ({ start }) => start.toString(),
  );

  const optionKeyMap = groupBy(allOptions, option => {
    const { start, end } = option.timeRange;
    const key = `${start}_${end}`;
    return key;
  });

  const optionUsersMap = Object.keys(optionKeyMap).reduce((prev, next) => {
    // eslint-disable-next-line
    prev[next] = uniq(
      optionKeyMap[next]
        .filter(
          o => o.state !== 'MAYBE_AVAILABLE' && o.state !== 'NOT_AVAILABLE',
        )
        .map(o => o.userId),
    );
    return prev;
  }, {});

  const maybeOptionUsersMap = Object.keys(optionKeyMap).reduce((prev, next) => {
    // eslint-disable-next-line
    prev[next] = uniq(
      optionKeyMap[next]
        .filter(o => o.state === 'MAYBE_AVAILABLE')
        .map(o => o.userId),
    );
    return prev;
  }, {});

  const selectedOptions = selection.reduce((prev, option) => {
    const { start, end } = option.timeRange;
    const key = `${start}_${end}`;
    // eslint-disable-next-line
    prev[key] = option.state;
    return prev;
  }, {});

  const checkBestOption = timeRange => {
    const { start, end } = timeRange;
    const key = `${start}_${end}`;

    const numUsers = optionUsersMap[key].length;
    const numMaybeUsers = maybeOptionUsersMap[key].length;
    const totalUsers = numUsers + numMaybeUsers;
    const ratio = numUsers / numMaybeUsers;

    const largerOptions = Object.keys(optionUsersMap).filter(k => {
      const numUsers2 = optionUsersMap[k].length;
      const numMaybeUsers2 = maybeOptionUsersMap[k].length;
      const totalUsers2 = numUsers2 + numMaybeUsers2;
      const ratio2 = numUsers2 / numMaybeUsers2;
      return (
        totalUsers2 > totalUsers ||
        (totalUsers2 === totalUsers && ratio2 > ratio)
      );
    });

    return largerOptions.length === 0;
  };

  const hasMaybes = day => {
    const maybes = selection.filter(option => {
      return (
        option.state === 'MAYBE_AVAILABLE' && option.timeRange.start >= day
      );
    });
    return !!maybes.length;
  };

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

    return !isDayChecked(day) && (some(Object.values(map)) || hasMaybes(day));
  };

  function toggleTimeRange(timeRange) {
    const { start, end } = timeRange;
    const key = `${start}_${end}`;

    const [foundTimeRange] = selection.filter(option => {
      const t = option.timeRange;
      const timeRangeKey = `${t.start}_${t.end}`;

      return key === timeRangeKey;
    });

    let newSelection;
    if (foundTimeRange) {
      if (foundTimeRange.state === 'AVAILABLE') {
        foundTimeRange.state = 'MAYBE_AVAILABLE';
        newSelection = [...selection];
      } else if (foundTimeRange.state === 'MAYBE_AVAILABLE') {
        foundTimeRange.state = 'NOT_AVAILABLE';
        newSelection = [...selection];
      } else {
        newSelection = selection.filter(option => {
          const t = option.timeRange;
          const timeRangeKey = `${t.start}_${t.end}`;

          return key !== timeRangeKey;
        });
      }
    } else {
      newSelection = [
        ...selection,
        {
          timeRange,
          userId,
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
      newSelection = [
        ...selection.filter(o => {
          const { start, end } = o.timeRange;
          const key = `${start}_${end}`;
          return !Object.keys(map).includes(key);
        }),
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
      ];
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
    if (isEditMode) {
      const firstOptionTime = allOptions[0].start;
      setViewingDate(firstOptionTime);
    } else {
      setViewingDate(new Date());
    }

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
    let endTime = end;
    if (start === end) {
      endTime = new Date(start);
      endTime.setHours(endTime.getHours() + 23);
      endTime.setMinutes(59);
    }

    setLocalTimeRanges([
      ...localTimeRanges,
      {
        timeRange: {
          start,
          end: endTime,
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

  return {
    events,
    usersById,
    viewingDate,
    isEditMode,
    isDayChecked,
    isDayIndeterminate,
    hasTimeRange,
    toggleTimeRange,
    toggleDay,
    checkBestOption,
    onSelectSlot,
    onSelectingSlot,
    onCancelEditTimeRanges,
    onNavigate,
    onEditTimeRanges,
  };
};

export default useTimeRangeHooks;
