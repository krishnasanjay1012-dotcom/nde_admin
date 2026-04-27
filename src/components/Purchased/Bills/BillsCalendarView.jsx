import { useState } from "react";
import { Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import { useBillsCustomView } from "../../../hooks/purchased/bills-hooks";
import CommonCalendar from "../../common/NDE-Calender";

const BillsCalendarView = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const { data } = useBillsCustomView({ page: 1, limit: 1000 }); 
  const bills = data?.data || [];

  return (
    <Box sx={{ mt: 1, mx: 1 }}>
      <CommonCalendar
        value={currentMonth}
        onChange={setCurrentMonth}
        renderDayContent={(day) => {
          const dayStr = day.format('YYYY-MM-DD');
          const billsForDay = bills.filter(b => {
            const dateField = b.bill_date || b.billDate || b.createdAt;
            if (!dateField) return false;
            return dayjs(dateField).format('YYYY-MM-DD') === dayStr;
          });

          if (!billsForDay.length) return null;

          return (
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {billsForDay.map(bill => (
                <Box
                  key={bill._id}
                  onClick={() => navigate(`/purchased/bills/payment-details/${bill._id}`)}
                  sx={{
                    bgcolor: bill.status === 'paid' ? '#e8f5e9' : bill.status === 'unpaid' ? '#fff3e0' : '#ffebee',
                    color: bill.status === 'paid' ? '#2e7d32' : bill.status === 'unpaid' ? '#ef6c00' : '#c62828',
                    fontSize: '0.7rem',
                    p: 0.5,
                    borderRadius: 1,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {bill.billNo || bill.bill_no || "Bill"} - ₹{bill.amount || bill.total || 0}
                </Box>
              ))}
            </Stack>
          );
        }}
      />
    </Box>
  );
};

export default BillsCalendarView;