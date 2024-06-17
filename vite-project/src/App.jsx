import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Web3 from 'web3';
import QRCode from 'qrcode';
import { ethers } from "ethers";
import { QrReader } from '@blackbox-vision/react-qr-reader';
import red from "../../artifacts/contracts/CertificateVerification.sol/CertificateVerification.json"


const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS // Replace with your contract address

const App = () => {
  const [file, setFile] = useState(null);
  const [contract, setContract] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [certificateData, setCertificateData] = useState({
    studentName: '',
    course: '',
    institution: '',
    issueDate: ''
  });
  const [qrCode, setQrCode] = useState('');
  const [scannedData, setScannedData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCertificateData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const uploadToPinata = async () => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY, // Replace with your Pinata secret key
        }
      });
      setIpfsHash(res.data.IpfsHash);
    } catch (err) {
      console.error('Error uploading file to Pinata:', err.response ? err.response.data : err.message);
    }
  };

  async function getContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, red.abi, signer);
    return contract
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      getContract().then((contract) => {
        setContract(contract);
      })
    }
  }, [])

  // const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
  // const contract = new web3.eth.Contract(red.abi, contractAddress);

  const addCertificate = async () => {
    const { studentName, course, institution, issueDate } = certificateData;
    await contract.addCertificate(studentName, course, institution, Date.parse(issueDate) / 1000, ipfsHash);
    generateQrCode();
  };

  const generateQrCode = async () => {
    const { studentName, course, institution, issueDate } = certificateData;
    const qrData = JSON.stringify({
      studentName,
      course,
      institution,
      issueDate,
      ipfsHash,
    });
    try {
      const url = await QRCode.toDataURL(qrData);
      setQrCode(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const handleScan = (data) => {
    if (data) {
      setScannedData(JSON.parse(data)); // Parse the JSON data from the QR code
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const fetchCertificateData = async () => {
    if (!scannedData) return;

    const { studentName, course, institution, issueDate, ipfsHash } = scannedData;

    // Fetch the file from IPFS using the IPFS hash
    const fileUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    try {
      const res = await axios.get(fileUrl);
      const fileData = res.data;
      console.log('File Data from IPFS:', fileData);
    } catch (err) {
      console.error('Error fetching file from IPFS:', err);
    }

    // Fetch the certificate details from the blockchain
    const storedCertificate = await contract.methods.getCertificate(ipfsHash).call();
    console.log('Certificate Data from Blockchain:', storedCertificate);

    // Verify the scanned data with the data on the blockchain
    if (
      storedCertificate.studentName === studentName &&
      storedCertificate.course === course &&
      storedCertificate.institution === institution &&
      new Date(storedCertificate.issueDate * 1000).toISOString().split('T')[0] === issueDate
    ) {
      console.log('Certificate is valid');
    } else {
      console.log('Certificate is invalid');
    }
  };

  return (
    <div id="root">
      <h1>Certificate Verification System</h1>
      <div className="card">
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadToPinata}>Upload to IPFS</button>
        <input type="text" name="studentName" placeholder="Student Name" onChange={handleInputChange} />
        <input type="text" name="course" placeholder="Course" onChange={handleInputChange} />
        <input type="text" name="institution" placeholder="Institution" onChange={handleInputChange} />
        <input type="date" name="issueDate" onChange={handleInputChange} />
        <button onClick={addCertificate}>Add Certificate</button>
        {ipfsHash && <p>IPFS Hash: {ipfsHash}</p>}
        {qrCode && <img src={qrCode} alt="QR Code" />}
      </div>
      <div className="qr-scanner">
        <h2>Scan QR Code</h2>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
        <button onClick={fetchCertificateData}>Fetch Certificate Data</button>
        {scannedData && <pre>{JSON.stringify(scannedData, null, 2)}</pre>}
      </div>
    </div>
  );
};

export default App;
