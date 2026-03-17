const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');
const { refreshTokenCookieOptions } = require('../utils/cookieOptions');

const signup = asyncHandler(async (req, res) => {
  const user = await authService.signupUser(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.loginUser(req.body);

  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions());

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      accessToken,
      user,
    },
  });
});

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const accessToken = await authService.refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    message: 'Access token refreshed',
    data: {
      accessToken,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  await authService.logoutUser(refreshToken);
  res.clearCookie('refreshToken', refreshTokenCookieOptions());

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

module.exports = {
  signup,
  login,
  refresh,
  logout,
};