import React from 'react';

const CustomArrow = ({ className, onClick, icon }) => {
  return (
    <div className={className} onClick={onClick}>
      <i className={icon}></i>
    </div>
  );
};

export default CustomArrow;
