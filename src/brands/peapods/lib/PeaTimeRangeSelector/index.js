/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import moment from 'moment';
import { Box, Grid, Tooltip, Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Calendar, Views, momentLocalizer, Navigate } from 'react-big-calendar';

import PeaButton from '../PeaButton';
import PeaAvatar from '../PeaAvatar';
import PeaIcon from '../PeaIcon';

import TimeRangeCheckbox from './TimeRangeCheckbox';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import './PeaTimeRangeSelector.css';
import useTimeRangeHooks from './timeRangeHooks';

const localizer = momentLocalizer(moment);

// TODO: create custom Agenda view ( sorting, column names, multi-day times )
// TODO: use array for selection not object
// TODO: don't delete our timeRanges when unchecked
// TODO: add minDate and maxDate props ( event.startTime, event.endTime )
// TODO: fix ux issue
// https://github.com/jquense/react-big-calendar/issues/1684

const useStyles = makeStyles(() => {
  return {
    container: {
      minWidth: 500,
      maxHeight: 400,
      overflowY: 'scroll',
      scrollbarWidth: 'auto',
    },
  };
});

const PeaTimeRangeSelector = ({
  timeRangeOptions,
  selection,
  onChange,
  onEditModeChange,
  userId,
  users,
}) => {
  const classes = useStyles();

  const {
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
  } = useTimeRangeHooks({
    timeRangeOptions,
    selection,
    users,
    userId,
    onChange,
    onEditModeChange,
  });

  const DateAgenda = ({ day, label }) => {
    return (
      <>
        <div>{label}</div>
        <TimeRangeCheckbox
          isChecked={isDayChecked(day)}
          isIndeterminate={isDayIndeterminate(day)}
          value={day}
          onChange={() => toggleDay(day)}
        />
      </>
    );
  };

  function TimeAgenda({ event, label }) {
    const { timeRange } = event;
    const { start, end } = timeRange;
    const key = `${start}_${end}`;

    const [foundTimeRange] = selection.filter(option => {
      const t = option.timeRange;
      const timeRangeKey = `${t.start}_${t.end}`;

      return key === timeRangeKey;
    });
    const isMaybe = foundTimeRange?.state === 'MAYBE_AVAILABLE';
    const isUnavailable = foundTimeRange?.state === 'NOT_AVAILABLE';

    let timeString = label;
    if (end.getDay() + end.getDate() !== end.getDay() + start.getDate()) {
      timeString = ` ${moment(start).format('H:mm a ddd')} – ${moment(
        end,
      ).format('H:mm a ddd')}`;
    }

    const isBestOption = checkBestOption(timeRange);

    return (
      <>
        <div>{timeString}</div>
        {isBestOption ? (
          <Tooltip title="best option">
            <Box display="inline">
              <PeaIcon icon="star" shape="circular" color="primary" />
            </Box>
          </Tooltip>
        ) : (
          <Box display="inline" style={{ opacity: 0 }}>
            <PeaIcon icon="star" shape="circular" color="white" />
          </Box>
        )}

        <TimeRangeCheckbox
          isMaybe={isMaybe}
          isUnavailable={isUnavailable}
          isChecked={hasTimeRange(timeRange)}
          value={timeRange}
          onChange={() => toggleTimeRange(timeRange)}
        />
      </>
    );
  }

  function EventAgenda({ event }) {
    const { start, end } = event.timeRange;
    const key = `${start}_${end}`;

    const userIds = timeRangeOptions.filter(({ timeRange, userId: id }) => {
      return key === `${timeRange.start}_${timeRange.end}` && usersById[id];
    });

    const peas = sortBy(
      usersById
        ? userIds.map(({ userId: id, state }) => ({
            id: usersById[id].id,
            name: usersById[id].name,
            src: usersById[id].profilePhoto,
            state,
          }))
        : [],
      'name',
    );

    return (
      <Grid container spacing={1}>
        {peas.map(pea => {
          let badge;
          let color = 'secondary';
          if (pea.state === 'MAYBE_AVAILABLE') {
            badge = 'help';
          } else if (pea.state === 'NOT_AVAILABLE') {
            badge = 'cancel';
            color = 'error';
          }

          return (
            <Grid item key={pea.id}>
              <Tooltip title={pea.name} arrow>
                <Badge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  badgeContent={
                    badge ? (
                      <Box>
                        <PeaIcon icon={badge} shape="circular" color={color} />
                      </Box>
                    ) : null
                  }
                >
                  <PeaAvatar alt={pea.name} src={pea.src} size="big" />
                </Badge>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    );
  }

  const renderToolbar = ({ label }) => {
    return (
      <Grid container justify="space-between">
        {isEditMode && (
          <Grid item>
            <Box textAlign="center" mb={1}>
              {label}
            </Box>

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
          </Grid>
        )}

        <Grid item style={{ flex: 1 }}>
          <Grid
            container
            spacing={isEditMode ? 1 : 0}
            justify="flex-end"
            style={{
              marginBottom: 8,
            }}
          >
            {isEditMode && (
              <Grid item>
                <PeaButton
                  color="error"
                  variant="contained"
                  onClick={onCancelEditTimeRanges}
                >
                  cancel
                </PeaButton>
              </Grid>
            )}

            <Grid item>
              <PeaButton
                color="primary"
                variant="contained"
                onClick={onEditTimeRanges}
              >
                {isEditMode ? 'save' : 'edit options'}
              </PeaButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const length = isEditMode ? 7 : 365;
  const viewMode = isEditMode ? Views.WEEK : Views.AGENDA;
  const messages = {
    time: 'Time Range',
    event: 'Peas',
  };

  return (
    <div className={classes.container}>
      <Calendar
        length={length}
        messages={messages}
        date={viewingDate}
        selectable
        onSelectSlot={onSelectSlot}
        onSelecting={onSelectingSlot}
        events={events}
        localizer={localizer}
        view={viewMode}
        defaultView={viewMode}
        components={{
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
