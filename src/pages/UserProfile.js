// import { AppBar } from '@mui/material'
import DashNavbar from '../components/DashNavBar'
import React from 'react'

const UserProfile = ({loadWeb3,currentAccount,setCurrentAccount,state, userLogged}) => {
  return (
    <div>
        <DashNavbar loadWeb3={loadWeb3} currentAccount={currentAccount} setCurrentAccount={setCurrentAccount} state={state} userLogged={userLogged}/>
        {/* <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
        <RecentTransactions/>
          
        </Box> */}


    </div>
  )
}

export default UserProfile