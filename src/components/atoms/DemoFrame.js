/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { create } from 'jss';
import { withStyles } from '@material-ui/core/styles';
import { jssPreset, StylesProvider } from '@material-ui/styles';
import NoSsr from '@material-ui/core/NoSsr';
import Frame from 'react-frame-component';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.common.white,
    height: 'calc(100vh - 48px)',
    border: 'none',
    width: '100%',
  },
});

class DemoFrame extends React.Component {
  state = {
    ready: false,
  };

  handleRef = (ref) => {
    this.contentDocument = ref ? ref.node.contentDocument : null;
    this.contentWindow = ref ? ref.node.contentWindow : null;
  };

  onContentDidMount = () => {
    this.setState({
      ready: true,
      jss: create({
        plugins: jssPreset().plugins,
        insertionPoint: this.contentWindow['demo-frame-jss'],
      }),
      sheetsManager: new Map(),
      container: this.contentDocument.body,
      window: () => this.contentWindow,
    });
  };

  onContentDidUpdate = () => {
    // eslint-disable-next-line react/prop-types
    this.contentDocument.body.dir = this.props.theme.direction;
  };

  render() {
    const { children, classes } = this.props;

    // eslint-disable-next-line max-len
    // NoSsr fixes a strange concurrency issue with iframe and quick React mount/unmount
    return (
      <NoSsr>
        <Frame
          ref={this.handleRef}
          className={classes.root}
          contentDidMount={this.onContentDidMount}
          contentDidUpdate={this.onContentDidUpdate}
        >
          <div id="demo-frame-jss" />
          {this.state.ready ? (
            <StylesProvider
              jss={this.state.jss}
              sheetsManager={this.state.sheetsManager}
            >
              {React.cloneElement(children, {
                container: this.state.container,
                window: this.state.window,
              })}
            </StylesProvider>
          ) : null}
        </Frame>
      </NoSsr>
    );
  }
}

DemoFrame.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({}).isRequired,
  theme: PropTypes.shape({}).isRequired,
};

export default withStyles(styles, { withTheme: true })(DemoFrame);
