import { useEffect, useState } from 'react'
import server from '../utils/server'

// use this hook to get the data from the server
function useData(id) {
    const [state, setState] = useState({ loadingUser: true, loadingExpenses: true })
    const [userInputs, setUserInputs] = useState({ low: 0, high: 0, cost: 0 })
    const [expenses, setExpenses] = useState([])

    useEffect(() => {
        const getUserInputs = async () => {
            const res = await server.get(`/api/user_input/${id}`)
            const low = res.data.thresh_low
            const high = res.data.thresh_up
            const cost = res.data.cost_per_kwh
            setUserInputs({ low, high, cost }) 
        }
        const getExpenses = async () => {
            const res = await server.get(`/user/data?id=${id}`)
            setExpenses(res.data)
        }
        getUserInputs().then(() => setState(prev => ({ ...prev, loadingUser: false })))
        getExpenses().then(() => setState(prev => ({ ...prev, loadingExpenses: false })))
    }, [id])

    return {
        loading: state.loadingUser || state.loadingExpenses,
        userInputs,
        expenses
    }
}

export default useData