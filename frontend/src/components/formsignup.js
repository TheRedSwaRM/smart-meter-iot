import React, {useState} from 'react';
import '../styles/form.css';
import { Route, Routes, useNavigate } from 'react-router-dom';

const FormSignup = (props) => {
  const nav = useNavigate();
  const [accInfo, setAccInfo] = useState({
    uname: '',    //login username
    display: '',  //displayed username
    password: '', //password
    deviceID: '', //device id
    kwhCost: '',  //kwh cost value
    thresh_low: 0, //first threshold benchmark
    thresh_high: Infinity //second threshold benchmark
  })
  const doCancel = () => {
    nav('/login');
  }
  const doSubmit = (e) => {
    e.preventDefault()

    doCancel();
  }

  return(
    <div className="form">
      <form onSubmit={doSubmit}>
        <h3> User Settings: </h3>
        <div className="input-container">
          <label>Username: </label>
          <input 
            type="text" name="uname" id = "uname"
            required 
            value = {accInfo.uname} 
            onChange = {(e) => setAccInfo({
              uname : e.target.value,
              display : e.target.value
              })
            }
          />
        </div>
        <div className="input-container">
          <label>Password: </label>
          <input 
            type="password" name="password" id = "password" 
            required 
            value = {accInfo.password} 
            onChange = {(e) => setAccInfo({
              password: e.target.value
            })}
          />
        </div>
        
        <h3> Device Settings: </h3>
        <div className="input-container">
          <label>Device ID: </label>
          <input 
            type="text" name="deviceid" id = "deviceid" 
            required 
            value = {accInfo.deviceID} 
            onChange = {(e) => setAccInfo({
              deviceID: e.target.value
            })}
          />
        </div>

        <div className="input-container">
          <label>Kw/H Cost: </label>
          <input 
            type="text" name="kwhcost" id = "kwhcost" 
            required 
            value = {accInfo.kwhCost} 
            onChange = {(e) => setAccInfo({
              kwhCost: e.target.value
            })}
          />
        </div>

        <h3>Cost thresholds (in ₱): </h3>
        <div className="input-container">
          <label>Low: </label>
          <input 
            type="number" name="thresh_low" id = "thresh_low" 
            required 
            value = {accInfo.thresh_low} 
            onChange = {(e) => setAccInfo({
              thresh_low: e.target.value
            })}
          />
          <label>High: </label>
          <input 
            type="number" name="thresh_high" id = "thresh_up" 
            required 
            value = {accInfo.thresh_high} 
            onChange = {(e) => setAccInfo({
              thresh_high: e.target.value
            })}
          />
        </div>


        <div className="button-bar">
          <div className="button-container">
            <input type="submit" name = "login" value = "Sign Up"/>
          </div>
          <div className="button-container">
            <input type="button" name = "cancel" value = "Cancel" onClick={doCancel}/>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormSignup;
