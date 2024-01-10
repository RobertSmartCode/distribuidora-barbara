import React from "react";
import { Chip, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFilterContext } from "../../context/FilterContext";

const PriceRangeFilter: React.FC = () => {
  const { filter, updateFilter } = useFilterContext()!;

  const clearFilter = () => {
    updateFilter({ ...filter, priceRange: { from: '', to: '' } });
  };

  const customColors = {
    primary: {
      main: '#000',
      contrastText: '#000',
    },
  };

  return (
    <div>
      {filter.priceRange.from && filter.priceRange.to && (
        <Chip
          label={`Precio: ${filter.priceRange.from} - ${filter.priceRange.to}`}
          onDelete={clearFilter}
          variant="outlined"
          style={{ color: customColors.primary.main, borderColor: customColors.primary.main, marginBottom: '8px' }}
          deleteIcon={<IconButton size="small" style={{ color: customColors.primary.main }}><CloseIcon /></IconButton>}
        />
      )}
    </div>
  );
};

export default PriceRangeFilter;
