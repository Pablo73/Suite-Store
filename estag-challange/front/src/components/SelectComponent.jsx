import React from 'react';

const SelectComponent = ({ label, id, options, onChange, keyValue, className }) => {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}:</label>
      <select id={id} onChange={onChange}>
        <option value="">Select an option</option>
        {options?.map((option, index) => (
          <option key={index} value={option[keyValue]}>
            {option[keyValue]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;
