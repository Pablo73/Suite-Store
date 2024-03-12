import React from 'react';

function Button({ name, id, className, onClick, type }) {
  return (
    <div >
      <button type={type} className={className} id={id} onClick={onClick}>{ name }</button>
    </div>
  );
}

export default Button;