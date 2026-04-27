import {
  Box,
  Typography,
  Popover,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CommonDatePicker, CommonTextField } from '../../common/fields';
import { useState } from 'react';
import { Divider, Stack } from '@mui/material';
import CommonButton from '../../common/NDE-Button';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const UnpaidBillTable = ({
  bills = [],
  paymentAmounts = {},
  paymentDates = {},
  onPaymentChange,
  onPaymentDateChange,
  onClearApplied,
  currencySymbol = '₹',
  isFullAmount = false,
  amountReceived = 0,
  dateFilter = { startDate: '', endDate: '' },
  onDateFilterChange,
}) => {
  const theme = useTheme();

  const [filterAnchor, setFilterAnchor] = useState(null);
  const [tempDates, setTempDates] = useState(dateFilter);

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const applyDateFilter = () => {
    onDateFilterChange(tempDates);
    handleFilterClose();
  };

  const clearDateFilter = () => {
    const cleared = { startDate: '', endDate: '' };
    setTempDates(cleared);
    onDateFilterChange(cleared);
    handleFilterClose();
  };

  const handlePayInFull = (billId, amountDue) => {
    onPaymentChange(billId, amountDue);
  };

  const totalPaymentColumnSum = Object.values(paymentAmounts).reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );

  const rawExcess = Number(amountReceived) - totalPaymentColumnSum;
  const amountInExcess = rawExcess > 0 ? rawExcess : 0;

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Box
      mt={2}
      sx={{
        overflow: 'hidden',
        marginBottom: '15px',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 0px',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
           {/* Date filter can be optional or styled as per image */}
        </Box>
        <a
          onClick={onClearApplied}
          style={{
            color: '#2176ff',
            fontSize: '13px',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          Clear Applied Amount
        </a>
      </Box>

      <TableContainer elevation={0} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="unpaid bills table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#667085', fontWeight: 400, fontSize: '14px' }}>Date</TableCell>
              <TableCell sx={{ color: '#667085', fontWeight: 400, fontSize: '14px' }}>Bill#</TableCell>
              <TableCell sx={{ color: '#667085', fontWeight: 400, fontSize: '14px' }}>PO#</TableCell>
              <TableCell align="right" sx={{ color: '#667085', fontWeight: 400, fontSize: '14px' }}>Bill Amount</TableCell>
              <TableCell align="right" sx={{ color: '#667085', fontWeight: 400, fontSize: '14px' }}>Amount Due</TableCell>
              <TableCell sx={{ color: '#667085', fontWeight: 400, fontSize: '14px' }}>
                <Box display="flex" alignItems="center" gap={0.5}>
                    Payment Made on <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ color: '#667085', fontWeight: 400, fontSize: '14px' }}>Payment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  There are no unpaid bills associated with this vendor.
                </TableCell>
              </TableRow>
            ) : (
              bills.map((bill) => {
                const paymentValue = Number(paymentAmounts[bill.id]) || 0;
                const balance = Number(bill.balance) || 0;

                return (
                  <TableRow key={bill.id}>
                    <TableCell>
                      <div style={{ fontSize: '14px' }}>{formatDate(bill.billDate)}</div>
                      <div style={{ fontSize: '12px', color: '#667085' }}>
                        Due Date: {formatDate(bill.dueDate)}
                      </div>
                    </TableCell>
                    <TableCell sx={{ fontSize: '14px' }}>{bill.billNumber}</TableCell>
                    <TableCell sx={{ fontSize: '14px' }}>{bill.po_number || ""}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '14px' }}>{bill.totalAmount}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '14px' }}>{bill.balance}</TableCell>
                    <TableCell>
                      <CommonDatePicker
                        value={paymentDates[bill.id] || null}
                        onChange={(e) => onPaymentDateChange(bill.id, e.target.value)}
                        mt={0}
                        mb={0}
                        width="150px"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <CommonTextField
                          type="number"
                          value={paymentAmounts[bill.id] ?? ''}
                          onChange={(e) => onPaymentChange(bill.id, e.target.value)}
                          inputProps={{ min: 0, step: '0.01' }}
                          placeholder="0.00"
                          mt={0}
                          mb={0}
                          width="120px"
                          textAlign="right"
                        />
                        <Typography
                            mt={0.5}
                            onClick={() => handlePayInFull(bill.id, bill.balance)}
                            sx={{
                            cursor: 'pointer',
                            color: '#2176ff',
                            fontSize: '12px',
                            }}
                        >
                            Pay in Full
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Box
          sx={{
            padding: '20px',
            backgroundColor: '#fff7f2', // light orange as in image
            borderRadius: '12px',
            width: '350px',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: '#344054' }}>
            <span>Amount Paid:</span>
            <span>{Number(amountReceived).toFixed(2)}</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: '#344054' }}>
            <span>Amount used for Payments:</span>
            <span>{totalPaymentColumnSum.toFixed(2)}</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: '#344054' }}>
            <span>Amount Refunded:</span>
            <span>0.00</span>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0 6px 0',
              fontSize: '14px',
              color: '#344054',
              fontWeight: 500,
            }}
          >
            <span>
                <Box component="span" sx={{ color: '#F79009', mr: 1 }}>⚠️</Box>
                Amount in Excess:
            </span>
            <span style={{ fontWeight: 600 }}>
              {currencySymbol} {amountInExcess.toFixed(2)}
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UnpaidBillTable;
