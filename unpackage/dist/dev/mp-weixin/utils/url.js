"use strict";
const BASE_URL = "https://xinliang.fun/api/wx";
const getAvatarUrl = (url) => {
  if (!url)
    return "";
  if (url.startsWith("http"))
    return url;
  const normalizedUrl = url.replace(/\\/g, "/");
  return `${BASE_URL}${normalizedUrl}`;
};
exports.getAvatarUrl = getAvatarUrl;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/url.js.map
