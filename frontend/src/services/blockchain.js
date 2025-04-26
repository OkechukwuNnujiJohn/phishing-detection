import Web3 from 'web3';
import contractABI from '../contracts/contractABI.json';
import { contractAddress } from '../contracts/contractAddress';

let web3;
let contract;
let userAccount = null; 

const autoSignIn = async () => {
  if (window.ethereum && !userAccount) {
    try {
      web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      userAccount = accounts[0];
      contract = new web3.eth.Contract(contractABI, contractAddress);

      localStorage.setItem("lastSignInTime", Date.now().toString());
      console.log("User signed in:", userAccount);
      return userAccount;
    } catch (error) {
      console.error("MetaMask sign-in error:", error);
      alert("Sign-in failed. Ensure MetaMask is connected.");
      return null;
    }
  }
  return userAccount;
};

const storeOnBlockchain = async (url, isPhishing) => {
  try {
    if (!userAccount) {
      const signedInUser = await autoSignIn();
      if (!signedInUser) {
        alert("Sign-in required to store on blockchain.");
        return;
      }
    }

    const accounts = await web3.eth.getAccounts();
    await contract.methods.storePhishingUrl(url, isPhishing).send({ from: accounts[0] });

    console.log("Stored on blockchain:", url, isPhishing);
    alert("Transaction successful! URL stored on the blockchain.");
  } catch (error) {
    console.error("Blockchain Error:", error);
    alert("Error storing URL on blockchain.");
  }
};

const getUserHistory = async () => {
  try {
    if (!userAccount) {
      const signedInUser = await autoSignIn();
      if (!signedInUser) {
        alert("Sign-in required to fetch blockchain history.");
        return [];
      }
    }

    const history = await contract.methods.getUserHistory().call({ from: userAccount });

    const formattedHistory = history.map(record => ({
      url: record.url,
      isPhishing: record.isPhishing
    }));

    console.log("Fetched user history:", formattedHistory);
    return formattedHistory;
  } catch (error) {
    console.error("Error fetching history from blockchain:", error);
    return [];
  }
};

export { storeOnBlockchain, getUserHistory };
