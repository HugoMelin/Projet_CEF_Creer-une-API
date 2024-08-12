const User = require('../models/user');
const { body, validationResult } = require('express-validator')

exports.getById = async (req, res, next) => {
    const id = req.params.id 

    try {
        let user = await User.findById(id);

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json('user-not-found');
    } catch (e) {
        return res.status(501).json(e);
    }
}

exports.add = [
    // Définition des règles de validation
        body('name').isLength({ min: 3 }).withMessage('Le nom doit contenir au moins 3 caractères'),
        body('email').isEmail().normalizeEmail().withMessage('Veuillez entrer une adresse email valide'),
        body('password').isStrongPassword({ minLength: 3, minLowercase: 1, minUppercase: 0, minNumbers: 0, minSymbols: 0 }).withMessage('Le mot de passe doit contenir au moins 3 caractères et une minuscule.'),

    // Fonction de traitement de la requête
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const temp = ({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        try {
            let user = await User.create(temp);

            return res.status(201).json(user);
        } catch (e) {
            return res.status(501).json(e);
        }
    }
];


exports.update = [
    // Définition des règles de validation
    body('name').optional().isLength({ min: 3 }).withMessage('Le nom doit contenir au moins 3 caractères'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Veuillez entrer une adresse email valide'),
    body('password').optional().isStrongPassword({ minLength: 3, minLowercase: 1, minUppercase: 0, minNumbers: 0, minSymbols: 0 }).withMessage('Le mot de passe doit contenir au moins 3 caractères et une minuscule.'),

    // Fonction de traitement de la requête
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const temp = ({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        const id = req.params.id;

        try {
            let user = await User.findOne({_id : id});

            if (user) {
                Object.keys(temp).forEach((key) => {
                    if (!!temp[key]) {
                        user[key] = temp[key];
                    }
                });

                await user.save();
                return res.status(201).json(user);
            }

            return res.status(404).json("user_not_found");
        } catch (e) {
            return res.status(501).json(e);
        }
    }
];

exports.delete = async (req, res, next) => {
    const id = req.params.id 

    try {
        await User.deleteOne({ _id: id });

        return res.status(204).json('delete_ok');
    } catch (e) {
        return res.status(501).json(e)
    }
}