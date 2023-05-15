import React from 'react'
import Box from '@mui/material/Box'
import GroupList from './GroupList'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
// import { groupLists } from './GroupList';
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
const groupLists=[
        "Apple","Banana", "Mangoes", "Oranges", "WaterMelon", "Papaya"
    ]

const Groups = ({}) => {
  const [groupNameValue, setgroupNameValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const createGroup = () => setOpen(true);
  const modalClose = () => {
    setOpen(false)
  };

  const submitGroup=()=>{
    setOpen(false);
    groupLists.push(groupNameValue)
    setgroupNameValue("")
  };

  const handleChange=(e)=>{
    console.log(e.target.value);
    setgroupNameValue(e.target.value);
  }


  //from here
  const [groupName, setgroupName] = React.useState("")
    const [openInfo, setopenInfo] = React.useState(false)
    const addMembersToGroup=(groupN)=>{
        console.log("from the function: ",groupName);
        setopenInfo(true);
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
        <GroupInfo groupName={groupName}></GroupInfo>

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
