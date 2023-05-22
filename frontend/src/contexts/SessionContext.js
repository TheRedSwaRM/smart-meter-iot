import { createContext } from "react";

export const SessionContext = createContext({
    loading: true,
    loggedIn: false,
    userid: '',
    display: ''
})

export const SessionVerbs = createContext({
    login: (id, display) => {},
    logout: () => {}
})