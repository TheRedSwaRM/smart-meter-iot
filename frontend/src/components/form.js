import React, {useState} from 'react';
import '../styles/form.css';

const Form = () => {
  const [uname, setUname] = useState(); 
  const [password, setPassword] = useState(); 
  
  const [dataInput, setDataInput] = useState();

  
  const doSubmit = () => {
    const login = {uname:uname, password:password}
    setDataInput([login]);
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
        <div className="button-container">
          <input type="submit" value = "Log In"/>
        </div>
      </form>
    </div>
  );
}

export default Form;
