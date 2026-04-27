import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  Button,
  IconButton,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import CommonDeleteModal from "../../common/NDE-DeleteModal";
import ActionBar from "../../common/NDE-ActionBar";
import FlowerLoader from "../../common/NDE-loader";
import CommonTextField from "../../common/fields/NDE-TextField";

import {
  useAllSuites,
  useDeleteSuite,
  useSuitePlanById,
} from "../../../hooks/application/application-hooks";
import CreateSuite from "./CreateSuite";
import PlansPage from "./SuiteRightPanel";
import CreatePlan from "./Suite-Plan-Create-Edit";

const ApplicationDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedIdFromNav = location.state?.selectedId || null;
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [opendialog, setOpendialog] = useState(false);
  const [applicationToEdit, setApplicationToEdit] = useState(null);
  // const [isAscending, setIsAscending] = useState("");
  const [deleteProductModalOpen, setDeleteProductModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState(null);
  const [opendrawer, setOpendrawer] = useState(false);
  
  

  const searchInputRef = useRef(null);

  const { data, isLoading } = useAllSuites();
  const { mutate: deleteSuite,isLoading:deleting } = useDeleteSuite();
  const suites = data?.data || [];
  const [selectedSuite, setSelectedSuite] = useState(null);
  const [lastSelectedSuite, setLastSelectedSuite] = useState(null);
  const { data: suitePlansData, isLoading: loadingPlans } = useSuitePlanById(selectedSuite?._id);
  const plansList = suitePlansData?.data || [];
   
  useEffect(() => {
    const handler = setTimeout(() => {
      // setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (suites.length > 0) {
      let initial = suites[0];
      if (selectedIdFromNav) {
        const found = suites.find((s) => s._id === selectedIdFromNav);
        if (found) initial = found;
      }
      setSelectedSuite(initial);
      setLastSelectedSuite(initial);
    } else {
      setSelectedSuite(null);
      setLastSelectedSuite(null);
    }
  }, [suites, selectedIdFromNav]);


  const isBulkMode = selectedIds.length > 0;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(suites.map((suite) => suite._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectSuiteCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectSuiteClick = (suite) => {
    setSelectedSuite(suite);
    setLastSelectedSuite(suite);
  };

  const handleNew = () => {
    setApplicationToEdit(null);
    setOpendialog(true);
  };

    const handleCreatePlan = () => {
    setPlanToEdit(null);
    setOpendrawer(true);
  };

    const handleEdit = (plan) => {
    setPlanToEdit(plan);
    setOpendrawer(true);
  };

  const handleEditApplication = (suite) => {
    setApplicationToEdit(suite);
    setOpendialog(true);
  };
 
    const handleDeleteSuite = () => {
    if (!selectedSuite) return;
    deleteSuite(selectedSuite?._id ,
      {
        onSuccess: () => setDeleteProductModalOpen(false),
      }
    );
  };
  // const toggleSort = () => setIsAscending((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        maxHeight:"calc(100vh - 80px)",
        overflow: "hidden",
        p: 1,
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", md: 350 },
          borderRight: { md: "1px solid #EBEBEF" },
          borderBottom: { xs: "1px solid #EBEBEF", md: "none" },
          borderRadius: "8px",
          background: "primary.contrastText",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          maxHeight: { xs: "40vh", md: "100vh" },
        }}
      >
        {isBulkMode ? (
          <ActionBar
            selectedCount={selectedIds.length}
            onClose={() => setSelectedIds([])}
            actions={[
              {
                label: "Bulk Delete",
                color: "error",
              },
            ]}
          />
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderBottom: "1px solid #EBEBEF",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <IconButton onClick={() => navigate("/products/applications/suite")}>
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
                <Typography variant="h5">Suites</Typography>
              </Box>

              {!showSearch ? (
                <IconButton
                  onClick={() => setShowSearch(true)}
                  sx={{
                    height: 30,
                    width: 35,
                    borderRadius: 1.5,
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.main" },
                  }}
                >
                  <SearchIcon sx={{ color: "icon.light" }} />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setShowSearch(false);
                    setSearchTerm("");
                    if (lastSelectedSuite) setSelectedSuite(lastSelectedSuite);
                  }}
                  sx={{
                    height: 30,
                    width: 35,
                    borderRadius: 1.5,
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.main" },
                  }}
                >
                  <CloseIcon sx={{ color: "icon.light" }} />
                </IconButton>
              )}

              <IconButton
                // onClick={toggleSort}
                sx={{
                  height: 30,
                  width: 35,
                  borderRadius: 1.5,
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.main" },
                }}
              >
                <SwapVertRoundedIcon sx={{ color: "icon.light" }} />
              </IconButton>

              <Button
                onClick={handleNew}
                variant="contained"
                size="small"
                sx={{
                  minWidth: 0,
                  borderRadius: "6px",
                  bgcolor: "primary.main",
                  textTransform: "none",
                  color: "primary.contrastText",
                  px: 1,
                  py: 0.5,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "primary.main", boxShadow: "none" },
                }}
              >
                <AddIcon fontSize="small" sx={{ color: "icon.light" }} />
              </Button>
            </Box>

            <Collapse in={showSearch} orientation="vertical">
              <Box sx={{ px: 1 }}>
                <CommonTextField
                  inputRef={searchInputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startAdornment={
                    <SearchIcon fontSize="small" sx={{ color: "icon.main" }} />
                  }
                  placeholder="Search Suite"
                  width="100%"
                  autoFocus
                />
              </Box>
            </Collapse>
          </>
        )}

        {/* Header with Checkbox */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "background.default",
            px: 2,
            py: 0.5,
            flexShrink: 0,
          }}
        >
          <Checkbox
            size="small"
            checked={
              selectedIds.length ===
                suites.filter((suite) => suite._id).length &&
              suites.length > 0
            }
            indeterminate={
              selectedIds.length > 0 &&
              selectedIds.length < suites.filter((suite) => suite._id).length
            }
            onChange={handleSelectAll}
            sx={{
              color: "#000334B2",
              "&.Mui-checked": { color: "#000334B2" },
            }}
          />
          <Typography
            sx={{
              flexGrow: 1,
              fontSize: "14px",
              fontWeight: 500,
              color: "#000334B2",
            }}
          >
            Suite Name
          </Typography>
          <IconButton size="small">
            <MoreVertIcon fontSize="small" sx={{ color: "#000334B2" }} />
          </IconButton>
        </Box>

        {/* Suites List */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "60vh",
              }}
            >
              <FlowerLoader size={20} />
            </Box>
          ) : suites.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
              }}
            >
              <Typography>No suites available</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {suites.map((suite) => {
                const suiteId = suite._id;
                const suiteName = suite.suite_name || "Unnamed Suite";
                const suiiteDec = suite.desc || "-"
                if (!suiteId) return null;

                return (
                  <React.Fragment key={suiteId}>
                    <ListItem
                      sx={{
                        cursor: "pointer",
                        borderBottom: "1px solid #E9E9F8",
                        backgroundColor:
                          selectedSuite?._id === suiteId
                            ? "background.default"
                            : "transparent",
                        "&:hover": { backgroundColor: "background.default" },
                      }}
                      onClick={() => handleSelectSuiteClick(suite)}
                    >
                      <ListItemIcon onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          size="small"
                          checked={selectedIds.includes(suiteId)}
                          onChange={() =>
                            handleSelectSuiteCheckbox(suiteId)
                          }
                          sx={{
                            color: "#000334B2",
                            "&.Mui-checked": { color: "#000334B2" },
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          suiteName.charAt(0).toUpperCase() + suiteName.slice(1)
                        }
                         secondary={suiiteDec}
                        primaryTypographyProps={{ variant: "body2", fontSize: 14 }}
                        secondaryTypographyProps={{
                          color: "#9f9f9f",
                          fontSize: 12,
                        }}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Box>
      </Box>

      {/* Right Panel */}
      {selectedSuite ? (
        <PlansPage
          selectedProduct={selectedSuite}
          plansList={plansList}
          isLoading={loadingPlans}
          handleEditApplication={handleEditApplication}
          isBulkMode={isBulkMode}
          setDeleteProductModalOpen={setDeleteProductModalOpen}
          handleCreatePlan={handleCreatePlan}
          handleEdit={handleEdit}
        />
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "text.secondary",
          }}
        >
          <Typography variant="body1">No suite plan selected</Typography>
        </Box>
      )}

      <CreateSuite
        open={opendialog}
        setOpen={(val) => {
          setOpendialog(val);
          if (!val) setApplicationToEdit(null);
        }}
        initialData={applicationToEdit}
      />

      <CreatePlan open={opendrawer} setOpen={setOpendrawer} initialData={planToEdit} selectedProduct={selectedSuite} />


      <CommonDeleteModal
        open={deleteProductModalOpen}
        onClose={() => setDeleteProductModalOpen(false)}
        onConfirmDelete={handleDeleteSuite}
        deleting={deleting}
        itemType={selectedSuite?.suite_name || ""}
        title={"Suite"}
      />
    </Box>
  );
};

export default ApplicationDetails;
