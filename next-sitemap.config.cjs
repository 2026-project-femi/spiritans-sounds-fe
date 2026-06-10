/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.APP_URL || 'https://spiritanssound.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/payload-types', '/admin/*'],
};
