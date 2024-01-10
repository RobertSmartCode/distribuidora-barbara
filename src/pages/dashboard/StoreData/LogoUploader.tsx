import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import { uploadFile } from "../../../firebase/firebaseConfig"; // Asegúrate de importar la función de carga de Firebase

interface LogoUploaderProps {
  onLogoUpload: (imageUrl: string) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ onLogoUpload }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Estado para almacenar la URL de la imagen cargada

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadFile(file);
        setImageUrl(imageUrl); // Almacenar la URL de la imagen en el estado
        onLogoUpload(imageUrl);
      } catch (error) {
        console.error("Error al cargar la imagen:", error);
      }
    }
  };

  return (
    <>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Logo"
          style={{ maxWidth: "100px", maxHeight: "100px" }}
        />
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
      <Button
        variant="contained"
        component="span"
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        Subir Logo
      </Button>
    </>
  );
};

export default LogoUploader;
