import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  useMediaQuery
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signUp, db } from "../../firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserCredentials({
      ...userCredentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await signUp(userCredentials);
    if (res.user.uid) {
      await setDoc(doc(db, "users", res.user.uid), { rol: "user" });
    }
    navigate("/login");
  };
  const isDesktop = useMediaQuery("(min-width:960px)");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: '100vh', 
        padding: "20px", // Padding por defecto
        maxWidth: "600px", // Ancho máximo del contenido
        marginLeft: "auto", // Espacio a la izquierda
        marginRight: "auto", // Espacio a la derecha
        ...(isDesktop && {
          paddingLeft: "400px", // Padding a la izquierda para escritorio
          paddingRight: "400px", // Padding a la derecha para escritorio
        }),
        backgroundColor: "white",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2} justifyContent={"center"}>
          <Grid item xs={10} md={12}>
            <TextField
              name="email"
              label="Email"
              fullWidth
              onChange={handleChange}
              sx={{
                color: "black",
                backgroundColor: "white"
              }}
            />
          </Grid>
          <Grid item xs={10} md={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password"  sx={{
                color: "black",
                
              }}>
                Contraseña
              </InputLabel>
              <OutlinedInput
               sx={{
                color: "black",
                backgroundColor: "white"
              }}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{
                          color: "black"
                        }}  />
                      ) : (
                        <Visibility sx={{
                          color: "black"
                        }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña"
              />
            </FormControl>
          </Grid>
          <Grid item xs={10} md={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password"  sx={{
                color: "black",
                backgroundColor: "white"
              }}>
                Confirmar contraseña
              </InputLabel>
              <OutlinedInput
               sx={{
                color: "black",
                backgroundColor: "white"
              }}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{
                          color: "black"
                        }}  />
                      ) : (
                        <Visibility sx={{
                          color: "black"
                        }}  />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirmar contraseña"
              />
            </FormControl>
          </Grid>
          <Grid container justifyContent="center" spacing={3} mt={2}>
            <Grid item xs={10} md={7}>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  color: "#fff",
                  backgroundColor: "black", // Fondo negro
                  textTransform: "none",
                }}
              >
                Registrarme
              </Button>
            </Grid>
            <Grid item xs={10} md={7}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate("/login")}
                type="button"
                sx={{
                  color: "#fff",
                  backgroundColor: "black", // Fondo negro
                  textTransform: "none",
                }}
              >
                Regresar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Register;
