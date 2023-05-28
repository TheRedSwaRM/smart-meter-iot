import React, {useEffect, useState} from 'react';
import getCurrentDate from '../utils/date';
import '../styles/utils.css';
import '../styles/dashboard.css'
import Modal from '../components/modal';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import useData from '../hooks/useData';

const Dashboard = () => {
  const [uname, setUname] = useState('user');
  const date = getCurrentDate();
  const currentMonth = date.month;

  const nav = useNavigate();

  const userid = localStorage.getItem('userid')
  const userData = useData(userid)

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

  if (userData.loading) {
    return <div>Loading...</div>
  }

  const energyExpense = userData.expenses[userData.expenses.length-1]

  return ( 
  <>     
   <h1 style = {{textAlign: 'center'}}>IoMeter</h1>
    <Modal>
      <h2 style = {{textAlign: 'center'}}> Hello, {uname}! Here's your: </h2>
      <p>
        Current Energy Expenses (for the month of {currentMonth}): {energyExpense.estimated_cost}
      </p>
      <p>
        Current Energy Expenses threshold: {energyExpense.thresh_up}
      </p>
      <br/>
      <div className='navbar'>
        <Link to='../settings'>Settings</Link> | <Link to='../login'>Logout</Link>
      </div>
      <p className='date'>{getCurrentDate()}</p>
    </Modal>
  </>
  );
}

export default Dashboard;