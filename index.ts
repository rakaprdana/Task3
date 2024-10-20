import { encryptFile, decryptFile } from "./encryptDecrypt";
import path from "path";

async function main() {
  const filePath = path.join(__dirname, "file.txt");
  const password = "password";

  // Enkripsi file
  await encryptFile(filePath, password);

  // Dekripsi file
  const encryptedFilePath = filePath + ".enc";
  await decryptFile(encryptedFilePath, password);
}

main().catch((error) =>
  console.error(`Error in main function: ${error.message}`)
);
