import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
} from "node:crypto";
import { promises as fs } from "fs";
import path from "path";
import { logActivity } from "./logger";

const algorithm = "aes-192-cbc";
const keyLength = 24;
const ivLength = 16;

async function generateKey(password: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, "salt", keyLength, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

export async function encryptFile(
  filePath: string,
  password: string
): Promise<void> {
  try {
    const key = await generateKey(password);
    const iv = randomBytes(ivLength);
    const cipher = createCipheriv(algorithm, key, iv);

    const fileData = await fs.readFile(filePath);
    const encryptedData = Buffer.concat([
      iv,
      cipher.update(fileData),
      cipher.final(),
    ]);
    const encryptedBase64 = encryptedData.toString("base64");

    const encryptedFilePath = path.join(
      path.dirname(filePath),
      path.basename(filePath) + ".enc"
    );
    await fs.writeFile(encryptedFilePath, encryptedBase64);

    await logActivity(`File terenkripsi: ${encryptedFilePath}`);
    console.log(
      new Date().toLocaleString(),
      `: File berhasil terenkripsi: ${encryptedFilePath}`
    );
  } catch (error) {
    await logActivity(`Enkripsi gagal: ${error}`);
    console.error(`Enkripsi gagal: ${error}`);
  }
}

export async function decryptFile(
  encryptedFilePath: string,
  password: string
): Promise<void> {
  try {
    const key = await generateKey(password);
    const encryptedBase64 = await fs.readFile(encryptedFilePath, "utf8");

    const encryptedData = Buffer.from(encryptedBase64, "base64");

    const iv = encryptedData.subarray(0, ivLength);
    const encryptedContent = encryptedData.subarray(ivLength);
    const decipher = createDecipheriv(algorithm, key, iv);

    const decryptedData = Buffer.concat([
      decipher.update(encryptedContent),
      decipher.final(),
    ]);

    const decryptedFilePath = encryptedFilePath.replace(".enc", ".dec");
    await fs.writeFile(decryptedFilePath, decryptedData);

    await logActivity(`File terdekripsi: ${decryptedFilePath}`);
    console.log(
      new Date().toLocaleString(),
      `: File berhasil terdekripsi: ${decryptedFilePath}`
    );
  } catch (error) {
    await logActivity(`Dekripsi gagal: ${error}`);
    console.error(`Dekripsi gagal: ${error}`);
  }
}
