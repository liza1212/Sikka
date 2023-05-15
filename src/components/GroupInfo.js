import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


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


const GroupInfo = ({groupName}) => {
  const [open, setOpen] = React.useState(false);
  const [expenseDescription, setexpenseDescription]= React.useState("");
  const [expenseContributor, setexpenseContributor]= React.useState("");
  const [expenseAmount, setexpenseAmount]= React.useState(0);

  const formatData=[
    {eName:"Breakfast",eAmount:20,eContributor:"Liza"},
    {eName:"Lunch", eAmount:30, eContributor:"Bishesh"},
    {eName:"Snacks", eAmount:40, eContributor:"Libu"}
  ]

  const addExpense = () => setOpen(true);
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
    const newExpense={
      eName:expenseDescription,
      eAmount: expenseAmount,
      eContributor: expenseContributor,
    }
    formatData.push(newExpense);
    console.log(formatData)
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



  

  return (
    <div>
      <Box 
        component="main"
        sx={{
          backgroudColor:(theme)=>
          theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <h1>{groupName}</h1>
<div>
   <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell align="right">Contributor Name</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {formatData.map((expense) => (
            <TableRow
              key={expense.name}
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


        <Button variant="outlined" onClick={addExpense}>Add expense</Button>
</div>
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
    </div>
  )
}

export default GroupInfo