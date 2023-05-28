import React, {useState} from 'react';
import getCurrentDate from '../utils/date';
import '../styles/utils.css';
import '../styles/dashboard.css'
import Modal from '../components/modal';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [uname, setUname] = useState('user');
  const date = getCurrentDate();
  const currentMonth = date.month;

  const nav = useNavigate();


  return ( 
  <>     
   <h1 style = {{textAlign: 'center'}}>IoMeter</h1>
    <Modal>
      <h2 style = {{textAlign: 'center'}}> Hello, {uname}! Here's your: </h2>
      <p>
        Current Energy Expenses (for the month of {currentMonth}): 
      </p>
      <p>
        Current Energy Expenses threshold: 
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