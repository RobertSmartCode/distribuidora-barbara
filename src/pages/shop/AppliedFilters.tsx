import React from "react";
import { Box, Chip, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFilterContext } from "../../context/FilterContext";
import { useSortContext } from "../../context/SortContext";


interface Sort {
    sortBy: string;
    sortOrder: 'asc' | 'desc' | undefined;
  }

const AppliedFilters: React.FC = () => {
  const { filter, updateFilter } = useFilterContext()!;
  const { sort, updateSort } = useSortContext()!;
  const defaultSort: Sort = { sortBy: 'default', sortOrder: 'asc' };

  const resetFilters = () => {
    const defaultSort: Sort = { sortBy: 'default', sortOrder: 'asc' };
    const defaultColors = Object.fromEntries(
      Object.keys(filter.colors).map((color) => [color, false])
    );
    const defaultSizes = Object.fromEntries(
      Object.keys(filter.sizes).map((size) => [size, false])
    );
    const defaultPriceRange = { from: '', to: '' };
  
    // Aplica los valores predeterminados
    updateSort(defaultSort);
    updateFilter({
      colors: defaultColors,
      sizes: defaultSizes,
      priceRange: defaultPriceRange,
    });
  };

  const clearFilter = (key: string, value?: string) => {
    // Lógica para eliminar un filtro específico
    if (key === 'priceRange') {
      updateFilter({ ...filter, priceRange: { from: '', to: '' } });
    } else if (key === 'colors' && value) {
      const updatedColors = { ...filter.colors };
      delete updatedColors[value];
      updateFilter({ ...filter, colors: updatedColors });
    } else if (key === 'sizes' && value) {
      const updatedSizes = { ...filter.sizes };
      delete updatedSizes[value];
      updateFilter({ ...filter, sizes: updatedSizes });
    }
  };

  const areAllFiltersEmpty = () => {
    const { sortBy, sortOrder } = sort;
    const { colors, sizes, priceRange } = filter;

    const isSortEmpty = sortBy === 'default' && sortOrder === 'asc';

    const isColorsEmpty = Object.values(colors).every((color) => !color);
    const isSizesEmpty = Object.values(sizes).every((size) => !size);
    const isPriceRangeEmpty = !priceRange.from && !priceRange.to;

    return isSortEmpty && isColorsEmpty && isSizesEmpty && isPriceRangeEmpty;
  };

  const sortTranslations: Record<string, string> = {
    lowToHigh: 'Menor Precio',
    highToLow: 'Mayor Precio',
    newToOld: 'Nuevos a Viejos',
    oldToNew: 'Viejos a Nuevos',
    bestSellers: 'Más Vendidos',
  };
  

  const customColors = {
    primary: {
      main: '#000',
      contrastText: '#000',
    },
    secondary: {
      main: '#fff',
      contrastText: '#fff',
    },
  };

  return (
    <Box>
      {areAllFiltersEmpty() ? null : (
        <Box>
          <h4>Filtros aplicados:</h4>
          {filter.priceRange.from && filter.priceRange.to && (
            <Chip
              label={`Precio: ${filter.priceRange.from} - ${filter.priceRange.to}`}
              onDelete={() => clearFilter('priceRange')}
             
              variant="outlined"
              style={{ marginRight: '8px', marginBottom: '8px' }}
            />
          )}
          {sort.sortBy !== 'default' && (
            <Chip
                label={`Orden: ${sortTranslations[sort.sortBy]}`}
                onDelete={() => updateSort(defaultSort)}
                variant="outlined"
                style={{
                marginRight: '8px',
                marginBottom: '8px',
                color: customColors.primary.main,
                borderColor: customColors.primary.main,
                }}
            />
            )}


          {Object.keys(filter.colors).map(
            (color) =>
              filter.colors[color] && (
                <Chip
                  key={color}
                  label={color}
                  onDelete={() => clearFilter('colors', color)}
                 
                  variant="outlined"
                  style={{
                    marginRight: '8px',
                    marginBottom: '8px',
                    color: customColors.primary.main,
                    borderColor: customColors.primary.main,
                  }}
                />
              )
          )}
          {Object.keys(filter.sizes).map(
            (size) =>
              filter.sizes[size] && (
                <Chip
                  key={size}
                  label={size}
                  onDelete={() => clearFilter('sizes', size)}
                
                  variant="outlined"
                  style={{
                    marginRight: '8px',
                    marginBottom: '8px',
                    color: customColors.primary.main,
                    borderColor: customColors.primary.main,
                  }}
                />
              )
          )}

          <IconButton onClick={resetFilters}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default AppliedFilters;
