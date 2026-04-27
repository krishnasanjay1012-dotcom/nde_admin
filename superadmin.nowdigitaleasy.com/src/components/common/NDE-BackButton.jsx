import { useNavigate } from "react-router-dom";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { IconButton, Tooltip } from "@mui/material";


const CommonBackButton = ({
  to = "/",
  size = "medium",
  buttonSize = 40,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <Tooltip title="Back" arrow>
      <IconButton
        onClick={handleClick}
        sx={{ 
          width: buttonSize,
          height: buttonSize,
          border: "1px solid #E5E7EB",
          '&:hover': { backgroundColor: "rgba(0,0,0,0.04)" }
        }}
      >
        <KeyboardBackspaceRoundedIcon fontSize={size} />
      </IconButton>
    </Tooltip>
  );
};

export default CommonBackButton;
