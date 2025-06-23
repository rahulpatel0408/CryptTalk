// ✅ Updated crypto.js with persistent key pair using IndexedDB

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
  const sharedKey = await window.crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: publicKey,
    },
    privateKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const rawKey = await window.crypto.subtle.exportKey("raw", sharedKey);
  console.log("🔐 Derived Shared Secret (raw bytes):", new Uint8Array(rawKey));
  return sharedKey;
}

export async function encryptMessage(message, key) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  console.log("🧪 IV used for encryption:", iv);

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    data
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: Array.from(iv),
  };
}

export async function decryptMessage(encryptedJson, key) {
  let parsed;
  try {
    parsed = typeof encryptedJson === "string" ? JSON.parse(encryptedJson) : encryptedJson;
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
  } catch (e) {
    console.error("❌ JSON parse failed:", encryptedJson);
    throw e;
  }

  const { ciphertext, iv } = parsed;

  console.log("🧪 Ciphertext to decode:", ciphertext);
  console.log("🧪 IV used for decryption:", iv);

  if (!ciphertext) throw new Error("Ciphertext missing");

  const binaryStr = atob(ciphertext);
  const data = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    data[i] = binaryStr.charCodeAt(i);
  }

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

// ✅ IndexedDB Storage Functions
export async function saveKeyPair(chatId, keyPair) {
  const db = await openKeyDB();
  const tx = db.transaction("keys", "readwrite");
  await tx.objectStore("keys").put(keyPair.privateKey, `${chatId}_private`);
  await tx.objectStore("keys").put(keyPair.publicKey, `${chatId}_public`);
}

export async function loadKeyPair(chatId) {
  const db = await openKeyDB();
  const tx = db.transaction("keys", "readonly");
  const store = tx.objectStore("keys");
  const privateKey = await promisifyRequest(store.get(`${chatId}_private`));
  const publicKey = await promisifyRequest(store.get(`${chatId}_public`));
  if (privateKey && publicKey) return { privateKey, publicKey };
  return null;
}

function openKeyDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("keyStore", 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("keys");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
