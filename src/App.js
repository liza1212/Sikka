import React,{useState,useEffect} from 'react';
import './App.css';
import Web3 from 'web3';
import UserProfile from './pages/UserProfile';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const loadWeb3 = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            const { web3 } = window;
            const accounts = await web3.eth.getAccounts();
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error)
        }
    }
    // Legacy dapp Browser...
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log("No metamask found")
    }
};

useEffect(() => {
    try{
        window.ethereum.on('accountsChanged', ()=>{loadWeb3()});
    }catch(error){
        console.log("No metamask found")
    }
}, []);

  
  return (
    <div>
        <UserProfile loadWeb3={loadWeb3} currentAccount={currentAccount} setCurrentAccount={setCurrentAccount}/>
    </div>
  );
}

export default App;
