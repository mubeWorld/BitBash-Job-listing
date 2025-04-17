import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 40 }) => {
  return (
    <div
      className="spinner"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${size / 8}px`,
      }}
    ></div>
  );
};

export default Spinner;
