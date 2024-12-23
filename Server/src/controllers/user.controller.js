import { asyncHandler } from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({message: "User registered successfully"});
});

const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json({message: "User logged in successfully"});
});

const logoutUser = asyncHandler(async (req, res) => {
    res.status(200).json({message: "User logged out successfully"});
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    res.status(200).json({message: "Access token refreshed successfully"});
});

export { registerUser };
export { loginUser };
export { logoutUser };
export { refreshAccessToken };