import React from 'react';
import Playlists from '../playlists/Playlists';

const PlaylistList = () => {
  return (
    <div className='page-limiter'>
      {/* Pass isPlayListManager as a prop to Playlists */}
      <Playlists isPlayListManager={true} />
    </div>
  );
}

export default PlaylistList;
