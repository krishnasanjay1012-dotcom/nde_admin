import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { getUserSession } from "../../../utils/session";
import WaveLoader from "../../common/NDE-WaveLoader";
import CommonBackButton from "../../common/NDE-BackButton";
import CustomToastContainer from "../../../components/common/NDE-Snackbar";

const api_url1 = "https://api.nowdigitaleasy.com/ndeadmin/v2";

const EditHostingPlan = () => {
  const { token } = getUserSession();
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const { hostingId } = useParams();

  const [actualName, setActualName] = useState("");
  const [description, setDescription] = useState("");
  const [planData, setPlanData] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [originalPlanData, setOriginalPlanData] = useState({});
  const [originalDescription, setOriginalDescription] = useState("");
  const [originalActualName, setOriginalActualName] = useState("");

  const optionsPer = ["%", "mb", "gb", "tb"];
  const options = ["mb", "gb", "tb"];
  const optionsPerM = ["gb", "mb", "tb"];
  const expiryOption = ["days", "month", "year"];

  const compactTextFieldStyle = {
    width: "80px",
    "& .MuiInputBase-input": {
      height: "30px",
      padding: "0 8px",
      fontSize: "0.875rem",
    },
  };

  const compactSelectStyle = {
    width: "80px",
    height: "30px",
    "& .MuiSelect-select": {
      height: "30px",
      padding: "0 8px",
      fontSize: "0.875rem",
      display: "flex",
      alignItems: "center",
    },
  };

  const MyGridItem = ({ children, ...props }) => (
    <Grid item xs={12} sm={4} sx={{ display: "flex", alignItems: "center" }} {...props}>
      <Typography variant="body2">{children}</Typography>
    </Grid>
  );

  const initializePlanData = (details) => {
    return {
      productName: details?.productName || "",
      hsn_code: details?.hsn_code || "",
      overuse_policy: details?.overuse_policy || {
        overuse_not_allowed: false,
        overuse_disk_space: false,
        overuse_disk_space_nofify: false,
        overuse_allowed: false,
        overuse_allowed_notify: false,
      },
      disk_space: details?.disk_space || { value: "", type: "gb", unlimited: false },
      disk_space_usage: details?.disk_space_usage || { value: "", type: "gb" },
      traffic: details?.traffic || { value: "", type: "mb", unlimited: false },
      traffic_usage: details?.traffic_usage || { value: "", type: "mb" },
      domains: details?.domains || { value: "", unlimited: false },
      subdomins: details?.subdomins || { value: "", unlimited: false },
      dom_aliases: details?.dom_aliases || { value: "", unlimited: false },
      mail_boxes: details?.mail_boxes || { value: "", unlimited: false },
      mailbox_sizes: details?.mailbox_sizes || { value: "", type: "mb", unlimited: false },
      mail_list: details?.mail_list || { value: "", unlimited: false },
      add_ftp_acc: details?.add_ftp_acc || { value: "", unlimited: false },
      database: details?.database || { value: "", unlimited: false },
      expire_date: details?.expire_date || { value: "", type: "month", unlimited: false },
      wordpress_website: details?.wordpress_website || { value: "", unlimited: false },
      wordpress_backup: details?.wordpress_backup || { value: "", unlimited: false },
      wordpress_website_update: details?.wordpress_website_update || { value: "", unlimited: false },
      rank_tracker_crawls: details?.rank_tracker_crawls || { value: "", unlimited: false },
      web_users: details?.web_users || { value: "", unlimited: false },
    };
  };

  const handlePlanDataService = (name, value) => {
    setPlanData((prevPlanData) => ({
      ...prevPlanData,
      [name]: value,
    }));
  };

  const fetchData = () => {
    return axios
      .get(`${api_url1}/product/getProduct/${hostingId}`, axiosConfig)
      .then((result) => {
        const response = result.data;
        // console.log('Full API Response:', response);
        
        if (response.status === "success" && response.data) {
          const details = response.data.details;
          const customFields = response.data.customFields;
          
          // console.log('Details:', details);
          // console.log('Custom Fields:', customFields);
          
          setDescription(customFields?.description || "");
          setActualName(details?.productName || "");
          
          const initializedPlanData = initializePlanData(details);
          setPlanData(initializedPlanData);

          setOriginalPlanData(initializedPlanData);
          setOriginalDescription(customFields?.description || "");
          setOriginalActualName(details?.productName || "");

          return initializedPlanData;
        } else {
          throw new Error("Invalid response structure");
        }
      })
      .catch((err) => {
        // console.error('API Error:', err);
        const msg = err?.response?.data?.error?.message || err?.message || "Error fetching hosting plan";
        toast.error(msg);
        throw err;
      });
  };

  const { data: fetchedData, isLoading, error } = useQuery({
    queryKey: ['hostingPlan', hostingId],
    queryFn: fetchData,
    enabled: !!hostingId,
    retry: 1,
  });

  useEffect(() => {
    if (!isLoading && fetchedData) {
      setInitialLoading(false);
    }
  }, [isLoading, fetchedData]);

  const handleChangeOverUse = (field) => {
    setPlanData((prevPlanData) => ({
      ...prevPlanData,
      overuse_policy: {
        ...prevPlanData.overuse_policy,
        overuse_not_allowed: field === "overuse_not_allowed",
        overuse_disk_space: field === "overuse_disk_space",
        overuse_allowed: field === "overuse_allowed",
        overuse_disk_space_nofify:
          field === "overuse_not_allowed" || field === "overuse_allowed"
            ? false
            : prevPlanData.overuse_policy?.overuse_disk_space_nofify || false,
        overuse_allowed_notify:
          field === "overuse_not_allowed" || field === "overuse_disk_space"
            ? false
            : prevPlanData.overuse_policy?.overuse_allowed_notify || false,
      },
    }));
  };

  const handleChangeOverNotify = (field) => {
    setPlanData((prevPlanData) => ({
      ...prevPlanData,
      overuse_policy: {
        ...prevPlanData.overuse_policy,
        [field]: !prevPlanData.overuse_policy?.[field],
      },
    }));
  };

  const handlePlanData = (section, name, value) => {
    if (name === "value") {
      setPlanData((prevPlanData) => ({
        ...prevPlanData,
        [section]: {
          ...prevPlanData[section],
          [name]: value === "" ? "" : parseInt(value) || 0,
        },
      }));
    } else {
      setPlanData((prevPlanData) => ({
        ...prevPlanData,
        [section]: {
          ...prevPlanData[section],
          [name]: value,
        },
      }));
    }
  };

  const handlePlanDataBool = (section, name, secondName) => {
    setPlanData((prevPlanData) => ({
      ...prevPlanData,
      [section]: {
        ...prevPlanData[section],
        [name]: !prevPlanData[section]?.[name],
        ...(secondName && { [secondName]: prevPlanData[section]?.[name] ? "" : prevPlanData[section]?.[secondName] }),
      },
    }));
  };

  const handlePlanUpdate = () => {
    setLoading(true);
    const params = {
      detailsStatus: true,
      productId: hostingId,
      details: {
        description: description,
        hsn_code: planData.hsn_code,
        productName: actualName,
        newProductName: actualName === originalActualName ? "" : actualName,
        overuse_policy: planData.overuse_policy,
        disk_space: planData.disk_space,
        disk_space_usage: planData.disk_space_usage,
        traffic: planData.traffic,
        traffic_usage: planData.traffic_usage,
        domains: planData.domains,
        subdomins: planData.subdomins,
        dom_aliases: planData.dom_aliases,
        mail_boxes: planData.mail_boxes,
        mailbox_sizes: planData.mailbox_sizes,
        mail_list: planData.mail_list,
        add_ftp_acc: planData.add_ftp_acc,
        database: planData.database,
        expire_date: planData.expire_date,
        wordpress_website: planData.wordpress_website,
        wordpress_backup: planData.wordpress_backup,
        wordpress_website_update: planData.wordpress_website_update,
        rank_tracker_crawls: planData.rank_tracker_crawls,
        web_users: planData.web_users,
      },
    };

    axios
      .patch(`${api_url1}/product/updateProduct`, params, axiosConfig)
      .then(() => {
        toast.success("Plan updated successfully");
      })
      .catch((err) => {
        const msg = err?.response?.data?.message ;
        toast.error(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (initialLoading || isLoading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <WaveLoader size={60} barCount={6} />
        <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
          Loading Hosting Plan...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error loading hosting plan: {error.message}</Typography>
      </Box>
    );
  }

  const renderResourceInput = (section, label, hasSelect = false, options = [], hasCheckbox = true) => (
    <Grid item container xs={12} sx={{ marginBottom: 1 }}>
      <MyGridItem>{label}</MyGridItem>
      <Grid item xs={12} sm={8} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          size="small"
          sx={compactTextFieldStyle}
          value={planData?.[section]?.value ?? ""}
          type="number"
          onChange={(e) => handlePlanData(section, "value", e.target.value)}
          disabled={planData?.[section]?.unlimited}
        />
        {hasSelect && (
          <Select
            size="small"
            sx={compactSelectStyle}
            value={planData?.[section]?.type || ""}
            onChange={(e) => handlePlanData(section, "type", e.target.value)}
            disabled={planData?.[section]?.unlimited}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        )}
        {hasCheckbox && (
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={planData?.[section]?.unlimited || false}
                onChange={() => handlePlanDataBool(section, "unlimited", "value")}
              />
            }
            label="unlimited"
            sx={{ margin: 0, "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
          />
        )}
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 2, maxHeight: "calc(100vh - 100px)", overflow: "auto" }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <CommonBackButton to="/pricing/hosting" />
        <Typography variant="h5" 
        sx={{
          ml: 1, fontWeight: 600, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}>
          Hosting Plan Settings - {planData?.productName}
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        {/* Plan Name and Description */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" fontWeight="500" gutterBottom>
              Plan Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={planData?.productName || ""}
              onChange={(e) => handlePlanDataService("productName", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" fontWeight="500" gutterBottom>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Overuse Policy Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Resource Usage Policy
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={planData?.overuse_policy?.overuse_not_allowed || false}
                    onChange={() => handleChangeOverUse("overuse_not_allowed")}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="500">
                      OverUse is not allowed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Disallow overuse of resources. Subscription is automatically suspended if usage exceeds limits.
                    </Typography>
                  </Box>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={planData?.overuse_policy?.overuse_disk_space || false}
                    onChange={() => handleChangeOverUse("overuse_disk_space")}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="500">
                      OverUse of disk space and traffic is disallowed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Allow overuse of disk space and traffic. Disallow overuse of other resources.
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={planData?.overuse_policy?.overuse_disk_space_nofify || false}
                          onChange={() => handleChangeOverNotify("overuse_disk_space_nofify")}
                          disabled={!planData?.overuse_policy?.overuse_disk_space}
                        />
                      }
                      label="Notify me by email in case of overuse"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={planData?.overuse_policy?.overuse_allowed || false}
                    onChange={() => handleChangeOverUse("overuse_allowed")}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="500">
                      OverUse is allowed (not recommended)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Allow customers to use more resources than initially provided by the plan.
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={planData?.overuse_policy?.overuse_allowed_notify || false}
                          onChange={() => handleChangeOverNotify("overuse_allowed_notify")}
                          disabled={!planData?.overuse_policy?.overuse_allowed}
                        />
                      }
                      label="Notify me by email in case of overuse"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Resources Section */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Plan Resources
          </Typography>

          {/* Storage Resources */}
          <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Storage & Bandwidth
            </Typography>
            <Grid container spacing={1}>
              {renderResourceInput("disk_space", "Disk Space", true, options)}

              <Grid item container xs={12} sx={{ marginBottom: 1 }}>
                <MyGridItem>Notify when disk space usage reaches</MyGridItem>
                <Grid item xs={12} sm={8} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    size="small"
                    sx={compactTextFieldStyle}
                    value={planData?.disk_space_usage?.value || ""}
                    type="number"
                    onChange={(e) => handlePlanData("disk_space_usage", "value", e.target.value)}
                  />
                  <Select
                    size="small"
                    sx={compactSelectStyle}
                    value={planData?.disk_space_usage?.type || ""}
                    onChange={(e) => handlePlanData("disk_space_usage", "type", e.target.value)}
                  >
                    {optionsPer.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>

              {renderResourceInput("traffic", "Traffic", true, optionsPerM)}

              <Grid item container xs={12} sx={{ marginBottom: 1 }}>
                <MyGridItem>Notify when Traffic Limit Reaches</MyGridItem>
                <Grid item xs={12} sm={8} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    size="small"
                    sx={compactTextFieldStyle}
                    value={planData?.traffic_usage?.value || ""}
                    type="number"
                    onChange={(e) => handlePlanData("traffic_usage", "value", e.target.value)}
                  />
                  <Select
                    size="small"
                    sx={compactSelectStyle}
                    value={planData?.traffic_usage?.type || ""}
                    onChange={(e) => handlePlanData("traffic_usage", "type", e.target.value)}
                  >
                    {optionsPerM.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Domain Resources */}
          <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Domain Resources
            </Typography>
            <Grid container spacing={1}>
              {renderResourceInput("domains", "Domains", false, [], true)}
              {renderResourceInput("subdomins", "SubDomains", false, [], true)}
              {renderResourceInput("dom_aliases", "Domain Aliases", false, [], true)}
              {renderResourceInput("web_users", "Web Users", false, [], true)}
            </Grid>
          </Paper>

          {/* Mail Resources */}
          <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Mail Resources
            </Typography>
            <Grid container spacing={1}>
              {renderResourceInput("mail_boxes", "MailBoxes", false, [], true)}
              {renderResourceInput("mailbox_sizes", "Mail Size", true, options)}
              {renderResourceInput("mail_list", "Mail Lists", false, [], true)}
            </Grid>
          </Paper>

          {/* Other Resources */}
          <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Other Resources
            </Typography>
            <Grid container spacing={1}>
              {renderResourceInput("add_ftp_acc", "Additional FTP Accounts", false, [], true)}
              {renderResourceInput("database", "Databases", false, [], true)}
              {renderResourceInput("expire_date", "Expiration Date", true, expiryOption)}
              {renderResourceInput("wordpress_website", "WordPress Websites", false, [], true)}
              {renderResourceInput("wordpress_backup", "WordPress Backups", false, [], true)}
              {renderResourceInput("wordpress_website_update", "WordPress websites with smart updates", false, [], true)}
              {renderResourceInput("rank_tracker_crawls", "Rank Tracker crawls", false, [], true)}
            </Grid>
          </Paper>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={handlePlanUpdate}
            size="medium"
          >
            Save Changes
          </LoadingButton>
          <Button
            variant="outlined"
            onClick={() => {
              setPlanData(originalPlanData);
              setDescription(originalDescription);
              setActualName(originalActualName);
            }}
            size="medium"
          >
            Cancel
          </Button>
        </Box>
      </Paper>

      <CustomToastContainer />
    </Box>
  );
};

export default EditHostingPlan;