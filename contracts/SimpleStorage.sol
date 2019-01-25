pragma solidity ^0.5.0;

contract SimpleStorage {
  string ipfsDataHash;

  function set(string memory x) public {
    ipfsDataHash = x;
  }

  function get() public view returns (string memory) {
    return ipfsDataHash;
  }
}
