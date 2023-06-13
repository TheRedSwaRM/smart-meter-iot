import React, {useEffect, useState} from 'react';
import getCurrentDate from '../utils/date';
import '../styles/utils.css';
import '../styles/dashboard.css'
import Modal from '../components/modal';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import useData from '../hooks/useData';
import AlertBanner from '../components/alertbanner';

const Dashboard = () => {
  const date = (new Date()).toLocaleString('en-US', {month: 'long'}) + ' ' + (new Date().getFullYear()).toString();

  const nav = useNavigate();

  const userid = localStorage.getItem('userid');
  const display = localStorage.getItem('display')
  const userData = useData(userid);

  useEffect(() => {
    let autoUpdate = null
    if (!userData.loading) {
      autoUpdate = () => {
        userData.getData()
        setTimeout(autoUpdate, 5000)
      }
      setTimeout(autoUpdate, 5000)
    }
    return () => {
      if (autoUpdate) {
        clearTimeout(autoUpdate)
      }
    }
  }, [userData.loading])

  const doLogout = () => {
      localStorage.removeItem('userid')
      localStorage.removeItem('display')
  }

  if (userData.loading) {
    return <div className='loading-screen'>Loading...</div>
  }

  const energyExpense = userData.expenses[userData.expenses.length-1]

  const cost = `PHP ${energyExpense.estimated_cost.toFixed(2)}`
  const power = `${energyExpense.power.toFixed(2)} Kw/h`

  return ( 
  <>     
   <h1 style = {{textAlign: 'center'}}>IoMeter</h1>
    <Modal>
      <h2 style = {{textAlign: 'center'}}> Hello, {display}!</h2>
      <div className='status'>
        <h3>
          Statistics for {date}
        </h3>
        
        <div className='input-container'>
          <label>Current Cost:</label> 
          <input 
          disabled value={cost}
          />
          
        </div>
        <div className='input-container'>
          <label>Energy Reading:</label>
          <input 
          disabled value={power}
          />
        </div>
          
      </div>
      <br/>
      <AlertBanner 
        value={cost}
        low={userData.userInputs.low}
        high={userData.userInputs.high}
      />
      <br/>
      <div className='navbar'>
        <Link to='../settings'>Settings</Link> | <Link to='../login' onClick={doLogout}>Logout</Link>
      </div>
      <p className='date'>{getCurrentDate()}</p>
    </Modal>
  </>
  );
}

export default Dashboard;