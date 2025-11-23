// server/src/middleware/validationMiddleware.js

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

// Sanitize input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Validate request body
export const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (username.length < 2 || username.length > 50) {
    return res.status(400).json({ message: 'Username must be between 2 and 50 characters' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  // Sanitize inputs
  req.body.username = sanitizeInput(username);
  req.body.email = sanitizeInput(email).toLowerCase();

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Log for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('Login validation - Request body:', JSON.stringify(req.body));
    console.log('Login validation - email:', email ? `"${email}"` : 'missing', 'password:', password ? 'provided' : 'missing');
  }

  if (!email || !password) {
    const missing = [];
    if (!email) missing.push('email');
    if (!password) missing.push('password');
    return res.status(400).json({ 
      message: `Missing required fields: ${missing.join(', ')}`,
      missing: missing
    });
  }

  // Check if email is a string
  if (typeof email !== 'string') {
    return res.status(400).json({ message: 'Email must be a string' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  req.body.email = sanitizeInput(email).toLowerCase();

  next();
};

