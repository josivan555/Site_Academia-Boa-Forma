const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Simulação de banco de dados
const users = [
    { id: 1, email: 'user@example.com', name: 'User', password: 'password123', resetToken: null, resetTokenExpiration: null }
];

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', // ou outro serviço de e-mail
    auth: {
        user: 'seu-email@gmail.com',
        pass: 'sua-senha'
    }
});

// Endpoint para recuperação de senha
app.post('/api/recover-password', (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ success: false, message: 'E-mail não encontrado.' });
    }

    // Gerar token de recuperação
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hora

    // Enviar e-mail com o link de recuperação
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
        from: 'seu-email@gmail.com',
        to: user.email,
        subject: 'Recuperação de Senha',
        text: `Olá, ${user.name}. Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:\n\n${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Erro ao enviar e-mail.' });
        }
        res.json({ success: true, message: 'E-mail de recuperação enviado com sucesso.' });
    });
});

// Endpoint para redefinir senha
app.post('/api/reset-password', (req, res) => {
    const { token, newPassword } = req.body;
    const user = users.find(u => u.resetToken === token && u.resetTokenExpiration > Date.now());

    if (!user) {
        return res.status(400).json({ success: false, message: 'Token inválido ou expirado.' });
    }

    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;

    res.json({ success: true, message: 'Senha redefinida com sucesso.' });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});