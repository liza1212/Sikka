import React from 'react'
import DashNavbar from '../components/DashNavBar'

const AddGroups = ({loadWeb3, currentAccount, setCurrentAccount}) => {
  return (
    <div>
        <DashNavbar loadWeb3={loadWeb3} currentAccount={currentAccount} setCurrentAccount={setCurrentAccount}/>
    </div>
  )
}

export default AddGroups
