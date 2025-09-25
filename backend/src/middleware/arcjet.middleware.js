import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Limite de requisições excedido. Tente novamente mais tarde." });
            } else if (decision.reason.isBot()) {
                return res.status(403).json({ message: "Acesso de bot negado." });
            } else {
                return res.status(403).json({
                    message: "Acesso negado pela política de segurança.",
                });
            }
        }

        // check for spoofed bots
        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({
                error: "Bot falsificado detectado",
                message: "Atividade maliciosa de bot detectada.",
            });
        }
        next();
    } catch (error) {
        console.log("Erro no Arcjet :", error);
        next();
    }
};