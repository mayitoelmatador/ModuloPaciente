const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "gR7cH9Svfj8JLe4c186Ghs48hheb3902nh5DsA";

//CREAR TOKEN
exports.createAccessToken = function(user){
    //No pongo contraseña por seguridad
    const payload = {
        id:user._id,
        email:user.email,
        role:user.role,
        createToken:moment().unix(),
        exp:moment().add(3,"hours").unix()      //expira cada 3 horas

    };
    return jwt.encode(payload,SECRET_KEY);
};
//REFRESCAR TOKEN
exports.createRefreshToken = function(user){
    const payload = {
        id:user._id,
        exp:moment().add(30,"days").unix
    };
    return jwt.encode(payload,SECRET_KEY);
};

//Descodificar
exports.decodedToken = function(token){
    return jwt.decode(token,SECRET_KEY,true);
}



