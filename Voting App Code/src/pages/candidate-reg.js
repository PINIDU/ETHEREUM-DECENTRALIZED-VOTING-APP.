import React, {useState , useEffect ,useContext} from "react";

import { VotingContext } from "../../context/Voter";
import { Container , Row , Input  , Card, Col, Text , Navbar, Button, Link , Textarea  } from "@nextui-org/react";
import Swal from 'sweetalert2';

export default function CandidateReg() {

  const {votingTitle} = useContext(VotingContext);
  const [activeColor, setActiveColor] = React.useState("success");
  const [accountAddress, setAccountAddress] = useState('');

  
  const [name, setFullName] = useState("");
  const [bod, setBod] = useState("");
  const [age, setAge] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errorAgeMessage, setErrorAgeMessage] = useState('');
  const [ageColor, setAgeColor] = useState('');


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setUploadFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBODChange = (event) => {
    setBod(event.target.value);
    calculateAge(event.target.value);
  };

  const calculateAge = (bod) => {
    const today = new Date();
    const birthDate = new Date(bod);
    const diff = today - birthDate;
    const ageInYears = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    setAge(ageInYears);

    if (ageInYears < 18) {
      setErrorAgeMessage('You must be at least 18 years old.');
      setAgeColor("Red")
    } else {
      setErrorAgeMessage('Valid Age');
      setAgeColor("Green");
    }
  };

  const handleChange = (event) => {
    setFullName(event.target.value);
  };

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

  function submit_candidate(){

  }

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
           
            <Navbar.Item>
                <Button auto flat as={Link} onClick={handleConnectMetaMask}>
                  Logout
                </Button>
            </Navbar.Item>
            </Navbar.Content>
        </Navbar> 
        <br/>
        <Container fluid style={{paddingBottom:'10%' , marginTop:'3%'}}>
            <Row gap={1}>
                <Col>
                  <Card css={{ $$cardColor: '$colors$white' }}>
                    <Card.Body css={{ $$cardColor: '$colors$white' }}>
                      <div style={{padding:'3%'}}>
                        <h2 className="text-uppercase" style={{color:'#667167'}}>Preview Profile</h2>
                        <hr/>
                        <center>
                          {previewImage && <img src={previewImage} alt="Preview" style={{height:'220px'}} />}
                        </center>
                        <br/>
                        <h3 style={{paddingTop:'4%', lineHeight:'10px'}}>Candidate Name : <span style={{fontWeight:'100' , color:'#415643'}}>{name}</span></h3>
                        <h3 style={{paddingTop:'4%' , lineHeight:'10px'}}>Candidate BOD : <span style={{fontWeight:'100' , color:'#415643'}}>{bod}</span></h3>
                        <h3 style={{paddingTop:'4%' , lineHeight:'10px'}}>Candidate Age : <span style={{fontWeight:'100' , color:'#415643'}}>{age}</span></h3>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card css={{ $$cardColor: '$colors$white' }}>
                    <Card.Body css={{ $$cardColor: '$colors$white' }}>
                      <div style={{padding:'2%'}}>
                       <br/>
                       <center>
                         <Text h2 style={{textTransform:'uppercase' , textDecoration:'underline'}} >Add New Candidates</Text>
                       </center>
                       <div style={{paddingTop:'4%'}}>
                        <Input bordered label="Full Name" placeholder="" size="lg" width="100%"  value={name} onChange={handleChange}/>
                       </div>
                       <div style={{paddingTop:'4%'}}>
                        <Input bordered label="Birth Of Date" type="date" placeholder="" size="lg" width="100%" value={bod} onChange={handleBODChange} />
                        
                        {errorAgeMessage && <p style={{color:ageColor , paddingTop:'10px'}}>{errorAgeMessage}</p>}
                        {age && <p>Your age is: {age} years</p>}
                       </div>
                       <div style={{paddingTop:'4%'}}>
                        <Input bordered label="Image" type="file" placeholder="" size="lg" width="100%" onChange={handleImageUpload}  />
                       </div>
                       {/* <div style={{paddingTop:'4%'}}>
                        <Textarea  
                          minRows={10}
                          maxRows={100} 
                          bordered 
                          label="Qualifications" 
                          placeholder="" size="lg" width="100%"  />
                       </div> */}
                       <div style={{paddingTop:'4%' }}>
                          <Button onClick={submit_candidate}>Submit</Button>
                       </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
               
              </Row>
        </Container>
      </div>
    </>
  )
}
