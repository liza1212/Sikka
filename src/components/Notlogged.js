import { WindowOutlined } from '@mui/icons-material'
import React from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Notlogged = (userLogged) => {
  const bull = (
  <Box
    component="span"
    sx={{ 
      display:'inline-block',
      mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
const style={
    minWidth: 275,  
    marginTop: 5,
    marginBottom: 5,
    marginRight: 15,
    marginLeft: 15,
    backgroundColor: "#232323"
}

  return (
    <div>
            <Card sx={style}>
      <CardContent>
        <Typography variant="h5" component="div" style={{color:"#fed70a"}}>
          {bull}CONNECT{bull}
        </Typography>
        <Typography variant="body2" style={{color:"white"}}>
          Making groups made easier.
          <br />
          </Typography>
      </CardContent>
      <CardActions>
      </CardActions>
    </Card>

        <Card sx={style}>
      <CardContent>
        {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography> */}
        <Typography variant="h5" component="div"style={{color:"#fed70a"}}>
          {bull}SPLIT{bull}
        </Typography>
        <Typography variant="body2" style={{color:"white"}}>
          Divide money between members to know how much your share is.
          <br />
          </Typography>
      </CardContent>
      <CardActions>
      </CardActions>
    </Card>

        <Card sx={style}>
      <CardContent sx={{
        // alignItems: "center",
        // alignContent: "center"
        // justifyContent: "center"
      }}>
        {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography> */}
        <Typography variant="h5" component="div" style={{color:"#fed70a"}}>
          {bull}PAY{bull}
        </Typography>
        <Typography variant="body2" style={{color:"white"}}>
          Easy transfer of fund between you and your friends.
          <br />
          </Typography>
      </CardContent>
      <CardActions>
      </CardActions>
    </Card>
    
    </div>
  )
}

export default Notlogged