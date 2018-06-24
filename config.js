'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/favehikes-data';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/favehikes-data-test';

exports.PORT = process.env.PORT || 3000;
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 8080;

exports.SECRET = process.env.SECRET || 'new secret'; 

exports.TESTING = false