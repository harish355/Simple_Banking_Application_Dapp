import React, { useEffect, useState } from "react";
import SimpleBanking from "./contracts/SimpleBanking.json";
import getWeb3 from "./getWeb3";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Grow,
  Fade
} from '@mui/material';
import { AccountBalanceWallet, Send, Download, Upload } from '@mui/icons-material';
import "./App.css";

function App() {
  const [web3,setWeb3]=useState(null);
  const [accBal,setAccBal]=useState(0);
  const [accounts,setAccounts]=useState(null);
  const [contract,setContract]=useState(null);
  const [balance,setBalance]=useState(0);
  const [value,setValue]=useState();
  const [toAddress,setToaddress]=useState();
  const [transferAmount,setTransferAmount]=useState();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

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

  const deposit = async () => {
    try {
      setLoading(true);
      await contract.methods.deposit().send({
        from: accounts[0],
        value: web3.utils.toHex(value)
      });
      setSnackbar({ open: true, message: 'Deposit successful!', severity: 'success' });
      window.location.reload();
    } catch (error) {
      setSnackbar({ open: true, message: 'Deposit failed: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async () => {
    try {
      setLoading(true);
      await contract.methods.withdraw(value).send({ from: accounts[0] });
      setSnackbar({ open: true, message: 'Withdrawal successful!', severity: 'success' });
      window.location.reload();
    } catch (error) {
      setSnackbar({ open: true, message: 'Withdrawal failed: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const Transfer = async () => {
    try {
      setLoading(true);
      await contract.methods.transfer(transferAmount, toAddress).send({ from: accounts[0] });
      setSnackbar({ open: true, message: 'Transfer successful!', severity: 'success' });
      window.location.reload();
    } catch (error) {
      setSnackbar({ open: true, message: 'Transfer failed: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

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
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DBank
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            {accounts ? accounts[0] : 'Connect Wallet'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grow in timeout={500}>
              <Card sx={{ transition: '0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <AccountBalanceWallet sx={{ mr: 1 }} />
                    Account Balance
                  </Typography>
                  <Typography variant="h4">{balance} Wei</Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grow in timeout={800}>
              <Card sx={{ transition: '0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <AccountBalanceWallet sx={{ mr: 1 }} />
                    Wallet Balance
                  </Typography>
                  <Typography variant="h4">{accBal * Math.pow(10, 18)} Wei</Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        <Fade in timeout={1000}>
          <Box sx={{ mt: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Amount (Wei)"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={deposit}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <Upload />}
                    >
                      Deposit
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={withdraw}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <Download />}
                    >
                      Withdraw
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Fade>

        <Fade in timeout={1200}>
          <Box sx={{ mt: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Transfer Funds</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="To Address"
                      value={toAddress}
                      onChange={(e) => setToaddress(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Amount to Transfer"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={Transfer}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                    >
                      Transfer
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Fade>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

export default App;
