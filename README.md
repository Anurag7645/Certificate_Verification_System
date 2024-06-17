##Certificate_Verification_System

# Summary Report: Implementation of Certificate Verification System
Project Overview
The Certificate Verification System project allows for the creation, storage, and verification of certificates using blockchain technology and IPFS (InterPlanetary File System). The system leverages Ethereum smart contracts to securely store certificate data and Pinata's IPFS service to store the certificate files. The frontend of the application is built using Vite and React, while the backend involves deploying a smart contract using Hardhat and interacting with the blockchain using Ether.js.
Tools and Technologies Used
1.	Vite: A fast build tool for the frontend application.
2.	React: A JavaScript library for building user interfaces.
3.	Ether.js: A library for interacting with the Ethereum blockchain.
4.	Hardhat: A development environment for compiling, deploying, and testing Ethereum smart contracts.
5.	Pinata: A service for managing IPFS content.
6.	Ganache: A local blockchain for development and testing.
Implementation Steps
1. Setting Up the Frontend with Vite
1.	Create a Vite project:
bash

npm create vite@latest certificate-verification-system --template react
cd certificate-verification-system
npm install
2.	Install necessary dependencies:
bash
Copy code
npm install axios ethers @blackbox-vision/react-qr-reader
3.	Modify App.jsx:
o	Create and manage state for file, IPFS hash, certificate data, QR code, and scanned data.
o	Implement functions to upload files to Pinata, add certificates to the blockchain, generate QR codes, and retrieve certificate data from the blockchain.
4.	Modify App.css:
o	Enhance the styling for better user experience.

2. Setting Up the Backend with Hardhat
1.	Initialize a Hardhat project:
bash

npx hardhat
2.	Create and configure Hardhat project:
o	Choose "Create a basic sample project".
o	Install dependencies if prompted.
3.	Install necessary Hardhat plugins and dependencies:
bash
Copy code
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install dotenv
4.	Write the smart contract:
o	Create CertificateVerification.sol in the contracts directory:
5.	Compile the smart contract:
bash

npx hardhat compile
6.	Deploy the smart contract:
o	Create deploy.js in the scripts directory:
o	Deploy using Hardhat:
bash

npx hardhat run scripts/deploy.js --network localhost
7.	Update the contract address and ABI in the frontend:
o	Copy the ABI from the artifacts directory after compilation.
o	Update App.jsx with the new contract address and ABI.
3. Running the Development Environment
1.	Start the local blockchain:
bash
npx hardhat node
2.	Deploy the contract to the local blockchain:
bash

npx hardhat run scripts/deploy.js --network localhost
3.	Run the frontend application:
bash

npm run dev
Conclusion
By following the above steps, the Certificate Verification System was successfully implemented. The project demonstrates the integration of blockchain technology with a web application for secure certificate storage and verification. The use of Vite for the frontend, Ether.js for blockchain interactions, and Hardhat for smart contract development ensures a modern and efficient development workflow.


