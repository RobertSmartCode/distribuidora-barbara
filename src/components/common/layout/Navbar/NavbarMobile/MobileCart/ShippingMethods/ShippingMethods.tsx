import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  Grid,
} from "@mui/material";
import { useShippingMethods } from "../../../../../../../context/ShippingMethodsContext";

const ShippingMethods: React.FC = () => {
  const { shippingMethods, selectedMethodId, updateShippingMethods, selectShippingMethod } = useShippingMethods();

  if (!shippingMethods) {
    // Puedes mostrar un mensaje de carga o retornar un indicador de carga
    return null;
  }

  return (
    <Grid container spacing={2}>
      {shippingMethods.map((method) => (
        <Grid item xs={12} sm={12} md={12} key={method.id}>
          <Card
            onClick={() => {
              const updatedMethods = shippingMethods.map((m) => ({
                ...m,
                selected: m.id === method.id,
              }));
              updateShippingMethods(updatedMethods);
              selectShippingMethod(method.id);
            }}
            style={{
              cursor: "pointer",
              backgroundColor: method.id === selectedMethodId ? "#e0e0e0" : "white",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Checkbox
                  checked={method.id === selectedMethodId}
                  onChange={() => {
                    const updatedMethods = shippingMethods.map((m) => ({
                      ...m,
                      selected: m.id === method.id,
                    }));
                    updateShippingMethods(updatedMethods);
                    selectShippingMethod(method.id);
                  }}
                  style={{ marginRight: "10px" }}
                />
                <Typography variant="body1" component="div">
                  {method.name}
                </Typography>
              </div>
              <Typography variant="body1" color="text.secondary">
                ${method.price}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ShippingMethods;
