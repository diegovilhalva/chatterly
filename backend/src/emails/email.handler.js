import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/email.template.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Bem-vindo ao Chatterly",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Erro ao enviar o email:", error);
    throw new Error("Erro ao enviar email");
  }

  console.log("Email enviado com sucesso!", data);
};