export default ({ palette }) => ({
  MuiBadge: {
    badge: {
      height: 20,
      width: 20,
      background: 'white',
    },
    colorError: {
      boxShadow: `0 0 12px 0 ${palette.error.main}`,
    },
  },
});
