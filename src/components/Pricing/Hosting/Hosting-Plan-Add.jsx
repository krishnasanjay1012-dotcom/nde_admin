import React, { useState } from "react";
import {
    Box,
    Typography,
    Checkbox,
    Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { CommonNumberField, CommonSelect, CommonTextField } from "../../common/fields";
import { getUserSession } from "../../../utils/session";
import { toast } from "react-toastify";
import CommonDrawer from "../../common/NDE-Drawer";

const api_url1 = "https://api.nowdigitaleasy.com/ndeadmin/v2";

function CreatePlan({ open, handleClose }) {
    const [loading, setloading] = useState(false);
    const { token } = getUserSession();
    const axiosConfig = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    const [GroupList, setGroupList] = useState([]);
    const [groupId, setGroupId] = useState("");
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
                if (defaultServerObject) {
                    setPlanData((prevPlanData) => ({
                        ...prevPlanData,
                        module_name: defaultServerObject.serverName,
                    }));
                }
                return result.data;
            })
            .catch((err) => {
                const msg = err?.response?.data?.message || err?.response?.data?.error?.message || "Error fetching hosting plan";
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

    function handlePlanDataService(name, value) {
        setPlanData({
            ...planData,
            [name]: value,
        });
    }

    const renderResourceInput = (field, label, hasSelect = false, selectOptions = [], showUnlimited = true) => (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2.5,
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
                    <CommonNumberField
                        value={planData[field].value}
                        onChange={(e) => handlePlanData(field, "value", e.target.value)}
                        disabled={planData[field].unlimited}
                        width="100%"
                        mb={0}
                        height={40}
                    />
                    {hasSelect && (
                        <CommonSelect
                            value={planData[field].type}
                            onChange={(e) => handlePlanData(field, "type", e.target.value)}
                            options={selectOptions.map(opt => ({ value: opt, label: opt }))}
                            disabled={planData[field].unlimited}
                            width="100px"
                            height={40}
                            mb={0}
                            mt={0}
                        />
                    )}
                </Box>
                {showUnlimited && (
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: "140px",
                        justifyContent: "flex-end"
                    }}>
                        <Checkbox
                            checked={planData[field].unlimited}
                            onChange={() => handlePlanDataBool(field, "unlimited", "value")}
                            size="small"
                        />
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                            Unlimited
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );

    return (
        <Box>
            <CommonDrawer
                open={open}
                onClose={handleClose}
                title={"New Hosting Plan"}
                onSubmit={createGroup}
                anchor="right"
                width={800}
                actions={[
                    { label: "Cancel", variant: "outlined", onClick: handleClose },
                    { label: "Save", onClick: createGroup, loading: loading, },
                ]}
            >
                <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                        Basic Information
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
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
                        </Box>
                    </Box>
                </Paper>
                {/* Overuse Policy */}
                <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '1.125rem' }}>
                        Overuse Policy
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
                                    size="small"
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: '0.9375rem', mb: 0.5 }}>
                                        {policy.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: '0.8125rem' }}>
                                        {policy.description}
                                    </Typography>
                                    {policy.notify && (
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                                            <Checkbox
                                                checked={planData.overuse_policy[policy.notify]}
                                                onChange={() => handleChangeOverNotify(policy.notify)}
                                                disabled={!planData.overuse_policy[policy.field]}
                                                size="small"
                                            />
                                            <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
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
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '1.125rem' }}>
                        Plan Resources
                    </Typography>

                    {/* Storage & Bandwidth */}
                    <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ fontSize: '1rem', mb: 2.5 }}>
                            Storage & Bandwidth
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
                                        <CommonNumberField
                                            value={planData.disk_space.value}
                                            onChange={(e) => handlePlanData("disk_space", "value", e.target.value)}
                                            disabled={planData.disk_space.unlimited}
                                            width="100%"
                                            mb={0}
                                            height={40}
                                        />
                                        <CommonSelect
                                            value={planData.disk_space.type}
                                            onChange={(e) => handlePlanData("disk_space", "type", e.target.value)}
                                            options={options.map(opt => ({ value: opt, label: opt }))}
                                            disabled={planData.disk_space.unlimited}
                                            width="100px"
                                            height={40}
                                            mb={0}
                                            mt={0}

                                        />
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        minWidth: "140px",
                                        justifyContent: "flex-end"
                                    }}>
                                        <Checkbox
                                            checked={planData.disk_space.unlimited}
                                            onChange={() => handlePlanDataBool("disk_space", "unlimited", "value")}
                                            size="small"
                                        />
                                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                            Unlimited
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Disk Space Usage Notification */}
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
                                    Notify when disk space usage reaches
                                </Typography>
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    flex: 1,
                                    maxWidth: "400px"
                                }}>
                                    <CommonNumberField
                                        value={planData.disk_space_usage.value || 0}
                                        onChange={(e) => handlePlanData("disk_space_usage", "value", e.target.value)}
                                        width="100%"
                                        height={40}
                                    />
                                    <CommonSelect
                                        value={planData.disk_space_usage.type}
                                        onChange={(e) => handlePlanData("disk_space_usage", "type", e.target.value)}
                                        options={optionsPer.map(opt => ({ value: opt, label: opt }))}
                                        width="100px"
                                        height={40}
                                    />
                                </Box>
                            </Box>

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
                                        <CommonNumberField
                                            value={planData.traffic.value}
                                            onChange={(e) => handlePlanData("traffic", "value", e.target.value)}
                                            disabled={planData.traffic.unlimited}
                                            width="100%"
                                            mb={0}
                                            height={40}
                                        />
                                        <CommonSelect
                                            value={planData.traffic.type}
                                            onChange={(e) => handlePlanData("traffic", "type", e.target.value)}
                                            options={optionsPerM.map(opt => ({ value: opt, label: opt }))}
                                            disabled={planData.traffic.unlimited}
                                            width="100px"
                                            height={40}
                                        />
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        minWidth: "140px",
                                        justifyContent: "flex-end"
                                    }}>
                                        <Checkbox
                                            checked={planData.traffic.unlimited}
                                            onChange={() => handlePlanDataBool("traffic", "unlimited", "value")}
                                            size="small"
                                        />
                                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                            Unlimited
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Traffic Usage Notification */}
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}>
                                <Typography variant="subtitle2" sx={{
                                    minWidth: "220px",
                                    fontWeight: 600,
                                    fontSize: '0.875rem'
                                }}>
                                    Notify when Traffic Limit Reaches
                                </Typography>
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    flex: 1,
                                    maxWidth: "400px"
                                }}>
                                    <CommonNumberField
                                        value={planData.traffic_usage.value || 0}
                                        onChange={(e) => handlePlanData("traffic_usage", "value", e.target.value)}
                                        width="100%"
                                        height={40}
                                    />
                                    <CommonSelect
                                        value={planData.traffic_usage.type}
                                        onChange={(e) => handlePlanData("traffic_usage", "type", e.target.value)}
                                        options={optionsPerM.map(opt => ({ value: opt, label: opt }))}
                                        width="100px"
                                        height={40}
                                        mb={0}
                                        mt={0}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Domain Resources */}
                    <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ fontSize: '1rem', mb: 2.5 }}>
                            Domain Resources
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {renderResourceInput("domains", "Domains", false, [], true)}
                            {renderResourceInput("subdomins", "SubDomains", false, [], true)}
                            {renderResourceInput("dom_aliases", "Domain Aliases", false, [], true)}
                            {renderResourceInput("web_users", "Web Users", false, [], true)}
                        </Box>
                    </Paper>

                    {/* Mail Resources */}
                    <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ fontSize: '1rem', mb: 2.5 }}>
                            Mail Resources
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {renderResourceInput("mail_boxes", "MailBoxes", false, [], true)}
                            {renderResourceInput("mailbox_sizes", "Mail Size", true, options)}
                            {renderResourceInput("mail_list", "Mail Lists", false, [], true)}
                        </Box>
                    </Paper>

                    {/* Other Resources */}
                    <Paper elevation={0} sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ fontSize: '1rem', mb: 2.5 }}>
                            Other Resources
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', }}>
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
            </CommonDrawer>
        </Box>
    );
}

export default CreatePlan;