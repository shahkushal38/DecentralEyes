import {
  NO_EXPIRATION,
  SchemaEncoder,
} from '@ethereum-attestation-service/eas-sdk';
import { easInitialize } from './easInitialize.js';

export const createAttestion = async () => {
  const eas = easInitialize();
  eas.connect(signer); //need to create signer

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder(
    'uint8 rating,string comment,bool isVerified,string tool'
  );

  const encodedData = schemaEncoder.encodeData([
    { name: 'rating', value: 8, type: 'uint8' },
    { name: 'comment', value: 'Text value', type: 'string' },
    { name: 'isVerified', value: true, type: 'bool' },
    { name: 'tool', value: 'Test Tool', type: 'string' },
  ]);

  const schemaUID =
    '0x16bdf90908fc731765dfd4a3929f099dd330a640b75614b5957226665e9e4e89';

  const transaction = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: '0x0000000000000000000000000000000000000000',
      expirationTime: NO_EXPIRATION,
      revocable: false,
      data: encodedData,
    },
  });

  const newAttestationUID = await transaction.wait();

  console.log('New attestation UID:', newAttestationUID);

  console.log('Transaction receipt:', transaction.receipt);
};

createAttestion();
