import React, { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Box, Typography, Slider, IconButton, Button } from "@mui/material";
import LocalSeeOutlinedIcon from "@mui/icons-material/LocalSeeOutlined";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useUpdateClientLogo } from "../../hooks/settings/logo";

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (err) => reject(err));
    image.setAttribute("crossOrigin", "anonymous"); 
    image.src = url;
  });

function getCroppedImg(imageSrc, crop, rotation = 0) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const safeArea = Math.max(image.width, image.height) * 2;

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
      image,
      (safeArea - image.width) / 2,
      (safeArea - image.height) / 2
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.putImageData(
      data,
      Math.round(0 - (safeArea / 2 - image.width / 2) - crop.x),
      Math.round(0 - (safeArea / 2 - image.height / 2) - crop.y)
    );

    canvas.toBlob((file) => {
      if (file) resolve(file);
      else reject("Canvas is empty");
    }, "image/png");
  });
}


const ImageUploadCrop = ({ onClose, rowData }) => {
  const inputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedImage, setCroppedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const { mutate: updateLogo } = useUpdateClientLogo();

  const handleIconClick = () => inputRef.current.click();

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setStep(2);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleNext = async () => {
    if (step === 2 && imageSrc && croppedAreaPixels) {
      try {
        const blob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
        const url = URL.createObjectURL(blob);
        setCroppedImage(url);
        setFile(blob);
        setStep(3);
      } catch (err) {
        console.error("Crop failed", err);
      }
    } else if (step === 3 && file) {
      const formData = new FormData();
      formData.append("image", file);

      updateLogo(
        { id: rowData, formData },
        {
          onSuccess: () => onClose(),
          onError: (err) => console.error("Upload failed", err),
        }
      );
    }
  };

  const handleBackToCrop = () => {
    setStep(2);
    setCroppedImage(null);
  };

  const handleChangeImage = () => {
    setStep(1);
    setImageSrc(null);
    setCroppedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFile(null);
  };

  return (
    <Box sx={{ color: "#fff", p: 3, width: 400, mx: "auto" }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">
          {step === 1
            ? "Upload Image"
            : step === 2
            ? "Crop & Rotate"
            : "Save Image"}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseOutlinedIcon />
        </IconButton>
      </Box>

      {step === 1 && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileUpload}
          />
          <Box textAlign="center" mt={5}>
            <IconButton
              onClick={handleIconClick}
              sx={{
                bgcolor: "#1a1a1a",
                color: "#fff",
                width: 70,
                height: 70,
                "&:hover": { bgcolor: "#333" },
              }}
            >
              <LocalSeeOutlinedIcon fontSize="large" />
            </IconButton>
          </Box>
        </>
      )}

      {step === 2 && imageSrc && (
        <>
          <Box
            sx={{
              position: "relative",
              width: 300,
              height: 200,
              bgcolor: "#111",
              mx: "auto",
            }}
          >
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
            />
          </Box>

          <Box width={300} mx="auto" mt={3}>
            <Typography variant="body2">Zoom</Typography>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(_, v) => setZoom(v)}
            />
            <IconButton
              onClick={() => setRotation((r) => r + 90)}
              sx={{ mt: 1, color: "#fff", border: "1px solid #555" }}
            >
              <RotateRightIcon />
            </IconButton>
          </Box>
        </>
      )}

      {step === 3 && croppedImage && (
        <Box textAlign="center" mt={2}>
          <img
            src={croppedImage}
            alt="Cropped"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          <Typography mt={2}>Click Save to finalize your image.</Typography>
          <Box mt={2} display="flex" justifyContent="center" gap={2}>
            <Button fullWidth variant="outlined" onClick={handleBackToCrop}>
              Back & Re-crop
            </Button>
          </Box>
        </Box>
      )}

      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleNext}>
        {step === 2 ? "Next" : "Save"}
      </Button>
      <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={handleChangeImage}>
        Change Image
      </Button>
    </Box>
  );
};

export default ImageUploadCrop;
