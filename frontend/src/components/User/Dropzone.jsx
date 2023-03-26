import React from 'react';
import '../../static/scss/User/NewRequest.scss'
import toast from 'react-hot-toast'
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client');
const projectId = "2NKrBI1kOXqIoQI9AKldOjK6eqI";
const projectSecret = "ec1c887351c1c0c40a9ad2b9cab08ded";
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = ipfsClient({
  host: 'ipfs.infura.io', port: 5001, protocol: 'https', headers: {
    authorization: auth,
  },
})

function Dropzone({ ipfsHash, setIpfsHash }) {

  const [isUploading, setIsUplaoding] = React.useState(false);

  const captureFile = async (_file) => {

    const reader = new window.FileReader()
    console.log("file",_file)
    reader.readAsArrayBuffer(_file)

    reader.onloadend = () => {
      console.log("buffer",Buffer(reader.result));
      ipfs.add(Buffer(reader.result), (error, result) => {
        console.log('Ipfs result', result[0].hash)
        setIpfsHash(result[0].hash)
      })
    }
  }

  const upload = async (_file) => {
    setIsUplaoding(true)
    try {
      captureFile(_file);
    } catch (err) {
      console.log('Error in uploading to IPFS: ', err)
      toast.error(err.message)
    }
    setIsUplaoding(false)
  }

  return (
    <section className="newRequest-dropzone">
      <StyledDropZone onDrop={(_file) => upload(_file)} />
      <aside>
        <h3>Files</h3>
        {ipfsHash ?
          isUploading ?
            'Uploading...' :
            <a href={`https://Personal-Project.infura-ipfs.io/ipfs/${ipfsHash}`} target="_blank" >{ipfsHash}</a>
          : 'No file attatched'}
      </aside>
    </section>
  );
}

export default Dropzone;
