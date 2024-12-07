import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { easInitialize } from './easInitialize';
import { findWordInGitHub } from './findWordInGithub';

export const createAttestion = async (data, signer) => {
  try {
    const eas = easInitialize(data.address);
    eas.connect(signer);
    const agentVerified = await findWordInGitHub('shahkushal38', data.toolName);
    console.log('agetn verified - ', agentVerified);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(
      'uint8 rating,string comment,bool isVerified,string tool'
    );

    const encodedData = schemaEncoder.encodeData([
      { name: 'rating', value: data.rating, type: 'uint8' },
      { name: 'comment', value: data.text, type: 'string' },
      { name: 'isVerified', value: true, type: 'bool' },
      { name: 'tool', value: data.toolName, type: 'string' },
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
  } catch (err) {
    throw 'Error occurred' + err;
  }
};
