
import React from "react";
import Playlists from "../../playlists/Playlists";
import AdminLayout from "@/components/admin/AdminLayout";

const PlaylistList = () => {
  return (
    <AdminLayout>
      <div className="page-limiter">
      {/* Pass isPlayListManager as a prop to Playlists */}
      <Playlists isPlayListManager={true} />
      </div>
    </AdminLayout>
    );
};

export default PlaylistList;
