import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { getUserSession } from "../../../utils/session";
import CustomToastContainer from "../../../components/common/NDE-Snackbar";
import CommonDrawer from "../../common/NDE-Drawer";

const api_url1 = "https://api.nowdigitaleasy.com/ndeadmin/v2";

const EditHostingPlan = ({ open, handleClose }) => {
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
        width: "120px",
        "& .MuiInputBase-input": {
            height: "40px",
            padding: "0 12px",
            fontSize: "0.875rem",
        },
    };

    const compactSelectStyle = {
        width: "100px",
        height: "40px",
        "& .MuiSelect-select": {
            height: "40px",
            padding: "0 12px",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
        },
    };

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

                if (response.status === "success" && response.data) {
                    const details = response.data.details;
                    const customFields = response.data.customFields;
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
                const msg = err?.response?.data?.error?.message || err?.message || "Error fetching hosting plan";
                toast.error(msg);
                throw err;
            });
    };

    const { data: fetchedData, isLoading } = useQuery({
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
                const msg = err?.response?.data?.message;
                toast.error(msg);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const renderResourceInput = (section, label, hasSelect = false, options = [], hasCheckbox = true) => (
        <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            mb: 2,
            gap: 2
        }}>
            <Typography variant="subtitle2" sx={{ 
                minWidth: "220px", 
                fontWeight: 600,
                fontSize: '0.875rem'
            }}>
                {label}
            </Typography>
            <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 2,
                flex: 1,
                maxWidth: "400px"
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
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
                </Box>
                {hasCheckbox && (
                    <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        minWidth: "140px",
                        justifyContent: "flex-end"
                    }}>
                        <Checkbox
                            size="small"
                            checked={planData?.[section]?.unlimited || false}
                            onChange={() => handlePlanDataBool(section, "unlimited", "value")}
                        />
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                            Unlimited
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );

    const renderNotificationInput = (label, section, typeOptions) => (
        <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            mb: 2,
            gap: 2
        }}>
            <Typography variant="subtitle2" sx={{ 
                minWidth: "220px", 
                fontWeight: 600,
                fontSize: '0.875rem'
            }}>
                {label}
            </Typography>
            <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1,
                flex: 1,
                maxWidth: "400px"
            }}>
                <TextField
                    size="small"
                    sx={compactTextFieldStyle}
                    value={planData?.[section]?.value || ""}
                    type="number"
                    onChange={(e) => handlePlanData(section, "value", e.target.value)}
                />
                <Select
                    size="small"
                    sx={compactSelectStyle}
                    value={planData?.[section]?.type || ""}
                    onChange={(e) => handlePlanData(section, "type", e.target.value)}
                >
                    {typeOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </Box>
    );

    return (
        <Box>
            <CommonDrawer
                open={open}
                onClose={handleClose}
                title={"Edit Hosting Plan"}
                onSubmit={handlePlanUpdate}
                anchor="right"
                width={800}
                actions={[
                    { label: "Cancel", variant: "outlined", onClick: handleClose },
                    { label: "Save", onClick: handlePlanUpdate, loading: loading },
                ]}
            >

                {/* Header Section */}
                <Paper elevation={1} sx={{ p: 1, mb: 3, borderRadius: 2 }}>
                    {/* Plan Name and Description */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ fontSize: '1rem', mb: 1.5 }}>
                            Plan Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ minWidth: "120px", fontWeight: 600, fontSize: '0.875rem' }}>
                                        Plan Name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={planData?.productName || ""}
                                        onChange={(e) => handlePlanDataService("productName", e.target.value)}
                                        sx={{ maxWidth: "400px" }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Typography variant="subtitle2" sx={{ minWidth: "120px", fontWeight: 600, fontSize: '0.875rem' }}>
                                        Description
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        sx={{ maxWidth: "400px" }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Overuse Policy Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ fontSize: '1rem', mb: 1.5 }}>
                            Resource Usage Policy
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {[
                                {
                                    field: "overuse_not_allowed",
                                    title: "OverUse is not allowed",
                                    description: "Disallow overuse of resources. Subscription is automatically suspended if usage exceeds limits.",
                                    notify: false
                                },
                                {
                                    field: "overuse_disk_space",
                                    title: "OverUse of disk space and traffic is disallowed",
                                    description: "Allow overuse of disk space and traffic. Disallow overuse of other resources.",
                                    notify: "overuse_disk_space_nofify"
                                },
                                {
                                    field: "overuse_allowed",
                                    title: "OverUse is allowed (not recommended)",
                                    description: "Allow customers to use more resources than initially provided by the plan.",
                                    notify: "overuse_allowed_notify"
                                }
                            ].map((policy, index) => (
                                <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                    <Checkbox
                                        size="small"
                                        checked={planData?.overuse_policy?.[policy.field] || false}
                                        onChange={() => handleChangeOverUse(policy.field)}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" fontWeight="500" sx={{ mb: 0.5 }}>
                                            {policy.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                            {policy.description}
                                        </Typography>
                                        {policy.notify && (
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Checkbox
                                                    size="small"
                                                    checked={planData?.overuse_policy?.[policy.notify] || false}
                                                    onChange={() => handleChangeOverNotify(policy.notify)}
                                                    disabled={!planData?.overuse_policy?.[policy.field]}
                                                />
                                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                                    Notify me by email in case of overuse
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Resources Section */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ fontSize: '1rem', mb: 2 }}>
                            Plan Resources
                        </Typography>

                        {/* Storage Resources */}
                        <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                            <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ fontSize: '0.9375rem', mb: 2.5 }}>
                                Storage & Bandwidth
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Disk Space */}
                                <Box sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "space-between",
                                    mb: 2
                                }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        minWidth: "220px", 
                                        fontWeight: 600,
                                        fontSize: '0.875rem'
                                    }}>
                                        Disk Space
                                    </Typography>
                                    <Box sx={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 2,
                                        flex: 1,
                                        maxWidth: "400px"
                                    }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                                            <TextField
                                                size="small"
                                                sx={compactTextFieldStyle}
                                                value={planData?.disk_space?.value ?? ""}
                                                type="number"
                                                onChange={(e) => handlePlanData("disk_space", "value", e.target.value)}
                                                disabled={planData?.disk_space?.unlimited}
                                            />
                                            <Select
                                                size="small"
                                                sx={compactSelectStyle}
                                                value={planData?.disk_space?.type || "gb"}
                                                onChange={(e) => handlePlanData("disk_space", "type", e.target.value)}
                                                disabled={planData?.disk_space?.unlimited}
                                            >
                                                {options.map((option, index) => (
                                                    <MenuItem key={index} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                        <Box sx={{ 
                                            display: "flex", 
                                            alignItems: "center", 
                                            minWidth: "140px",
                                            justifyContent: "flex-end"
                                        }}>
                                            <Checkbox
                                                size="small"
                                                checked={planData?.disk_space?.unlimited || false}
                                                onChange={() => handlePlanDataBool("disk_space", "unlimited", "value")}
                                            />
                                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                                Unlimited
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {renderNotificationInput("Notify when disk space usage reaches", "disk_space_usage", optionsPer)}

                                {/* Traffic */}
                                <Box sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "space-between",
                                    mb: 2
                                }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        minWidth: "220px", 
                                        fontWeight: 600,
                                        fontSize: '0.875rem'
                                    }}>
                                        Traffic
                                    </Typography>
                                    <Box sx={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 2,
                                        flex: 1,
                                        maxWidth: "400px"
                                    }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                                            <TextField
                                                size="small"
                                                sx={compactTextFieldStyle}
                                                value={planData?.traffic?.value ?? ""}
                                                type="number"
                                                onChange={(e) => handlePlanData("traffic", "value", e.target.value)}
                                                disabled={planData?.traffic?.unlimited}
                                            />
                                            <Select
                                                size="small"
                                                sx={compactSelectStyle}
                                                value={planData?.traffic?.type || "mb"}
                                                onChange={(e) => handlePlanData("traffic", "type", e.target.value)}
                                                disabled={planData?.traffic?.unlimited}
                                            >
                                                {optionsPerM.map((option, index) => (
                                                    <MenuItem key={index} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                        <Box sx={{ 
                                            display: "flex", 
                                            alignItems: "center", 
                                            minWidth: "140px",
                                            justifyContent: "flex-end"
                                        }}>
                                            <Checkbox
                                                size="small"
                                                checked={planData?.traffic?.unlimited || false}
                                                onChange={() => handlePlanDataBool("traffic", "unlimited", "value")}
                                            />
                                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                                Unlimited
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {renderNotificationInput("Notify when Traffic Limit Reaches", "traffic_usage", optionsPerM)}
                            </Box>
                        </Paper>

                        {/* Domain Resources */}
                        <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                            <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ fontSize: '0.9375rem', mb: 2.5 }}>
                                Domain Resources
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {renderResourceInput("domains", "Domains", false, [], true)}
                                {renderResourceInput("subdomins", "SubDomains", false, [], true)}
                                {renderResourceInput("dom_aliases", "Domain Aliases", false, [], true)}
                                {renderResourceInput("web_users", "Web Users", false, [], true)}
                            </Box>
                        </Paper>

                        {/* Mail Resources */}
                        <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                            <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ fontSize: '0.9375rem', mb: 2.5 }}>
                                Mail Resources
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {renderResourceInput("mail_boxes", "MailBoxes", false, [], true)}
                                {renderResourceInput("mailbox_sizes", "Mail Size", true, options)}
                                {renderResourceInput("mail_list", "Mail Lists", false, [], true)}
                            </Box>
                        </Paper>

                        {/* Other Resources */}
                        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                            <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ fontSize: '0.9375rem', mb: 2.5 }}>
                                Other Resources
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {renderResourceInput("add_ftp_acc", "Additional FTP Accounts", false, [], true)}
                                {renderResourceInput("database", "Databases", false, [], true)}
                                {renderResourceInput("expire_date", "Expiration Date", true, expiryOption)}
                                {renderResourceInput("wordpress_website", "WordPress Websites", false, [], true)}
                                {renderResourceInput("wordpress_backup", "WordPress Backups", false, [], true)}
                                {renderResourceInput("wordpress_website_update", "WordPress websites with smart updates", false, [], true)}
                                {renderResourceInput("rank_tracker_crawls", "Rank Tracker crawls", false, [], true)}
                            </Box>
                        </Paper>
                    </Box>
                </Paper>

                <CustomToastContainer />
            </CommonDrawer>
        </Box>
    );
};

export default EditHostingPlan;