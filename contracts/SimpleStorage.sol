pragma solidity ^0.5.0;

contract SimpleStorage {
  string storedHashData;

  function set(string memory x) public {
    storedHashData = x;
  }

  function get() public view returns (string memory) {
    return storedHashData;
  }
}
