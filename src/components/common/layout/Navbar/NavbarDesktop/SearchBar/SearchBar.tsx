import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchContext } from "../../../../../../context/SearchContext"; 
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

function SearchBar() {
  const { searchKeyword, updateSearchKeyword} = useSearchContext()!;
  const navigate = useNavigate();
  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <Box className="search-bar" marginLeft="2px" width="100%" maxWidth="400px" marginX="auto">
    <TextField
      type="text"
      label="¿Qué está buscando?"
      value={searchKeyword}
      autoComplete="off"
      onChange={(e) => updateSearchKeyword(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <SearchIcon onClick={handleSearch} style={{ cursor: 'pointer' }} />
          </InputAdornment>
        ),
      }}
      fullWidth  // Opción fullWidth para ocupar el ancho completo del contenedor
    />
  </Box>
  );
}

export default SearchBar;
