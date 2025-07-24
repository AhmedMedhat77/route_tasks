import jwt from "jsonwebtoken";

// in future will be stored in env but for seek of Assignment this saved here
const tokenSecret =
  "Hqum/OZ3VePuAi3UzFuxQajtVACrUYglv/z+DoLEUlT1qTN2Npmdmn5u8opJr47IOiCaujSeWokotwAD";

const generateJWT = (_id, expiresIn = "1h") => {
  return jwt.sign({ _id }, tokenSecret, { expiresIn });
};

export const verifyJWT = async (token) => {
  try {
    const decoded = jwt.verify(token, tokenSecret);
    return decoded;
  } catch (error) {
    return null;
  }
};

export default generateJWT;
