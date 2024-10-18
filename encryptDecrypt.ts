import fs from "fs";
import path from "path";
import crypto from "crypto";
import { logMessage } from "./logger";

const algorithm = "aes-256-cbc";
const iv = crypto.randomBytes(16);

function getKey(password: string): Buffer {
  return crypto.createHash("sha256").update(password).digest();
}

export async function encryptFile(
  filePath: string,
  password: string
): Promise<void> {
  try {
    await logMessage(`Mulai mengenkripsi file ${filePath}`);
    const key = getKey(password);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(`${filePath}.enc`);

    input.pipe(cipher).pipe(output);

    output.on("finish", async () => {
      await logMessage(`Berhasil mengenkripsi file ${filePath}`);
    });
  } catch (error) {
    await logMessage(`Error ketika mengenkripsi file: ${error}`);
  }
}

export async function decryptFile(
  encryptedFilePath: string,
  password: string
): Promise<void> {
  try {
    await logMessage(`Mulai mendekripsi file ${encryptedFilePath}`);
    const key = getKey(password);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const input = fs.createReadStream(encryptedFilePath);
    const outputFilePath = encryptedFilePath.replace(/\.enc$/, "");
    const output = fs.createWriteStream(outputFilePath);

    input.pipe(decipher).pipe(output);

    output.on("finish", async () => {
      await logMessage(`Berhasil mendekripsi file ${encryptedFilePath}`);
    });
  } catch (error) {
    await logMessage(`Error ketika mendekripsi file: ${error}`);
  }
}
