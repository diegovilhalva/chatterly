import Joi from "joi"

export const signupSchema = Joi.object({
  fullName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "O nome completo é obrigatório.",
      "string.min": "O nome deve ter no mínimo {#limit} caracteres.",
      "string.max": "O nome deve ter no máximo {#limit} caracteres.",
      "any.required": "O nome completo é obrigatório."
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Digite um email válido.",
      "string.empty": "O email é obrigatório.",
      "any.required": "O email é obrigatório."
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      "string.min": "A senha deve ter no mínimo {#limit} caracteres.",
      "string.empty": "A senha é obrigatória.",
      "any.required": "A senha é obrigatória."
    }),
})
