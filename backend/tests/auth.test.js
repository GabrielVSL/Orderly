process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');

jest.setTimeout(30000);

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
}, 30000);

afterAll(async () => {
  await db.sequelize.close();
});

describe('5. Sistema de Autenticação & Usuários Blindado', () => {
  let authToken = '';
  let userId = null;
  let resetToken = '';

  it('POST /api/auth/register deve cadastrar usuário com requisitos fortes de senha e SEM endereço obrigatório', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Gabriel Teste',
        email: 'gabriel@teste.com',
        password: 'SenhaForte#2026',
        phone: '(11) 98888-7777'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('gabriel@teste.com');
    expect(res.body.user).not.toHaveProperty('password');

    authToken = res.body.token;
    userId = res.body.user.id;
  });

  it('POST /api/auth/register deve rejeitar senhas fracas (sem maiúscula, minúscula, número ou caractere especial)', async () => {
    // Sem caractere especial
    const res1 = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Teste Senha Fraca',
        email: 'fraca1@teste.com',
        password: 'SenhaSemEspecial123'
      });
    expect(res1.status).toBe(400);
    expect(res1.body.message).toMatch(/caractere especial/i);

    // Sem maiúscula
    const res2 = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Teste Senha Fraca',
        email: 'fraca2@teste.com',
        password: 'sem_maiuscula#123'
      });
    expect(res2.status).toBe(400);
    expect(res2.body.message).toMatch(/letra maiúscula/i);

    // Sem número
    const res3 = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Teste Senha Fraca',
        email: 'fraca3@teste.com',
        password: 'SenhaSemNumero!@#'
      });
    expect(res3.status).toBe(400);
    expect(res3.body.message).toMatch(/número/i);

    // Menor que 8 dígitos
    const res4 = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Teste Senha Fraca',
        email: 'fraca4@teste.com',
        password: 'Aa1!'
      });
    expect(res4.status).toBe(400);
    expect(res4.body.message).toMatch(/8 caracteres/i);
  });

  it('POST /api/auth/register deve rejeitar e-mail duplicado', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Outro Gabriel',
        email: 'gabriel@teste.com',
        password: 'OutraSenhaForte#2026'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/já está cadastrado/i);
  });

  it('POST /api/auth/login deve autenticar com sucesso e retornar token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'gabriel@teste.com',
        password: 'SenhaForte#2026'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.id).toBe(userId);
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('POST /api/auth/login deve rejeitar credenciais incorretas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'gabriel@teste.com',
        password: 'SenhaErrada#999'
      });

    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me deve retornar dados sem vazar senha ou token de reset', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('gabriel@teste.com');
    expect(res.body).not.toHaveProperty('password');
    expect(res.body).not.toHaveProperty('resetPasswordToken');
  });

  it('defaultScope do Sequelize deve blindar consulta direta no banco contra vazamento de senha', async () => {
    const rawUser = await db.User.findByPk(userId);
    expect(rawUser.password).toBeUndefined();
    expect(rawUser.resetPasswordToken).toBeUndefined();
  });

  it('POST /api/auth/forgot-password deve gerar token de recuperação (mensageria)', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'gabriel@teste.com' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    resetToken = res.body.token;
  });

  it('POST /api/auth/reset-password deve atualizar a senha com sucesso e permitir login com a nova senha', async () => {
    const resetRes = await request(app)
      .post('/api/auth/reset-password')
      .send({
        token: resetToken,
        newPassword: 'NovaSenhaUltraSegura#2026'
      });

    expect(resetRes.status).toBe(200);

    // Senha antiga deve falhar agora
    const oldLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'gabriel@teste.com',
        password: 'SenhaForte#2026'
      });
    expect(oldLogin.status).toBe(401);

    // Nova senha deve funcionar com sucesso
    const newLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'gabriel@teste.com',
        password: 'NovaSenhaUltraSegura#2026'
      });
    expect(newLogin.status).toBe(200);
  });
});
