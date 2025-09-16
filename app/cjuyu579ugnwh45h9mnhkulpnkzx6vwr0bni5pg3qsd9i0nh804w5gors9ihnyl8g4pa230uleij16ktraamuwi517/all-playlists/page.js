
import React from "react";
import Playlists from "../../playlists/Playlists";
import AdminLayout from "@/components/admin/AdminLayout";

const PlaylistList = () => {
  return (
    <AdminLayout>
      <Playlists isPlayListManager={true} />
    </AdminLayout>
    );
};

export default PlaylistList;
