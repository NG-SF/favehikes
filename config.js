'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/favehikes-data';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/favehikes-data-test';

exports.PORT = process.env.PORT || 3000;
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

exports.TESTING = false