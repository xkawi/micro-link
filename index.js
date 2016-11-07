const marked = require('marked');
const readFileSync = require('fs').readFileSync;
const { parse } = require('url');
const { json, send, sendError } = require('micro');
const { generateDynamicLink, parseDynamicLink, tokenParamKey } = require('./lib/core');

/**
 * handle thrown error and response properly
 */
async function onError(err, res) {
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack)
  }

  send(res, err.statusCode || 500, {
    error: true,
    message: err.message
  });
}

/**
 * handle POST requests
 */
async function onPost(req) {
  const data = await json(req);
  if (!data.web) {
    const error = new Error(
      `Please provide the web link as fallback url.`
    );
    error.statusCode = 400;
    throw error;
  }
  // TODO: take android package name
  const link = await generateDynamicLink(data);
  return { link };
}

/**
 * handle GET requests
 */
async function onGet(req, res) {
  const { path, query } = await parse(req.url, true);

  if (query[tokenParamKey]) {
    const redirectTo = await parseDynamicLink(query[tokenParamKey], req.headers['user-agent']);
    res.setHeader('Location', redirectTo);
    return send(res, 301);
  }

  if (path === '/') {
    const readme = readFileSync('./README.md', 'utf-8');
    const html = marked(readme);
    res.setHeader('Content-Type', 'text/html');
    send(res, 200, html);
  } else {
    send(res, 404, '404 Not Found!');
  }
}

module.exports = async function (req, res) {
  try {
    switch (req.method) {
      case 'POST':
        return await onPost(req);
      case 'GET':
        return await onGet(req, res);
      default:
        send(res, 405, 'Invalid Method!');
        break;
    }
  } catch (err) {
    return await onError(err, res);
  }
};