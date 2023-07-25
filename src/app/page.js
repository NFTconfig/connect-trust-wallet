'use client';
import styles from './page.module.css'
import { useEffect,useState } from 'react';
import { ethers } from "ethers";
import ABI from "./721Abi.json";
const  getTrustWalletFromWindow = ()=> {
  // return window.ethereum;
  const isTrustWallet = (ethereum) => {
    // Identify if Trust Wallet injected provider is present.
    const trustWallet = !!ethereum.isTrust;

    return trustWallet;
  };

  const injectedProviderExist =
    typeof window !== "undefined" && typeof window.ethereum !== "undefined";

  if (!injectedProviderExist) {
    return null;
  }

  if (isTrustWallet(window.ethereum)) {
    return window.ethereum;
  }

  if (window.ethereum?.providers){
    return window.ethereum.providers.find(isTrustWallet) ?? null;
  }

  return window["trustwallet"] ?? null;
}


export default function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(()=>{
    let provider = getTrustWalletFromWindow();
    setProvider(provider);
  },[])

  const connect =async ()=>{
    try {
      const account = await provider.request({
        method: "eth_requestAccounts",
      });
     
      console.log(account); // => ['0x...']
      setAccount(account[0]);
    } catch (e) {
      if (e.code === 4001) {
        console.error("User denied connection.");
      }
    }
  }
  const approve = async()=>{
  
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();
    let _token = "0xf7497304AC73c1A52d10f719dd27580a0Db7F932"
    const contract = new ethers.Contract(_token, ABI, signer);
    let res =  contract.approve('0x15051107651f3420144d3a2412d49402c2FAc3C0',18970240857 );
    console.log('res: ',res);

  }
  return (
    <main className={styles.main}>
       <div onClick={()=>{
        connect();
       }}>connect trust wallet</div>

      <div onClick={()=>{
        approve();
       }}>test approve</div>

       <div>{account}</div>
      
    </main>
  )
}
