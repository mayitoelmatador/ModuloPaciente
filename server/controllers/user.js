const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");
const { query } = require("express");

function signUp(req, res){
    const user = new User();
    const {name,lastname,email,password,repeatPassword,role} = req.body;

    user.name = name;
    user.lastname = lastname;
    user.role="user";
    user.email = email.toLowerCase();

        if(!password || !repeatPassword){
            res.status(404).send({message: "Las contraseñas son obligatorias."});
        }else{
            if(password !== repeatPassword){
                res.status(404).send({message: "Las contraseñas no son iguales."});
            }else{
                bcrypt.hash(password,null,null,function(err,hash){
                    if(err){
                        res.status(500).send({message: "Error al encriptar la contraseña."});
                    }else{
                        user.password = hash;
                        //res.status(200).send({message: hash});
                        user.save((err,userStored) =>{
                            if(err){
                                res.status(500).send({message: "El usuario ya existe."});
                            }else{
                                if(!userStored){
                                    res.status(404).send({message: "Error al crear al usuario"});
                                }else{
                                    res.status(200).send({user: userStored});
                                }
                            }
                        } )
                    }
                })
                // res.status(200).send({message: "Usuario Creado"});
            }
        }
}

function signIn(req,res){
    const params = req.body;
    const email = params.email.toLowerCase(); 
    const password = params.password;

    User.findOne({email},(err, userStored)=> {
        if(err){
            res.status(500).send({message: "Error del servidor"});
        }else{
            if(!userStored){
                res.status(404).send({message: "Usuario no encontrado"});
            }else{
                bcrypt.compare(password, userStored.password, (err, check) => {
                    if(err){
                        res.status(500).send({message: "Error del servidor."});
                    }else if(!check){
                        res.status(404).send({message: "La contraseña es incorrecta."});
                    }else{
                        res.status(200).send({
                            accessToken: jwt.createAccessToken(userStored),
                            refreshToken: jwt.createRefreshToken(userStored)
                        });
                    }
                });
            }
        }
    });
}

function getUser(req,res){
    User.find().then(users =>{
        if(!users){
            res.status(404).send({message: "No se ha encontrado ningun usuario"});
        }else{
            res.status(200).send({users});
        }
    });
}

module.exports = {
    signUp,
    signIn,
    getUser
};