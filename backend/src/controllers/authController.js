const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User, sequelize } = require('../models');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const mailService = require('../services/mailService');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Validador de política de senhas fortes: Maiúscula, minúscula, número, caractere especial e 8+ chars
const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return 'Por favor, informe uma senha válida.';
  }
  if (password.length < 8) {
    return 'A senha deve conter no mínimo 8 caracteres.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra maiúscula (A-Z).';
  }
  if (!/[a-z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra minúscula (a-z).';
  }
  if (!/[0-9]/.test(password)) {
    return 'A senha deve conter pelo menos um número (0-9).';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    return 'A senha deve conter pelo menos um caractere especial (!, @, #, $, %, etc.).';
  }
  return null;
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: 'Por favor, informe seu nome completo.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Por favor, informe um e-mail válido.' });
    }

    // Validação estrita de senha solicitada
    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    // Verifica se e-mail já existe
    const existing = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado. Faça login ou use outro.' });
    }

    // Criação sem exigir ou guardar endereço obrigatoriamente
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone ? phone.trim() : null,
    });

    const token = generateToken(user.id);

    // Dispara e-mail de boas-vindas com cupom de primeira compra via mensageria APENAS no cadastro
    mailService.sendWelcomeEmail(user).catch(err => {
      console.warn('Falha no envio de e-mail de boas-vindas no cadastro:', err.message);
    });

    return res.status(201).json({
      message: 'Cadastro realizado com sucesso!',
      token,
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao processar cadastro. Tente novamente mais tarde.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Informe seu e-mail e senha para entrar.' });
    }

    // Busca com o escopo withPassword para verificar o hash
    const user = await User.scope('withPassword').findOne({ 
      where: { email: email.trim().toLowerCase() } 
    });

    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao autenticar. Tente novamente mais tarde.' });
  }
};

const me = async (req, res) => {
  return res.status(200).json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, cep, street, number, complement, neighborhood, city, state } = req.body;
    const user = req.user;

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone ? phone.trim() : null;
    if (cep !== undefined) user.cep = cep ? cep.trim() : null;
    if (street !== undefined) user.street = street ? street.trim() : null;
    if (number !== undefined) user.number = number ? number.trim() : null;
    if (complement !== undefined) user.complement = complement ? complement.trim() : null;
    if (neighborhood !== undefined) user.neighborhood = neighborhood ? neighborhood.trim() : null;
    if (city !== undefined) user.city = city ? city.trim() : null;
    if (state !== undefined) user.state = state ? state.trim() : null;

    await user.save();

    return res.status(200).json({
      message: 'Dados atualizados com sucesso!',
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao atualizar perfil. Tente novamente mais tarde.' });
  }
};

// Solicitação de recuperação de senha (Mensageria / Token)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Informe o e-mail cadastrado.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ where: { email: normalizedEmail } });

    // Prevenção contra enumeração de e-mails: sempre retorna mensagem de sucesso
    if (!user) {
      return res.status(200).json({
        message: 'Se este e-mail estiver cadastrado, enviamos as instruções para redefinição de senha.',
      });
    }

    // Gera token criptografado seguro de 32 bytes (64 caracteres hex)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expires = new Date(Date.now() + 30 * 60 * 1000); // Válido por 30 minutos

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expires;
    await user.save();

    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendBaseUrl}/reset-password?token=${rawToken}`;

    // Dispara e-mail transacional com Resend
    await mailService.sendPasswordReset(user, resetUrl);

    return res.status(200).json({
      message: 'Se este e-mail estiver cadastrado, enviamos as instruções para redefinição de senha.',
      ...(process.env.NODE_ENV === 'test' && { resetUrl, token: rawToken })
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao processar recuperação de senha. Tente novamente mais tarde.' });
  }
};

// Confirmação de redefinição de senha com a nova senha
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token de recuperação não fornecido.' });
    }

    const passwordError = validatePasswordStrength(newPassword);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const Op = sequelize.Sequelize.Op;

    const user = await User.scope('withResetToken').findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Link de recuperação inválido ou expirado. Por favor, solicite um novo link.'
      });
    }

    // Atualiza para a nova senha e invalida o token
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      message: 'Senha alterada com sucesso! Você já pode entrar com sua nova senha.'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao redefinir senha. Tente novamente mais tarde.' });
  }
};

module.exports = {
  register,
  login,
  me,
  updateProfile,
  forgotPassword,
  resetPassword,
  validatePasswordStrength
};
