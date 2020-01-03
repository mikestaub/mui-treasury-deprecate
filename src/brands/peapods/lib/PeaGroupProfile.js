import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';

import PeaSwipeableTabs from './PeaSwipeableTabs';
import PeaTag from './PeaTag';
import PeaText from './PeaTypography';

const PeaGroupProfile = ({
  description,
  tags,
  renderPodList,
  renderConnections,
  renderMemberList,
  renderMessages,
  isMobile,
  onChangeTab,
}) => {
  const podsRef = useRef();
  const aboutRef = useRef();
  const membersRef = useRef();
  const messagesRef = useRef();

  const [tabIndex, setTabIndex] = useState(0);

  const tabs = [
    { ref: podsRef, label: 'Pods' },
    { ref: aboutRef, label: 'About' },
    { ref: membersRef, label: 'Members' },
    { ref: messagesRef, label: 'Messages' },
  ];

  const onTabChange = index => {
    if (onChangeTab) {
      onChangeTab(tabs[index]);
    }
  };

  const handleTabChanged = newIndex => {
    setTabIndex(newIndex);

    if (onTabChange) {
      onTabChange(newIndex);
    }
  };

  useEffect(() => {
    handleTabChanged(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PeaSwipeableTabs
      activeIndex={tabIndex}
      tabs={tabs}
      enableFeedback={isMobile}
      onTabChange={handleTabChanged}
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

        {renderConnections()}
      </>

      {renderMemberList()}

      {renderMessages()}
    </PeaSwipeableTabs>
  );
};

PeaGroupProfile.propTypes = {
  renderPodList: PropTypes.func.isRequired,
  renderConnections: PropTypes.func.isRequired,
  renderMemberList: PropTypes.func.isRequired,
  renderMessages: PropTypes.func.isRequired,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.shape({})),
  isMobile: PropTypes.bool,
  onChangeTab: PropTypes.func,
};

PeaGroupProfile.defaultProps = {
  isMobile: false,
  onChangeTab: () => {},
  description: '',
  tags: [],
};

PeaGroupProfile.metadata = {
  name: 'Pea Group Profile',
};

export default PeaGroupProfile;
