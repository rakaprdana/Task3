import fs from "fs";
import path from "path";

function getLogFileName(): string {
  const now = new Date();
  const fileName = `${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}_${
    now.getMonth() + 1
  }_${now.getDate()}_${now.getFullYear()}.log`;
  return path.join(__dirname, "../logs", fileName);
}

export async function logMessage(message: string): Promise<void> {
  const logFile = getLogFileName();
  const logEntry = `[${new Date().toISOString()}] ${message}\n`;

  try {
    await fs.promises.mkdir(path.dirname(logFile), { recursive: true });
    await fs.promises.appendFile(logFile, logEntry, "utf8");
  } catch (error) {
    console.error("Error logging message:", error);
  }
}
