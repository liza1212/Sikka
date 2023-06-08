import React from 'react'
import Notlogged from './Notlogged';
import Typography  from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
const Dashboard = ({loadWeb3,state, currentAccount, userLogged}) => {

  //using web3 to get info about the users account balance
  const {web3}= state;
  console.log("The user balance is:", web3)
  React.useEffect(() => {
    web3.eth.getBalance(currentAccount, (err, balance) => {
      if (err) {
        console.error(err);
      } else {
        setuserbalance(web3.utils.fromWei(balance, 'ether'));
      }
    });
  }, [web3, currentAccount]);
  

  //user profile informations:
  const [userBalance, setuserbalance]= React.useState(0)

  return (
       <Box sx={{
        margin:5,
        display: 'flex',
        flexDirection:'column',
        alignItems:'center'
       }}>
      <img src="/profile.png" style={{
        height:200,
        width: 200,
        margin:40,
      }} alt='profile' />
      <Paper variant="contained" sx={{
        padding: 10,
        display:'flex',
        flexDirection:'column',
        alignItems: 'center',
        backgroundColor:'#232323',
        color:'white'
      }}>
      <Typography variant='h5'>Account: {currentAccount}</Typography>
      <Typography>Balance: {userBalance}</Typography>
      </Paper>
      
    </Box>
  
    
   
  )
}

export default Dashboard