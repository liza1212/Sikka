import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



let member, memberCount;
const Payments = ({state,currentAccount}) => {
  const getToPay = async(groupAddress)=>{
      const {contract} = state;
      try {
          const result = fetchGroupMember(groupAddress)
          member=result[0]
          memberCount=result[1]
          const toPay = []
          for(let i = 0;i<memberCount;i++){
              const amount = await contract.methods.getToPay(currentAccount,member[i],groupAddress).call()
              toPay.push({group:groupAddress,to:member[i],amount:amount})
          }
      } catch (error) {
          console.log("Contract error",error)
      }
    }
   

  const fetchGroupMember = async(groupAddress)=>{
      const {contract} = state
      try {
          const GroupMember = await contract.methods.getMemberes(currentAccount).call()
          return GroupMember,GroupMember.length
      } catch (error) {
          console.log(`Cannot get group member of ${groupAddress}`,error)
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
        const GroupMember = await contract.methods.getMembers(currentAccount).call()
        setmemberList(GroupMember);
    } 
    catch (error) {
        console.log(`Cannot get group member of ${groupAddress}`,error)
    }
  }


  const [payments, setpayments]=React.useState([])
  //find which group, find members of 
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handlePayment=()=>{
    console.log("IF only")
  }

  const memberInformation=(member)=>{
    let index=groupMemberInfo.groupName.indexOf(member);
    console.log("Index of group member",member," is: ",index)
    showMember(groupMemberInfo.groupAddress[index])
    console.log(memberList)
  }
  React.useEffect(()=>{
    getMemberedGroups(currentAccount);
  })

  // let index
     {/* { 
          index= groupMemberInfo.groupName.findIndex(member),
          showMember(groupMemberInfo.groupAddress[index])
          } */}
  return (
    <div style={{marginLeft: 30, marginRight: 30}}>
        <div>
            <h2>Due</h2>
        </div>

      {groupMemberInfo.groupName.map((member)=>(

      <Accordion expanded={expanded === member} onChange={handleChange(member)} onClick={()=>memberInformation(member)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            {member}
          </Typography>
                    
        </AccordionSummary>
        <AccordionDetails>
              <Card sx={{ display: 'flex' }}>
      <CardActionArea>
        <CardContent >
          <Typography gutterBottom variant="h5" component="div">
            Member name
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Money
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
      </Accordion>
      ))}


  
        {/* <div style={{marginTop:80}}>
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
    </Card> */}
    </div>
  )

  
}

export default Payments