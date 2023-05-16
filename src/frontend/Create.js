import React,{useState,useEffect} from 'react'
import {create as ipfsHttpClient} from 'ipfs-http-client'
import {Buffer} from "buffer";
import { Row,Form,Button } from 'react-bootstrap';
import { ethers } from 'hardhat';

const projectId = "2KJvFW3SrkSHMqYqm0PPVE53eob"
const projectSecret = "3959dacde4acd650d7374da39ac5801c"
const subdomain = "blockskillo"
const authorization = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString("base64")}`;

const client = ipfsHttpClient({
  host:"infura-ipfs.io",
  port:5001,
  protocol:"https",
  headers:{
    authorization:authorization
  }
})

const Create = ({marketplace,nft}) => {
  const [image,setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.file[0]

    if(typeof file !== 'undefined'){
      try {
        const result = await client.add(file)
        console.log(result);
        setImage(`${subdomain}/ipfs/${result.path}`)
      } catch (error) {
        console.log("Ipfs image upload error",error);
      }
    }
  }

  const createNft = async () => {
    if(!image || !price || !name || !description) return

    try {
      const result = await client.add(JSON.stringify({image,price,name,description}))
      mintThenList(result)
    } catch (error) {
      console.log("ipfs uri upload error",error);
    }
  }

  const mintThenList = async (result) => {
    const uri = `${subdomain}/ipfs/${result.path}`
    // mint nft
    await (await nft.mint(uri)).wait()

    // get tokenId of new nft
    const id = await nft.tokenCount()

    // approve marketplace to spend
    await (await nft.setApprovalForAll(marketplace.address,true)).wait()

    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await (await marketplace.makeItem(nft.address,id,listingPrice)).wait()
  }

  return (
    <div className='container-fluid mt-5'>
     <div className='row'>
      <main role='main' className='col-lg-12 mx-auto' style={{maxWidth:'1000px'}}>
          <div className='content mx-auto'>
            <Row className='g-4'>
              <Form.Control type="file" required name="file" onChange={uploadToIPFS}/>
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder='Name'/>
              <Form.Control onChange={(e) => setDescription(e.target.value)}
                size="lg" required type="textarea" placeholder='Description'
              />
              <Form.Control onChange={(e) => setPrice(e.target.value)}
                size="lg" required type="number" placeholder='Price in ETH'
              />
              <div className='d-grid px-0'>
                <Button onClick={createNft} variant="primary" size='lg'>
                       Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
      </main>
     </div>
    </div>
  )
}

export default Create