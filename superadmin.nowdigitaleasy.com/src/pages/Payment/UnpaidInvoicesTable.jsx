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
  Paper,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CommonDatePicker, CommonTextField } from '../../components/common/fields';
import { useState, useRef, useEffect } from 'react';
import { Button, Divider, Stack } from '@mui/material';
import CommonButton from '../../components/common/NDE-Button';

const UnpaidInvoicesTable = ({
  invoices = [],
  paymentAmounts = {},
  paymentDates = {},
  withholdingTaxes = {},
  onPaymentChange,
  onPaymentDateChange,
  onWithholdingTaxChange,
  onClearApplied,
  isTdsEnabled = false,
  currencySymbol = '₹',
  isFullAmount = false,
  amountReceived = 0,
  dateFilter = { startDate: '', endDate: '' },
  onDateFilterChange,
  defaultPaymentDate,
  isEditMode = false,
}) => {
  const theme = useTheme();

  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [popoverInvoiceId, setPopoverInvoiceId] = useState(null);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [tempDates, setTempDates] = useState(dateFilter);
  const withholdingRefs = useRef({});

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

  const handlePayInFull = (invoiceId, amountDue) => {
    const withholdingValue = Number(withholdingTaxes[invoiceId]) || 0;
    const netPayment = Math.max(0, Number(amountDue) - withholdingValue);
    onPaymentChange(invoiceId, netPayment);
  };

  const handleWithholdingTaxChangeWithPopover = (invoiceId, value) => {
    const withholdingValue = Number(value) || 0;
    const paymentValue = Number(paymentAmounts[invoiceId]) || 0;

    if (isFullAmount) {
      const invoice = invoices.find((inv) => inv._id === invoiceId);
      const balance = Number(invoice?.balance) || 0;
      if (withholdingValue > balance) {
        const anchor = withholdingRefs.current[invoiceId];
        if (anchor) {
          setPopoverAnchor(anchor);
          setPopoverInvoiceId(invoiceId);
        }
        return;
      }
    }

    onWithholdingTaxChange(invoiceId, value);

    if (!isFullAmount && withholdingValue > paymentValue) {
      const anchor = withholdingRefs.current[invoiceId];
      if (anchor) {
        setPopoverAnchor(anchor);
        setPopoverInvoiceId(invoiceId);
      }
    } else {
      if (popoverInvoiceId === invoiceId) {
        setPopoverAnchor(null);
        setPopoverInvoiceId(null);
      }
    }
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setPopoverInvoiceId(null);
  };

  const totalWithholdingTax = Object.values(withholdingTaxes).reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );

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

  const colSpanCount = isTdsEnabled ? 7 : 6;

  return (
    <Box
      mt={2}
      sx={{
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
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
          padding: '15px 20px',
          backgroundColor: theme.palette.background.muted,
          borderBottom: `1px solid ${theme.palette.divider}`,
          fontSize: '16px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 400, fontSize: '16px' }}>Unpaid Invoices</Typography>
          <Box sx={{ mx: 2, height: '16px', width: '1px', backgroundColor: theme.palette.divider }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              color: dateFilter.startDate || dateFilter.endDate ? 'primary.main' : '#667085',
              fontSize: '14px',
              fontWeight: 400,
              '&:hover': { color: 'primary.main' },
            }}
            onClick={handleFilterClick}
          >
            <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.8 }} />
            <span style={{ marginRight: '4px' }}>Filter by Date Range</span>
            {Boolean(filterAnchor) ? <KeyboardArrowUpIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
          </Box>
        </Box>
        <a
          onClick={onClearApplied}
          style={{
            color: theme.palette.primary.main,
            fontSize: '14px',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          Clear Applied Amount
        </a>
      </Box>

      {/* Date Range Filter Popover */}
      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={handleFilterClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            width: 500,
            p: 0,
            mt: 1,
            borderRadius: 2,
            boxShadow: '0px 12px 24px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 120,
              width: 16,
              height: 16,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" >Date Range</Typography>
            <IconButton size="small" onClick={handleFilterClose} color='error'>
              <CloseIcon sx={{ fontSize: 18, color: 'error.main' }} />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <CommonDatePicker
              value={tempDates.startDate}
              onChange={(e) => setTempDates({ ...tempDates, startDate: e.target.value })}
              placeholder="dd/MM/yyyy"
              width="200px"
              mt={0}
              mb={0}
            />
            <Typography sx={{ color: '#667085' }}>-</Typography>
            <CommonDatePicker
              value={tempDates.endDate}
              onChange={(e) => setTempDates({ ...tempDates, endDate: e.target.value })}
              placeholder="dd/MM/yyyy"
              width="200px"
              mt={0}
              mb={0}
              minDate={tempDates.startDate}
            />
          </Stack>

          <Typography sx={{ fontSize: '12px', color: '#667085', lineHeight: 1.5, mb: 1 }}>
            Note: If you've entered a Payment amount for any unpaid invoices, those invoices will continue to be shown at the top of the list, irrespective of the Date Range filter that you apply.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <CommonButton
              variant="contained"
              onClick={applyDateFilter}
              label="Apply Filter"
              startIcon
            />
            <CommonButton
              variant="outlined"
              onClick={handleFilterClose}
              label="Cancel"
              startIcon
            />
          </Box>
          <CommonButton
            onClick={clearDateFilter}
            label="Clear Selection"
            variant="text"
            sx={{
              textTransform: 'none',
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
            }}
          />
        </Box>
      </Popover>

      <TableContainer elevation={0} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="unpaid invoices table">
          <TableHead >
            <TableRow>
              <TableCell sx={{ backgroundColor: theme.palette.background.muted, fontWeight: 400, fontSize: '14px' }}>
                DATE
              </TableCell>
              <TableCell sx={{ backgroundColor: theme.palette.background.muted, fontWeight: 400, fontSize: '14px' }}>
                INVOICE NUMBER
              </TableCell>
              <TableCell
                align="right"
                sx={{ backgroundColor: theme.palette.background.muted, fontWeight: 400, fontSize: '14px' }}
              >
                INVOICE AMOUNT
              </TableCell>
              <TableCell
                align="right"
                sx={{ backgroundColor: theme.palette.background.muted, fontWeight: 400, fontSize: '14px' }}
              >
                AMOUNT DUE
              </TableCell>
              <TableCell sx={{ backgroundColor: theme.palette.background.muted, fontWeight: 400, fontSize: '14px' }}>
                PAYMENT RECEIVED ON
              </TableCell>
              {isTdsEnabled && (
                <TableCell
                  align="right"
                  sx={{ backgroundColor: theme.palette.background.muted, fontWeight: 400, fontSize: '14px' }}
                >
                  WITHHOLDING TAX
                </TableCell>
              )}
              <TableCell
                align="right"
                sx={{ backgroundColor: theme.palette.background.muted, fontWeight: 400, fontSize: '14px' }}
              >
                PAYMENT
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpanCount} align="center" sx={{ py: 4 }}>
                  There are no unpaid invoices associated with this customer.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => {
                const paymentValue = Number(paymentAmounts[inv._id]) || 0;
                const withholdingValue = Number(withholdingTaxes[inv._id]) || 0;
                const balance = Number(inv.balance) || 0;
                const isWithholdingExceeds = isFullAmount
                  ? withholdingValue > balance
                  : withholdingValue > paymentValue;

                return (
                  <TableRow key={inv._id}
                    sx={{
                      '& .MuiTableCell-root': {
                        p: 0,
                        px: 1
                      },
                    }}
                  >
                    <TableCell>
                      <div style={{ fontSize: '14px', color: theme.palette.text.secondary }}>{formatDate(inv.dueDate)}</div>
                      <div style={{ fontSize: '12px', color: theme.palette.text.secondary }}>
                        Due Date: {formatDate(inv.dueDate)}
                      </div>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 400, fontSize: '14px' }}>{inv.invoiceId}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 400, fontSize: '14px' }}>{inv.totalAmount}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 400, fontSize: '14px' }}>{inv.balance}</TableCell>
                    <TableCell>
                      <CommonDatePicker
                        value={paymentDates[inv._id] || defaultPaymentDate || new Date().toISOString()}
                        onChange={(e) => onPaymentDateChange(inv._id, e.target.value)}
                        mt={0}
                        mb={0}
                        width="130px"
                      />
                    </TableCell>
                    {isTdsEnabled && (
                      <TableCell>
                        <Box ref={(el) => (withholdingRefs.current[inv._id] = el)}>
                          <CommonTextField
                            type="number"
                            value={withholdingTaxes[inv._id] ?? ''}
                            onChange={(e) =>
                              handleWithholdingTaxChangeWithPopover(inv._id, e.target.value)
                            }
                            inputProps={{ min: 0, step: '0.01' }}
                            mt={0}
                            mb={0}
                            placeholder="0.00"
                            error={isWithholdingExceeds}
                          />
                        </Box>
                        <Popover
                          open={Boolean(popoverAnchor) && popoverInvoiceId === inv._id}
                          anchorEl={popoverAnchor}
                          onClose={handlePopoverClose}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                          disableAutoFocus
                          disableEnforceFocus
                          PaperProps={{
                            sx: {
                              p: 1.5,
                              maxWidth: 220,
                              mt: 1,
                              backgroundColor: theme.palette.warning.light,
                              border: `1px solid ${theme.palette.warning.main}`,
                              borderRadius: 1,
                              boxShadow: 2,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <Typography sx={{ fontSize: '13px', color: theme.palette.text.primary, flex: 1, pr: 1 }}>
                              {isFullAmount
                                ? `Withholding Tax cannot exceed the invoice balance (${currencySymbol}${balance.toFixed(2)}).`
                                : 'Withholding Tax exceeds the Payment amount for this invoice.'}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={handlePopoverClose}
                              sx={{ p: 0, mt: '-2px', color: theme.palette.text.secondary }}
                            >
                              <CloseIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Popover>
                      </TableCell>
                    )}
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <CommonTextField
                          type="number"
                          value={paymentAmounts[inv._id] ?? ''}
                          onChange={(e) => onPaymentChange(inv._id, e.target.value)}
                          inputProps={{ min: 0, step: '0.01' }}
                          placeholder="0.00"
                          mt={1}
                          mb={0}
                        />
                      </Box>
                      {!isEditMode && (
                        <Typography
                          mt={1}
                          onClick={() => handlePayInFull(inv._id, inv.balance)}
                          sx={{
                            cursor: 'pointer',
                            color: theme.palette.primary.main,
                            fontSize: '13px',
                            mb: 1
                          }}
                        >
                          Pay in Full
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>

          <TableBody component="tfoot">
            <TableRow>
              <TableCell
                colSpan={isTdsEnabled ? 4 : 3}
                sx={{ fontSize: '12px', color: theme.palette.text.secondary }}
              >
                **List contains only SENT invoices
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 500 }}>
                Total
              </TableCell>
              {isTdsEnabled && (
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  {totalWithholdingTax.toFixed(2)}
                </TableCell>
              )}
              <TableCell align="right" sx={{ fontWeight: 500 }}>
                {totalPaymentColumnSum.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ overflow: 'hidden', minHeight: '180px' }}>
        <Box
          sx={{
            marginTop: '20px',
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: theme.palette.warning.light,
            borderRadius: '4px',
            float: 'right',
            width: '320px',
            border: `1px solid ${theme.palette.warning.main}`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px' }}>
            <span>Amount Received :</span>
            <span>
              {currencySymbol} {Number(amountReceived).toFixed(2)}
            </span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px' }}>
            <span>Amount used for Payments :</span>
            <span>
              {currencySymbol} {totalPaymentColumnSum.toFixed(2)}
            </span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px' }}>
            <span>Amount Refunded :</span>
            <span>0.00</span>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              fontSize: '14px',
              color: theme.palette.error.main,
              fontWeight: 500,
            }}
          >
            <span>⚠️ Amount in Excess:</span>
            <span>
              {currencySymbol} {amountInExcess.toFixed(2)}
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UnpaidInvoicesTable;