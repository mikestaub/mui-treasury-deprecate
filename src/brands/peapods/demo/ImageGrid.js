import React from 'react';
import PeaImageGrid from '../lib/PeaImageGrid';
import { INSTAGRAM_FEED_GRID } from './_mock';

const ImageGrid = () => (
  <PeaImageGrid
    title="Instagram Activity"
    loading={false}
    feed={INSTAGRAM_FEED_GRID}
  />
);

ImageGrid.metadata = {
  name: 'Pea ImageGrid',
};

ImageGrid.code = `
  import PeaImageGrid from '../lib/PeaImageGrid';
  
  const INSTAGRAM_FEED_GRID = new Array(10).fill('https://picsum.photos/200');

  const Preview = () => (
    <PeaConnections
      title='Instagram Activity'
      loading={false}
      feed={INSTAGRAM_FEED_GRID}
    />
  )
`;

export default ImageGrid;
