import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "secret";

const generateToken = (id: string) => {
  const token = jwt.sign({ id }, secretKey, { expiresIn: "30d" });
  return token;
};

export default generateToken;
