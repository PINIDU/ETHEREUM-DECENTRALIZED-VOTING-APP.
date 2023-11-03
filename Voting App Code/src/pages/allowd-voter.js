import React, {useState , useEffect ,useCallback ,useContext} from "react";
import { Router, useRouter } from "next/router";
import { useDropzone } from "react-dropzone";


import { VotingContext } from "../../context/Voter";
import { accessListify } from "ethers/lib/utils";

const allowedVoters = () => {
  const [fileUrl , setFileUrl] = useState(null);
  const [formInput , setFormInput] = useState({
    name :"",
    address:"",
    position:"",
  });

  const route = useRouter();
  const {uploadToIPFS} = useContext(VotingContext);

  //voters image drop
  const onDrop = useCallback(async(acceptedFil) =>{
    const url = await uploadToIPFS(acceptedFil[0]);
    setFileUrl(url);
  });

  const {getRootProps , getInputProps} = useDropzone({
    onDrop,
    accept:"image/*",
    maxSize:5000000,

  })


  return (
    <div>
       {fileUrl && (
        <div>
          <img src={fileUrl} alt="Voter image" />
          <div>
            <p>Name : <span>&nbsp; {formInput.name}</span></p>
            <p>Address : <span>&nbsp; {formInput.address.slice(0,20)}</span></p>
            <p>Position : <span>&nbsp; {formInput.position}</span></p>
          </div>
        </div>
       )}


       {!fileUrl && (

        <div>
          <h4>Add Candidate</h4>
          <div>
            {/* {voterArray.map((el , i) => (
              <div key={i+1}>
                <div>
                  <img src="" />
                </div>
                <div>
                   <p> Name </p>
                   <p> Address </p>
                   <p> Possition </p>
                </div>
              </div>
            ))} */}
          </div>
          <div>
             <h3>Create New Voter</h3>
             <div {...getRootProps}>
                <input {...getInputProps} />
                <label>Image Upload</label> 
              
             </div>
          </div>
        </div>

       )}

    </div>
  )
}

export default allowedVoters;
