import React, { useContext, useState, ChangeEvent, FormEvent } from "react";
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
  Tooltip,
  Typography,
  useMediaQuery
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { db, loginGoogle, onSigIn } from "../../firebase/firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";

const Login: React.FC = () => {


const { search } = useLocation();
const params = new URLSearchParams(search);
const isComingFromPaymentSuccess = params.get('from');



  const { handleLogin } = useContext(AuthContext)!;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await onSigIn(userCredentials);
      if (res?.user) {
        const userCollection = collection(db, "users");
        const userRef = doc(userCollection, res.user.uid);
        const userDoc = await getDoc(userRef);
        const finalUser = {
          email: res.user.email || "",
          rol: userDoc.data()?.rol,
        };
        handleLogin(finalUser);
  
        if (isComingFromPaymentSuccess) {
          navigate("/user-orders"); // Redirige a la página de pedidos del usuario
        } else {
          navigate("/"); // Redirige a la página principal
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const googleSignIn = async () => {
    const res = await loginGoogle();
    const finalUser = {
      email: res.user.email || "",
      rol: "user",
    };
    handleLogin(finalUser);
    navigate("/");
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
        padding: "20px",
        maxWidth: "600px",
        marginLeft: "auto",
        marginRight: "auto",
        ...(isDesktop && {
          paddingLeft: "400px",
          paddingRight: "400px",
        }),
        backgroundColor: "white",
      }}
    >

{isComingFromPaymentSuccess && (
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2, color: "black",}}>
          Inicia sesión para hacerle seguimiento a tu compra
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2} justifyContent={"center"}>
          <Grid item xs={12} md={12}>
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
          <Grid item xs={12} md={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password" >
                Contraseña
              </InputLabel>
              <OutlinedInput
              sx={{
                color: "black",
                backgroundColor: "white"
              }}
                name="password"
                onChange={handleChange}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
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
                        }} />
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
          <Link
            to="/forgot-password"
            style={{
              color: "#000", // Color de texto negro
              marginTop: "10px",
              textDecoration: "none",
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <Grid container justifyContent="center" spacing={3} mt={2}>
            <Grid item xs={12} md={5}>
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
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Tooltip title="Ingresa con Google">
                <Button
                  variant="contained"
                  startIcon={<GoogleIcon />}
                  onClick={googleSignIn}
                  type="button"
                  fullWidth
                  sx={{
                    color: "#fff",
                    backgroundColor: "black", // Fondo negro
                    textTransform: "none",
                  }}
                >
                  Ingresa con Google
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography
                color="secondary.primary"
                variant="h6"
                mt={1}
                align="center"
              >
                ¿Aún no tienes cuenta?
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Tooltip title="Regístrate">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/register")}
                  type="button"
                  sx={{
                    color: "#fff",
                    backgroundColor: "black", // Fondo negro
                    textTransform: "none",
                  }}
                >
                  Regístrate
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Login;
