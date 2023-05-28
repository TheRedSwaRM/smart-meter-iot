import React, {useState} from 'react';
import '../styles/form.css';
import useData from '../hooks/useData';
import { Route, Routes, useNavigate } from 'react-router-dom';

const FormSettings = (props) => {
  const nav = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const userid = localStorage.getItem('userid')
  const userData = useData('userid');

  const [accInfo, setAccInfo] = useState({
    kwhCost: userData.userInputs.cost,  //kwh cost value
    thresh_low: userData.userInputs.low, //first threshold benchmark
    thresh_high: userData.userInputs.high //second threshold benchmark
  })

  const doSubmit = (e) => {

    // insert code to update values here
    e.preventDefault()

  }
  const doCancel = () => {
    nav('../dashboard');
  }


  return(
    <div className="form">
      <form onSubmit={doSubmit}>
        <h3>Energy Rates (in ₱): </h3>
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
            <input type="button" name = "save" value = "Save Settings"/>
          </div>
          <div className="button-container">
            <input type="button" name = "cancel" value = "Cancel" onClick={doCancel}/>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormSettings;
