import React from 'react'
import Notlogged from './Notlogged';
const Dashboard = ({loadWeb3,state, currentAccount, userLogged}) => {

  //using web3 to get info about the users account balance
  const {web3}= state;
  console.log("The user balance is:", web3)
  // web3.eth.getBalance(currentAccount, (err, balance)=>{
  //   if(err){
  //     console.error(err);
  //   }
  //   else{
  //     // console.log(web3.utils.fromWei(balance, 'ether'))
  //     setuserbalance(web3.utils.fromWei(balance, 'ether'))
  //   }
  // })

  //user profile informations:
  const [userBalance, setuserbalance]= React.useState(0)

  return (
       <div sx={{
      display: userLogged?'block':'none'
      }}>
      <img src="/profile.png" style={{
        height:200,
        width: 200,
        margin:40,
        
      }}/>

      <h1>{userBalance}</h1>
    </div>
  
    
   
  )
}

export default Dashboard