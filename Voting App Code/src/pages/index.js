import React, {useState , useEffect ,useContext} from "react";

import { VotingContext } from "../../context/Voter";
import { Container , Row , Spacer  , Card, Col, Text , Navbar, Button, Link  } from "@nextui-org/react";
import Swal from 'sweetalert2';

export default function Home() {

  const {votingTitle} = useContext(VotingContext);
  const [activeColor, setActiveColor] = React.useState("success");
  const [accountAddress, setAccountAddress] = useState('');

  const handleConnectMetaMask = async () => {
    try {
      if (window.ethereum && !window.ethereum.isConnected()) {
        // Request MetaMask to connect
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // MetaMask is connected
        const address = accounts[0];
        setAccountAddress(address);
        Swal.fire({
          title: 'Connected to MetaMask',
          text: `Account address: ${address}`,
          icon: 'success',
          confirmButtonText: 'OK',
        });

        // Add your further logic here for interacting with MetaMask
      } else {
        // Request MetaMask to connect
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // MetaMask is connected
        const address = accounts[0];
        setAccountAddress(address);
        
        // MetaMask is already connected
        Swal.fire({
          title: 'MetaMask is already connected',
          text: `Account address: ${address}`,
          icon: 'info',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      // Handle error
      Swal.fire({
        title: 'Failed to connect to MetaMask',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };


  return (

    <>
      <div style={{backgroundColor:'#F0F0E7'}} >
        <Navbar  variant={"sticky"} style={{backgroundColor:'white'}}  >
            <Navbar.Brand>
            
            <Text  hideIn="xs" style={{color:'#D20C02'}} h1 >
                PublicVote
            </Text>
            </Navbar.Brand>
            <Navbar.Content activeColor={activeColor} enableCursorHighlight hideIn="xs" variant="underline">
            <Navbar.Link href="#" isActive  >About</Navbar.Link>
            <Navbar.Link  href="#">Customers</Navbar.Link>
            <Navbar.Link href="#">Pricing</Navbar.Link>
            <Navbar.Link href="#">Company</Navbar.Link>
            </Navbar.Content>
            <Navbar.Content>
            <Navbar.Link color="inherit" href="#">
                Login
            </Navbar.Link>
            <Navbar.Item>
                <Button auto flat as={Link} onClick={handleConnectMetaMask}>
                  Connect
                </Button>
            </Navbar.Item>
            </Navbar.Content>
        </Navbar> 
        <br/>
        <Container fluid style={{paddingBottom:'10%' , marginTop:'3%'}}>
            <Row gap={1}>
                <Col>
                  <Card css={{ $$cardColor: '$colors$white' }}>
                    <Card.Body style={{textAlign:'center'}}>
                      <h2 style={{paddingTop:'4%' , textTransform:'uppercase'}}>Vote For Your Choice</h2>
                      <Spacer y={1} />
                      <div style={{textAlign:'center'}}>
                        <br/>
                        <br/>
                        <img src="./metamask.webp" style={{width:'20%'}} />
                        <center>
                        <Button onClick={handleConnectMetaMask}>Connect To MetaMask</Button>
                        </center>
                        <br/>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card style={{backgroundColor:'transparent'}}>
                    <Card.Body style={{backgroundColor:'transparent'}} >
                        <img src="./bg_img.png" style={{width:'75%'}}/>
                    </Card.Body>
                  </Card>
                </Col>
               
              </Row>
        </Container>
      </div>
    </>
  )
}
