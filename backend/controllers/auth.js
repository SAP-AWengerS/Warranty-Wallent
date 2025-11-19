const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user-model");
const ErrorHandler = require("../middleware/errorHandlers");
const { catchAsyncError } = require("../middleware/catchAsyncError");

//Create OAuth2Client instance
let client;
try {
  client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
} catch (error) {
  console.error("Failed to create OAuth2Client:", error);
}

module.exports.signUpWithGoogle = catchAsyncError(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("Google token not provided", 400));
  }

  // Add debugging information
  console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
  console.log("Received token (first 50 chars):", token.substring(0, 50) + "...");

  try {
    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Token payload audience:", payload.aud);
    console.log("Expected audience:", process.env.GOOGLE_CLIENT_ID);

    const userId = payload.sub;
    const email = payload.email;
    const picture = payload.picture;
    const name = payload.name || "User";

    // Validate required fields from Google payload
    if (!userId || !email) {
      return next(new ErrorHandler("Invalid Google token payload", 400));
    }

    let user = await User.findOne({ googleId: userId });

    if (!user) {
      // Create a new user if not found
      user = new User({
        googleId: userId,
        email,
        name,
        isSubscribed: false,
        createdAt: new Date(),
      });
      await user.save();
    }

    // Create JWT token
    const jwtToken = jwt.sign(
      {
        userId,
        name,
        email,
        picture,
      },
      process.env.SECRETKEY,
      { expiresIn: "7d" }
    );

    // Respond with user data and token
    res.status(200).json({
      code: 200,
      message: "Google authentication successful",
      user: {
        userId,
        email,
        picture,
        name,
        isSubscribed: user.isSubscribed
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error("Token verification or user handling failed:", error);

    // Provide more specific error messages
    if (error.message && error.message.includes("audience")) {
      console.error("Audience mismatch - Check your GOOGLE_CLIENT_ID environment variable");
      return next(new ErrorHandler("Google Client ID mismatch. Please check your configuration.", 401));
    } else if (error.message && error.message.includes("Token used too late")) {
      return next(new ErrorHandler("Google token has expired", 401));
    } else if (error.message && error.message.includes("Invalid token signature")) {
      return next(new ErrorHandler("Invalid Google token signature", 401));
    }

    return next(new ErrorHandler("Google authentication failed: " + error.message, 401));
  }
});

module.exports.whoami = catchAsyncError(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Retrieve token from Authorization header

  if (!token) {
    return next(new ErrorHandler("Token not found", 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);

    res.status(200).json({
      message: "User verified",
      user: decoded,
    });
  } catch (error) {
    res.status(401).json({
      message: "Token expired or invalid",
    });
  }
});

module.exports.logIn = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ErrorHandler("username or password not passed", 400));
  }

  const user = await User.findOne({
    username: username,
  });

  if (!user) {
    return next(new ErrorHandler("Invalid credentials or user not found", 401));
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const token = jwt.sign(
    {
      username: username,
    },
    process.env.SECRETKEY,
    {
      expiresIn: "14h",
    }
  );

  res.json({
    code: 200,
    message: "Login successful",
    token: token,
  });
});

module.exports.signUp = async (req, res, next) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return next(
      new ErrorHandler("username or password not passed or not validated", 400)
    );
  }

  const user = await User.findOne({
    username: username,
  });

  if (user) {
    return res
      .status(409)
      .json({ message: "username already exists", code: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const date = new Date();
  const newUser = new User({
    username: username,
    password: hashedPassword,
    name: name,
    createdAt: {
      string: date.toLocaleString(),
      timestamp: date.getTime(),
    },
  });

  const result = await newUser.save();

  if (result !== null) {
    res.json({
      code: 200,
      message: "User created",
      data: result,
    });
  } else {
    return next(new ErrorHandler("Failed to create user", 500));
  }
};

module.exports.logOut = catchAsyncError(async (req, res, next) => {
  try {
  } catch (error) {}
});

module.exports.changePassword = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ErrorHandler("username or password not found", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.findOneAndUpdate(
    {
      username: username,
    },
    {
      password: hashedPassword,
    }
  );

  if (!user) {
    return next(new ErrorHandler("user password not updated", 400));
  }

  res.json({
    code: 200,
    status: "success",
    user: user,
  });
});
