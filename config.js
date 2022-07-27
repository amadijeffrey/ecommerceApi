var enviroment = {};

enviroment.development = {
    'port':3030,
    'envName':'development',
    'DB':process.env.DB_URL,
    'jwtSecretKey': process.env.JWT_SECRET,
    'jwtExpiry': process.env.JWT_EXPIRES_IN
}

enviroment.production = {
    'port':process.env.PORT || 3030,
    'envName':'production',
    'DB': process.env.DB_URL,
    'jwtSecretKey': process.env.JWT_SECRET,
    'jwtExpiry': process.env.JWT_EXPIRES_IN
}

// Check for present env
var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : false;

// Env to export
var envToExport = typeof(enviroment[currentEnviroment]) == 'object' ? enviroment[currentEnviroment] : enviroment['development'];

module.exports = envToExport;