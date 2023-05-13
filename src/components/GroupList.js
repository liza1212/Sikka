import { ListItemButton, ListItemText } from '@mui/material'
import List from '@mui/material/List'
import React from 'react'
import { useState } from 'react'
import GroupInfo from './GroupInfo'
const groupLists=[
        "Apple","Banana", "Mangoes", "Oranges", "WaterMelon", "Papaya"
    ]

const GroupList = () => {
    const [groupName, setgroupName] = useState("")
    const [open, setopen] = useState(false)
    const addMembersToGroup=(groupN)=>{
        console.log("from the function: ",groupName);
        setopen(true);
    }
  return (
    <div>
        <List component="nav"  style={{ display: !open ? 'block' : 'none' }}>
            {groupLists.map((group)=>(
                <ListItemButton 
                onClick={()=>{setopen(true) ;setgroupName(group)}}>
                {/* // <ListItemButton> */}
                {console.log("Group name is ",groupName)}
                <ListItemText>{group}</ListItemText>
            </ListItemButton>
            ))}
        </List>
        <GroupInfo groupName={groupName} open={open}></GroupInfo>
        

    </div>
  )
}


export default GroupList
export {groupLists}