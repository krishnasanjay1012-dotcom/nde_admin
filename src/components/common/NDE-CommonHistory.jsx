import React, { useRef, useCallback } from 'react';
import { Box, Typography, useTheme, CircularProgress } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import HistoryIcon from '@mui/icons-material/History';
import { useInfiniteLogs } from '../../hooks/Customer/Customer-hooks';

const CommonHistory = ({ historyData, title }) => {

    const theme = useTheme();
    const observer = useRef();

    console.log(historyData,'historyData');
   

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteLogs({
        // userId: historyData?.userId || historyData?.workspace?.userId,
        userId: title === "Vendor" ? historyData?._id : "",
        workspace_Id: title === "Vendor" ? "" : historyData?.workspace?._id,
        limit: 10,
        filter: "",
    });

    const logs = data?.pages.flatMap((page) => page.logData) || [];

    const lastElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);


    return (
        <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: '100%', overflowY: 'auto', }}>
            {logs.map((item, index) => (
                <Box
                    key={item._id || index}
                    ref={index === logs.length - 1 ? lastElementRef : null}
                    sx={{ display: 'flex', gap: 3, position: 'relative' }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 1
                    }}>
                        <Box sx={{
                            width: '2px',
                            height: '100%',
                            bgcolor: theme.palette.divider,
                            position: 'absolute',
                            left: '16px',
                            top: 0,
                            zIndex: -1,
                            display: index === logs.length - 1 ? 'none' : 'block'
                        }} />

                        <Box sx={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            bgcolor: item.referenceModel === 'user' 
                                ? (theme.palette.mode === 'dark' ? 'rgba(47, 128, 237, 0.15)' : theme.palette.info.light)
                                : item.referenceModel === 'invoice'
                                ? (theme.palette.mode === 'dark' ? 'rgba(46, 125, 50, 0.15)' : theme.palette.success.light)
                                : item.referenceModel === 'paymentDetails'
                                ? (theme.palette.mode === 'dark' ? 'rgba(156, 39, 176, 0.15)' : theme.palette.secondary.light)
                                : (theme.palette.mode === 'dark' ? 'rgba(226, 185, 59, 0.15)' : theme.palette.warning.light),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${item.referenceModel === 'user'
                                ? (theme.palette.mode === 'dark' ? 'rgba(47, 128, 237, 0.3)' : '#DBEAFE')
                                : item.referenceModel === 'invoice'
                                ? (theme.palette.mode === 'dark' ? 'rgba(46, 125, 50, 0.3)' : '#DCFCE7')
                                : item.referenceModel === 'paymentDetails'
                                ? (theme.palette.mode === 'dark' ? 'rgba(156, 39, 176, 0.3)' : '#F3E8FF')
                                : (theme.palette.mode === 'dark' ? 'rgba(226, 185, 59, 0.3)' : '#FEF3C7')}`,
                            flexShrink: 0,
                            mb: 6
                        }}>
                            {item.referenceModel === 'user' && <PersonOutlineIcon sx={{ fontSize: 18, color: theme.palette.info.main }} />}
                            {item.referenceModel === 'invoice' && <ReceiptOutlinedIcon sx={{ fontSize: 18, color: theme.palette.success.main }} />}
                            {item.referenceModel === 'paymentDetails' && <PaymentsOutlinedIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />}
                            {!['user', 'invoice', 'paymentDetails'].includes(item.referenceModel) && <HistoryIcon sx={{ fontSize: 18, color: theme.palette.warning.main }} />}
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
                            <Typography sx={{
                                fontSize: '14px',
                                color: theme.palette.text.primary,
                                textTransform: 'capitalize'
                            }}>
                                {item.commentedBy}
                            </Typography>
                            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: theme.palette.divider }} />
                            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '12px', fontWeight: 500 }}>
                                {item.date} {item.time}
                            </Typography>
                        </Box>

                        <Box sx={{
                            bgcolor: theme.palette.background.paper,
                            p: '10px 10px',
                            borderRadius: '10px',
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.palette.mode === 'dark' ? 'none' : '0px 2px 4px rgba(31, 41, 55, 0.04)',
                            display: 'flex',
                            alignItems: 'center',
                            width: 'fit-content',
                            minWidth: { xs: '100%', sm: '400px' },
                            mb: 1
                        }}>
                            <Typography sx={{ fontSize: '13px', color: theme.palette.text.primary }}>
                                {item.message}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            ))}
            {!isLoading && logs.length === 0 && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 10,
                    px: 2,
                    textAlign: 'center'
                }}>
                    <HistoryIcon sx={{ fontSize: 50, color: theme.palette.divider, mb: 1.5 }} />
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                        No History Found
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mt: 0.5 }}>
                        Activity logs will appear here as they are generated.
                    </Typography>
                </Box>
            )}
            {(isFetchingNextPage || isLoading) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            )}
        </Box>
    );
};

export default CommonHistory;