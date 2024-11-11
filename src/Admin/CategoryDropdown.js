import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import PropTypes from 'prop-types';

function CategoryDropdown({ categoryOptions, initialCategory, onCategoryChange }) {
  const [category, setCategory] = useState(initialCategory || "Others");

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const handleChange = (event, newValue) => {
    const newCategory = categoryOptions.includes(newValue) ? newValue : "Others";
    setCategory(newCategory);
    onCategoryChange(newCategory); // Notify parent component of the change
  };

  return (
    <Autocomplete
      options={categoryOptions} // Full list of options passed from parent
      value={category}
      onChange={handleChange}
      freeSolo  // Allows entering a value not in the list
      renderInput={(params) => (
        <TextField
          {...params}
          label="Category"
          variant="outlined"
          sx={{
            width: { xs: "100%", sm: "400px", md: "450px" },
            marginBottom: "20px",
          }}
        />
      )}
    />
  );
}

CategoryDropdown.propTypes = {
  categoryOptions: PropTypes.array.isRequired,
  initialCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired,
};

export default CategoryDropdown;
