import React, {useState} from 'react';
import getCurrentDate from '../utils/date';
import '../styles/utils.css';
import Modal from '../components/modal';

const Dashboard = () => {
  const [uname, setUname] = useState('user');
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