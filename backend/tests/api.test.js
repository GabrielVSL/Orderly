process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');

const mockProducts = [
  {
    name: 'Original Patties Burger',
    description: 'Pão tostado, duplo smash crocante, cheddar e picles.',
    price: 29.90,
    rating: 4.9,
    category: 'burgers',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'
  },
  {
    name: 'Batata Skinny Patties',
    description: 'Batata fininha crocante com flor de sal.',
    price: 14.90,
    rating: 4.8,
    category: 'sides',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f'
  },
  {
    name: 'Milkshake Ovomaltine Crocante',
    description: 'Sorvete cremoso com muito Ovomaltine crocante.',
    price: 21.90,
    rating: 5.0,
    category: 'shakes',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699'
  }
];

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
  await db.Product.bulkCreate(mockProducts);
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('1. Health Check Endpoint', () => {
  it('GET /health deve responder com 200 e status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('2. Catálogo de Produtos e Filtros', () => {
  it('GET /api/products deve retornar todos os produtos cadastrados', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3);
  });

  it('GET /api/products?category=burgers deve filtrar somente a categoria correta', async () => {
    const res = await request(app).get('/api/products?category=burgers');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].category).toBe('burgers');
    expect(res.body[0].name).toBe('Original Patties Burger');
  });

  it('GET /api/products?search=ovomaltine deve buscar por termo de busca no nome/descrição', async () => {
    const res = await request(app).get('/api/products?search=ovomaltine');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toContain('Ovomaltine');
  });

  it('GET /api/products/:id deve retornar o produto específico ou 404 se inexistente', async () => {
    const resSuccess = await request(app).get('/api/products/1');
    expect(resSuccess.status).toBe(200);
    expect(resSuccess.body.id).toBe(1);

    const resFail = await request(app).get('/api/products/999');
    expect(resFail.status).toBe(404);
  });
});

describe('3. Isolamento de Sessão no Carrinho', () => {
  const sessionAlice = 'session-alice-123';
  const sessionBob = 'session-bob-456';
  let cartItemIdAlice;

  it('POST /api/cart deve adicionar um item ao carrinho da sessão Alice', async () => {
    const res = await request(app)
      .post('/api/cart')
      .set('x-session-id', sessionAlice)
      .send({ productId: 1, quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.quantity).toBe(2);
    expect(res.body.product.name).toBe('Original Patties Burger');
    cartItemIdAlice = res.body.id;
  });

  it('GET /api/cart para sessão Bob deve estar vazio (carrinho isolado)', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('x-session-id', sessionBob);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it('GET /api/cart para Alice deve conter o item adicionado', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('x-session-id', sessionAlice);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].quantity).toBe(2);
  });

  it('PUT /api/cart/:id não deve permitir quantidade maior que 10', async () => {
    const res = await request(app)
      .put(`/api/cart/${cartItemIdAlice}`)
      .set('x-session-id', sessionAlice)
      .send({ quantity: 15 });

    expect(res.status).toBe(400);
  });

  it('PUT /api/cart/:id deve atualizar a quantidade com sucesso', async () => {
    const res = await request(app)
      .put(`/api/cart/${cartItemIdAlice}`)
      .set('x-session-id', sessionAlice)
      .send({ quantity: 3 });

    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(3);
  });
});

describe('4. Motor de Cupons e Checkout Transacional', () => {
  const sessionCheckout = 'session-checkout-789';
  let createdOrderNumber;

  beforeAll(async () => {
    // Adiciona o produto ao carrinho para a sessão de checkout
    await request(app)
      .post('/api/cart')
      .set('x-session-id', sessionCheckout)
      .send({ productId: 1, quantity: 1 }); // R$ 29.90
  });

  it('POST /api/orders/validate-coupon deve validar e calcular desconto de 10% para PATTIES10', async () => {
    const res = await request(app)
      .post('/api/orders/validate-coupon')
      .send({ code: 'PATTIES10', subtotal: 50.00 });

    expect(res.status).toBe(200);
    expect(res.body.code).toBe('PATTIES10');
    expect(res.body.discountAmount).toBe(5.00);
  });

  it('POST /api/orders/validate-coupon deve rejeitar cupom inválido', async () => {
    const res = await request(app)
      .post('/api/orders/validate-coupon')
      .send({ code: 'CUPOM_FALSO', subtotal: 50.00 });

    expect(res.status).toBe(400);
  });

  it('POST /api/orders deve rejeitar checkout com dados incompletos', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('x-session-id', sessionCheckout)
      .send({ name: 'A' }); // nome muito curto, sem email/endereço

    expect(res.status).toBe(400);
  });

  it('POST /api/orders deve criar o pedido com sucesso dentro de transação atômica e limpar o carrinho', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('x-session-id', sessionCheckout)
      .send({
        name: 'Gabriel Victor',
        email: 'gabriel@patties.com',
        phone: '11999998888',
        address: 'Rua Oscar Freire, 1000, São Paulo - SP',
        paymentMethod: 'pix',
        couponCode: 'PATTIES10'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('order');
    expect(res.body.order).toHaveProperty('orderNumber');
    expect(res.body.order.orderNumber).toMatch(/^PAT-\d{4}$/);
    expect(res.body.order.status).toBe('received');
    expect(res.body.order.items.length).toBe(1);
    expect(res.body.order.items[0].productName).toBe('Original Patties Burger');

    createdOrderNumber = res.body.order.orderNumber;

    // Garante que o carrinho da sessão foi limpo
    const cartRes = await request(app)
      .get('/api/cart')
      .set('x-session-id', sessionCheckout);
    expect(cartRes.body.length).toBe(0);
  });

  it('GET /api/orders/:orderNumber deve retornar os detalhes do pedido para rastreamento', async () => {
    const res = await request(app).get(`/api/orders/${createdOrderNumber}`);
    expect(res.status).toBe(200);
    expect(res.body.orderNumber).toBe(createdOrderNumber);
    expect(res.body.status).toBe('received');
  });

  it('PATCH /api/orders/:orderNumber/status deve permitir atualizar a etapa do pedido', async () => {
    const res = await request(app)
      .patch(`/api/orders/${createdOrderNumber}/status`)
      .send({ status: 'preparing' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('preparing');
  });
});
