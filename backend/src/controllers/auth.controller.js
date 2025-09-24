import { sendWelcomeEmail } from "../emails/email.handler.js"
import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import { loginSchema, signupSchema } from "../validators/auth.validator.js"
import bcrypt from "bcryptjs"
import "dotenv/config"

export const signup = async (req, res) => {
    try {
        const { error, value } = signupSchema.validate(req.body)

        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const { fullName, email, password } = value

        const existingUser = await User.findOne({ email })


        if (existingUser) {
            return res.status(400).json({ message: "Email já cadastrado." })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            const savedUser = await newUser.save()
            generateToken(savedUser._id, res)
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL);
            } catch (error) {
                console.error("Erro ao enviar o email:", error);
            }
        } else {
            res.status(400).json({ message: "Dados inválidos" })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Erro no servidor." })
    }
}


export const login = async (req, res) => {
    try {

        const { error, value } = loginSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const { email, password } = value


        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Credenciais inválidas." })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Credenciais inválidas." })
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro no servidor." })
    }
}



export const logout = async (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout feito com sucesso!" });
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body

        if (!profilePic) return res.status(400).json({ message: "Por favor envie sua foto de perfil" })

        if (!profilePic.startsWith("data:image")) {
            return res.status(400).json({ message: "Formato de imagem inválido." })
        }


        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        )

        res.status(200).json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic,
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro no servidor." })
    }
}