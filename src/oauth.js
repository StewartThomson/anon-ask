const token = require("./token");

module.exports.GetOAuthToken = async teamId => {
  const { tokenCache } = await token.getToken();
  if (tokenCache[teamId]) {
    return tokenCache[teamId].oauth_access;
  } else {
    console.error(`Team not found in tokenCache: ${teamId}`);
  }
};
