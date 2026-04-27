import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, IconButton, Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

const CommonCalendar = ({
  value, 
  onChange,
  renderDayContent = () => null, 
  getDayProps = () => ({}), 
  onDayClick = () => {},
  tabCount = 5,
  sx = {}
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const selectedDate = value && dayjs(value).isValid() ? dayjs(value).startOf('month') : dayjs().startOf('month');
  const [selectedDay, setSelectedDay] = useState(value && dayjs(value).isValid() ? dayjs(value) : dayjs());

  useEffect(() => {
    if (value && dayjs(value).isValid()) {
      setSelectedDay(dayjs(value));
    }
  }, [value]);

  const tabs = useMemo(() => {
    const arr = [];
    const offset = Math.floor(tabCount * 0.75); 
    for (let i = 0; i < tabCount; i++) {
      arr.push(selectedDate.subtract(offset - i, 'month'));
    }
    return arr;
  }, [selectedDate, tabCount]);

  const handleCalendarOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setAnchorEl(null);
  };

  const handleMonthChange = (newDate) => {
    if (onChange) {
      onChange(dayjs(newDate).startOf('month'));
    }
    handleCalendarClose();
  };

  const handleTabClick = (newDate) => {
    if (onChange) {
      onChange(dayjs(newDate).startOf('month'));
    }
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    if (onDayClick) {
      onDayClick(day);
    }
  };

  const startOfMonth = selectedDate.startOf('month');
  const endOfMonth = selectedDate.endOf('month');
  const startDate = startOfMonth.startOf('week'); 
  const endDate = endOfMonth.endOf('week');

  const calendarDays = [];
  let current = startDate;
  while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
    calendarDays.push(current);
    current = current.add(1, 'day');
  }

  const rows = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    rows.push(calendarDays.slice(i, i + 7));
  }

  return (
    <Box sx={{ width: '100%', border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : '1px solid #E4E5E7', borderRadius: 1, overflow: 'hidden', ...sx }}>
      {/* Top Tabs Area */}
      <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : '1px solid #E4E5E7', bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#FAFAFB' }}>
        <Box sx={{ display: 'flex', flexGrow: 1, overflowX: 'auto', '&::-webkit-scrollbar': { height: 0 } }}>
          {tabs.map((m) => {
            const isSelected = m.isSame(selectedDate, 'month');
            return (
              <Box
                key={m.format("YYYY-MM")}
                onClick={() => handleTabClick(m)}
                sx={{
                  flex: 1,
                  minWidth: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 1.5,
                  px: 2,
                  cursor: 'pointer',
                  borderRight: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : '1px solid #E4E5E7',
                  bgcolor: isSelected ? (theme.palette.mode === 'dark' ? theme.palette.background.paper : '#FFFFFF') : 'transparent',
                  color: isSelected ? (theme.palette.mode === 'dark' ? theme.palette.primary.main : '#D32F2F') : (theme.palette.mode === 'dark' ? theme.palette.text.secondary : '#636366'), 
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: '0.875rem',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: isSelected ? (theme.palette.mode === 'dark' ? theme.palette.background.paper : '#FFFFFF') : (theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F2F2F7'),
                  }
                }}
              >
                {m.format("MMM YYYY")}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ px: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#FAFAFB', minHeight: 48 }}>
          <IconButton size="small" onClick={handleCalendarOpen}>
            <CalendarTodayOutlinedIcon fontSize="small" sx={{ color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : '#636366' }} />
          </IconButton>
        </Box>
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCalendarClose}
        anchorOrigin={{
           vertical: 'bottom',
           horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { mt: 1, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate}
            onChange={handleMonthChange}
            views={['year', 'month']}
            openTo="month"
          />
        </LocalizationProvider>
      </Popover>

      {/* Calendar Grid Area */}
      <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: "calc(100vh - 190px)", overflowY: 'auto' }}>
        {rows.map((row, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: 'flex',
              borderBottom: rowIndex === rows.length - 1 ? 'none' : (theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : '1px solid #E4E5E7')
            }}
          >
            {row.map((day, colIndex) => {
              const isSameMonth = day.isSame(selectedDate, 'month');
              const isSelectedDay = day.isSame(selectedDay, 'day');
              const isToday = day.isSame(dayjs(), 'day');
              const extraProps = getDayProps(day) || {};
              const customSx = extraProps.sx || {};
              
              return (
                <Box
                  key={colIndex}
                  onClick={() => handleDayClick(day)}
                  {...extraProps}
                  sx={{
                    flex: 1,
                    minHeight: 120, 
                    borderRight: colIndex === 6 ? 'none' : (theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : '1px solid #E4E5E7'),
                    bgcolor: isSameMonth ? (theme.palette.mode === 'dark' ? theme.palette.background.paper : '#FFFFFF') : (theme.palette.mode === 'dark' ? theme.palette.background.default : '#FAFAFB'),
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F9F9FB',
                    },
                    ...customSx,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: 'flex-end',
                      color: isSelectedDay ? '#fff' : isToday ? theme.palette.primary.main : isSameMonth ? (theme.palette.mode === 'dark' ? theme.palette.text.primary : '#1C1C1E') : (theme.palette.mode === 'dark' ? theme.palette.text.disabled : '#C7C7CC'),
                      bgcolor: isSelectedDay ? theme.palette.primary.main : 'transparent',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: isSelectedDay || isToday ? 600 : 500,
                      mb: 0.5
                    }}
                  >
                    {day.format('D')}
                  </Typography>
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {renderDayContent(day)}
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CommonCalendar;
