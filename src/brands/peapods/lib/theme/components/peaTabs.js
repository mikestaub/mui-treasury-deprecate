import Color from 'color';

export default ({ breakpoints, primary, secondary }) => ({
  MuiTabs: {
    root: {
      width: '100%',
      borderBottom: 'none',
    },
    indicator: {
      height: 4,
      transform: 'translateY(-3px)',
      backgroundColor: secondary.main,
    },
  },
  MuiTab: {
    root: {
      alignItems: 'flex-end',
      backgroundColor: 'none',
      minHeight: 53,
      minWidth: 0,
      [breakpoints.up('sm')]: {
        minWidth: 0,
      },
      '&:hover': {
        '& .MuiTab-label': {
          color: secondary.main,
        },
      },
      '&$selected': {
        '& *': {
          color: secondary.main,
        },
      },
    },
    textColorInherit: {
      opacity: 1,
    },
    wrapper: {
      textTransform: 'none',
      fontSize: 15,
      fontWeight: 700,
      color: '#657786',
      width: '100%',
      '& svg': {
        fontSize: 26.25,
      },
    },
  },
  PrivateTabIndicator: {
    root: {
      height: 4,
      borderRadius: 4,
    },
  },
});
