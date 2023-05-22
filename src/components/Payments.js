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

  const [payments, setpayments] = React.useState([]);

  const getToPay = async(groupAddress)=>{
      const {contract} = state;
      try {

          member=memberList
          memberCount=memberList.length
          console.log("Member and member count: ",member, memberCount)
          const toPay = []
          for(let i = 0;i<memberCount;i++){
              const amount = await contract.methods.getTopay(currentAccount,member[i],groupAddress).call()
              toPay.push({group:groupAddress,to:member[i],amount:amount})
          }
          setpayments(toPay);
          console.log("Payments after calling the splitwise: ",payments);
          // console.log("To pay has the valueS: ",toPay);

      } catch (error) {
          console.log("Contract error",error)
      }
    }
  
  
    const splitwise = async(groupAddress)=>{
      const {contract} = state;
      try {
          await contract.methods.splitwise(groupAddress).send({from:currentAccount})
          .once('member', async(member)=>{
            await (getToPay(groupAddress))
          })
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
  }

  const memberInformation=(groupAddress)=>{
    showMember(groupAddress);
    getToPay(groupAddress) ;
    console.log("Here",payments);
    console.log("Group member list: ",memberList)
  }

  const newFunction=(groupAddress)=>{
    console.log("New function");
    splitwise(groupAddress);
  }

  React.useEffect(()=>{
    getMemberedGroups(currentAccount);
  
    // getToPay();
  },[payments])

  return (
    <div style={{marginLeft: 30, marginRight: 30}}>
        <div>
            <h2>Due</h2>
        </div>

      {groupMemberInfo.groupName.map((group,index)=>(

      <Accordion expanded={expanded === group} onChange={handleChange(group)} onClick={()=>{memberInformation(groupMemberInfo.groupAddress[index]); }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            {group}
          </Typography>
                    
        </AccordionSummary>

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
    </div>
  )

  
}

export default Payments