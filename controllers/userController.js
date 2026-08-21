
const crypto = require("crypto");
const util = require("util");

const pool = require("../db/pg-pool");
const { userSchema } = require("../validation/userSchema");

const scrypt = util.promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);

  return `${salt}:${derivedKey.toString("hex")}`;
}

async function comparePassword(inputPassword, storedHash) {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [salt, storedKey] = storedHash.split(":");
  const derivedKey = await scrypt(inputPassword, salt, 64);
  const storedKeyBuffer = Buffer.from(storedKey, "hex");

  if (storedKeyBuffer.length !== derivedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedKeyBuffer, derivedKey);
}

const register = async (req, res, next) => {
  if (!req.body) {
    req.body = {};
  }

  const { error, value } = userSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  try {
    const hashedPassword = await hashPassword(value.password);

    const result = await pool.query(
      `INSERT INTO users (email, name, hashed_password)
       VALUES ($1, $2, $3)
       RETURNING id, email, name`,
      [value.email, value.name, hashedPassword],
    );

    const newUser = result.rows[0];

    global.user_id = newUser.id;

    return res.status(201).json({
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    return next(err);
  }
};

const logon = async (req, res, next) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    const result = await pool.query(
      "SELECT id, email, name, hashed_password FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const goodCredentials =
      typeof password === "string" &&
      (await comparePassword(password, user.hashed_password));

    if (!goodCredentials) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    global.user_id = user.id;

    return res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    return next(err);
  }
};

const logoff = (req, res) => {
  global.user_id = null;

  return res.status(200).json({
    message: "Logged off successfully",
  });
};

module.exports = {
  register,
  logon,
  logoff,
};
