export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao Chatterly</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <img src="https://img.freepik.com/free-vector/hand-drawn-message-element-vector-cute-sticker_53876-118344.jpg?t=st=1741295028~exp=1741298628~hmac=0d076f885d7095f0b5bc8d34136cd6d64749455f8cb5f29a924281bafc11b96c&w=1480" alt="Chatterly Logo" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background-color: white; padding: 10px;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">Bem-vindo ao Chatterly!</h1>
    </div>
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #5B86E5;"><strong>Olá ${name},</strong></p>
      <p>Estamos muito felizes em ter você conosco! O <strong>Chatterly</strong> conecta você com amigos, família e colegas em tempo real, em qualquer lugar do mundo.</p>
      
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #36D1DC;">
        <p style="font-size: 16px; margin: 0 0 15px 0;"><strong>Comece em apenas alguns passos:</strong></p>
        <ul style="padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 10px;">Configure sua foto de perfil</li>
          <li style="margin-bottom: 10px;">Encontre e adicione seus contatos</li>
          <li style="margin-bottom: 10px;">Inicie uma conversa</li>
          <li style="margin-bottom: 0;">Compartilhe fotos, vídeos, áudios e muito mais</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href=${clientURL} style="background: linear-gradient(to right, #36D1DC, #5B86E5); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; display: inline-block;">Abrir Chatterly</a>
      </div>
      
      <p style="margin-bottom: 5px;">Se precisar de ajuda ou tiver dúvidas, nossa equipe está sempre pronta para apoiar você.</p>
      <p style="margin-top: 0;">Boas conversas!</p>
      
      <p style="margin-top: 25px; margin-bottom: 0;">Abraços,<br>Equipe Chatterly</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© 2025 Chatterly. Todos os direitos reservados.</p>
      <p>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Política de Privacidade</a>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Termos de Serviço</a>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Fale Conosco</a>
      </p>
    </div>
  </body>
  </html>
  `;
}
