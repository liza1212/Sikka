import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText'
import GroupInfo from './GroupInfo';
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

const Groups = ({loadWeb3,state,currentAccount,openInfo,setopenInfo}) => {
  
  const [groupNameValue, setgroupNameValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [disableButton,setdisableButton] = React.useState(false);

  React.useEffect(()=>{

    // loadWeb3();
    fetchMemberedGroup(currentAccount);
  },[currentAccount])
  
  const createGroup = () => setOpen(true);
  const modalClose = () => {
    setOpen(false)
  };

  const submitGroup=(e)=>{
    e.preventDefault();
    setOpen(false);
    setgroupNameValue("")
    addGroup(groupNameValue);
  };

  const handleChange=(e)=>{
    console.log(e.target.value);
    setgroupNameValue(e.target.value);
  }

  // const [groupAddress, setgroupAddress]= React.useState("")
  // const [groupName, setgroupName] = React.useState("")
  const [memberedGroupInfo,setmemberedGroupInfo]= React.useState({groupAddress:[],groupName:[]})
  const [currentGroup,setcurrentGroup] = React.useState("")
  const [currentGroupName,setcurrentGroupName] = React.useState("");
  

    const addGroup= async(name)=>{
      const {contract} = state;
      console.log(contract)
      console.log(name)

      try{
          await contract.methods.createGroup(name).send({from:currentAccount})
          .once('receipt',async(receipt)=>{
          await(fetchMemberedGroup(currentAccount))
          
      })
      }catch(error){
          if (error.message) {
              console.log('Contract error:', error.message);
            }
      }
    }

    const fetchMemberedGroup = async(currentAccount)=>{
      const {contract} = state;
      console.log(currentAccount)

      try {
          // console.log("Hhhhhhhhhhhhhheki")
          const result=await contract.methods.getMemberedGroups(currentAccount).call();
          // console.log(await contract.methods.getMemberedGroups(currentAccount).call())
          const memberedGroupAddress= result[0];
          const memberedGroupName = result[1];
          console.log(memberedGroupAddress, memberedGroupName);
          if(memberedGroupAddress.includes(currentAccount)){
            setdisableButton(true)
          }
          setmemberedGroupInfo({groupAddress:memberedGroupAddress,groupName:memberedGroupName});
          // return memberedGroupAddress,memberedGroupName
      } catch (error) {
          console.log("Cannot fetch membered group info",error)
      } 
    }
    
    const addMember= async(groupAddress,memberAddress)=>{
      const {contract} = state;
      try{
          await contract.methods.addMember(groupAddress,memberAddress).send({from:currentAccount})
          .once('receipt',async(receipt)=>{
          await(fetchGroupMember(groupAddress))
          
      })
      }catch(error){
          if (error.message) {
              console.log('Cannot add member', error.message);
            }
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

    console.log("The state in groups is: ",state)
    console.log("The value of web3 in gruops is : ", state.web3)

  
  return (
    <div style={{
      margin:30,
    }}>
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
        {/* <Typography variant='h4'>Grouplist</Typography> */}
        {/* <GroupList/> */}
        <List component="nav"  style={{ 
          display: !openInfo ? 'block' : 'none' ,
          }}>
            {memberedGroupInfo.groupName.map((group, index) => (
              <Paper>
                <ListItemButton 
                  key={index}
                  style={{
                    color:'white',
                    backgroundColor:'#232323'
                  }}
                  onClick={() => {
                    setopenInfo(true);
                    setcurrentGroup(memberedGroupInfo.groupAddress[index]);
                    setcurrentGroupName(group)
                  
                  }}
                >
                  <Typography  variant='h6'>{group}</Typography>
                </ListItemButton>
                </Paper>
              ))}
              <Box sx={{
                display:'flex',
                justifyContent:'flex-end'
              }}>
        <Button variant="contained"  onClick={createGroup} disabled={disableButton} sx={{
          alignSelf: 'flex-end',
          margin: '8px',
          fontSize: '1rem',
          color:'#fed70a',
          backgroundColor:'#232323',
          "&.Mui-disabled": {
            background: "#eaeaea",
            color: "#c0c0c0"
          }
        }}>Create a group</Button>
</Box>
        </List>
        {openInfo &&<GroupInfo groupName={currentGroupName} state={state} currentAccount={currentAccount} openInfo={openInfo} currentGroup={currentGroup}/>}

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
            Cheers to memories together!
          </Typography>
            <TextField
              sx={styleText}
              required
              value={groupNameValue}
              onChange={handleChange}
              id="standard-search"
              label="Group name"
            />
          <Button 
            variant="outlined" 
            onClick={submitGroup}
            style={{
              cursor:'pointer',
              dispay:'felx',
              alignItems:'right',
              color:'#fed70a',
              backgroundColor:'#232323'
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

export default Groups


