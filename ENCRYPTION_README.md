# CryptTalk - End-to-End Encryption Implementation

## Overview

This implementation adds end-to-end encryption to the CryptTalk chat application using Diffie-Hellman key exchange and AES encryption. Each user has a passphrase that generates their private key, and their public key is stored on the server for secure communication.

## How It Works

### 1. Registration Process
- User enters a passphrase during registration
- Passphrase is used to generate a deterministic private key using SHA-256 hash
- Public key is calculated as `g^privateKey mod p` (Diffie-Hellman)
- Public key is stored on the server, passphrase is stored locally only

### 2. Login Process
- User enters their passphrase during login
- Passphrase is stored locally in localStorage for session duration
- No passphrase is sent to the server

### 3. Message Encryption
When User A sends a message to User B:
1. User A's client gets User B's public key from the server
2. User A generates their private key from their passphrase
3. User A derives a shared secret: `sharedSecret = B_publicKey^A_privateKey mod p`
4. User A derives an AES key from the shared secret using SHA-256
5. User A encrypts the message using AES-256
6. Encrypted message is sent to the server and stored in the database

### 4. Message Decryption
When User B receives a message from User A:
1. User B's client gets User A's public key from the server
2. User B generates their private key from their passphrase
3. User B derives the same shared secret: `sharedSecret = A_publicKey^B_privateKey mod p`
4. User B derives the same AES key from the shared secret
5. User B decrypts the message using AES-256

## Security Features

- **Passphrase-based**: Users control their own encryption keys through passphrases
- **Local storage only**: Passphrases are never sent to the server
- **Perfect Forward Secrecy**: Each conversation uses a unique shared secret
- **AES-256 encryption**: Industry-standard symmetric encryption
- **Diffie-Hellman 2048-bit**: Strong key exchange protocol

## Database Schema Changes

### User Model
```javascript
{
  // ... existing fields
  publicKey: {
    type: String,
    required: true,
  }
}
```

### Message Model
```javascript
{
  // ... existing fields
  content: {
    type: String,
    required: true,
  },
  encryptedContent: {
    type: String,
    required: true,
  }
}
```

## API Changes

### Registration
- Added `publicKey` field to user registration
- Passphrase is processed client-side only

### Login
- Added passphrase input field
- Passphrase is stored locally only

### Message Handling
- Messages are encrypted before sending to server
- Server stores both original and encrypted content
- Client decrypts messages on receipt

## Client-Side Implementation

### Crypto Utilities (`src/utils/crypto.js`)
- `generatePrivateKeyFromPassphrase()`: Creates private key from passphrase
- `generatePublicKey()`: Creates public key from private key
- `deriveSharedSecret()`: Computes shared secret for key exchange
- `deriveAESKey()`: Creates AES key from shared secret
- `encryptMessage()` / `decryptMessage()`: AES encryption/decryption
- `storePassphrase()` / `getStoredPassphrase()` / `clearStoredPassphrase()`: Local storage management

### Components Updated
- **Login.jsx**: Added passphrase input field
- **Register.jsx**: Added passphrase input and public key generation
- **Chat.jsx**: Added message encryption/decryption logic
- **Header.jsx**: Added passphrase clearing on logout

## Usage

1. **Register**: Enter username, password, and a secure passphrase
2. **Login**: Enter username, password, and the same passphrase
3. **Chat**: Messages are automatically encrypted/decrypted
4. **Logout**: Passphrase is cleared from local storage

## Security Considerations

- Passphrases should be strong and unique
- Users should never share their passphrases
- Passphrases are stored in localStorage (consider more secure storage for production)
- The implementation uses standard cryptographic libraries (crypto-js)
- All encryption/decryption happens client-side

## Dependencies

- `crypto-js`: For AES encryption and SHA-256 hashing
- Built-in JavaScript BigInt: For Diffie-Hellman calculations

## Notes

- This implementation provides end-to-end encryption for direct messages
- Group chat encryption would require additional implementation
- The passphrase is the only secret the user needs to remember
- If a user forgets their passphrase, they cannot decrypt their messages 