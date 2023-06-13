import React from 'react';
import '../styles/alert.css';

const AlertBanner = ({value, low, high}) => {
  if (value >= high){
    return(
      <div className='warning2'>
        <b>ALERT</b>: you have exceeded your monthly threshold of <b>{high}PHP</b>.
      </div>
    );
  }
  else if (value >= low && value < high){
    return(
      <div className='warning1'>
        <b>ALERT</b>: you have exceeded your initial threshold of <b>{low}PHP</b> and are approaching your monthly threshold of <b>{high}PHP</b>.
      </div>
    );
  }
  
  
  return null;
}

export default AlertBanner;
