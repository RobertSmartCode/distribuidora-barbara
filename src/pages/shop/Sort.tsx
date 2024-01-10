import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useSortContext } from "../../context/SortContext";
import SortIcon from "@mui/icons-material/Sort";

const Sort: React.FC = () => {
  const { updateSort, sort } = useSortContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectSortOption = (option: string) => {
    updateSort({ sortBy: option });
    handleCloseMenu();
  };

  const translateSortOption = (option: string): string => {
    // Tabla de conversión
    const translations: { [key: string]: string } = {
      default: "Ordenar",
      lowToHigh: "Menor Precio",
      highToLow: "Mayor Precio",
      newToOld: "Nuevos a Viejos",
      oldToNew: "Viejos a Nuevos",
      bestSellers: "Más Vendidos",
    };

    return translations[option] || option;
  };

  const customColors = {
    primary: {
      main: "#000",
      contrastText: "#000",
    },
    secondary: {
      main: "#fff",
      contrastText: "#fff",
    },
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={handleOpenMenu}
        style={{
          backgroundColor: customColors.secondary.main,
          color: customColors.primary.main,
          padding: "8px 16px",
          border: `1px solid ${customColors.primary.main}`,
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          marginLeft: "8px",
        }}
      >
        {sort ? translateSortOption(sort.sortBy) : "Ordenar"}
        <SortIcon style={{ marginLeft: "4px" }} />
      </button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
      {sort && sort.sortBy !== "default" && (
          <MenuItem onClick={() => handleSelectSortOption("default")}>
            {"Quitar Filtro"}
          </MenuItem>
        )}
        <MenuItem onClick={() => handleSelectSortOption("lowToHigh")}>
          {translateSortOption("lowToHigh")}
        </MenuItem>
        <MenuItem onClick={() => handleSelectSortOption("highToLow")}>
          {translateSortOption("highToLow")}
        </MenuItem>
        <MenuItem onClick={() => handleSelectSortOption("newToOld")}>
          {translateSortOption("newToOld")}
        </MenuItem>
        <MenuItem onClick={() => handleSelectSortOption("oldToNew")}>
          {translateSortOption("oldToNew")}
        </MenuItem>
        <MenuItem onClick={() => handleSelectSortOption("bestSellers")}>
          {translateSortOption("bestSellers")}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Sort;
