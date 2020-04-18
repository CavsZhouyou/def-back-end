// Strings
export const paramMissingError = '缺少一个或多个必需参数。';
export const loginFailedErr = 'Login failed';
export const onlineAddress = 'http://online.def.com';
export const dailyAddress = 'http://daily.def.com';

// Numbers
export const pwdSaltRounds = 12;

// Cookie Properties
export const cookieProps = Object.freeze({
  key: 'ExpressGeneratorTs',
  secret: process.env.COOKIE_SECRET,
  options: {
    httpOnly: true,
    signed: true,
    path: process.env.COOKIE_PATH,
    maxAge: Number(process.env.COOKIE_EXP),
    domain: process.env.COOKIE_DOMAIN,
    secure: process.env.SECURE_COOKIE === 'true',
  },
});
