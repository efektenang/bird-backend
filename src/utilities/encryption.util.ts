import * as crypto from "crypto";
import * as cryptoJS from "crypto-js";

const algorithm = "aes-256-cbc";

interface IEncryptors {
  encrypted: string;
  key: string;
}
export function shortEncrypt(key: string, text: string): IEncryptors {
  const cipher = crypto.createCipheriv(
    algorithm,
    key + process.env.AFX_SHORT_CRYPT_KEY,
    process.env.AFX_SHORT_CRYPT_VCT
  );

  let encryptedData = cipher.update(text, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return {
    encrypted: encryptedData,
    key,
  };
}

export function shortDecrypt(data: IEncryptors) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    data.key + process.env.AFX_SHORT_CRYPT_KEY,
    process.env.AFX_SHORT_CRYPT_VCT
  );
  let decryptedData = decipher.update(data.encrypted, "hex", "utf-8");
  decryptedData += decipher.final("utf8");

  return decryptedData;
}

export function genRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

export function genRandomNumber(length: number): number {
  const randomNumber = Math.floor(Math.random() * 100000000);
  const paddedNumber = randomNumber.toString().padStart(length, "0");

  return parseInt(paddedNumber);
}

export function hashing(password, salt) {
  try {
    const hash = crypto.createHmac("sha256", salt);
    hash.update(`${+process.env.AFX_EXTEND_CRYPTO_KEY}${password}`);
    const value = hash.digest("hex");

    return {
      salt: salt,
      hash: value,
    };
  } catch (er) {
    return null;
  }
}

export function encryptBase64(text: string): string {
  return cryptoJS.enc.Base64.stringify(
    cryptoJS.enc.Utf8.parse(text)
  ).toString();
}

export function decryptBase64(encrypted: string): string {
  return cryptoJS.enc.Utf8.stringify(cryptoJS.enc.Base64.parse(encrypted));
}

export function encryptPassword(password) {
  let salt = genRandomString(+process.env.AFX_LENGTH_SALT);
  let saltHash = hashing(password, salt);
  return saltHash;
}
