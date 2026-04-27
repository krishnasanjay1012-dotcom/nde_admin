import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import {
    useCustomerList,
} from "../../hooks/Customer/Customer-hooks";
import CommonAutocomplete from "../common/fields/NDE-Autocomplete";
import { useDebounce } from "use-debounce";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BusinessIcon from "@mui/icons-material/Business";

const WorkSpaceDropdownList = ({
    control,
    errors,
    initialWorkspace,
    name = "workspace_id",
}) => {
    const listRef = useRef(null);
    const [data, setData] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [debouncedSearchTerm] = useDebounce(searchTerm, 400);

    const {
        data: fetchedData,
        isLoading,
    } = useCustomerList(
        {
            page: pageNo,
            limit: 50,
            searchTerm: debouncedSearchTerm,
        }
    );

    useEffect(() => {
        if (fetchedData?.data) {
            setData((prev) => {
                const merged =
                    pageNo === 1 ? fetchedData.data : [...prev, ...fetchedData.data];
                return merged.filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t._id === item._id),
                );
            });
            setHasNext(fetchedData.data.length === 50);
        }
    }, [fetchedData, pageNo]);


    const handleScroll = (event) => {

        const listboxNode = event.currentTarget;
        const { scrollTop, scrollHeight, clientHeight } = listboxNode;

        if (
            scrollHeight - scrollTop <= clientHeight + 20 &&
            !isLoading &&
            hasNext
        ) {
            setPageNo((prev) => prev + 1);
        }
    };

    const handleInputChange = (_, value, reason) => {

        setSearchTerm(value);
        if (reason === "input") {
            setData([]);
            setPageNo(1);
            setHasNext(true);
        }
    };

    const workspaceList = data.map((c) => ({
        value: c?.workspaceDetails?._id || c?._id,
        label: c?.workspaceDetails?.workspace_name || c?.workspace_name || c?.email,
        fullData: c,
    }));

    console.log(workspaceList, "workspaceList");
    return (
        <Box>
            <Box display="flex" gap={1}>
                <Box display="flex" flexDirection="column" gap="4px" flex={1}>
                    <Controller
                        name={name}
                        control={control}
                        render={({ field }) => {

                            let wsId = typeof initialWorkspace === "object" ? (initialWorkspace?._id || initialWorkspace?.id) : initialWorkspace;
                            let wsName = typeof initialWorkspace === "object" ? (initialWorkspace?.workspace_name || initialWorkspace?.name || initialWorkspace?.email) : "";

                            let matchedOption = workspaceList.find((opt) => opt.value === field.value);

                            let selectedOption = (matchedOption && matchedOption.label) 
                                ? matchedOption 
                                : (wsId && wsId === field.value
                                    ? {
                                        value: wsId,
                                        label: wsName || matchedOption?.label || "Selected Workspace",
                                        fullData: { workspaceDetails: typeof initialWorkspace === "object" ? initialWorkspace : { _id: wsId } },
                                    }
                                    : null);

                            return (
                                <CommonAutocomplete
                                    {...field}
                                    label={"Workspace Name"}
                                    value={selectedOption}
                                    onChange={(val) => { field.onChange(val?.value || "") }}
                                    onInputChange={handleInputChange}
                                    options={workspaceList}
                                    placeholder="Search workspace"
                                    loading={isLoading}
                                    error={!!errors[name]}
                                    helperText={errors[name]?.message}
                                    mandatory
                                    ListboxProps={{
                                        onScroll: handleScroll,
                                        ref: listRef,
                                        style: { maxHeight: 250, overflowY: "auto" },
                                    }}
                                // renderOption={(props, option, { selected }) => {
                                //     const customer = option.fullData;
                                //     const email = customer?.email || "";
                                //     const companyName =
                                //         customer.workspaceDetails?.workspace_name || "";

                                //     return (
                                //         <li
                                //             {...props}
                                //             style={{
                                //                 borderRadius: 8,
                                //                 margin: "4px 8px",
                                //                 padding: "6px",
                                //             }}
                                //         >
                                //             <Box
                                //                 display="flex"
                                //                 alignItems="center"
                                //                 gap={1.5}
                                //                 sx={{
                                //                     width: "100%",
                                //                     color: selected ? "#fff" : "#000",
                                //                     transition: "0.2s ease",
                                //                 }}
                                //             >
                                //                 {/* Avatar */}


                                //                 <Box>


                                //                     {/* Email with icon */}
                                //                     <Box
                                //                         display="flex"
                                //                         alignItems="center"
                                //                         gap={0.5}
                                //                         mt={0.3}
                                //                     >




                                //                         <BusinessIcon
                                //                             sx={{
                                //                                 fontSize: 16,
                                //                                 color: selected ? "#E3E8FF" : "#777",
                                //                             }}
                                //                         />
                                //                         <Typography
                                //                             fontSize={12}
                                //                             color={selected ? "#E3E8FF" : "text.primary"}
                                //                         >
                                //                             {companyName}
                                //                         </Typography>
                                //                         <span
                                //                             style={{ color: selected ? "#E3E8FF" : "#777" }}
                                //                         >
                                //                             |
                                //                         </span>
                                //                         <MailOutlineIcon
                                //                             sx={{
                                //                                 fontSize: 16,
                                //                                 color: selected ? "#E3E8FF" : "#777",
                                //                             }}
                                //                         />
                                //                         <Typography
                                //                             fontSize={12}
                                //                             color={selected ? "#E3E8FF" : "text.primary"}
                                //                         >
                                //                             {email}
                                //                         </Typography>
                                //                     </Box>
                                //                 </Box>
                                //             </Box>
                                //         </li>
                                //     );
                                // }}
                                />
                            );
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};


export default WorkSpaceDropdownList;