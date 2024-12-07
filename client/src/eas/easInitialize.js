import { EAS } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

export const EASContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'; // Sepolia base

export const easInitialize = () => {
  // Initialize the sdk with the address of the EAS Schema contract address
  const eas = new EAS(EASContractAddress);

  // Gets a default provider (in production use something else like infura/alchemy)
  const provider = ethers.getDefaultProvider('sepolia');

  // Connects an ethers style provider/signingProvider to perform read/write functions.
  // MUST be a signer to do write operations!
  eas.connect(provider);

  // const PRIVATE_KEY =
  //   '1d2bf3146fc6dd8fe961720484f60b26d81f92fee287e5bfb2e7511c4ef37d28';

  // const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  // eas.connect(signer);

  return eas;
};
