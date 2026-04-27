import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  Paper,
} from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { useQuery } from "@tanstack/react-query";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CommonNumberField, CommonTextField, CommonSelect, CommonDescriptionField } from "../../common/fields";
import { getUserSession } from "../../../utils/session";
import { toast } from "react-toastify";
import WaveLoader from "../../common/NDE-WaveLoader";

const api_url1 = "https://api.nowdigitaleasy.com/ndeadmin/v2";

function CreateProduct() {
  const [loading, setloading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { token } = getUserSession();
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const [GroupList, setGroupList] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [moduleList, setModuleList] = useState([]);
  const [productType, setproductType] = useState("Shared Hosting");
  const navigate = useNavigate();

  const options = ["mb", "gb", "tb"];
  const optionsPer = ["%", "mb", "gb", "tb"];
  const optionsPerM = ["gb", "mb", "tb"];
  const expiryOption = ["days", "month", "year"];

  const [planData, setPlanData] = useState({
    productName: "",
    hsn_code: "",
    module_name: "",
    decription: "",
    productGroup: groupId,
    productType: productType,
    overuse_policy: {
      overuse_not_allowed: true,
      overuse_disk_space: false,
      overuse_disk_space_nofify: false,
      overuse_allowed: false,
      overuse_allowed_notify: false,
    },
    disk_space: {
      value: "",
      type: "mb",
      unlimited: false,
    },
    disk_space_usage: {
      value: "",
      type: "mb",
    },
    traffic: {
      value: "",
      type: "mb",
      unlimited: false,
    },
    traffic_usage: {
      value: "",
      type: "mb",
    },
    domains: {
      value: "",
      unlimited: false,
    },
    subdomins: {
      value: "",
      unlimited: false,
    },
    dom_aliases: {
      value: "",
      unlimited: false,
    },
    mail_boxes: {
      value: "",
      unlimited: false,
    },
    mailbox_sizes: {
      value: "",
      type: "mb",
      unlimited: false,
    },
    mail_list: {
      value: "",
      unlimited: false,
    },
    add_ftp_acc: {
      value: "",
      unlimited: false,
    },
    database: {
      value: "",
      unlimited: false,
    },
    expire_date: {
      value: "",
      type: "days",
      unlimited: false,
    },
    wordpress_website: {
      value: "",
      unlimited: false,
    },
    wordpress_backup: {
      value: "",
      unlimited: false,
    },
    wordpress_website_update: {
      value: "",
      unlimited: false,
    },
    rank_tracker_crawls: {
      value: "",
      unlimited: false,
    },
    web_users: {
      value: "",
      unlimited: false,
    },
  });

  const groupList = () => {
    return axios
      .get(`${api_url1}/product/getAllProductGroup`, axiosConfig)
      .then((responce) => {
        setGroupList(
          responce.data.data.map((item) => ({
            label: item.name,
            id: item._id,
          }))
        );
        const groupId = responce.data.data.filter((data) => {
          return data.name.toLowerCase() === "hosting";
        });
        setGroupId(groupId[0]._id);
        return responce.data.data;
      })
      .catch((err) => {
        return err;
      });
  };

  function getModuleList() {
    return axios
      .get(`${api_url1}/plesk/getmodule`, axiosConfig)
      .then((result) => {
        const defaultServerObject = result.data.find(
          (item) => item.defaultserver
        );
        setModuleList(result.data);
        if (defaultServerObject) {
          setPlanData((prevPlanData) => ({
            ...prevPlanData,
            module_name: defaultServerObject.serverName,
          }));
        }
        return result.data;
      })
      .catch((err) => {
        const msg = err?.response?.data?.error?.message || "Error fetching hosting plan";
        toast.error(msg);
      });
  }

  useQuery({
    queryKey: ["key"],
    queryFn: groupList,
  });
  useQuery({
    queryKey: ["moduleKey"],
    queryFn: getModuleList,
  });

  const createGroup = async () => {
    setloading(true);
    const params = {
      productType: planData.productType,
      productGroup: groupId,
      productName: planData.productName,
      hsn_code: planData.hsn_code,
      module_name: planData.module_name,
      decription: planData.decription,
      overuse_policy: planData.overuse_policy,
      disk_space: {
        value: planData.disk_space.unlimited ? "" : planData.disk_space.value,
        type: planData.disk_space.unlimited ? "" : planData.disk_space.type,
        unlimited: planData.disk_space.unlimited,
      },
      disk_space_usage: {
        value: planData.disk_space_usage.value,
        type: planData.disk_space_usage.type,
      },
      traffic: {
        value: planData.traffic.unlimited ? "" : planData.traffic.value,
        type: planData.traffic.unlimited ? "" : planData.traffic.type,
        unlimited: planData.traffic.unlimited,
      },
      traffic_usage: {
        value: planData.traffic_usage.value,
        type: planData.traffic_usage.type,
      },
      domains: {
        value: planData.domains.unlimited ? "" : planData.domains.value,
        unlimited: planData.domains.unlimited,
      },
      subdomins: {
        value: planData.subdomins.unlimited ? "" : planData.subdomins.value,
        unlimited: planData.subdomins.unlimited,
      },
      dom_aliases: {
        value: planData.dom_aliases.unlimited ? "" : planData.dom_aliases.value,
        unlimited: planData.dom_aliases.unlimited,
      },
      mail_boxes: {
        value: planData.mail_boxes.unlimited ? "" : planData.mail_boxes.value,
        unlimited: planData.mail_boxes.unlimited,
      },
      mailbox_sizes: {
        value: planData.mailbox_sizes.unlimited ? "" : planData.mailbox_sizes.value,
        type: planData.mailbox_sizes.unlimited ? "" : planData.mailbox_sizes.type,
        unlimited: planData.mailbox_sizes.unlimited,
      },
      mail_list: {
        value: planData.mail_list.unlimited ? "" : planData.mail_list.value,
        unlimited: planData.mail_list.unlimited,
      },
      add_ftp_acc: {
        value: planData.add_ftp_acc.unlimited ? "" : planData.add_ftp_acc.value,
        unlimited: planData.add_ftp_acc.unlimited,
      },
      database: {
        value: planData.database.unlimited ? "" : planData.database.value,
        unlimited: planData.database.unlimited,
      },
      expire_date: {
        value: planData.expire_date.unlimited ? "" : planData.expire_date.value,
        type: planData.expire_date.unlimited ? "" : planData.expire_date.type,
        unlimited: planData.expire_date.unlimited,
      },
      wordpress_website: {
        value: planData.wordpress_website.unlimited ? "" : planData.wordpress_website.value,
        unlimited: planData.wordpress_website.unlimited,
      },
      wordpress_backup: {
        value: planData.wordpress_backup.unlimited ? "" : planData.wordpress_backup.value,
        unlimited: planData.wordpress_backup.unlimited,
      },
      wordpress_website_update: {
        value: planData.wordpress_website_update.unlimited ? "" : planData.wordpress_website_update.value,
        unlimited: planData.wordpress_website_update.unlimited,
      },
      rank_tracker_crawls: {
        value: planData.rank_tracker_crawls.unlimited ? "" : planData.rank_tracker_crawls.value,
        unlimited: planData.rank_tracker_crawls.unlimited,
      },
      web_users: {
        value: planData.web_users.unlimited ? "" : planData.web_users.value,
        unlimited: planData.web_users.unlimited,
      },
    };

    await axios
      .post(`${api_url1}/product/createProduct`, params, axiosConfig)
      .then(function () {
        setloading(false);
        setTimeout(() => {
          navigate('/pricing/hosting');
        }, 2000);
      })
      .catch((error) => {
        setloading(false);
        const msg = error?.response?.data?.error || "Error fetching hosting plan";
        toast.error(msg);
      });
  };

  function handlePlanDataService(name, value) {
    setPlanData({
      ...planData,
      [name]: value,
    });
  }

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
            : prevPlanData.overuse_policy.overuse_disk_space_nofify,
        overuse_allowed_notify:
          field === "overuse_not_allowed" || field === "overuse_disk_space"
            ? false
            : prevPlanData.overuse_policy.overuse_allowed_notify,
      },
    }));
  };

  const handleChangeOverNotify = (field) => {
    setPlanData((prevPlanData) => ({
      ...prevPlanData,
      overuse_policy: {
        ...prevPlanData.overuse_policy,
        [field]: !prevPlanData.overuse_policy[field],
      },
    }));
  };

  function handlePlanData(section, name, value) {
    setPlanData((prevPlanData) => ({
      ...prevPlanData,
      [section]: {
        ...prevPlanData[section],
        [name]: value,
      },
    }));
  }

  function handlePlanDataBool(section, name, secondName) {
    setPlanData((prevPlanData) => ({
      ...prevPlanData,
      [section]: {
        ...prevPlanData[section],
        [name]: !prevPlanData[section][name],
        [secondName]: prevPlanData[section][name] ? "" : -1,
      },
    }));
  }

  const renderResourceInput = (field, label, hasSelect = false, selectOptions = [], showUnlimited = true) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      <Typography variant="subtitle2" sx={{ minWidth: "200px", fontWeight: 600 }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CommonNumberField
          value={planData[field].value}
          onChange={(e) => handlePlanData(field, "value", e.target.value)}
          disabled={planData[field].unlimited}
          width="120px"
          mb={0}
        />
        {hasSelect && (
          <CommonSelect
            value={planData[field].type}
            onChange={(e) => handlePlanData(field, "type", e.target.value)}
            options={selectOptions.map(opt => ({ value: opt, label: opt }))}
            disabled={planData[field].unlimited}
            width="100px"
          />
        )}
        {showUnlimited && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={planData[field].unlimited}
              onChange={() => handlePlanDataBool(field, "unlimited", "value")}
            />
            <Typography variant="body2">Unlimited</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  if (initialLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "600px",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <WaveLoader size={60} barCount={6} />
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          Loading product configuration...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxHeight: "calc(100vh - 100px)", overflow: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            border: "1px solid #E5E7EB",
            '&:hover': { backgroundColor: "rgba(0,0,0,0.04)" }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent"
          }}
        >
          Create New Product
        </Typography>
      </Box>

      {/* Product Type Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Product Type
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          Defines how WHMCS manages the item. Don't see the type of product you're looking for? Choose Other
        </Typography>
        <Button
          onClick={() => setproductType("Shared Hosting")}
          sx={{
            backgroundColor: productType === "Shared Hosting" ? "primary.main" : "background.paper",
            color: productType === "Shared Hosting" ? "white" : "text.primary",
            border: "1px solid",
            borderColor: productType === "Shared Hosting" ? "primary.main" : "grey.300",
            p: 2,
            '&:hover': {
              backgroundColor: productType === "Shared Hosting" ? "primary.dark" : "grey.100",
            }
          }}
        >
          <StorageIcon sx={{ fontSize: "45px", mr: 2, color: 'icon.light' }} />
          Shared Hosting
        </Button>
      </Paper>

      {/* Basic Information */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Basic Information
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 300px" }}>
              <CommonTextField
                label="Product Name"
                value={planData.productName}
                onChange={(e) => handlePlanDataService("productName", e.target.value)}
                placeholder="eg. Shared Hosting"
                fullWidth
                mandatory
                mb={0}
              />
            </Box>
            <Box sx={{ flex: "1 1 300px" }}>
              <CommonTextField
                label="HSN Code"
                value={planData.hsn_code}
                onChange={(e) => handlePlanDataService("hsn_code", e.target.value)}
                placeholder="HSN Code"
                fullWidth
                mandatory
                mb={0}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 300px" }}>
              <CommonSelect
                label="Module Name"
                value={planData.module_name}
                onChange={(e) => handlePlanDataService("module_name", e.target.value)}
                options={moduleList.map(item => ({ value: item.serverName, label: item.serverName }))}
                fullWidth
                mb={0}
              />
            </Box>
          </Box>
          <Box>
            <CommonDescriptionField
              label="Description"
              value={planData.decription}
              onChange={(e) => handlePlanDataService("decription", e.target.value)}
              placeholder="Product description..."
              rows={4}
              fullWidth
              mandatory
              mb={0}
            />
          </Box>
        </Box>
      </Paper>

      {/* Overuse Policy */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Overuse Policy
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {[
            {
              field: "overuse_not_allowed",
              title: "OverUse is not allowed",
              description: "Disallow overuse of the resources. A subscription is automatically suspended if the resource usage exceeds the limit value",
              notify: false
            },
            {
              field: "overuse_disk_space",
              title: "OverUse use of disk space and traffic is disallowed",
              description: "Allow overuse of disk space and traffic. Disallow overuse of other resources",
              notify: "overuse_disk_space_nofify"
            },
            {
              field: "overuse_allowed",
              title: "OverUse use is allowed (not recommended)",
              description: "Allow customers to use more resources than initially provided by the plan",
              notify: "overuse_allowed_notify"
            }
          ].map((policy, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Checkbox
                checked={planData.overuse_policy[policy.field]}
                onChange={() => handleChangeOverUse(policy.field)}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {policy.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                  {policy.description}
                </Typography>
                {policy.notify && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Checkbox
                      checked={planData.overuse_policy[policy.notify]}
                      onChange={() => handleChangeOverNotify(policy.notify)}
                      disabled={!planData.overuse_policy[policy.field]}
                      size="small"
                    />
                    <Typography variant="body2">
                      Notify me by email in case of overuse
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Resource Configuration */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Plan Resources
        </Typography>

        {/* Storage & Bandwidth */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            Storage & Bandwidth
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              {renderResourceInput("disk_space", "Disk Space", true, options)}

              {/* Disk Space Usage Notification */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ minWidth: "200px", fontWeight: 600 }}>
                  Notify when disk space usage reaches
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CommonNumberField
                    value={planData.disk_space_usage.value}
                    onChange={(e) => handlePlanData("disk_space_usage", "value", e.target.value)}
                    width="120px"
                  />
                  <CommonSelect
                    value={planData.disk_space_usage.type}
                    onChange={(e) => handlePlanData("disk_space_usage", "type", e.target.value)}
                    options={optionsPer.map(opt => ({ value: opt, label: opt }))}
                    width="100px"
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: '1 1 300px' }}>
              {renderResourceInput("traffic", "Traffic", true, optionsPerM)}

              {/* Traffic Usage Notification */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ minWidth: "200px", fontWeight: 600 }}>
                  Notify when Traffic Limit Reaches
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CommonNumberField
                    value={planData.traffic_usage.value}
                    onChange={(e) => handlePlanData("traffic_usage", "value", e.target.value)}
                    width="120px"
                  />
                  <CommonSelect
                    value={planData.traffic_usage.type}
                    onChange={(e) => handlePlanData("traffic_usage", "type", e.target.value)}
                    options={optionsPerM.map(opt => ({ value: opt, label: opt }))}
                    width="100px"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Domain Resources */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            Domain Resources
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              {renderResourceInput("domains", "Domains", false, [], true)}
              {renderResourceInput("subdomins", "SubDomains", false, [], true)}
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              {renderResourceInput("dom_aliases", "Domain Aliases", false, [], true)}
              {renderResourceInput("web_users", "Web Users", false, [], true)}
            </Box>
          </Box>
        </Paper>

        {/* Mail Resources */}
        <Paper elevation={0} sx={{ p: 3,  backgroundColor: 'grey.50' }}>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            Mail Resources
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', }}>
            <Box sx={{ flex: '1 1 300px' }}>
              {renderResourceInput("mail_boxes", "MailBoxes", false, [], true)}
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              {renderResourceInput("mailbox_sizes", "Mail Size", true, options)}
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              {renderResourceInput("mail_list", "Mail Lists", false, [], true)}
            </Box>
          </Box>
        </Paper>

        {/* Other Resources */}
        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            Other Resources
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              {renderResourceInput("add_ftp_acc", "Additional FTP Accounts", false, [], true)}
              {renderResourceInput("database", "Databases", false, [], true)}
              {renderResourceInput("expire_date", "Expiration Date", true, expiryOption)}
              {renderResourceInput("wordpress_website", "WordPress Websites", false, [], true)}
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              {renderResourceInput("wordpress_backup", "WordPress Backups", false, [], true)}
              {renderResourceInput("wordpress_website_update", "WordPress websites with smart updates", false, [], true)}
              {renderResourceInput("rank_tracker_crawls", "Rank Tracker crawls", false, [], true)}
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={createGroup}
          sx={{
            borderRadius: 2,
             height:40,
          }}
        >
          Create Product
        </LoadingButton>
        <Button
          variant="outlined"
          sx={{
            height:40,
            borderRadius: 2,
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

export default CreateProduct;