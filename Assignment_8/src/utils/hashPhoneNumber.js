import crypto from "crypto";

// Hash the phone number with a salt using SHA-256
export function hashPhoneNumber(phoneNumber, salt) {
  const dataToHash = phoneNumber + salt;

  const hashObj = crypto.createHash("sha256");
  hashObj.update(dataToHash);

  return hashObj.digest("hex");
}
