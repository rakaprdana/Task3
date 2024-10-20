import { promises as fs } from "fs";
import path, { format } from "path";

const logFilePath = path.join(__dirname, "activity.log");

export async function logActivity(message: string): Promise<void> {
  const logMessage = `${new Date().toLocaleString()} - ${message}\n`;
  try {
    await fs.appendFile(logFilePath, logMessage);
  } catch (error) {
    console.error(`Failed to write log: ${error}`);
  }
}
