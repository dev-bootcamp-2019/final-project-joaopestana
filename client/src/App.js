import React, { Component } from "react";
import SimpleStorageContract from './contracts/SimpleStorage.json'
import getWeb3 from "./utils/getWeb3";

import ipfs from "./ipfs";

import "./App.css";
import { isNull } from "util";

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: "",
      storageValue: 0,
      web3: null,
      buffer: null,
      account: null
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  // this function garanties that the correct order of events go as planed
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  instantiateContract() {
    const contract = require('truffle-contract');
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance
        this.setState({ account: accounts[0] })
        // Get the value from the contract to prove it worked.
        return this.simpleStorageInstance.get.call(accounts[0])
      }).then((ipfsHash) => {
        // Update state with the result.
        return this.setState({ ipfsHash })
      })
    })
  }


   
  captureFile(event) {
    console.log('capture file...')
    // next line prevents the page to refresh. Because it's the default behaviour
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)    
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log("buffer", this.state.buffer)
    }
  }

  onSubmit(event) {
    // next line prevents the page to refresh. Because it's the default behaviour
    event.preventDefault()
    ipfs.files.add(this.state.buffer, (error, result) => { 
      if(error) {
        console.error(error)
        return
      }
      this.setState({ ipfsHash: result[0].hash })
      console.log("ipfsHash", this.state.ipfsHash)
    })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">        
        <h1>Your Picture or Video</h1>
        <p>This file is stored on IPFS (client) and in the Ethereum BlockChain.</p>
        {/* 
        use to display the picture.
         */}
        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
        <h2>Upload Image right bellow</h2>
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.captureFile} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App;

module.exports = XMLHttpRequest;
exports = XMLHttpRequest;
