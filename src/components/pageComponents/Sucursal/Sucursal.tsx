import React, { useEffect } from "react";
import { useStoreData } from "../../../context/StoreDataContext";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { fetchStoreData } from "../../../api/api"

const Sucursal: React.FC = () => {

    const { storeData, updateStoreData, selectedLocation, updateSelectedLocation } = useStoreData();
    // console.log(storeData)

  useEffect(() => {
   
    const unsubscribe = fetchStoreData((newData) => {
      updateStoreData(newData);
    });

    return () => unsubscribe();
  }, [updateStoreData]);

  

  const handleLocationChange = (event: SelectChangeEvent<string>) => {
    updateSelectedLocation({
      ...selectedLocation,
      sucursal: event.target.value,
      caja: "", 
    });
  };

  const handleBoxChange = (event: SelectChangeEvent<string>) => {
    updateSelectedLocation({
      ...selectedLocation,
      caja: event.target.value,
    });
  };

  useEffect(() => {
    // Este efecto se ejecutará cada vez que selectedLocation.sucursal cambie
    console.log("selectedLocation.sucursal cambiado:", selectedLocation.sucursal);

    // Aquí puedes realizar operaciones adicionales si es necesario
    // ...

  }, [selectedLocation.sucursal]);
  
  return (
    <div>
      <Typography variant="h4">Seleccionar Sucursal y Caja</Typography>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="sucursal-label">Sucursal</InputLabel>
        <Select
            labelId="sucursal-label"
            id="sucursal-select"
            value={selectedLocation.sucursal}
            label="Sucursal"
            onChange={handleLocationChange}
        >
            {storeData.flatMap((data) =>
            data.branches?.map((branch) => (
                <MenuItem key={branch.id} value={branch.name}>
                {branch.name}
                </MenuItem>
            )) || []
            )}
        </Select>
      </FormControl>
  
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="caja-label">Caja</InputLabel>
        <Select
            labelId="caja-label"
            id="caja-select"
            value={selectedLocation.caja}
            label="Caja"
            onChange={handleBoxChange}
            disabled={!selectedLocation.sucursal}
        >
            {storeData
            .filter((data) => data.branches?.some((branch) => branch.name === selectedLocation.sucursal))
            .map((filteredData) => {
                return filteredData.branches?.flatMap((branch, branchIndex) => {
                if (branch.name === selectedLocation.sucursal) {
                    // Filtrar solo las cajas de la sucursal seleccionada
                    return branch.boxes.map((box, boxIndex) => (
                    <MenuItem key={`box-${branchIndex}-${boxIndex}`} value={box.number}>
                        {box.number}
                    </MenuItem>
                    ));
                }
                return null;
                }) || [];
              })}
        </Select>
      </FormControl>
    </div>
  );
  
  
  

};

export default Sucursal;
