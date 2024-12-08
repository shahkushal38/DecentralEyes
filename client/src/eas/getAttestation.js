import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { easInitialize } from './easInitialize';

export const getAttestation = async (uid) => {
  const eas = easInitialize();

  const attestation = await eas.getAttestation(uid);

  const schemaEncoder = new SchemaEncoder(
    'uint8 rating,string comment,bool isVerified,string tool'
  );
  const decodedData = schemaEncoder.decodeData(attestation.data);

  return decodedData;
};
