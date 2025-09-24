import { sendWelcomeEmail } from "../emails/email.handler.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import { signupSchema } from "../validators/auth.validator.js"
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
                await sendWelcomeEmail(savedUser.email, savedUser.fullName,process.env.CLIENT_URL);
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