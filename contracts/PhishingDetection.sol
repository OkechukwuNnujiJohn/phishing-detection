// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PhishingDetection {
    struct URLData {
        string url;
        bool isPhishing;
    }

    // ✅ Mapping to store user-specific phishing history
    mapping(address => URLData[]) private userHistory;

    event URLStored(address indexed user, string url, bool isPhishing);

    // ✅ Function to store phishing check results on blockchain
    function storePhishingUrl(string memory _url, bool _isPhishing) public {
        userHistory[msg.sender].push(URLData(_url, _isPhishing));
        emit URLStored(msg.sender, _url, _isPhishing);
    }

    // ✅ Function to retrieve user history
    function getUserHistory() public view returns (URLData[] memory) {
        return userHistory[msg.sender];
    }
}
