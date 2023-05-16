import { BrowserRouter,Routes,Route } from 'react-router-dom'
import MarketplaceAbi from './contractsData/Marketplace.json'
import MarketplaceAddress from './contractsData/Marketplace-address.json'
import NFTAbi from './contractsData/NFT.json'
import NFTAddress from './contractsData/NFT-address.json'
import { useState } from 'react'
import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'


import './App.css';
import Navigation from './Navbar'
import Home from './Home'
import Create from './Create'
import MyListedItems from './MyListedItems'
import MyPurchases from './MyPurchases'

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})
  const [network,setNetwork] = useState(false)
  const [signer,setSigner] = useState(null)

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    loadBlockchain()
  }

  const loadBlockchain = () => {
    setNetwork(true)
  }
  
  const loadEthContract = async () => {
    const MarketplaceAbi = require('../contractsData/Marketplace.json')
    const MarketplaceAddress = require('../contractsData/Marketplace-address.json')
    const NFTAbi = require('../contractData/NFT.json')
    const NFTAddress = require('../contractsData/NFT-address.json')

    // get deployed copies of contracts
    const marketplace = new ethers.Contract(MarketplaceAddress.address,MarketplaceAbi.abi,signer)
    setMarketplace(marketplace)

    const nft = new ethers.Contract(NFTAddress.address,NFTAbi.abi,signer)
    setNFT(nft)
    setNetwork(false)
    setLoading(false)
  }

  const loadPolygonContract = async () => {
    const MarketplaceAbi = require('../contractsDataPolygon/Marketplace.json')
    const MarketplaceAddress = require('../contractsDataPolygon/Marketplace-address.json')
    const NFTAbi = require('../contractsDataPolygon/NFT.json')
    const NFTAddress = require('../contractsDataPolygon/NFT-address.json')

    // get deployed copies of contract
    const marketplace = new ethers.Contract(MarketplaceAddress.address,MarketplaceAbi.abi,signer)
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NFTAddress.address,NFTAbi.abi,signer)
    setNFT(nft)
    setNetwork(false)
    setLoading(false)
  }

  return (
    <BrowserRouter>
    <div className="App">
    <Navigation web3Handler={web3Handler} account={account}/>
    <div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
       <Spinner animation="border" style={{ display: 'flex' }} />
       <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
        </div>
      ) : (
    <Routes>
      <Route path="/" element={<Home nft={nft} marketplace={marketplace}/>}/>
      <Route path="/create" element={<Create marketplace={marketplace}  nft={nft}/>}/>
      <Route path="/my-listed-items" element={<MyListedItems marketplace={marketplace}  nft={nft} account={account}/>}/>
      <Route path="/my-purchases" element={<MyPurchases marketplace={marketplace}  nft={nft} account={account}/>}/>
    </Routes>
      )}
      {network ? (
        <div>
          <h1>Network</h1>
          <button onClick={loadEthContract} >Eth</button>
          <button onClick={loadPolygonContract} >Polygon</button>
        </div>
      ):(
        <div></div>
      )}
    </div> 
    </div>
    </BrowserRouter>
      
  );
}

export default App;
