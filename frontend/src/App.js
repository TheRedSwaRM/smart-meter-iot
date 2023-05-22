import logo from './logo.svg';
import React, {useState} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Modal from './components/modal';
import Form from './components/form';
import './App.css';
import { getCurrentDate } from './utils/date';
import './styles/utils.css'

function App() {
  return (
    <>
      <h1 style = {{textAlign: 'center'}}>IoMeter</h1>
      <Modal>
        <h2 style = {{textAlign: 'center'}}> Welcome! </h2>
        <Form>
        </Form>
        <p className='date'>{getCurrentDate()}</p>
      </Modal>
    </>
  );
}

export default App;
