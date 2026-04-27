import { Box } from "@mui/material";
import React, { useState } from "react";

const CommonTab = ({ tabs, height, overFlow, activetab, tabHeaderStyle, tabButtonStyle, initialActiveTab }) => {

    const [activeTab, setActiveTab] = useState(initialActiveTab || 0);

    return (
        <Box width={"100%"}>
            {/* Tab Header */}
            <Box style={{ ...styles.tabHeader, ...tabHeaderStyle }}>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        style={{
                            ...styles.tabButton,
                            ...tabButtonStyle,
                            ...(activeTab === index ? styles.activeTabButton : {}),
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            (setActiveTab(index), activetab(index))
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </Box>

            {/* Tab Content */}
            <Box height={height} overflow={overFlow} sx={{ position: "relative" }}>
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.tabContent,
                            opacity: activeTab === index ? 1 : 0,
                            transform: activeTab === index ? "translateX(0)" : "translateX(20px)",
                            pointerEvents: activeTab === index ? "auto" : "none",
                            position: activeTab === index ? "relative" : "absolute",
                            transition: "opacity 0.3s ease, transform 0.3s ease",
                            width: "100%",
                        }}
                    >
                        {tab.content}
                    </div>
                ))}
            </Box>
        </Box>
    );
};


const styles = {
    tabHeader: {
        display: "flex",
    },
    tabButton: {
        padding: "10px 15px",
        cursor: "pointer",
        background: "transparent",
        border: "none",
        borderBottom: "2px solid transparent",
        fontSize: "14px",
        transition: "border-bottom 0.3s ease, color 0.3s ease",
    },
    activeTabButton: {
        borderBottom: "2px solid #007BFF",
        fontWeight: "bold",
        color: "#007BFF",
    },
};

export default CommonTab;
