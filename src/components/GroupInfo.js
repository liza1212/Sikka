import React from 'react'
import Box from '@mui/material/Box'
import GroupList from './GroupList'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

// const styleText={
//   display:'flex',
//   margin: 3,
// }


const GroupInfo = ({groupName}) => {
  const [open, setOpen] = React.useState(false);
const [expanded, setExpanded] = React.useState(false);

  const addExpense = () => setOpen(true);
  const modalClose = () => {
    setOpen(false)
  };

  const submitGroup=()=>{
    setOpen(false);
  };

  // const handleChange=(e)=>{
  //   console.log(e.target.value);
  // }
  const expenseData=[
    {"Apple":[
      {"2023-01-03":["Breakfast", "Lunch"]}, 
      {"2023-01-22":["Lunch", "Dinner"]},
      {"2023-01-25":["Breakfast", "Snacks"]},
      {"2023-01-26":["Dinner", "Dessert"]}]
    },
    {"Banana":[
      {"2020-01-03":["Breakfast", "Lunch"]}, 
      {"2020-01-22":["Lunch", "Dinner"]},
      {"2020-01-25":["Breakfast", "Snacks"]},
      {"2020-01-26":["Dinner", "Dessert"]}]
    },
  ]



  const handleChangePanel = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  var date,expenses, gName,groupExpenses;
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
        {expenseData.map((expense)=>(

           gName=Object.keys(expense)[0],
           groupExpenses=expense[gName], //[{"2023-01-03":["Breakfast", "Lunch"]},  {"2023-01-22":["Lunch", "Dinner"]},]
           console.log("Group Expenses",groupExpenses)
//             groupExpenses.map((singleExpense)=>(
//               date=Object.keys(singleExpense)[0],
//               expenses=groupExpenses[date],


// <Accordion 
//   expanded={expanded === 'panel1'} 
//   onChange={handleChangePanel('panel1')}>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel1bh-content"
//           id="panel1bh-header"
//         >
//           <Typography sx={{ width: '33%', flexShrink: 0 }}>
//             {date}
//           </Typography>
//           {/* <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography> */}
//           {expenses.map((expense)=>(
//           <Typography sx={{color: 'text.secondary'}}>
//             {expense },
//             {/* {expenses} */}
//           </Typography> 
//           ))}
//         </AccordionSummary>
//         <AccordionDetails>
//           {expenses.map((expense)=>(
//           <Typography>
//             {expense}
//             {/* {expenses} */}
//           </Typography> 
//           ))}
          
//         </AccordionDetails>
//       </Accordion>


//             ))
        ))}
        
        <Button variant="outlined" onClick={addExpense}>Add expense</Button>

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
          
       

          <Button 
            variant="outlined" 
            onClick={submitGroup}
            style={{
              cursor:'pointer',
              dispay:'felx',
              alignItems:'right'
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