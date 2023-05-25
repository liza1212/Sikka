import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

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



let member, memberCount;
const Payments = ({state,currentAccount}) => {

  const [payements, setPayements] = React.useState({});
  const [paymentModel, setpaymentModel] = useState(false)
  const [amount,setAmount] = useState(0)
  const [to,setto] =  useState("");
  const [from,setfrom] =  useState("");

  const paymentOpen= () =>  setpaymentModel(true);

  const modalClose = () => {
    setpaymentModel(false)
  };

  const getToPay = async(groupAddress)=>{
      const {contract} = state;
      try {
          member=memberList
          memberCount=memberList.length
          console.log("Member and member count: ",member, memberCount)
          let toPay={}
          for(let i = 0;i<memberCount;i++){
              const amount = await contract.methods.getTopay(currentAccount,member[i],groupAddress).call()
              toPay = {
                ...toPay,
                [groupAddress]: {
                  ...toPay[groupAddress],
                  [member[i]]: amount,
                },
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
  
  
    const splitwise = async(groupAddress)=>{
      const {contract} = state;
      try {
        await contract.methods.splitwise(groupAddress).send({from:currentAccount});
          console.log("This function has been called.")
      } catch (error) {
          console.log("Can't calculate balance split",error)
      }
    }

  const [groupMemberInfo, setgroupMemberInfo]= React.useState({groupAddress:[], groupName:[]})

  const getMemberedGroups= async(currentAccount)=>{
    const {contract}= state
    try{
      const result = await contract.methods.getMemberedGroups(currentAccount).call()
      setgroupMemberInfo({groupName: result[1], groupAddress: result[0]});
    }
    catch(error){
      console.log("Error: ", error)
    }
  }

  const [memberList, setmemberList]= React.useState([])
  
  const showMember = async(groupAddress)=>{
    const {contract} = state
    try {
        let GroupMember = await contract.methods.getMembers(groupAddress).call()
        //To get the list of group members except for the current member:

        GroupMember=GroupMember.filter((m)=>m!==currentAccount)
        setmemberList(GroupMember);
    } 
    catch (error) {
        console.log(`Cannot get group member of ${groupAddress}`,error)
    }
  }


  // const [payments, setpayments]=React.useState([])
  //find which group, find members of 
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handlePayment=()=>{
    console.log("IF only")
    setto("")
    setfrom("")
  }

  const memberInformation=(groupAddress)=>{
    showMember(groupAddress);
    getToPay(groupAddress) ;
    console.log("Here",payements);
    console.log("Group member list: ",memberList)
  }
  
  React.useEffect(()=>{
    getMemberedGroups(currentAccount);
  },[])


  const getPay = async(groupAddress,memberAddress)=>{
    const {contract} = state;
    console.log(state)
    try {
       let amount = await contract.methods.getTopay(currentAccount,memberAddress,groupAddress).call()
        // console.log("To pay has the valueS: ",toPay);
        return amount
    } catch (error) {
        console.log("Contract error",error)
    }
  }

//  React.useEffect(()=>{
//   memberInformation("0x0D0ba0FEe2F8938B6271eE5fDcD1D9D073a6750A")
//  },[])

    const handleChangeamount=(e)=>{
      setAmount(e.target.value);
    }

    const transferFund = async(amount)=>{

    }




  return (
    <div style={{marginLeft: 30, marginRight: 30}}>
        <div>
            <h2>Due</h2>
        </div>
        <Button onClick={()=>memberInformation("0x0D0ba0FEe2F8938B6271eE5fDcD1D9D073a6750A")}>GetPay</Button>

      {groupMemberInfo.groupName.map((group,index)=>(


      <Accordion expanded={expanded === group} onChange={handleChange(group)} onClick={()=>{memberInformation(groupMemberInfo.groupAddress[index])}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            {group}
          </Typography>
                    
        </AccordionSummary>
        <Button varaint="contained" onClick={()=>{splitwise(groupMemberInfo.groupAddress[index]);}}>Splitwise</Button>
        {memberList.map((member)=>(
        <AccordionDetails>
      <Card sx={{ display: 'flex' }}>
      <CardActionArea>
        <CardContent >
          <Typography gutterBottom component="div">
            {member}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Money
            { payements[group]!== undefined ? payements[group][member]:"----No----"}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={handlePayment}>
          Pay
        </Button>
      </CardActions>
    </Card>
        </AccordionDetails>  
        ))}
        <Button variant="contained" onClick={()=>{
          splitwise(groupMemberInfo.groupAddress[index]); 
          getToPay(groupMemberInfo.groupAddress[index])
          } }  ><h3>Calculate</h3></Button> 
        
      </Accordion>
      ))}  

      {!payements? 
      Object.entries(payements).map(([groupAddress, members]) => (
        <div key={groupAddress}>
          <h2>Group Address: {groupAddress}</h2>
          {Object.entries(members).map(([member, amount]) => (
            <div key={member}>
              <p>Member: {member}</p>
              <p>Amount: {amount}</p>
            </div>
          ))}
        </div>
      ))
      :<>Hello</>}


  
        <div style={{marginTop:80}}>
            <h2>Paid</h2>
        </div>
            <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            GroupName
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You owe (this person) (this amount of money).
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>


    <Modal 
          open={paymentOpen}
          onClose={modalClose}
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
              onChange={handleChangeamount}
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
            onClick={()=>{transferFund()}}
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


    </div>
  )

  
}

export default Payments