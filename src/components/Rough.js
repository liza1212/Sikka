
import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
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

const drawerWidth = 240;

const GroupInfo = ({groupAddress, groupName, state, currentAccount,openInfo}) => {
  const [open, setOpen] = React.useState(false);
  const [expenseDescription, setexpenseDescription]= React.useState("");
  const [expenseContributor, setexpenseContributor]= React.useState("");
  const [expenseAmount, setexpenseAmount]= React.useState(0);
  const [groupExpense, setgroupExpense]= React.useState([]);
  const [groupMembersList, setgroupMembersList]= React.useState([]);

  // const formatData=[
  //   {eName:"Breakfast",eAmount:20,eContributor:"Liza"},
  //   {eName:"Lunch", eAmount:30, eContributor:"Bishesh"},
  //   {eName:"Snacks", eAmount:40, eContributor:"Libu"}
  // ]

  React.useEffect(()=>{
    fetchExpenses(currentAccount);
  })

  const addExpenseOpen = () => setOpen(true);

  const modalClose = () => {
    setOpen(false)
  };

  const submitGroup=()=>{
    setOpen(false);
    console.log("Contributor ",expenseContributor);
    console.log("Amount ",expenseAmount);
    setexpenseAmount(0);
    setexpenseContributor("");
    setexpenseDescription("")
    // const newExpense={
    //   eName:expenseDescription,
    //   eAmount: expenseAmount,
    //   eContributor: expenseContributor,
    // }
    addExpense(currentAccount, expenseDescription, expenseAmount, expenseContributor);
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
  
  // var groupExpense = [];

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

  const fetchGroupMember = async(groupAddress)=>{
    const {contract} = state
    try {
        const GroupMember = await contract.methods.getMembers(currentAccount).call()
        setgroupMembersList(GroupMember)
        // return GroupMember,GroupMember.length
    } catch (error) {
        console.log(`Cannot get group member of ${groupAddress}`,error)
    }
  
  }


  React.useEffect(()=>{
    fetchGroupMember(groupAddress)
  })

  return (
    <Box component="main" sx={{ flexGrow: 1, overflow: 'auto',display:openInfo?'block':'none',}}>
      <Box sx={{ display: 'flex',padding:4, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3">{groupName}</Typography>
        <Button variant="contained" paddingBottom = {1}><h2>Add expense</h2></Button> 
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

        <Box component={Paper} sx={{ width: '20%',display: 'flex', flexDirection: 'column', justifyContent: 'center',paddingTop:0 }}>
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
                <ListItemText primary={`${member.slice(0, 5)}${'.'.repeat(3)}${member.slice(-4)}`} />
              </ListItem>
            ))}
          </List>
          <Button variant="outlined" style={{ alignSelf: 'center' }}>
            Add member
          </Button>
        </Box>
      </Box>
      {/* //Model for Add Expense */}
      <Modal 
          open={open}
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
    </Box>
  );
}

export default GroupInfo