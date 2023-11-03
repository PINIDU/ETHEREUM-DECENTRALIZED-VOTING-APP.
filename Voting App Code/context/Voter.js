import React , {useState , useEffect} from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient} from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";

import { VotingAddress , VotingAddressABI } from "./constants";

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const fetchContract = (signerOrProvider) => 
    new ethers.Contract(VotingAddress , VotingAddressABI , signerOrProvider);

    export const VotingContext = React.createContext();

    export const VotingProvider = ({children}) => {
        const votingTitle = 'My First Project';
        const router = useRouter();
        const [currentAccount , setCurrentAccount] = useState('');
        const [candidateLength , setCandidateLength] = useState('');
        const pushCandidate = [];
        const candidateIndex = [];
        const [candidateArray , setCandidateArray] = useState(pushCandidate);

        //------- End of Candidate Section -----

        const [error , setError] = useState('');
        const highestVote = [];

        //------- Voter Section -----

        const pushVoter = [];
        const [voterArray , setVoterArray] = useState(pushVoter);
        const [voterLength , setVoterLength] = useState('');
        const [voterAddress , setVoterAddress] = useState([]);

        //connecting wallet

        const checkIfWalletConnected =  async() =>{
            if(!window.ethereum) return setError("Please Install MetaMask");

            const account = await window.ethereum.request({method : "eth_accounts"});
            if(account.length){
                setCurrentAccount(account[0]);
            }else{
                setError("Please Install MetaMask & connect");
            }
        }

        //connect wallet

        const connectWallet = async() =>{
            if(!window.ethereum) return setError("Please Install MetaMask");

            const account = await window.ethereum.request({method : "eth_requestAccounts" , });
            setCurrentAccount(account[0]);
        }


        //upload to ipfs vater image
        const uploadToIPFS  = async(file) =>{
            try{
                const added = await client.add({content : file});
                const url = `https://ipfs.infura.io/ipfs/${added.path}`;
                return url;
            }catch(error){
                setError("Error upload file to IPFS");
            }
        }

        return(
            <VotingContext.Provider value={{votingTitle , checkIfWalletConnected , connectWallet , uploadToIPFS}}>
                {children}
            </VotingContext.Provider>
        )
    }
