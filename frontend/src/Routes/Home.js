import React, { useContext } from 'react'
import { Navigate, Route, Routes as Switch } from 'react-router-dom'
import { UserContext } from '../App'
import Dashboard from '../Pages/Dashboard/Dashboard'
// import NavBar from '../Components/NavBar/NavBar'

const Home = () => {

    const { user } = useContext(UserContext)

    return (
        <div style={{ height: "100vh", width: "100vw", padding: 16}}>
            {/* <NavBar /> */}
            <Switch>
                <Route path="/dashboard" element={<Dashboard />} />s
                <Route path="/*"  element={<Navigate to="/dashboard" replace />} />
            </Switch>
        </div>
    )
}

export default Home