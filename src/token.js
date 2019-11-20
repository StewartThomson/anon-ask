const tokenCacheFile = __dirname + '/tokenCache.json';

let tokenCache = {};
let userCache = {};
const fsp = require('fs').promises;
const fs = require('fs');

module.exports.getToken = async () => {
  try {
    await fsp.access(tokenCacheFile, fs.constants.F_OK);
  } catch (error) {
    console.log(`could not find ${tokenCacheFile}`);
    return { tokenCache: null, userCache: null };
  }
  try {
    const data = await fsp.readFile(tokenCacheFile, 'utf8');
    const [tokenCache, userCache] = JSON.parse(data);
    return { tokenCache, userCache };
  } catch (error) {
    throw new Error(`Error reading file ${tokenCacheFile}`);
  }
};
//Ensure token cache file exists before reading
