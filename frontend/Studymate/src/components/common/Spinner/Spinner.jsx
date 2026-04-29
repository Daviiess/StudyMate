import React from 'react';
import './Spinner.scss';

const Spinner = () => {

  return (
    <div className="spinner-loader-container">
      <div className="spinner-loader-circle"></div>
      <p className='spinner-text'>Loading...</p>
    </div>
  );
};

export default Spinner;