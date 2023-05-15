import React,{useState,useEffect} from 'react';
import './App.css';
import Web3 from 'web3';
import Sikka from './contracts/Sikka.json'
import UserProfile from './pages/UserProfile';
import { Button } from '@mui/material';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [state, setState] = useState({web3:null,contract:null});
  const [groupName, setGroupName] = React.useState('');


  async function loadWeb3(){
    let provider;
    // Is there an injected web3 instance?
    if (typeof Web3 !== "undefined") {
        // provider = Web3.currentProvider;
        // App.networkId = Web3.currentProvider.networkVersion;
        if (window.ethereum) {
            provider = window.ethereum
            // console.log("Modern dapp")
            await window.ethereum.request({method:"eth_requestAccounts"})
        }
        // Legacy dapp Browser...
        else if (window.web3) {
            provider = window.web3.currentProvider
            // console.log("Legacy Dapp")
        }
            // window.web3 = new Web3(window.web3.currentProvider);
        } else {
        // If no injected web3 instance is detected, fall back to Ganache
        // Only useful in a development environment
        provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
        );
        // console.log("Gnache")
        }   
        
        const web3 = new Web3(provider);

        const account = await web3.eth.getAccounts();
        // console.log("Account",account)
        setCurrentAccount(account[0]);
        console.log(currentAccount)

        const networkId = await web3.eth.net.getId();
        console.log(web3)
        // console.log(networkId)
        const deployedNetwork = Sikka.networks[networkId];
        console.log(deployedNetwork.address)
        const contract = new web3.eth.Contract(Sikka.abi,deployedNetwork.address);
        console.log(contract)// new instance 
        setState({web3:web3,contract:contract})
        
    }

    function handleAccountsChanged(accounts) {
        // Handle account changes
        if (accounts.length > 0) {
          // New account is connected
          const newAccount = accounts[0];
          console.log('New account connected:', newAccount);
          loadWeb3()
          // Perform necessary actions with the new account
        } else {
          // No account is connected
          console.log('No account connected');
          // Perform necessary actions when no account is connected
        }
      }

  
  useEffect(()=>{
    // loadWeb3()
    window.ethereum.on('accountsChanged', handleAccountsChanged);
      
  },[currentAccount])

  

  

  

  
  return (
    <div>
        <UserProfile loadWeb3={loadWeb3} currentAccount={currentAccount} setCurrentAccount={setCurrentAccount} state={state}/>
        {/* <button onClick={loadWeb3}>Login</button>
        <form>
            <input value={groupName} onChange={(e) => setGroupName(e.target.value)} />

            <button onClick={(e) => {e.preventDefault();createGroup(groupName);}}>Create group</button>
        </form>
        <button onClick={() => fetchMemberedGroup(currentAccount)}>get</button> */}
    </div>
  );
}

export default App;
