import React, {useEffect, useState} from 'react';
import '../styles/form.css';
import useData from '../hooks/useData';
import { Route, Routes, useNavigate } from 'react-router-dom';
import server from '../utils/server';

const FormSettings = (props) => {
  const nav = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const userid = localStorage.getItem('userid')
  const userData = useData(userid)

  const [accInfo, setAccInfo] = useState({
    kwhCost: 0,
    thresh_low: 0,
    thresh_high: 0
  }) 
  
  useEffect(() => {
    setAccInfo({
      kwhCost: userData.userInputs.cost,  //kwh cost value
      thresh_low: userData.userInputs.low, //first threshold benchmark
      thresh_high: userData.userInputs.high //second threshold benchmark
    })
  }, [userData.userInputs])

  const doSubmit = async (e) => {
    // insert code to update values here
    e.preventDefault()
    const cost_per_kwh = accInfo.kwhCost
    const thresh_low = accInfo.thresh_low
    const thresh_up = accInfo.thresh_high
    await server.post(`/api/user_input/${userid}`, {
      cost_per_kwh,
      thresh_low,
      thresh_up
    })
    nav('/dashboard')
  }

  const doCancel = () => {
    nav('/dashboard');
  }


  return(
    <div className="form">
      <form onSubmit={doSubmit}>
        <h3>Energy Rates (in ₱): </h3>
        <div className="input-container">
          <label>kWh Cost: </label>
          <input 
            type="number" name="kwhcost" id = "kwhcost" 
            step = "0.00001"
            required 
            value = {accInfo.kwhCost} 
            onChange = {(e) => setAccInfo({
              ...accInfo,
              kwhCost: parseFloat(e.target.value)
            })}
          />
        </div>
        <h3>Cost thresholds (in ₱): </h3>
        <div className="input-container">
          <label>Low: </label>
          <input 
            type="number" name="thresh_low" id = "thresh_low" 
            required 
            step = ".01"
            value = {accInfo.thresh_low} 
            onChange = {(e) => setAccInfo({
              ...accInfo,
              thresh_low: parseFloat(e.target.value)
            })}
          />
          <label>High: </label>
          <input 
            type="number" name="thresh_high" id = "thresh_up" 
            required 
            step = ".01"
            value = {accInfo.thresh_high} 
            onChange = {(e) => setAccInfo({
              ...accInfo,
              thresh_high: parseFloat(e.target.value)
            })}
          />
        </div>
        <div className="button-bar">
          <div className="button-container">
            <input type="submit" name = "save" value = "Save Settings" onClick={doSubmit}/>
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
