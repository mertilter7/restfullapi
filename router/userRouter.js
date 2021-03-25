const router = require('express').Router();
const User = require('../models/userModel');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    const allUsers = await User.find({});
    res.json(allUsers)
});
router.get('/:id', (req, res) => {
    res.json({mesaj:"idsi :"+ req.params.id+" olan tüm userlar listelenecek"})
});
router.post('/', async (req, res,next) => {
    try {
        const addUser = new User(req.body);
        addUser.sifre = await bcrypt.hash(addUser.sifre, 10);
        const {error, value} = addUser.joiValidation();
            if (error) {
                next(createError(400, error));
            } else {
                const value = await addUser.save();
                res.json(value);
            }
      
    }catch(err) {
        next(err);
        
    }
});
router.post('/signIn', async (req,res,next) => {
    try {
    const user = await User.signIn(req.body.email, req.body.sifre);
        res.json(user);
    }catch (err) {
            next(err);
    }
});

router.patch('/:id', async (req,res,next) => {
    delete req.body.createdAt;
    delete req.body.updatedAt;
        if(req.body.hasOwnProperty('sifre')){
            req.body.sifre = await bcrypt.hash(req.body.sifre, 10);
        }
    const {error,value} = User.joiValidationForUpdate(req.body);
    if (error) {
        next(createError(400,error));
    } else {
        try{
            const value = await User.findByIdAndUpdate({_id:req.params.id}, req.body, {new:true , runValidators: true});
            if(value){
                return res.json(value);
            } else {
                return res(404).json({
                    mesaj : "Kullanici Bulunamadi"
                });
            }
        }catch(e) {
           next(e);
        }
    }
   
});
router.delete('/:id', async  (req,res, next) => {
    try{
        const value = await User.findByIdAndDelete({_id:req.params.id});
        if(value){
            return res.json({
                mesaj : "kullanici silindi"
            });
        }else {
            throw createError(404, 'Kullanıcı Bulunamadı');
           // return res.status(404).json({
           //     mesaj : " Kullanici Bulunamadi "
           // })
        }
    }catch(e){
        next(e);
    }
});
module.exports = router;