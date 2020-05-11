import React, { memo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import cx from 'classnames';

import PeaSwipeableTabs from './PeaSwipeableTabs';
import PeaTag from './PeaTag';
import PeaText from './PeaTypography';
import PeaConnections from './PeaConnections';

const PeaGroupProfile = ({
  description,
  tags,
  renderPodList,
  renderMemberList,
  renderMessages,
  isMobile,
  activeTabIndex,
  onChangeTab,
  connections,
  connectionsCount,
  onLoadMoreFollowers,
  onLoadMoreFollowing,
  ...props
}) => {
  const podsRef = useRef();
  const aboutRef = useRef();
  const membersRef = useRef();
  const messagesRef = useRef();

  const tabs = [
    { index: 0, ref: podsRef, label: 'Pods' },
    { index: 1, ref: aboutRef, label: 'About' },
    { index: 2, ref: membersRef, label: 'Members' },
    { index: 3, ref: messagesRef, label: 'Messages' },
  ];

  const onTabChange = index => {
    if (onChangeTab) {
      onChangeTab(tabs[index]);
    }
  };

  useEffect(() => {
    onTabChange(0);
  }, []);

  return (
    <PeaSwipeableTabs
      tabIndex={activeTabIndex}
      tabs={tabs}
      enableFeedback={isMobile}
      onTabChange={onTabChange}
      stickyOffset={50}
      {...props}
    >
      {renderPodList()}

      <>
        {description && (
          <>
            <PeaText color={'secondary'} gutterBottom>
              <b>Description</b>
            </PeaText>

            {description && (
              <div className={cx('MuiTypography-root', 'MuiTypography-body1')}>
                {typeof description === 'string' ? (
                  <PeaText>{description}</PeaText>
                ) : (
                  React.Children.map(description, text => (
                    <div
                      style={{
                        marginBottom: 20,
                      }}
                    >
                      {text}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {tags.length > 0 && (
          <>
            <PeaText color={'secondary'} gutterBottom>
              <b>Tags</b>
            </PeaText>

            <Grid container wrap="wrap" spacing={1}>
              {tags.map(tag => (
                <Grid item key={tag}>
                  <PeaTag
                    color={'secondary'}
                    label={`#${tag}`}
                    onClick={() => {}}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <PeaConnections
          allowToConnect={false}
          followers={connections.followers}
          following={connections.following}
          friends={[]}
          loading={connections.loading}
          connectionsCount={connectionsCount}
          onLoadMoreFollowers={onLoadMoreFollowers}
          onLoadMoreFollowing={onLoadMoreFollowing}
          onLoadMoreFriends={() => null}
        />
      </>

      {renderMemberList()}

      {renderMessages()}
    </PeaSwipeableTabs>
  );
};

PeaGroupProfile.propTypes = {
  activeTabIndex: PropTypes.number,
  renderPodList: PropTypes.func.isRequired,
  renderMemberList: PropTypes.func.isRequired,
  renderMessages: PropTypes.func.isRequired,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.shape({})),
  isMobile: PropTypes.bool,
  onChangeTab: PropTypes.func,
  connections: PropTypes.object.isRequired,
  connectionsCount: PropTypes.object.isRequired,
  onLoadMoreFollowers: PropTypes.func.isRequired,
  onLoadMoreFollowing: PropTypes.func.isRequired,
};

PeaGroupProfile.defaultProps = {
  activeTabIndex: 0,
  isMobile: false,
  onChangeTab: () => {},
  description: '',
  tags: [],
};

PeaGroupProfile.metadata = {
  name: 'Pea Group Profile',
};

export default memo(PeaGroupProfile);
