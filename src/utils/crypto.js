// crypto.js

export async function generateKeyPair() {
  return window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );
}

export async function exportPublicKey(key) {
  const raw = await window.crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

export async function importPublicKey(base64) {
  const raw = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    "raw",
    raw,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
  );
}

export async function deriveSharedSecret(privateKey, publicKey) {
  return window.crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: publicKey,
    },
    privateKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMessage(message, key) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // GCM IV

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    data
  );

  return JSON.stringify({
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: Array.from(iv),
  });
}

export async function decryptMessage(encryptedJson, key) {
  const { ciphertext, iv } = JSON.parse(encryptedJson);
  const data = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(iv),
    },
    key,
    data
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
