// SPDX-License-Identifier: unlicence
pragma solidity ^0.8.0;

contract CertificateVerification {
    struct Certificate {
        string studentName;
        string course;
        string institution;
        uint256 issueDate;
        string ipfsHash;
    }

    mapping(string => Certificate) private certificates;

    event CertificateAdded(string ipfsHash, string studentName, string course, string institution, uint256 issueDate);

    function addCertificate(
        string memory studentName,
        string memory course,
        string memory institution,
        uint256 issueDate,
        string memory ipfsHash
    ) public {
        Certificate memory newCertificate = Certificate(studentName, course, institution, issueDate, ipfsHash);
        certificates[ipfsHash] = newCertificate;

        emit CertificateAdded(ipfsHash, studentName, course, institution, issueDate);
    }

    function getCertificate(string memory ipfsHash) public view returns (
        string memory studentName,
        string memory course,
        string memory institution,
        uint256 issueDate,
        string memory ipfsHashOut
    ) {
        Certificate memory cert = certificates[ipfsHash];
        return (cert.studentName, cert.course, cert.institution, cert.issueDate, cert.ipfsHash);
    }
}
