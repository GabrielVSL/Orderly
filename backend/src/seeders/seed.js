const { sequelize, Product, Cart } = require('../models');

const pattiesProductSeedData = [
  // --- LANCHES (SMASH BURGERS) ---
  {
    name: 'Original Patties Burger',
    description: 'Pão tostado na manteiga + Carne ultra smash prensada com crostinha crocante + Queijo cheddar derretido, Cebola picadinha, Picles artesanal, Ketchup e Mostarda.',
    price: 20.00,
    rating: 4.9,
    category: 'lanches',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/ORIGINAL.jpg'
  },
  {
    name: 'Cheeseburguer Patties',
    description: 'Pão fofinho tostado na manteiga + Carne ultra smash com crostinha crocante + Queijo cheddar cremoso fundido. O clássico definitivo do Patties!',
    price: 19.00,
    rating: 4.9,
    category: 'lanches',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/CHEESEBURGUER.jpg'
  },
  {
    name: 'Cheese Bacon Patties',
    description: 'Pão tostado na manteiga + Carne ultra smash prensada + Queijo cheddar derretido + Fatias ultra crocantes de bacon defumado especial.',
    price: 23.00,
    rating: 5.0,
    category: 'lanches',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/CHEESEBACON.jpg'
  },
  {
    name: 'Cheese Salada Patties',
    description: 'Pão tostado + Carne smash prensada na chapa + Queijo cheddar derretido + Alface fresca, Tomate, Cebola roxa e Picles crocante da casa.',
    price: 21.00,
    rating: 4.7,
    category: 'lanches',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/CHEESESALADA.jpg'
  },
  {
    name: 'Cheese Onion Patties',
    description: 'Pão tostado na manteiga + Carne ultra smash + Queijo cheddar fundido + Deliciosa cebola caramelizada douradinha na chapa.',
    price: 22.00,
    rating: 4.8,
    category: 'lanches',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/CHEESEONION.jpg'
  },
  {
    name: 'Patties Vegê',
    description: 'Pão tostado na manteiga + Blend de vegetais prensado na chapa com crostinha dourada + Queijo cheddar derretido e picles artesanal.',
    price: 21.00,
    rating: 4.6,
    category: 'lanches',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/VEGE.jpg'
  },

  // --- LINHA 4-UP (MONSTER SMASH) ---
  {
    name: '4-UP Cheese Bacon Monster',
    description: '4 carnes ultra smash prensadas com crostinha crocante de chapa, 4 fatias de queijo derretido e muito bacon crocante no pão tostado.',
    price: 37.00,
    rating: 5.0,
    category: '4up',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/4-UP-CHEESEBACON.jpg'
  },
  {
    name: '4-UP Original Monster',
    description: '4 carnes ultra smash prensadas, quadruplo queijo cheddar fundido, cebola picadinha, picles, ketchup e mostarda no pão fofinho tostado.',
    price: 35.00,
    rating: 4.9,
    category: '4up',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/4-UP-ORINGINAL.jpg'
  },
  {
    name: '4-UP Cheeseburguer Monster',
    description: '4 carnes ultra smash prensadas na chapa com quadruplo queijo cheddar fundido. Para quem ama o clássico smash em dose quádrupla!',
    price: 34.00,
    rating: 4.8,
    category: '4up',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/4-UP-CHEESEBURGUER.jpg'
  },
  {
    name: '4-UP Cheese Onion Monster',
    description: '4 carnes smash fininhas com crostinha, quadruplo queijo cheddar e generosa porção de cebola chapeada na manteiga.',
    price: 36.00,
    rating: 4.8,
    category: '4up',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/4-UP-CHEESE-ONION.jpg'
  },
  {
    name: '4-UP Patties Vegê Monster',
    description: 'A versão quádrupla do nosso burger vegetariano com blend exclusivo Patties, muito queijo e picles no pão tostado na manteiga.',
    price: 27.00,
    rating: 4.6,
    category: '4up',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/4-UP-VEGE.jpg'
  },

  // --- COMBOS COMPLETOS ---
  {
    name: 'Combo Original Clássico',
    description: '1 Original Patties Burger + 1 Batata Skinny Classic crocante + 1 Refresco artesanal da casa ou refrigerante em lata.',
    price: 39.90,
    rating: 5.0,
    category: 'combos',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/COMBO-ORIGINAL.jpg'
  },
  {
    name: 'Combo Cheeseburguer',
    description: '1 Cheeseburguer Patties + 1 Batata Skinny Classic sequinha + 1 Bebida bem gelada à sua escolha.',
    price: 38.90,
    rating: 4.9,
    category: 'combos',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/COMBO-CHEESEBURGUER.jpg'
  },
  {
    name: 'Combo Cheese Bacon',
    description: '1 Cheese Bacon Patties duplo com fatias crocantes de bacon + 1 Batata Skinny Classic + 1 Bebida geladinha.',
    price: 42.90,
    rating: 4.9,
    category: 'combos',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/COMBO-CHEESEBACON.jpg'
  },
  {
    name: 'Combo 4-UP Monster Original',
    description: '1 4-UP Original (4 carnes smash prensadas) + 1 Batata Skinny Classic + 1 Bebida. O combo pra quem tem apetite monstro!',
    price: 54.90,
    rating: 5.0,
    category: 'combos',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/COMBO-4-UP-ORIGINAL.jpg'
  },

  // --- LINHA FRANGO & BITES ---
  {
    name: 'Supreme Classic Frango',
    description: 'Peito de frango ultra crocante com tempero secreto da casa, maionese especial Patties e picles artesanal no pão tostado na manteiga.',
    price: 24.00,
    rating: 4.8,
    category: 'frango',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2023/09/supreme-calssic-frango.jpg'
  },
  {
    name: 'Supreme Salad Frango',
    description: 'Frango empanado super crocante, queijo, alface americana fresca crocante, tomate e molho especial no pão fofinho.',
    price: 25.00,
    rating: 4.7,
    category: 'frango',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2023/09/supreme-salad-frango.jpg'
  },
  {
    name: 'Bites de Frango (4 unid)',
    description: 'Pedaços selecionados de peito de frango 100% real marinados e empanados com casquinha crocante sequinha. Acompanha molho da casa.',
    price: 14.00,
    rating: 4.8,
    category: 'frango',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2023/09/bites-de-4.jpg'
  },
  {
    name: 'Bites de Frango (8 unid)',
    description: '8 pedaços suculentos e crocantes de peito de frango com nosso empanamento retrô especial. Acompanha molho classic da casa.',
    price: 24.00,
    rating: 4.9,
    category: 'frango',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2023/09/bites-de-8.jpg'
  },

  // --- BATATAS & SIDES ---
  {
    name: 'Skinny Classic Fries',
    description: 'A icônica batata frita fininha, sequinha e ultra crocante no estilo diner retrô americano, temperada com flor de sal marinho.',
    price: 16.00,
    rating: 4.9,
    category: 'batatas',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2023/05/1-skinny-classic-fries-1.jpg'
  },
  {
    name: 'Skinny Perfect Cheddar & Bacon',
    description: 'Nossa batata Skinny fininha crocante coberta com generosa calda de queijo cheddar cremoso aquecido e farofa crocante de bacon.',
    price: 24.00,
    rating: 5.0,
    category: 'batatas',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2023/05/2-%E2%80%93-skinny-perfect-fries.jpg'
  },
  {
    name: 'Nhonhonese da Casa (Pote 50ml)',
    description: 'A famosa maionese verde artesanal do Patties, receita secreta com blend fresco de ervas. O acompanhamento perfeito para suas fritas!',
    price: 5.00,
    rating: 5.0,
    category: 'batatas',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2024/09/nhonhonese.jpg'
  },

  // --- REFRESCOS & BEBIDAS ---
  {
    name: 'Refresco de Groselha com Hibiscus (400ml)',
    description: 'O sabor mais clássico do Patties! Groselha artesanal equilibrada com infusão natural de flores de hibiscus, servido estupidamente gelado.',
    price: 12.00,
    rating: 4.9,
    category: 'bebidas',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2024/09/refresco-hibiscus.jpg'
  },
  {
    name: 'Refresco de Tamarindo (400ml)',
    description: 'Refresco artesanal autêntico preparado com a acidez equilibrada do puro tamarindo. Refrescância vintage inconfundível.',
    price: 12.00,
    rating: 4.8,
    category: 'bebidas',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2024/09/refresco-tamarindo.jpg'
  },
  {
    name: 'Heineken Long Neck (330ml)',
    description: 'Cerveja puro malte Heineken trincando de gelada no ponto certo para harmonizar com seu smash burger.',
    price: 14.00,
    rating: 4.8,
    category: 'bebidas',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/HEINEKEN.jpg'
  },
  {
    name: 'Água Cristal Sem Gás (500ml)',
    description: 'Garrafa de água mineral pura e gelada.',
    price: 6.00,
    rating: 4.5,
    category: 'bebidas',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/AGUA-CRISTAL-SEM-GAS.jpg'
  },
  {
    name: 'Água Cristal Com Gás (500ml)',
    description: 'Garrafa de água mineral gaseificada servida bem gelada.',
    price: 6.00,
    rating: 4.5,
    category: 'bebidas',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2022/04/AGUA-CRISTAL-COM-GAS.jpg'
  },

  // --- SHAKES & SOBREMESAS ---
  {
    name: 'Milkshake Frosted Baunilha',
    description: 'Sorvete artesanal cremoso batido com leite gelado, baunilha clássica retrô e calda especial na taça.',
    price: 21.00,
    rating: 4.9,
    category: 'sobremesas',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2023/05/alteracao-8-%E2%80%93-Milkshake-Frosted.jpg'
  },
  {
    name: 'Milkshake Pink Morango',
    description: 'Sorvete artesanal batido com calda de morangos reais, textura aveludada e sabor irresistível.',
    price: 21.00,
    rating: 4.8,
    category: 'sobremesas',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2023/05/alteracao-8-%E2%80%93-Milkshake-Pink.jpg'
  },
  {
    name: 'Milkshake Blue Retrô',
    description: 'O icônico shake azul do Patties com sabor nostálgico de baunilha americana e algodão-doce.',
    price: 21.00,
    rating: 4.9,
    category: 'sobremesas',
    isFeatured: true,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2023/05/alteracao-8-%E2%80%93-Milkshake-Blue.jpg'
  },
  {
    name: 'Cascão Frosted Baunilha',
    description: 'Casquinha waffer super crocante com sorvete cremoso estilo máquina americana retrô.',
    price: 9.00,
    rating: 4.7,
    category: 'sobremesas',
    isFeatured: false,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2023/05/alteracao-8-%E2%80%93-cascao-frosted.jpg'
  }
];

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log(' Conexão com o banco estabelecida com sucesso.');

    // Garante compatibilidade de colunas no SQLite de forma segura
    const queryInterface = sequelize.getQueryInterface();
    const safeAddColumn = async (table, column, definition) => {
      try {
        const tableDesc = await queryInterface.describeTable(table);
        if (!tableDesc[column]) {
          await queryInterface.addColumn(table, column, definition);
        }
      } catch {}
    };

    await safeAddColumn('orders', 'userId', { type: sequelize.Sequelize.INTEGER, allowNull: true });
    await safeAddColumn('cart_items', 'notes', { type: sequelize.Sequelize.TEXT, allowNull: true });
    await safeAddColumn('order_items', 'notes', { type: sequelize.Sequelize.TEXT, allowNull: true });
    await safeAddColumn('users', 'resetPasswordToken', { type: sequelize.Sequelize.STRING, allowNull: true });
    await safeAddColumn('users', 'resetPasswordExpires', { type: sequelize.Sequelize.DATE, allowNull: true });

    // Sincroniza tabelas se ainda não existirem
    await sequelize.sync();

    const dialect = sequelize.getDialect();
    const forceSeed = process.argv.includes('--force');
    const existingCount = await Product.count();

    if (existingCount > 0 && !forceSeed && dialect === 'postgres') {
      console.log(` Catálogo já possui ${existingCount} produtos em produção (PostgreSQL). Pulando recriação destrutiva.`);
    } else {
      if (dialect === 'sqlite') {
        await sequelize.query('PRAGMA foreign_keys = OFF;');
      }

      // Limpa produtos antigos e popula catálogo oficial
      await Cart.destroy({ where: {} });
      await Product.destroy({ where: {} });
      console.log(' Tabela de produtos limpa.');

      const inserted = await Product.bulkCreate(pattiesProductSeedData);
      console.log(` Sucesso! ${inserted.length} itens oficiais do Patties Burger foram semeados no banco de dados.`);

      if (dialect === 'sqlite') {
        await sequelize.query('PRAGMA foreign_keys = ON;');
      }
    }
  } catch (error) {
    console.error('❌ Falha ao semear banco de dados:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, pattiesProductSeedData };
