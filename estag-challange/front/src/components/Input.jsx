import React from 'react';

function Input({ label, id, type, value, onChange, name, autoComplete, className}) {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        className={className}
        value={value}
        onChange={onChange}
        name={name}
        autoComplete={autoComplete}
      />
    </div>
  );
}

export default Input;

