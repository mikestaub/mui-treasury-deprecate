import React from 'react';
import PeaConnections from '../lib/PeaConnections';
import { SOCIAL1, SOCIAL2, SOCIAL3 } from './_mock';

const Connections = () => (
  <PeaConnections
    allowToConnect
    followers={SOCIAL1}
    following={SOCIAL2}
    friends={SOCIAL3}
    interests={SOCIAL1}
    connectionsCount={{
      followers: SOCIAL1.length,
      following: SOCIAL2.length,
      friends: SOCIAL3.length,
      interests: SOCIAL1.length,
    }}
  />
);

Connections.metadata = {
  name: 'Pea Connections',
};
Connections.codeSandbox = 'https://codesandbox.io/s/zljn06jmq4';
Connections.code = `
  import PeaConnections from '../lib/PeaConnections';

  const SOCIAL1 = [
    {
      src: 'https://avatars.dicebear.com/v2/avataaars/example.svg',
      name: 'Yeoman',
      username: 'Yeoman',
      unique: 'Yeoman',
      social: 'twitter',
    },
    {
      src: 'https://avatars.dicebear.com/v2/avataaars/example2.svg',
      name: 'GGWP',
      username: 'GGWP',
      unique: 'GGWP',
      social: 'meetup',
    },
    {
      src: 'https://avatars.dicebear.com/v2/avataaars/example3.svg',
      name: 'Sawasdee',
      username: 'Sawasdee',
      unique: 'Sawasdee',
      social: 'facebook',
    },
  ];

  const SOCIAL2 = [
    {
      src: 'https://avatars.dicebear.com/v2/avataaars/example4.svg',
      name: 'Yeoman',
      username: 'Yeoman',
      unique: 'Yeoman',
      social: 'twitter',
    },
    {
      src: 'https://avatars.dicebear.com/v2/avataaars/example5.svg',
      name: 'GGWP',
      username: 'GGWP',
      unique: 'GGWP',
      social: 'meetup',
    },
  ];

  const SOCIAL3 = [
    {
      src: 'https://avatars.dicebear.com/v2/avataaars/example7.svg',
      name: 'Yeoman',
      username: 'Yeoman',
      unique: 'Yeoman',
      social: 'twitter',
    },
    {
      src: 'https://avatars.dicebear.com/v2/avataaars/example8.svg',
      name: 'GGWP',
      username: 'GGWP',
      unique: 'GGWP',
      social: 'meetup',
    },
    {
      src: 'https://avatars.dicebear.com/v2/avataaars/example9.svg',
      name: 'Sawasdee',
      username: 'Sawasdee',
      unique: 'Sawasdee',
      social: 'facebook',
    },
  ];
  
  const Preview = () => (
    <PeaConnections
      allowToConnect
      followers={SOCIAL1}
      following={SOCIAL2}
      friends={SOCIAL3}
      interests={SOCIAL1}
      connectionsCount={{
        followers: SOCIAL1.length,
        following: SOCIAL2.length,
        friends: SOCIAL3.length,
        interests: SOCIAL1.length,
      }}
    />
  )
`;

export default Connections;
