// import crypto from "node:crypto";

// export const generateEncyption=async(plaintext:string):Promise<{iv:string,ciphertext:string}>=>{
//     const iv=crypto.randomBytes(16);
//     // Implementation for encryption logic
//     const cipherIvVector=crypto.createCipheriv("aes-256-cbc",10,iv);
//      let ciphertext=cipherIvVector.update(plaintext,"utf-8","hex");
//      ciphertext+=cipherIvVector.final("hex");
//      console.log({iv,cipherIvVector,ciphertext,ivv:iv.toString("hex")})
//      return {iv:iv.toString("hex"),ciphertext}
// }

// export const generateDecyption=async(ciphertext:string):Promise<string>=>{
//     const {iv,encryption}=ciphertext.split(":") || [] as string[];
//     if(!iv || !encryption){
//         throw new Error("Invalid ciphertext format. Expected format: 'iv:ciphertext'");
//     }
//     // Implementation for encryption logic
//    const ivLikeBinary=Buffer.from(iv,"hex");
//    const decipherIvVector=crypto.createDecipheriv("aes-256-cbc",10,ivLikeBinary);
//      let plaintext=decipherIvVector.update(encryption,"hex","utf-8");
//      plaintext+=decipherIvVector.final("utf-8");
//      console.log({ivLikeBinary,decipherIvVector,plaintext})
//      return plaintext;
// }








import crypto from "crypto";

// 🔐 بدل config
const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update("my_super_secret_key")
  .digest();

const IV_LENGTH = 16;


// 🔐 Encryption
export const generateEncryption = async (
  plaintext: string
): Promise<string> => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    ENCRYPTION_KEY,
    iv
  );

  let encrypted = cipher.update(plaintext, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};


// 🔓 Decryption
export const generateDecryption = async (
  ciphertext: string
): Promise<string> => {
  const [ivHex, encrypted] = ciphertext.split(":");

  if (!ivHex || !encrypted) {
    throw new Error("Invalid ciphertext format");
  }

  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    ENCRYPTION_KEY,
    iv
  );

  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
};