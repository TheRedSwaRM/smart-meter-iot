import React, {useState} from 'react';
import '../styles/form.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Navigate from '../utils/navutils'

const Form = (props) => {
  const nav = useNavigate();
  const [uname, setUname] = useState(); 
  const [password, setPassword] = useState(); 
  
  const [dataInput, setDataInput] = useState();

  const navigateToSignUpForm = () => {
    nav('/signup');
  }
  const doSubmit = (e) => {
    e.preventDefault()
    const login = {uname:uname, password:password}
    setDataInput([login])
    if (props.onSubmit) {
      props.onSubmit(uname, password)
    }
  }

  return(
    <div className="form">
      <form onSubmit={doSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input 
            type="text" 
            name="uname" 
            id = "uname"
            required 
            value = {uname} 
            onChange = {(e) => setUname(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label>Password </label>
          <input 
            type="password" 
            name="password"
            id = "password" 
            required 
            value = {password} 
            onChange = {(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="button-bar">
          <div className="button-container">
            <input type="submit" name = "login" value = "Log In"/>
          </div>
          <div className="button-container">
            <input type= "button" name = "signup" value = "Sign Up"onClick={navigateToSignUpForm}/>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Form;
