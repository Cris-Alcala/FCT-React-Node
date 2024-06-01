const AWS = require('aws-sdk');
const S3 = require('aws-sdk/clients/s3');

AWS.config.update({
  accessKeyId: '7bed1910200f8c14b9617e8ec8c760ef',
  secretAccessKey: 'd754215799502437e4201b49b2cbe9d4f6d85f84792daf96c526f2b4bc8ba235',
  region: 'weur'
});

const s3 = new S3({
  endpoint: 'https://9fa76778529463aa0f767283903fc346.r2.cloudflarestorage.com',
  s3ForcePathStyle: true
});

module.exports = { AWS, s3 };

