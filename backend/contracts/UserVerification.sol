// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserVerification {
  mapping(address => bool) public verifiedUsers;

  event UserVerified(address user);

  function verifyUser(address _user) public {
    // Add integration with Anon Aadhaar verification mechanism here
    // Placeholder for now:
    require(!verifiedUsers[_user], 'User already verified');
    verifiedUsers[_user] = true;
    emit UserVerified(_user);
  }

  function isUserVerified(address _user) public view returns (bool) {
    return verifiedUsers[_user];
  }
}