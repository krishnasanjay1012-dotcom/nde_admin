import { useTheme } from "@mui/material/styles";

const FlowerLoader = ({ size = 30, color }) => {
  const theme = useTheme();

  const loaderColor = color || theme.palette.primary.main;
  const bars = Array.from({ length: 12 });

  return (
    <div
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {bars.map((_, index) => {
        const rotation = index * 30;
        const delay = index * 0.1;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: `${size / 8}px`,
              height: `${size / 3}px`,
              backgroundColor: loaderColor,
              borderRadius: `${size / 16}px`,
              transformOrigin: "center bottom",
              transform: `rotate(${rotation}deg) translateY(-${size / 3}px)`,
              opacity: (index + 1) / bars.length,
              animation: `fade 1.2s linear ${delay}s infinite`,
              marginTop: -3,
            }}
          />
        );
      })}

      <style>{`
        @keyframes fade {
          0%, 20%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FlowerLoader;