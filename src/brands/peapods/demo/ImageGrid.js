import React from 'react';
import PeaImageGrid from '../lib/PeaImageGrid';
import { IMAGE_GRID } from './_mock';

const ImageGrid = () => (
  <PeaImageGrid title="Instagram Activity" images={IMAGE_GRID} />
);

ImageGrid.metadata = {
  name: 'Pea ImageGrid',
};

ImageGrid.code = `
  import PeaImageGrid from '../lib/PeaImageGrid';
  
  const Preview = () => (
    <PeaConnections
      title='Instagram Activity'
      images={[]}
    />
  )
`;

export default ImageGrid;
