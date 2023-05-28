import React from 'react';
import Modal from '../components/modal';
import FormSignup from '../components/formsignup';
import { default as getCurrentDate } from '../utils/date';
import '../styles/utils.css'

function Signup() {
  return (
    <>
      <h1 style = {{textAlign: 'center'}}>IoMeter</h1>
      <Modal>
        <h2 style = {{textAlign: 'center'}}>Sign Up</h2>
        <FormSignup/>
        <p className='date'>{getCurrentDate()}</p>
      </Modal>
    </>
  );
}

export default Signup;