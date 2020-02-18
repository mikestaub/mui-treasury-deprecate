/* eslint-disable max-len */
export default ({ spacing, breakpoints, white, palette }) => ({
  MuiDialog: {
    root: {
      position: 'relative',
      '&.PeaPodDialog': {
        '& .PeaCounter-root': {
          marginTop: spacing(1),
        },
      },
      '&.PeaGroupDialog': {
        [breakpoints.only('xs')]: {
          background: palette.common.white,
        },
        '& .PeaGroupForm-photoBtn': {
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          top: 0,
          left: 0,
          bottom: 0,
          width: '100%',
          borderRadius: 6,
          background: 'rgba(0,0,0,0.4)',
          '& .material-icons': {
            fontSize: 48,
          },
        },
      },
      '&.PeaEventDialog': {
        [breakpoints.only('xs')]: {
          background: palette.common.white,
        },
        '& .PeaEventForm-photoBtn': {
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          top: 0,
          left: 0,
          bottom: 0,
          width: '100%',
          borderRadius: 6,
          background: 'rgba(0,0,0,0.4)',
          '& .material-icons': {
            fontSize: 48,
          },
        },
      },
      '&.PeaDialog': {
        '& .DialogTitle--contained + .DialogContent--root': {
          paddingTop: 24,
        },
        '& .DialogTitle--secondaryCentered': {
          '& h6, h2': {
            color: palette.secondary.main,
            fontWeight: 'bold',
            textAlign: 'center',
          },
        },
        '& .DialogCloseButton': {
          position: 'absolute',
          padding: 4,
          background: palette.text.hint,
          color: palette.common.white,
          top: 16,
          right: 16,
          '& .material-icons': {
            fontSize: 20,
          },
          '&:hover': {
            background: palette.text.secondary,
          },
        },
        '& .DialogContent--root': {
          overflowY: 'auto',
          maxWidth: 400,
          minWidth: 400,
          [breakpoints.only('xs')]: {
            maxWidth: 'unset',
            minWidth: 'unset',
            maxHeight: 450,
            minHeight: 450,
          },
        },
        '& .DialogActions-root': {
          marginBottom: spacing(2),
          justifyContent: 'center',
        },
        '& .MuiCardMedia-root': {
          position: 'relative',
          width: '100%',
          zIndex: 1,
          backgroundColor: palette.grey[200],
          border: `2px dashed ${palette.secondary.main}`,
          borderRadius: 8,
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: palette.grey[300],
          },
        },
      },
      '&.PeaInvitationDialog': {
        '& .DialogContent--root': {
          padding: '0px !important',
          minWidth: 400,
          minHeight: 450,
        },
        '& .ListSubheader-typography': {
          color: palette.secondary.main,
          fontWeight: 'bold',
          paddingLeft: spacing(2),
        },
        '& .ListItem-secondaryErrorText': {
          color: palette.error.main,
        },
        '& .List-Container': {
          height: 300,
          overflowY: 'auto',
        },
      },
      '&.PeaDialog.PeaEventDialog': {
        '& .DialogContent--root': {
          maxWidth: 600,
          minWidth: 400,
          [breakpoints.only('xs')]: {
            maxWidth: 'unset',
            minWidth: 'unset',
          },
        },
      },
    },
    paper: {
      borderRadius: 16,
      [breakpoints.only('xs')]: {
        margin: spacing(2),
      },
    },
  },
  MuiDialogTitle: {
    root: {
      '&.DialogTitle--contained': {
        padding: 16,
        background:
          'linear-gradient(90deg, rgba(92,199,153,1), rgba(0,255,176,1))',
        '& *': {
          color: white.text,
          textAlign: 'center',
        },
      },
    },
  },
});
