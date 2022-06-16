import React, {  useEffect,useState } from "react";
import SimpleBanking from "./contracts/SimpleBanking.json";
import getWeb3 from "./getWeb3";
import "./App.css";



function App()
{
  // state = { storageValue: 0, web3: null, accounts: null, contract: null };
  const [web3,setWeb3]=useState(null);
  const [accBal,setAccBal]=useState(0);
  const [accounts,setAccounts]=useState(null);
  const [contract,setContract]=useState(null);
  const [balance,setBalance]=useState(0);
  const [value,setValue]=useState();
  const [toAddress,setToaddress]=useState();
  const [transferAmount,setTransferAmount]=useState();

  const web3_init=async()=>{
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
    try {
      const web3_js = await getWeb3();
      setWeb3(web3_js);
      const User_account = await web3_js.eth.getAccounts();
      const networkId = await web3_js.eth.net.getId();
      web3_js.eth.getBalance(User_account[0]).then((res)=>{
        setAccBal(res/1000000000000000000);}
      );
      const deployedNetwork = SimpleBanking.networks[networkId];
      const instance = await new web3_js.eth.Contract(
        SimpleBanking.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setContract(instance)
      setAccounts(User_account)
      // setAccBal(acc);
      // let resp=await contract.methods.getBalance.call({from:accounts});
      // setValue(resp)

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

  }
  const getValue=async()=>{
    if(accounts!=null)
    {
      var resp=await contract.methods.getBalance().call({from:accounts[0]});
      setBalance(resp)
    }
  }
  const deposit=async()=>{
    
     await contract.methods.deposit().send({from:accounts[0],value:
      web3.utils.toHex(value)});
      window.location.reload();

  }

  const withdraw=async()=>{
    let resp=await contract.methods.withdraw(value).send({from:accounts[0]});
    console.log(resp)
    window.location.reload();
  }

  const Transfer=async()=>{
    let resp=await contract.methods.transfer(transferAmount,toAddress).send({from:accounts[0]});
    console.log(resp)
    alert(resp)

  }

  useEffect(()=>{
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
    web3_init();
    if(contract!=null)
    {
      getValue()
    }
  },[accounts])


  

  return (
    
    <div className="container">
      <ul className="nav">
          <li className="nav-item">
            <a className="nav-link active" href="#">Homepage</a>
          </li>

          <li className="nav-item">
            <a className="nav-link disabled" href="#">{accounts}</a>
          </li>
      </ul>

      <div className="row">
        <div className="col-6">Account {balance} Wei</div>
        <div className="col-6">Wallet Balance {accBal*Math.pow(10,18)} Wei </div>
      </div>
      <div className="row">
        <div className="input-group">
          <input type="text" className="form-control"
          value={value}
          onChange={(event)=>{
            setValue(event.target.value)
          }}
          placeholder="0 Wei"  aria-describedby="basic-addon2" />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={
              ()=>{
                deposit();
              }
            }>Deposit</button>
            <button className="btn btn-outline-secondary" type="button" onClick={
              ()=>{
                withdraw();
              }
            }>Withdraw</button>
          </div>
        </div>
      </div>
            <br></br>
      <form>
      <div className="row">
        <div className="col-6">Transfer Funds:</div>
       
      </div>
      <div className="form-row">
        <div className="row">
          <div className="col-5">
            <input type="text" className="form-control"
            value={toAddress}
            onChange={(event)=>{
              setToaddress(event.target.value)
            }} placeholder="To Address" />
          </div>
          <div className="col-5">
            <input type="text" className="form-control"
            value={transferAmount}
            onChange={(event)=>{
              setTransferAmount(event.target.value)
            }} placeholder="Amount To Tranfser" />
          </div>
          <div className="col-2">
            <button type="text" className="form-control" onClick={Transfer }>Transfer</button>
          </div>
        </div>
      </div>
    </form>
    </div>

  );

}


export default App;
