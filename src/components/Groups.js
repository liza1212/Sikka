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

const Groups = ({loadWeb3,state,currentAccount}) => {
  const [groupLists, setgroupLists]=React.useState([]);
  const [groupNameValue, setgroupNameValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  

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


  const [groupName, setgroupName] = React.useState("")
  const [openInfo, setopenInfo] = React.useState(false)

//for the opening of  the next page i.e. groupInfo page

    // const addMembersToGroup=(groupN)=>{
    //     console.log("from the function: ",groupName);
    //     setopenInfo(true);
    // }

    const addGroup= async(name)=>{
      const {web3,contract} = state;
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
      const {web3,contract} = state;
      console.log(currentAccount)

      try {
          const result=await contract.methods.getMemberedGroups(currentAccount).call();
          const memberedGroupAddress= result[0];
          const memberedGroupName = result[1];
          console.log(memberedGroupAddress, memberedGroupName);
          setgroupLists(memberedGroupName);
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
  

  
    const splitwise = async(groupAddress)=>{
      const {contract} = state;
      try {
          await contract.methods.splitwise(groupAddress);
      } catch (error) {
          console.log("Can't calculate balance split",error)
      }
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
        {/* <GroupList/> */}
        <List component="nav"  style={{ display: !openInfo ? 'block' : 'none' }}>
            {groupLists.map((group)=>(
                <ListItemButton 
                onClick={()=>{setopenInfo(true) ;setgroupName(group)}}>
                {/* // <ListItemButton> */}
                {console.log("Group name is ",groupName)}
                <ListItemText>{group}</ListItemText>
            </ListItemButton>
            ))}
        <Button variant="outlined" onClick={createGroup}>Create a group</Button>

        </List>
        <GroupInfo groupName={groupName} state={state} currentAccount={currentAccount} openInfo={openInfo}></GroupInfo>

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

export default Groups
