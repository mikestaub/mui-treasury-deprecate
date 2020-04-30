import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import { times } from 'lodash';

import PeaPersonListItem from './PeaPersonListItem';

const useStyles = makeStyles(() => ({
  skeletonRoot: {
    padding: '10px 0px',
  },
  skeletonTitle: {
    marginLeft: 16,
  },
}));

const PeaPeopleList = ({
  people,
  subHeaderLabel,
  linkLabel,
  linkProps,
  loading,
}) => {
  const classes = useStyles();

  if (loading) {
    return (
      <Paper
        className={'MuiPaper--overflowHidden'}
        className={classes.skeletonRoot}
      >
        <Skeleton
          variant="text"
          width="70%"
          height={20}
          className={classes.skeletonTitle}
        />
        {times(3, () => (
          <PeaPersonListItem loading />
        ))}
      </Paper>
    );
  }
  return (
    <Paper className={'MuiPaper--overflowHidden'}>
      <List
        subheader={
          <ListSubheader className={'MuiListSubheader--stretch'} disableSticky>
            <Typography variant={'body1'}>{subHeaderLabel}</Typography>
            <Typography>
              <Link color={'secondary'} {...linkProps}>
                {linkLabel}
              </Link>
            </Typography>
          </ListSubheader>
        }
      >
        {people.map((person, index) => (
          <React.Fragment key={person.name}>
            <PeaPersonListItem {...person} />
            {index !== people.length - 1 && (
              <Divider light variant={'fullWidth'} />
            )}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

PeaPeopleList.propTypes = {
  people: PropTypes.arrayOf(PropTypes.shape({})),
  subHeaderLabel: PropTypes.string,
  linkLabel: PropTypes.string,
  linkProps: PropTypes.shape({}),
  loading: PropTypes.bool,
};
PeaPeopleList.defaultProps = {
  people: [],
  subHeaderLabel: 'People to follow',
  linkLabel: 'See all',
  linkProps: {},
  loading: false,
};
PeaPeopleList.metadata = {
  name: 'Pea People List',
};
PeaPeopleList.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';

export default PeaPeopleList;
