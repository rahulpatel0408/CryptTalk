import CryptoJS from 'crypto-js';

// Diffie-Hellman parameters (using standard 2048-bit MODP Group)
const DH_G = 2;
const DH_P = "0xFFFFFFFF FFFFFFFF C90FDAA2 2168C234 C4C6628B 80DC1CD1 29024E08 8A67CC74 020BBEA6 3B139B22 514A0879 8E3404DD EF9519B3 CD3A431B 302B0A6D F25F1437 4FE1356D 6D51C245 E485B576 625E7EC6 F44C42E9 A637ED6B 0BFF5CB6 F406B7ED EE386BFB 5A899FA5 AE9F2411 7C4B1FE6 49286651 ECE45B3D C2007CB8 A163BF05 98DA4836 1C55D39A 69163FA8 FD24CF5F 83655D23 DCA3AD96 1C62F356 208552BB 9ED52907 7096966D 670C354E 4ABC9804 F1746C08 CA18217C 32905E46 2E36CE3B E39E772C 180E8603 9B2783A2 EC07A28F B5C55DF0 6F4C52C9 DE2BCBF6 95581718 3995497C EA956AE5 15D22618 98FA0510 15728E5A 8AACAA68 FFFFFFFF FFFFFFFF";

// Convert hex string to BigInt
const hexToBigInt = (hex) => {
  return BigInt(hex.replace(/\s/g, ''));
};

// Convert BigInt to hex string
const bigIntToHex = (bigInt) => {
  return bigInt.toString(16);
};

// Generate public key from private key
const generatePublicKey = (privateKey) => {
  const g = BigInt(DH_G);
  const p = hexToBigInt(DH_P);
  return modPow(g, privateKey, p);
};

// Modular exponentiation (g^exp mod p)
const modPow = (base, exp, mod) => {
  if (mod === BigInt(1)) return BigInt(0);
  
  let result = BigInt(1);
  base = base % mod;
  
  while (exp > BigInt(0)) {
    if (exp % BigInt(2) === BigInt(1)) {
      result = (result * base) % mod;
    }
    exp = exp >> BigInt(1);
    base = (base * base) % mod;
  }
  
  return result;
};

// Derive shared secret from private key and other's public key
const deriveSharedSecret = (privateKey, otherPublicKey) => {
  const p = hexToBigInt(DH_P);
  return modPow(BigInt(otherPublicKey), privateKey, p);
};

// Generate AES key from shared secret
const deriveAESKey = (sharedSecret) => {
  const secretString = sharedSecret.toString();
  return CryptoJS.SHA256(secretString).toString();
};

// Encrypt message with AES
const encryptMessage = (message, aesKey) => {
  return CryptoJS.AES.encrypt(message, aesKey).toString();
};

// Decrypt message with AES
const decryptMessage = (encryptedMessage, aesKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, aesKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

// Generate private key from passphrase
const generatePrivateKeyFromPassphrase = (passphrase) => {
  const hash = CryptoJS.SHA256(passphrase).toString();
  const p = hexToBigInt(DH_P);
  const min = BigInt(2);
  const max = p - BigInt(2);
  
  // Use hash to generate deterministic private key
  let privateKey = BigInt('0x' + hash);
  privateKey = min + (privateKey % (max - min));
  
  return privateKey;
};

// Store passphrase locally (in localStorage)
const storePassphrase = (passphrase) => {
  try {
    localStorage.setItem('crypttalk_passphrase', passphrase);
    return true;
  } catch (error) {
    console.error('Failed to store passphrase:', error);
    return false;
  }
};

// Get stored passphrase
const getStoredPassphrase = () => {
  try {
    return localStorage.getItem('crypttalk_passphrase');
  } catch (error) {
    console.error('Failed to get stored passphrase:', error);
    return null;
  }
};

// Clear stored passphrase
const clearStoredPassphrase = () => {
  try {
    localStorage.removeItem('crypttalk_passphrase');
    return true;
  } catch (error) {
    console.error('Failed to clear passphrase:', error);
    return false;
  }
};

export {
  generatePublicKey,
  deriveSharedSecret,
  deriveAESKey,
  encryptMessage,
  decryptMessage,
  generatePrivateKeyFromPassphrase,
  storePassphrase,
  getStoredPassphrase,
  clearStoredPassphrase,
  DH_G,
  DH_P
}; 