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

  const fetchMemberedGroup = async(currentAccount)=>{
    const {web3,contract} = state;
    console.log(currentAccount)
    try {
        const [memberedGroupAddress,memberedGroupName]=await contract.methods.getMemberedGroups(currentAccount).call()
        return memberedGroupAddress,memberedGroupName
    } catch (error) {
        console.log("Cannot fetch membered group info",error)
    }
    
  }

  const createGroup= async(name)=>{
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

  const addExpense= async(groupAddress,expenseName,expensePrice,contributorAddress)=>{
        const {contract} = state;
        try {
            await contract.methods.addExpense(groupAddress,expenseName,expensePrice,contributorAddress).send({from:currentAccount})
            .once('receipt',async(receipt)=>{
            await(fetchExpenses(groupAddress))
            })
        }catch (error) {
            console.log("Expense cannot be added",error)
        }
  }

  const fetchExpenses = async(groupAddress)=>{
    const {contract} = state;
    try{
        const [gName,expenseCount] = await contract.methods.group(groupAddress).call();
        const groupExpense = []
        for(var i= 0 ;i<expenseCount;i++){
            const [name,amount,contributor] = await contract.methods.getExpense(groupAddress,i).call();
            groupExpense.push({eName:name,eAmount:amount,eContributor:contributor})
        }
    }catch(error){
        console.log(error)
    }
  }

  const splitwise = async(groupAddress)=>{
    const {contract} = state;
    try {
        await contract.methods.splitwise(groupAddress);
    } catch (error) {
        console.log("Can calculate balance split",error)
    }
  }

  const getToPay = async(groupAddress)=>{
    const {contract} = state;
    try {
        const [member,memberCount] = fetchGroupMember(groupAddress)
        const toPay = []
        for(let i = 0;i<memberCount;i++){
            const amount = await contract.methods.getToPay(currentAccount,member[i],groupAddress).call()
            toPay.push({group:groupAddress,to:member[i],amount:amount})
        }
    } catch (error) {
        console.log("Contract error",error)
    }
  }

  
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
