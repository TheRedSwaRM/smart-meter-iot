import logo from './logo.svg';
import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import { SessionContext, SessionVerbs } from './contexts/SessionContext';
import server from './utils/server';
import Modal from './components/modal';
import Form from './components/form';
import './App.css';
import { getCurrentDate } from './utils/date';
import './styles/utils.css'

function App() {
  const [sessionInfo, setSessionInfo] = useState({
    loading: true,
    loggedIn: false,
    userid: '',
    display: ''
  })
  const sessionVerb = {
    login: (userid, display) => {
      localStorage.setItem('userid', userid)
      localStorage.setItem('display', display)
      setSessionInfo(prev => ({
        ...prev,
        loggedIn: true,
        userid: userid,
        display: display
      }))
    },
    logout: () => {
      localStorage.removeItem('userid')
      localStorage.removeItem('display')
      setSessionInfo(prev => ({
        ...prev,
        loggedIn: false,
        userid: '',
        display: ''
      }))
    }
  }

  useEffect(() => {
    // try to get the user auth
    const userid = localStorage.getItem('userid')
    const display = localStorage.getItem('display')
    if (userid && display) {
      sessionVerb.login(userid, display)
    }
    setSessionInfo(prev => ({ ...prev, loading: false }))
  }, [])

  const handleSubmit = async (username, password) => {
    try {
      const res = await server.post('/user/login', {
        username: username,
        password: password
      })
      const id = res.data.id
      const display = res.data.username
      sessionVerb.login(id, display)
    } catch (err) {
      console.error(err)
      const msg = err.response.data || 'Something went wrong'
      alert(msg)
    }
  }

  return (
    <SessionVerbs.Provider value={sessionVerb}>
      <SessionContext.Provider value={sessionInfo}>
      {
        sessionInfo.loggedIn ?
        <>
          <h1 style = {{textAlign: 'center'}}>IoMeter</h1>
          <Modal>
            <h2 style = {{textAlign: 'center'}}>Welcome {sessionInfo.display}</h2>
            <p className='date'>{getCurrentDate()}</p>
            <button onClick={() => sessionVerb.logout()}>Logout</button>
          </Modal>
        </> :
        <>
          <h1 style = {{textAlign: 'center'}}>IoMeter</h1>
          <Modal>
            <h2 style = {{textAlign: 'center'}}> Welcome! </h2>
            <Form onSubmit={handleSubmit}>
            </Form>
            <p className='date'>{getCurrentDate()}</p>
          </Modal>
        </>
      }
      </SessionContext.Provider>
    </SessionVerbs.Provider>
  );
}

export default App;
