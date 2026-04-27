import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { tabsSx } from "../../styles/tab";
import { useUpdateNotification } from "../../hooks/notification/notification-hooks";

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  return date.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .toUpperCase();
};

const getSectionLabel = (date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
};

const groupByDate = (notifications) => {
  return notifications.reduce((acc, notif) => {
    const date = new Date(notif.time);
    const label = getSectionLabel(date);
    if (!acc[label]) acc[label] = [];
    acc[label].push(notif);
    return acc;
  }, {});
};

const NotificationsPanel = ({ notifications = [] }) => {
  const [list, setList] = useState([]);
  const [tab, setTab] = useState(0);
  const updateNotification = useUpdateNotification();

  useEffect(() => {
    if (notifications?.length) {
      const sorted = notifications
        .map((n) => ({
          id: n._id,
          title: n.type,
          desc: n.message || "No description",
          time: n.Date || n.createdAt,
          read: n.read,
        }))
        .sort((a, b) => new Date(b.time) - new Date(a.time));

      setList(sorted);
    }
  }, [notifications]);


  const handleMarkAsRead = (id) => {
    // Optimistic UI
    setList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    updateNotification.mutate({ id, read: true });
  };

  // const handleMarkAllAsRead = () => {
  //   const unread = list.filter((n) => !n.read);

  //   // Optimistic UI
  //   setList((prev) => prev.map((n) => ({ ...n, read: true })));

  //   // API calls for all unread notifications
  //   unread.forEach((notif) => {
  //     updateNotification.mutate({ id: notif.id, read: true });
  //   });
  // };

  const handleTabChange = (_, newValue) => setTab(newValue);

  const filtered = list.filter((n) => {
    if (tab === 1) return !n.read; // Unread
    if (tab === 2) return n.read;  // Read
    return true; // All
  });

  const grouped = groupByDate(filtered);

  return (
    <Box >
      {/* Tabs Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E0E0E0",
          position: "sticky",
          mt: -1
        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}

          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
          sx={tabsSx}
        >
          <Tab label="All" disableRipple />
          <Tab label="Unread" disableRipple />
          <Tab label="Read" disableRipple />
        </Tabs>
        {/* <Button
          size="small"
          color="primary"
          sx={{ mr: 2 }}
          onClick={handleMarkAllAsRead}
          disabled={list.every((n) => n.read)}
        >
          Mark all as read
        </Button> */}
      </Box>

      {filtered.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#f0f0f0",
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
            }}
          >
            <NotificationsNoneIcon sx={{ fontSize: 32, color: "#9e9e9e" }} />
          </Avatar>
          <Typography variant="h6" fontWeight={600}>
            You have no notifications yet
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "text.disabled" }}>
            We'll keep you updated once something arrives!
          </Typography>
        </Box>
      ) : (
        <Box>
          {Object.keys(grouped).map((section) => (
            <React.Fragment key={section}>
              {/* Section Header */}
              <Typography
                sx={{
                  px: 2,
                  py: 1,
                  fontWeight: 500,
                  // bgcolor: "background.default",
                  color: 'grey.3',
                }}
              >
                {section}
              </Typography>

              {grouped[section].map((notif) => (
                <ListItem
                  key={notif.id}
                  button
                  onClick={() => handleMarkAsRead(notif.id)}
                  sx={{
                    mb: 0.4,
                    p:0.5,
                    borderRadius: 1,
                    borderBottom: "1px solid #E0E0E0",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "background.default",
                      transform: "scale(1.01)",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: notif.read ? "#9e9e9e" : "primary.light" }}>
                      <NotificationsNoneIcon sx={{ color: 'icon.light' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={500}
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 400,
                        }}
                      >
                        {notif.title}
                      </Typography>}
                    secondary={
                      <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                        {formatDateTime(notif.time)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </React.Fragment>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default NotificationsPanel;
