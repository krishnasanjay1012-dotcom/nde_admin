import {
  Box,
  Typography,
  useTheme
} from "@mui/material";
import CommonDrawer from "./NDE-Drawer";
import { CommonSelect } from "./fields";
import { useDepositaccounts } from "../../hooks/Customer/Customer-hooks";
import { useMemo, useState, useEffect } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const ExcessPayment = ({ open, onStay, onSave, amount = 0, currencySymbol = "₹", initialAccount = null }) => {
  const theme = useTheme();
  const { data } = useDepositaccounts("wallet");

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const depositeOptions = useMemo(() => {
    if (!data?.data) return [];

    return Object.entries(data.data).flatMap(([groupName, accounts]) =>
      accounts.map((item) => ({
        label: item.name,
        value: item.id,
        group: groupName,
      }))
    );
  }, [data]);

  useEffect(() => {
    if (initialAccount) {
      setSelectedAccount(initialAccount);
    } else if (depositeOptions.length && !selectedAccount) {
      setSelectedAccount(depositeOptions[0]);
    }
  }, [depositeOptions, selectedAccount, initialAccount]);

  return (
    <CommonDrawer
      open={open}
      onClose={onStay}
      anchor="top"
      topWidth={530}
      actionsJustify="flex-start"
      title="Excess Payment"
      actions={[
        {
          label: "Continue to Save",
          onClick: () => onSave(selectedAccount),
          sx: {
            borderRadius: "6px",
          },
        },
        {
          label: "Cancel",
          variant: "outlined",
          onClick: onStay,
          sx: {
            borderRadius: "6px",
          },
        },
      ]}
    >
      {/* Content */}
      <Box>
        <Box display="flex" gap={2} alignItems="flex-start">
          
          {/* Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1.2,
              borderRadius: "12px",
              backgroundColor: "warning.light",
            }}
          >
            <InfoOutlinedIcon
              sx={{
                color: "#f59e0b",
                fontSize: 24,
              }}
            />
          </Box>

          {/* Text Content */}
          <Box>
            <Typography fontSize={14}>
              Would you like to store the excess amount of{" "}
              <b>{currencySymbol}{Number(amount).toFixed()}</b> as over payment from this customer?
            </Typography>

            <Typography fontSize={13} color="text.secondary" mt={1}>
              Note: The excess amount will be deposited in the{" "}

              {!isEditing ? (
                <span
                  onClick={() => setIsEditing(true)}
                  style={{
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {selectedAccount?.label || "Select Account"} 
                  <EditOutlinedIcon sx={{ fontSize: 15 ,color:theme.palette.primary.main}} />
                </span>
              ) : (
                <CommonSelect
                  options={depositeOptions}
                  value={selectedAccount?.value}
                  onChange={(val) => {
                    const selected = depositeOptions.find(
                      (opt) => opt.value === val
                    );
                    setSelectedAccount(selected);
                    setIsEditing(false); 
                  }}
                  width="180px"
                  height={34}
                  mb={0}
                />
              )}
            </Typography>

          </Box>
        </Box>
      </Box>
    </CommonDrawer>
  );
};

export default ExcessPayment;