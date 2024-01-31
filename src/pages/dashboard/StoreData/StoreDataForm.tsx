import React, {useEffect, useState, } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Slide,
  Snackbar,
  Container,
  Grid,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { db } from "../../../firebase/firebaseConfig";
import { ErrorMessage } from '../../../messages/ErrorMessage';
import * as yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { StoreData, SocialMedia, Branch, Box } from "../../../type/type";
import { v4 as uuidv4 } from 'uuid';



interface StoreDataFormProps {
  open: boolean;
  onClose: () => void;
  storeData?: StoreData | null;
 
}



const Transition = React.forwardRef<unknown, TransitionProps>((props, ref) => {
  return (
    <Slide direction="up" ref={ref as React.Ref<HTMLElement>} {...props}>
      <div>{props.children}</div>
    </Slide>
  );
});

const validationSchema = yup.object({
  
  storeName: yup.string().required("El Nombre de la Tienda es obligatorio."),
  // logo: yup.string().url("Ingrese una URL válida para el Logo de la Tienda."),
  // description: yup.string().required("La Descripción es obligatoria."),
  address: yup.string().required("La Dirección es obligatoria."),
  phoneNumber: yup
    .string()
    // .matches(/^\d{10}$/, "El Teléfono debe tener 10 dígitos válidos.")
    .required("El Teléfono es obligatorio."),
  email: yup
    .string()
    .email("Ingrese una dirección de correo electrónico válida.")
    .required("El Correo Electrónico es obligatorio."),

});

const StoreDataForm: React.FC<StoreDataFormProps> = ({ open, onClose, storeData}) => {

const [selectedBranchIndex, setSelectedBranchIndex] = useState<number | null>(null);
const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
const [selectedBranchForBox, setSelectedBranchForBox] = useState<number | null>(null);
const [editingBranchIndex, setEditingBranchIndex] = useState<{ branchIndex: number; boxIndex: number | null } | null>(null);
const [errors, setErrors] = useState<{ [key: string]: string }>({});
const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);

const clearErrors = () => {
  setErrors({});

};

// Función para manejar el tiempo de duración de los errores
const setErrorTimeoutAndClear = () => {
  if (errorTimeout) {
    clearTimeout(errorTimeout);
  }

  const timeout = setTimeout(clearErrors, 10000); // 5000 milisegundos (5 segundos)
  setErrorTimeout(timeout);
};


  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const isEditing = storeData !== null;

// Declarar estados para los campos del formulario

const [storeName, setStoreName] = useState<string>(storeData?.storeName || "");


const [logo, setLogo] = useState<string>("");
const [description, setDescription] = useState<string>("");
const [address, setAddress] = useState<string>("");
const [phoneNumber, setPhoneNumber] = useState<string>("");
const [email, setEmail] = useState<string>("");
const [website, setWebsite] = useState<string>("");
const [socialMedia, setSocialMedia] = useState<SocialMedia>( {
  facebook: "",
  instagram: "",
  tiktok: "",
  twitter: "",
  linkedin: "",
});
const [businessHours, setBusinessHours] = useState<string>("");
const [branches, setBranches] = useState<Branch[]>([]);

// Estados para agregar sucursales y cajas
const [branchName, setBranchName] = useState<string>("");
const [branchAddress, setBranchAddress] = useState<string>("");
const [branchPhone, setBranchPhone] = useState<string>("");
const [boxNumber, setBoxNumber] = useState<string>("");
const [boxLocation, setBoxLocation] = useState<string>("");

useEffect(() => {
  // Establecer los valores iniciales después de que el componente se monta
  if (storeData) {
    setStoreName(storeData.storeName || "");
    setLogo(storeData.logo || "");
    setDescription(storeData.description || "");
    setAddress(storeData.address || "");
    setPhoneNumber(storeData.phoneNumber || "");
    setEmail(storeData.email || "");
    setWebsite(storeData.website || "");
    setSocialMedia(storeData.socialMedia || {
      facebook: "",
      instagram: "",
      tiktok: "",
      twitter: "",
      linkedin: "",
    });
    setBusinessHours(storeData.businessHours || "");
    setBranches(storeData.branches || []);
  }
}, [storeData]); // Ejecutar solo cuando storeData cambia

const handleAddBranch = () => {
  if (editingBranchIndex !== null) {
    // Edición de la sucursal
    setBranches((prevBranches) => {
      const updatedBranches = [...prevBranches];
      const { branchIndex } = editingBranchIndex; // Extraer el branchIndex
      const editedBranch = updatedBranches[branchIndex];

      // Actualizar la sucursal editada con los nuevos valores
      const updatedEditedBranch = {
        ...editedBranch,
        name: branchName,
        address: branchAddress,
        phone: branchPhone,
      };

      // Actualizar el array de sucursales con la sucursal editada
      updatedBranches[branchIndex] = updatedEditedBranch;

      return updatedBranches;
    });

    // Limpiar los campos después de la edición
    setEditingBranchIndex(null);
  } else {
    // Adición de la sucursal
    setBranches((prevBranches) => [
      ...prevBranches,
      { name: branchName, address: branchAddress, phone: branchPhone, boxes: [] },
    ]);
  }

  // Limpiar los campos después de agregar/Editar una sucursal
  setBranchName("");
  setBranchAddress("");
  setBranchPhone("");
};


const handleEditBranch = (index: number) => {
  // Establecer el índice de edición para la sucursal actual
  setEditingBranchIndex({ branchIndex: index, boxIndex: null }); // Set boxIndex to null

  // Establecer la sucursal actualmente seleccionada para agregar caja
  setSelectedBranchForBox(null);

  // Llenar los campos del formulario con los datos actuales de la sucursal en edición
  const branchToEdit = branches[index];
  setBranchName(branchToEdit.name);
  setBranchAddress(branchToEdit.address);
  setBranchPhone(branchToEdit.phone);
};


const handleDeleteBranch = (index: number) => {
  // Filtrar las sucursales para excluir la que se va a eliminar
  setBranches((prevBranches) => prevBranches.filter((_, i) => i !== index));

  // Limpiar los campos después de eliminar la sucursal
  setEditingBranchIndex(null);
  setBranchName("");
  setBranchAddress("");
  setBranchPhone("");
};


const handleEditBox = (branchIndex: number, boxIndex: number) => {
  // Verificar si la caja que se quiere editar pertenece a la sucursal seleccionada
  if (branchIndex === selectedBranchForBox) {
    // Establecer el índice de edición para la caja actual y la sucursal correspondiente
    setEditingBranchIndex({ branchIndex, boxIndex });

    // Llenar los campos del formulario con los datos actuales de la caja en edición
    const branchToEdit = branches[branchIndex];
    const boxToEdit = branchToEdit.boxes[boxIndex];
    setBoxNumber(boxToEdit.number);
    setBoxLocation(boxToEdit.location);

    // Guardar la sucursal y caja actual para referencia durante la edición
    setSelectedBranchIndex(branchIndex);
    setSelectedBoxIndex(boxIndex);
  } else {
    // Mostrar un mensaje de Snackbar porque la sucursal no coincide
    setSnackbarMessage("No puedes editar esta caja porque no pertenece a la sucursal seleccionada.");
    setSnackbarOpen(true);
  }
};


const handleAddBox = (branchIndex: number) => {
  // Lógica para agregar la caja a la sucursal correspondiente
  const newBox: Box = { id: uuidv4(), number: boxNumber, location: boxLocation, branchIndex };

  setBranches((prevBranches) => {
    const updatedBranches = [...prevBranches];

    // Si hay una caja seleccionada, estamos en modo de edición
    if (selectedBranchIndex !== null && selectedBoxIndex !== null) {
      const currentBranch = updatedBranches[selectedBranchIndex];
      currentBranch.boxes[selectedBoxIndex] = newBox;
    } else {
      // No hay caja seleccionada, estamos en modo de adición
      updatedBranches[branchIndex].boxes.push(newBox);
    }

    return updatedBranches;
  });

  // Limpiar los campos después de agregar/editar una caja
  setBoxNumber("");
  setBoxLocation("");

  // Limpiar la información de edición y restablecer valores
  setEditingBranchIndex(null);
  setSelectedBranchIndex(null);
  setSelectedBoxIndex(null);
};


const handleDeleteBox = (branchIndex: number, boxIndex: number) => {
  // Lógica para eliminar la caja de la sucursal especificada
  setBranches((prevBranches) => {
    const updatedBranches = [...prevBranches];
    const currentBranch = updatedBranches[branchIndex];
    currentBranch.boxes.splice(boxIndex, 1);
    return updatedBranches;
  });
};



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Lógica para agregar o actualizar los datos en la base de datos
    let newDocRef;

    // Crear objeto con los datos del formulario
    const formData = {
      storeName,
      logo,
      description,
      address,
      phoneNumber,
      email,
      website,
      socialMedia,
      businessHours,
      branches,
    };

    // Validar el objeto con el esquema definido por yup
    const productToValidate = formData;
    await validationSchema.validate(productToValidate, { abortEarly: false });

    if (storeData) {
      // Actualizar datos existentes
      const docRef = doc(db, "storeData", storeData.id || "");
      await updateDoc(docRef, formData);
      setSnackbarMessage("Datos actualizados con éxito.");
    } else {
      // Agregar nuevos datos
      newDocRef = await addDoc(collection(db, "storeData"), formData);
      setSnackbarMessage(`Nueva tienda agregada con ID: ${newDocRef.id}`);
    }

    // Mostrar la Snackbar
    setSnackbarOpen(true);

    // Cerrar el formulario
    setTimeout(() => {
      onClose();
    }, 1000);
  } catch (error) {
    handleSubmissionError(error);
  }
};

  

  
const handleSubmissionError = (error: any) => {
  console.error("Error al procesar el formulario", error);

  if (error instanceof yup.ValidationError) {
    // Manejar errores de validación aquí
    const validationErrors: { [key: string]: string } = {};
    error.inner.forEach((e) => {
      if (e.path) {
        validationErrors[e.path] = e.message;
      }
    });

    console.error("Errores de validación:", validationErrors);
    setErrors(validationErrors);
    setErrorTimeoutAndClear();
    setSnackbarMessage("Por favor, corrige los errores en el formulario.");
    setSnackbarOpen(true);
  } else {
    // Otro tipo de error, mostrar un mensaje genérico
    setSnackbarMessage("Error al procesar el formulario. Por favor, inténtelo de nuevo.");
    setSnackbarOpen(true);
  }
};


return (
  <Dialog open={open} onClose={onClose} TransitionComponent={Transition} fullWidth maxWidth="sm">
    <form onSubmit={handleSubmit}>
      <DialogContent sx={{ overflowY: "auto", maxHeight: "70vh" }}>
        <Container maxWidth="sm">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="storeName"
                name="storeName"
                label="Nombre de la Tienda"
                variant="outlined" 
                value={storeName}
                  onChange={(e) => {
                    setStoreName(e.target.value);
                  }}
                margin="normal"
                type="text"
               
              />
               <ErrorMessage
                 messages={
                   errors.storeName
                     ? Array.isArray(errors.storeName)
                       ? errors.storeName
                       : [errors.storeName]
                     : []
                 }
               />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="logo"
                name="logo"
                label="Logo"
                variant="outlined"
                value={logo}
                onChange={(e) => {
                  setLogo(e.target.value);
                }}
                margin="normal"
                type="url"
              
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Descripción"
                variant="outlined"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                margin="normal"
                type="text"
                
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Dirección"
                variant="outlined"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                
                margin="normal"
                type="text"
    
              />
               <ErrorMessage
                 messages={
                   errors.address
                     ? Array.isArray(errors.address)
                       ? errors.address
                       : [errors.address]
                     : []
                 }
               />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="phoneNumber"
                name="phoneNumber"
                label="Teléfono"
                variant="outlined"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
                
                margin="normal"
                type="tel"
           
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Correo Electrónico"
                variant="outlined"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                
                margin="normal"
                type="email"
             
              />
              <ErrorMessage
                 messages={
                   errors.email
                     ? Array.isArray(errors.email)
                       ? errors.email
                       : [errors.email]
                     : []
                 }
               />
              
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="website"
                name="website"
                label="Enlace al Sitio Web"
                variant="outlined"
                value={website}
                onChange={(e) => {
                  setWebsite(e.target.value);
                }}
                
                margin="normal"
                type="url"
                inputProps={{ pattern: "https://.*" }}
          
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="socialMedia.facebook"
                name="socialMedia.facebook"
                label="Facebook"
                variant="outlined"
                value={socialMedia.facebook}
                onChange={(e) => {
                  setSocialMedia((prevSocialMedia) => ({
                    ...prevSocialMedia,
                    facebook: e.target.value,
                  }));
                }}
                margin="normal"
                type="url"
                inputProps={{ pattern: "https://www.facebook.com/.*" }}
         
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="socialMedia.instagram"
                name="socialMedia.instagram"
                label="Instagram"
                variant="outlined"
                value={socialMedia.instagram}
                onChange={(e) => {
                  setSocialMedia((prevSocialMedia) => ({
                    ...prevSocialMedia,
                    instagram: e.target.value,
                  }));
                }}
                margin="normal"
                type="url"
                inputProps={{ pattern: "https://www.instagram.com/.*" }}
             
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="socialMedia.tiktok"
                name="socialMedia.tiktok"
                label="TikTok"
                variant="outlined"
                value={socialMedia.tiktok}
                onChange={(e) => {
                  setSocialMedia((prevSocialMedia) => ({
                    ...prevSocialMedia,
                    tiktok: e.target.value,
                  }));
                }}
                margin="normal"
                type="url"
                inputProps={{ pattern: "https://www.tiktok.com/.*" }}
     
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="businessHours"
                name="businessHours"
                label="Horario Laboral"
                variant="outlined"
                value={businessHours}
                onChange={(e) => {
                  setBusinessHours(e.target.value);
                }}
                margin="normal"
                type="text"
              />
            </Grid>

        



            <Grid item xs={12}>
            {branches.length > 0 && (
              <>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {branches.map((branch, branchIndex) => (
                  <li key={branchIndex}>
                    {`Sucursal: ${branch.name}`}
                    <IconButton onClick={() => handleDeleteBranch(branchIndex)}>
                      <DeleteForeverIcon />
                    </IconButton>
                    <IconButton onClick={(e) => { e.stopPropagation(); handleEditBranch(branchIndex); }}>
                      <EditIcon />
                    </IconButton>

                    {`Agrega/Editar Caja`}
                    <IconButton onClick={() => setSelectedBranchForBox(prev => (prev === branchIndex ? null : branchIndex))}>
                    {/* Agregar un icono para indicar la selección de la sucursal */}
                    {selectedBranchForBox === branchIndex ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                  </IconButton>

                    {branch.boxes.length > 0 && (
                      <ul style={{ listStyle: 'none', padding: 0, marginLeft: '20px' }}>
                        {branch.boxes.map((box, boxIndex) => (
                          <li key={boxIndex}>
                            {`Caja: ${box.number}`}
                            <IconButton onClick={() => handleDeleteBox(branchIndex, boxIndex)}>
                              <DeleteForeverIcon />
                            </IconButton>
                            <IconButton onClick={() => handleEditBox(branchIndex, boxIndex)}>
                              <EditIcon />
                            </IconButton>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>


              {selectedBranchForBox !== null && (
                <>
                  {/* Edición o Agregado de datos de la caja */}
                  <Typography variant="h6" gutterBottom style={{ textAlign: 'center', marginTop: '20px' }}>
                    {editingBranchIndex !== null
                      ? `Editando la caja de la Sucursal: ${branches[selectedBranchForBox]?.name}`
                      : 'Agregar Caja'}
                  </Typography>

                  <TextField
                    fullWidth
                    label="Numero de la Caja"
                    variant="outlined"
                    value={boxNumber}
                    onChange={(e) => setBoxNumber(e.target.value)}
                    margin="normal"
                    type="text"
                  />
                  <TextField
                    fullWidth
                    label="Ubicación de la Caja"
                    variant="outlined"
                    value={boxLocation}
                    onChange={(e) => setBoxLocation(e.target.value)}
                    margin="normal"
                    type="text"
                  />

                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddBox(selectedBranchForBox)}
                 
                  >
                    {editingBranchIndex !== null ? 'Guardar Cambios' : 'Agregar Caja'}
                  </Button>

                  </div>
                </>
              )}





              </>
            )}


                  <Typography variant="h6" gutterBottom style={{ textAlign: 'center', marginTop: '20px' }}>
                    {editingBranchIndex !== null ? `Editar Sucursal:` : 'Agrega Sucursal'}
                  </Typography>

                  <TextField
                    fullWidth
                    label="Nombre de la Sucursal"
                    variant="outlined"
                    value={branchName}
                    onChange={(e) => {
                      setBranchName(e.target.value);
                    }}
                    margin="normal"
                    type="text"
                  />
                  <TextField
                    fullWidth
                    label="Dirección de la Sucursal"
                    variant="outlined"
                    value={branchAddress}
                    onChange={(e) => {
                      setBranchAddress(e.target.value);
                    }}
                    margin="normal"
                    type="text"
                  />
                  <TextField
                    fullWidth
                    label="Teléfono de la Sucursal"
                    variant="outlined"
                    value={branchPhone}
                    onChange={(e) => {
                      setBranchPhone(e.target.value);
                    }}
                    margin="normal"
                    type="tel"
                  />

                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddBranch()}
                  >
                    {editingBranchIndex !== null ? 'Guardar Cambios' : 'Agregar Sucursal'}
                  </Button>



                  </div>



            </Grid>

            <Grid container spacing={2}>
          </Grid>
          </Grid>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button type="submit" color="primary">
          {isEditing ? "Guardar Cambios" : "Agregar"}
        </Button>
      </DialogActions>
    </form>
    <Snackbar open={snackbarOpen} autoHideDuration={1200} onClose={handleCloseSnackbar} message={snackbarMessage} />
  </Dialog>
);




};

export default StoreDataForm;