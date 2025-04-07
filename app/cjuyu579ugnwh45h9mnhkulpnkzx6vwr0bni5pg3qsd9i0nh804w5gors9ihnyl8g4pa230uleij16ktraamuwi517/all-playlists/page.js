
import React from "react";
import Playlists from "../../playlists/page";
import AdminLayout from "@/components/admin/AdminLayout";

const PlaylistList = () => {
  return (
    <div className="page-limiter">
      <AdminLayout>
      <Playlists isPlayListManager={true} />
      </AdminLayout>
    </div>
  );
};

export default PlaylistList;
