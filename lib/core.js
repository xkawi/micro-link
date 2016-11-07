const useragent = require('useragent');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'tHis1sLean54cretH54'; // change accordingly
const tokenQueryKey = process.env.TOKEN_QUERY_KEY || 'token';

/**
 * generate dynamic link
 */
const generateDynamicLink = async (data) => {
  const token = jwt.sign(data, jwtSecret);
  const isProd = 'production' === process.env.NODE_ENV;
  const leanHost = isProd ? (process.env.HOST_URL || process.env.NOW_URL) : 'localhost:3000';
  return `${leanHost}?${tokenQueryKey}=${token}`;
}

/**
 * returns the appropriate url to redirect
 */
const parseDynamicLink = async (token, reqUserAgent) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const agent = useragent.parse(reqUserAgent);
    const agentOs = agent.os.toJSON();
    
    const isiOS = !!agentOs.family.match(/iOS/);
    if (isiOS && decoded.ios) {
      return decoded.ios; 
    }
    
    const isAndroid = !!agentOs.family.match(/Android/);
    if (isAndroid && decoded.android) {
      // TODO: properly parsed android deeplink
      // split the first :// from the url string
      // var split = url.split(/:\/\/(.+)/)
      // var scheme = split[0]
      // var path = split[1] || ''
      //'intent://' + path + '#Intent;scheme=' + scheme + ';package=' + android_package_name + ';end;'
      return decoded.android;
    }

    return decoded.web
  } catch (err) {
    throw err;
  }
}

module.exports = {
  generateDynamicLink,
  parseDynamicLink,
  tokenQueryKey
}