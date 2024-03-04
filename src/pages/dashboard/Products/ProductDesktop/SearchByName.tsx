import React, { useState, useEffect } from "react";
import { TextField, Grid } from "@mui/material";
import { useSearchContext } from "../../../../context/SearchContext";

const SearchByName: React.FC = () => {
  const {updateSearchKeyword } = useSearchContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
 

  useEffect(() => {
    // Actualizar el contexto de búsqueda cuando searchTerm cambie
    updateSearchKeyword(searchTerm);
  }, [searchTerm, updateSearchKeyword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

    return (
      <Grid container spacing={1} alignItems="center" justifyContent="center" textAlign="center">
        <Grid item xs={12}>
          <TextField
            label="Buscar por nombre"
            variant="outlined"
            value={searchTerm}
            onChange={handleInputChange}
            style={{ marginBottom: "2%", width: '80%' }}
            autoComplete="off"
          />
        </Grid>
      </Grid>
    );
  
};

export default SearchByName;
