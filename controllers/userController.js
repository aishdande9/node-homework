
const crypto = require("crypto");
const util = require("util");

const pool = require("../db/pg-pool");
const prisma = require("../db/prisma");
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

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: value.email,
          name: value.name,
          hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      const welcomeTaskData = [
        {
          title: "Complete your profile",
          priority: "medium",
          userId: newUser.id,
        },
        {
          title: "Add your first task",
          priority: "high",
          userId: newUser.id,
        },
        {
          title: "Explore the app",
          priority: "low",
          userId: newUser.id,
        },
      ];

      await tx.task.createMany({
        data: welcomeTaskData,
      });

      const welcomeTasks = await tx.task.findMany({
        where: {
          userId: newUser.id,
          title: {
            in: welcomeTaskData.map((task) => task.title),
          },
        },
        select: {
          id: true,
          title: true,
          isCompleted: true,
          userId: true,
          priority: true,
        },
      });

      return {
        user: newUser,
        welcomeTasks,
      };
    });

    global.user_id = result.user.id;

    return res.status(201).json({
      user: result.user,
      welcomeTasks: result.welcomeTasks,
      transactionStatus: "success",
    });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    return next(err);
  }
};
const logon = async (req, res, next) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
    

    const goodCredentials =
      typeof password === "string" &&
      (await comparePassword(password, user.hashedPassword));

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
