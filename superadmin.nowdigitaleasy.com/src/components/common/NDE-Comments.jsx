import React, { useRef, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Divider,
  Avatar,
  Stack,
  Skeleton,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import Delete from "../../assets/icons/delete.svg";
import CommonButton from "./NDE-Button";

const CommonComments = ({
  comments = [],
  isLoading = false,
  onAdd,
  onDelete,
  title = "ALL COMMENTS",
  maxHeight = "calc(100vh - 170px)",
}) => {
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState("");

  const handleAddComment = () => {
    if (!editorRef.current) return;

    const text = editorRef.current.innerHTML.trim();
    if (!text) return;

    onAdd?.(text);
    editorRef.current.innerHTML = "";
    setEditorContent("");
  };

  const handleDelete = (id) => {
    onDelete?.(id);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const toggleFormat = (format) => {
    document.execCommand(format, false, null);
  };

  const formatDateTime = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const formatted = d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, 
    });

    return formatted.toUpperCase(); 
  };
  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 2,
        maxHeight,
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          p: 1,
          border: "1px solid #E0E0E0",
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={1} mb={1}>
          <IconButton size="small" onClick={() => toggleFormat("bold")}>
            <FormatBoldIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => toggleFormat("italic")}>
            <FormatItalicIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => toggleFormat("underline")}>
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onKeyDown={handleKeyDown}
          onInput={(e) =>
            setEditorContent(e.currentTarget.innerHTML.trim())
          }
          sx={{
            minHeight: 80,
            border: "1px solid #E0E0E0",
            borderRadius: 2,
            p: 1,
            outline: "none",
          }}
        />

        <Box mt={1}>
          <CommonButton
            size="small"
            variant="contained"
            onClick={handleAddComment}
            label="Add Comment"
            disabled={!editorContent}
            startIcon
          />
        </Box>
      </Box>

      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Typography variant="body1" fontSize={14}>
          {title}
        </Typography>

        <Box
          sx={{
            bgcolor: "#22A06B",
            color: "#fff",
            px: 1.2,
            fontSize: 12,
            borderRadius: "12px",
            fontWeight: 600,
          }}
        >
          {isLoading ? <Skeleton width={20} height={20} /> : comments.length}
        </Box>
      </Stack>

      <Divider />

      {isLoading && (
        <Box sx={{ mt: 3 }}>
          <Stack spacing={3}>
            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ display: "flex" }}>
                <Skeleton
                  variant="circular"
                  width={32}
                  height={32}
                />

                <Box sx={{ ml: 2, flex: 1 }}>
                  <Skeleton width="40%" height={20} />
                  <Skeleton width="60%" height={15} sx={{ mt: 1 }} />
                  <Skeleton
                    width="100%"
                    height={40}
                    sx={{ mt: 1, borderRadius: 2 }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {!isLoading && comments.length === 0 && (
        <Typography
          mt={3}
          fontSize={14}
          color="text.secondary"
          textAlign="center"
        >
          No comments available.
        </Typography>
      )}

      {!isLoading && comments.length > 0 && (
        <Box sx={{ position: "relative", mt: 3 }}>
          <Box
            sx={{
              position: "absolute",
              left: 18,
              top: 0,
              bottom: 0,
              width: "1px",
              bgcolor: "#E0E0E0",
            }}
          />

          <Stack spacing={3}>
            {comments.map((c) => (
              <Box key={c.id} sx={{ display: "flex" }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#E6F0FA",
                    border: "1px solid #CFE3FF",
                  }}
                >
                  <ChatBubbleOutlineIcon fontSize="small" sx={{ color: 'primary.light' }} />
                </Avatar>

                <Box sx={{ ml: 2, flex: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <Typography fontSize={14} fontWeight={500}>
                      {c.user || "User"}
                    </Typography>

                    {c.timestamp && (
                      <Typography
                        fontSize={12}
                        color="text.secondary"
                      >
                        • {formatDateTime(c.timestamp)}
                      </Typography>
                    )}
                  </Stack>

                  <Box
                    sx={{
                      mt: 1,
                      bgcolor: "#F3F4F6",
                      p: 1.5,
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ pr: 2, fontSize: 14 }}
                      dangerouslySetInnerHTML={{ __html: c.text }}
                    />

                    <IconButton
                      size="small"
                      onClick={() => handleDelete(c.id)}
                    >
                      <img
                        src={Delete}
                        style={{ height: 18 }}
                        alt="delete"
                      />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default CommonComments;