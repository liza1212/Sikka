import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {CardActionArea, CardActions } from '@mui/material';
// import { ethToWei } from '../utils/Convert.js';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const styleText={
  display:'flex',
  margin: 3,
}


const GroupInfo = ({currentGroup, groupName, state, currentAccount,openInfo}) => {
  //Group Info
  const [groupExpense, setgroupExpense]= React.useState([]);
  const [groupMembersList, setgroupMembersList]= React.useState([]);

  //Add expense
  const [expenseOpen, setExpenseOpen] = React.useState(false);
  const [expenseDescription, setexpenseDescription]= React.useState("");
  const [expenseContributor, setexpenseContributor]= React.useState("");
  const [expenseAmount, setexpenseAmount]= React.useState(0);

   //Add new member:
   const [openMemInfo, setopenMemInfo]= React.useState(false);
   const [newMember, setnewMember]=React.useState("");

   const [paymentModel, setpaymentModel] = React.useState(false)
  const [amount,setAmount] = React.useState(0)
  const [to,setto] =  React.useState("");
  const [from,setfrom] = React.useState("");

  const paymentOpen= () =>  setpaymentModel(true);
  const addExpenseOpen = () => setExpenseOpen(true);
  const addMemberOpen= () =>  setopenMemInfo(true);
  const payementClose =()=> setpaymentModel(false);

  const modalClose = () => {
    setExpenseOpen(false)
    setopenMemInfo(false)
    // setpaymentModel(false)
  };

  const submitGroup=()=>{
    setExpenseOpen(false);
    console.log("Contributor ",expenseContributor);
    console.log("Amount ",expenseAmount);
    console.log("Herher",currentGroup)
    setexpenseAmount(0);
    setexpenseContributor("");
    setexpenseDescription("")
    // const newExpense={
    //   eName:expenseDescription,
    //   eAmount: expenseAmount,
    //   eContributor: expenseContributor,
    // }
    addExpense(currentGroup, expenseDescription, expenseAmount, expenseContributor);
    // formatData.push(newExpense);
    console.log("Group Expense after new expense has been added: ", groupExpense)
  };

  const handleChangeDescription=(e)=>{
    setexpenseDescription(e.target.value);
  }

  const handleChangeContributor=(e)=>{
    setexpenseContributor(e.target.value);
  }

  const handleChangeAmount=(e)=>{
    setexpenseAmount(e.target.value);
  }

  const handleChangeNewMember=(e)=>{
    setnewMember(e.target.value);
  }

  const submitMember=()=>{
    setopenMemInfo(false)
    // console.log( newMember,groupAddress)
    setnewMember("")
    addMembers(currentGroup,newMember)
    console.log("User added: ", newMember)
  }

  const addMembers=async(groupAddress, newMember)=>{
    const {contract}=state;
    console.log(state)
    try{
      await contract.methods.addMembers(groupAddress, newMember).send({from:currentAccount})
      .once('receipt',async(receipt)=>{
        await (fetchGroupMember(groupAddress))
      })

    } catch(error){
      console.log("Error: ", error)
    }
  }


  //To return the list of expenses
  const fetchExpenses = async(groupAddress)=>{
    const {contract} = state;
    try{
      // console.log(await contract.methods.groups(groupAddress).call())
      const result = await contract.methods.groups(groupAddress).call();
      const gName=result[0];
      const expenseCount=result[1];
      var temporary=[];
      var name, amount, contributor;
      for(var i= 0 ;i<expenseCount;i++){
          const result = await contract.methods.getExpense(groupAddress,i).call();
          name=result[0];
          amount=result[1];
          contributor=result[2];
          // setgroupExpense()
          temporary.push({eName:name,eAmount:amount,eContributor:contributor})
        }
        // console.log(temporary)
      setgroupExpense(temporary);
    }catch(error){
        console.log(error)
    }
  }
  
  //function to add a new expense
  const addExpense= async(groupAddress,expenseName,expensePrice,contributorAddress)=>{
    const {contract} = state;
    try {
        await contract.methods.addExpense(groupAddress,expenseName,expensePrice,contributorAddress).send({from:currentAccount})
        .once('receipt',async(receipt)=>{
        await(fetchExpenses(groupAddress))
        })
    }catch (error) {
        console.log("Expense cannot be added",error)
    }
  }

  //To return the list of members in a group
  const fetchGroupMember = async(groupAddress)=>{
    const {contract} = state
    try {
        const GroupMember = await contract.methods.getMembers(groupAddress).call()
        setgroupMembersList(GroupMember)
        // return GroupMember,GroupMember.length
    } catch (error) {
        console.log(`Cannot get group member of ${groupAddress}`,error)
    }
  }


  React.useEffect(()=>{
    fetchGroupMember(currentGroup)
    fetchExpenses(currentGroup);
  },[])


  //FOr Tab
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    getToPay( )
    setSelectedTab(newValue);
  };

  //for payements
  const [payements, setPayements] = React.useState({});

  const getToPay = async()=>{
      const {contract} = state;
      try {
          console.log("Member and member count: ",groupMembersList,groupMembersList.length)
          let toPay={}
          for(let i = 0;i<groupMembersList.length;i++){
              const amount = await contract.methods.getTopay(currentAccount,groupMembersList[i],currentGroup).call()
              toPay = {
                  ...toPay,
                  [groupMembersList[i]]: amount,
              };
            }
            setPayements(toPay);
            console.log(payements)
          }
          // console.log("To pay has the valueS: ",toPay);

       catch (error) {
          console.log("Contract error",error)
      }
    }
  
  
    const splitwise = async()=>{
      const {contract} = state;
      try {
        await contract.methods.splitwise(currentGroup).send({from:currentAccount});
          console.log("This function has been called.")
      } catch (error) {
          console.log("Can't calculate balance split",error)
      }
    }

    const handlePayment=(member)=>{
      console.log("IF only")
      setto(member)
      setfrom(currentAccount)
      setpaymentModel(true)
    }

    const handleChangeamount=(e)=>{
      setAmount(e.target.value);
    }

    //function to convert the eth value o wei
    const ethToWei = (amt)=>{
      const {web3} = state;
      console.log("Inside the ethtowei function");
      return web3.utils.toWei(amt, 'Ether');
      
    }

    const weiToEth = (amt)=>{
      const {web3} = state;
      console.log("Inside the ethtowei function");
      return web3.utils.fromWei(amt, 'Ether');
      
    }

    const transferFund = async(amount)=>{
      const {contract} = state;
      try{
        let temporary= weiToEth(amount);
        console.log(" Trying the transfer fund  ", amount)
        console.log("temporary value of temporary ", temporary)
        try {
          await contract.methods.transfer(to,currentGroup).send({from:currentAccount,value:amount});
            console.log("Pay successful")
        } catch (error) {
            console.log("Error to pay",error)
        }
      }catch(error){
        console.log(error)
      }

    }
  
  return (
    <div>
      <Tabs value={selectedTab} onChange={handleChange}>
        <Tab label="Group Info" />
        <Tab label="Split/T" />
      </Tabs>
      {selectedTab === 0 && 
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto',display:openInfo?'block':'none',}}>
      <Box sx={{ display: 'flex',padding:2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3">{groupName}</Typography>
        <Button variant="contained" style={{backgroundColor:"#687664"}} onClick={()=>{splitwise()}}>Spilt/T</Button> 
        <Button variant="contained" style={{backgroundColor:"#687664"}} onClick={addExpenseOpen}><h3>Add expense</h3></Button> 
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Contributor Name</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupExpense.map((expense, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {expense.eName}
                    </TableCell>
                    <TableCell align="right">{expense.eContributor}</TableCell>
                    <TableCell align="right">{expense.eAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
        </Box>

        <Box component={Paper} sx={{ width: '20%',display: 'flex', flexDirection: 'column', justifyContent: 'center',padding:2 }}>
          <Typography variant="h5" align="center" paddingBottom={3}>
            Members
          </Typography>
          <Divider/>
          <List>
            {groupMembersList.map((member, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText primary={`${member.slice(0, 5)}${'.'.repeat(9)}${member.slice(-4)}`} />
              </ListItem>
            ))}
          </List>
          <Button variant="outlined" onClick={addMemberOpen} style={{ alignSelf: 'center', color:'green', borderColor:'green' }}>
            Add member
          </Button>
        </Box>
      </Box>
      {/* //Model for Add Expense */}
      <Modal 
          open={expenseOpen}
          onClose={modalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
        <Box 
          sx={style} 
          component="form" 
          autocomplete="off">
          <Typography id="modal-modal-title" variant="h6" component="h2" alignContent= "center">
            People don't take trips, trips take people,
          </Typography>
          
          <TextField
              sx={styleText}
              required
              value={expenseDescription}
              onChange={handleChangeDescription}
              id="standard-search"
              label="Expense Descrition"
            />

            <TextField
              sx={styleText}
              required
              value={expenseContributor}
              onChange={handleChangeContributor}
              id="standard-search"
              label="Contributor"
            />

            <TextField
              sx={styleText}
              required
              value={expenseAmount}
              onChange={handleChangeAmount}
              id="standard-search"
              label="Amount"
            />
       
          <Button 
            variant="outlined" 
            onClick={submitGroup}
            style={{
              cursor:'pointer',
              dispay:'flex',
              alignItems:'right',
              align: 'right'
            }}
          >
              Submit
          </Button>
        </Box> 
      </Modal>

      <Modal
        open={openMemInfo}
        onClose={modalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} 
          component="form" 
          autocomplete="off">
        <Typography id="modal-modal-title" variant="h6" component="h2" alignContent= "center">
            Let's meet new people and make connections...
          </Typography>
        <TextField
              sx={styleText}
              required
              value={newMember}
              onChange={handleChangeNewMember}
              id="standard-search"
              label="New Member"
            />
       
          <Button 
            variant="outlined" 
            onClick={submitMember}
            style={{
              cursor:'pointer',
              dispay:'flex',
              alignItems:'right',
              align: 'right'
            }}>
              Submit
          </Button>
        </Box>
      </Modal>
    </Box>
        }
      {selectedTab === 1 &&
        <Box sx={{padding:2, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h4'> Due Remaining</Typography>
          {groupMembersList.map((member,index)=>(
            <Box sx={{padding:1}}>
              <Card sx={{ display: 'flex'}}>
                <CardActionArea>
                  <CardContent >
                    <Typography gutterBottom component="div">
                      {member}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      { payements!== undefined ? payements[member]+" WEI"  :"------------"}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                {/* <CardActions> */}
                  <Button size="small" color="primary" onClick={()=>{setpaymentModel(true); handlePayment(member);setAmount(payements[member])}}>
                    Pay
                  </Button>
                {/* </CardActions> */}
              </Card>
            </Box>
            
          ))}
          <Modal 
          open={paymentModel}
          onClose={payementClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >
            <Box 
              sx={style} 
              component="form" 
              autocomplete="off">
              <Typography id="modal-modal-title" variant="h6" component="h2" alignContent= "center">
                Pay bills
              </Typography>
              
              <TextField
                  sx={styleText}
                  required
                  value={amount}
                  // onChange={handleChangeamount}
                  id="standard-search"
                  label="Amount"
                />

                <TextField
                  sx={styleText}
                  required
                  value={from}
                  // onChange={handleChangeContributor}
                  id="standard-search"
                  label="From"
                />

                <TextField
                  sx={styleText}
                  required
                  value={to}
                  // onChange={handleChangeAmount}
                  id="standard-search"
                  label="To"
                />
          
              <Button 
                variant="outlined" 
                onClick={()=>{transferFund(amount)}}
                style={{
                  cursor:'pointer',
                  dispay:'flex',
                  alignItems:'right',
                  align: 'right'
                }}
              >
                  Transfer Fund
              </Button>
            </Box> 
          </Modal>
        </Box>}
    </div>
    
    
  );
}

export default GroupInfo