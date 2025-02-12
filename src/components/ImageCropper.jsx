import React, { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./cropImage";
import { v4 as uuidv4 } from "uuid";

const ImageCropper = ({ onUpload }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);

  const onSelectFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImageSrc(reader.result);
    }
  };

  const onCropComplete = useCallback(async (_, croppedAreaPixels) => {
    const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
    setCroppedImage(croppedImg);
  }, [imageSrc]);

  const uploadImage = async () => {
    if (!croppedImage) return;

    const formData = new FormData();
    formData.append("image", croppedImage, `${uuidv4()}.png`);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Image uploaded successfully!");
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onSelectFile} />
      {imageSrc && (
        <div style={{ width: "300px", height: "300px", position: "relative" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}
      {croppedImage && <img src={URL.createObjectURL(croppedImage)} alt="Cropped Preview" />}
      <button onClick={uploadImage}>Upload</button>
    </div>
  );
};

export default ImageCropper;
