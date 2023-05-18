import * as React from 'react';
// import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled,createTheme, ThemeProvider } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import Dashboard from './Dashboard';
import Friends from './Friends';
import Reports from './Reports';
import Groups from './Groups';
import Payments from './Payments';
import GroupInfo from './GroupInfo';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const drawerWidth = 240;
const mdTheme = createTheme();

const DashNavbar=({loadWeb3,currentAccount,setCurrentAccount,state})=>{
    const [menuItem,setMenuItem] = React.useState("Dashboard");
    const [LoggedIn,setLoggedIn] = React.useState(false)
    const [open, setopen] = React.useState(true);
    const toggleDrawer=()=>{
        setopen(!open)
    }
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };
    
    const logoutWallet = ()=>{
      setCurrentAccount(null) 
      handleClose()
    }

  const popOpen = Boolean(anchorEl);

    return (
  <ThemeProvider theme={mdTheme}>
        {/* <Box sx={{ flexGrow: 1 }}> */}
        <Box sx={{ display: 'flex' }}>

      <AppBar position="absolute" open={open}>
        <Toolbar sx={{
          pr:'24px',
        }}>
          <IconButton
            // size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ 
              marginRight: '36px',
              ...(open && {display:'none'}),
             }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SIKKA
          </Typography>
          
          {currentAccount ? (
          <div>
            <Button  aria-describedby={popOpen ? 'logout-popover' : undefined}  variant="contained" color="success" onClick={handleClick}>{currentAccount}</Button>
                <Popover
                  id="logout-popover"
                  open={popOpen}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  <Button variant ="outlined" onClick={logoutWallet}>Logout</Button>
                </Popover>
          </div>   
            ) : (
                  <Button variant='contained' onClick={loadWeb3}>Login</Button>
            )}
        </Toolbar>
      </AppBar>
      {/* <Box> */}
      <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItemButton onClick={()=>setMenuItem("Dashboard")}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton onClick={()=>setMenuItem("Groups")}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Groups" />
          </ListItemButton>
          <ListItemButton onClick={()=>setMenuItem("Friends")}>
            <ListItemIcon>
              <GroupAddIcon />
            </ListItemIcon>
            <ListItemText primary="Friends" />
          </ListItemButton>
          <ListItemButton onClick={()=>setMenuItem("Reports")}>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItemButton>
          </List>
        </Drawer>
        {/* </Box> */}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
        {menuItem === "Dashboard" && <Dashboard/>}  
        {menuItem === "Groups" && <Groups loadWeb3={loadWeb3} state={state} currentAccount={currentAccount}/> }
        {menuItem === "Friends" && <Friends/>}  
        {menuItem === "Reports" && <Reports/>}  
        {menuItem === "Payments" && <Payments state={state} currentAccount={currentAccount}/>}

        </Box>
    </Box>
    </ThemeProvider>
    )
}

export default DashNavbar
