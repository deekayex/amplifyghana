"use client";
import React from "react";
import Playlists from "../../playlists/Playlists";
import AdminLayout from "@/components/admin/AdminLayout";

const PlaylistList = () => {
  return (
    <AdminLayout>
        <div className="page-limiter">
      <Playlists isPlayListManager={true} />
      </div>
    </AdminLayout>
    );
};

export default PlaylistList;
