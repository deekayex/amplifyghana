"use client"
// pages/inbox.js
import React from "react";
import Messages from "../../../components/messages/Messages";
import AdminLayout from "../../../components/admin/AdminLayout"

const Inbox = () => {
  return (
  <AdminLayout>
    <div>
      <Messages />
    </div>
  </AdminLayout>
  );
};

export default Inbox;
