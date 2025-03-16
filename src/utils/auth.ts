import get from "@/utils/config";
import crypto from "crypto";

const auth = {
  hashPassword: async (password: string): Promise<string> => {
    const salt = crypto.randomBytes(16).toString("hex");
    const iterations = get.hashIterations();
    const keyLen = get.keyLength();
    const digest = get.hasAlgorithm();

    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        iterations,
        keyLen,
        digest,
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(`${salt}:${iterations}:${derivedKey.toString("hex")}`);
        }
      );
    });
  },

  verifyPassword: async (
    password: string,
    storedHash: string
  ): Promise<boolean> => {
    const keyLen = get.keyLength();
    const digest = get.hasAlgorithm();
    const [salt, iterations, hash] = storedHash.split(":");
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        parseInt(iterations),
        keyLen,
        digest,
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(derivedKey.toString("hex") === hash);
        }
      );
    });
  },
};

export default auth;
