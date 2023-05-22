import React, {useState} from 'react';
import getCurrentDate from '../utils';
import '../styles/utils.css';

function Dashboard() {
  const [uname, setUname] = setState('user');
  const date = getCurrentDate();
  const currentMonth = date.month;
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
      <p>
        Settings | Logout
      </p>
    </Modal>
  </>
  );
}

export default Dashboard;