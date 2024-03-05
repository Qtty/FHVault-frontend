import { getInstance } from '../../fhevmjs';
import { FhevmInstance } from 'fhevmjs';
import {Buffer} from 'buffer';

export function generateSecurePassword(length: number = 16): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':\",./<>?";
    let password = "";
    const windowCrypto = window.crypto || (window as any).msCrypto; // for IE 11

    for (let i = 0; i < length; i++) {
        const randomValue = windowCrypto.getRandomValues(new Uint32Array(1))[0];
        password += charset[randomValue % charset.length];
    }

    return password;
}

function str_to_int(str: String) {
  const hex = Buffer.from(str, "utf8").toString("hex");

  // Convert hex to BigInt
  const bigInt = BigInt("0x" + hex);

  return Number(bigInt);
}

function int_to_str(intValue: number) {
  // Convert the integer to a hex string
  let hex = intValue.toString(16);
  // Ensure hex string length is even for proper parsing
  if (hex.length % 2 !== 0) hex = "0" + hex;

  // Convert the hex string back to the original string
  return Buffer.from(hex, "hex").toString("utf8");
}

export function encryptPassword(generatedPassword: string): Array<Uint8Array> {
    let instance: FhevmInstance = getInstance();
    let password = [];
    for (let i = 0; i < generatedPassword.length; i += 4) {
      // Split the password into parts of four characters
      let part = generatedPassword.substring(i, i + 4);
      // Convert each part to an integer and apply encrypt32
      let encryptedPart = instance.encrypt32(str_to_int(part)); // Assuming encrypt32 is an async function
      password.push(encryptedPart);
    }

    return password;
}