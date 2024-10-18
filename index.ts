import { encryptFile, decryptFile } from "./encryptDecrypt";

async function main() {
  const action = process.argv[2];
  const filePath = process.argv[3];
  const password = process.argv[4];

  if (!action || !filePath || !password) {
    console.error("Usage: npm start <encrypt/decrypt> <filePath> <password>");
    process.exit(1);
  }

  if (action === "encrypt") {
    await encryptFile(filePath, password);
  } else if (action === "decrypt") {
    await decryptFile(filePath, password);
  } else {
    console.error('Action must be either "encrypt" or "decrypt"');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
