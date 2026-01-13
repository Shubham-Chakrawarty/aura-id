import { generateKeyPairSync } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const createKeyPair = () => {
  return generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
};

const saveKeysToDisk = (privateKey: string, publicKey: string) => {
  const dir = path.join(process.cwd(), 'keys');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(path.join(dir, 'private.pem'), privateKey);
  fs.writeFileSync(path.join(dir, 'public.pem'), publicKey);
};

const main = () => {
  try {
    const { privateKey, publicKey } = createKeyPair();
    saveKeysToDisk(privateKey, publicKey);
    console.log('✅ Keys generated and saved successfully.');
  } catch (error) {
    console.error('❌ Failed to generate keys:', error);
    process.exit(1);
  }
};

main();
