require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mailService = require('../services/mailService');

async function run() {
  const targetEmail = process.argv[2];

  if (!targetEmail) {
    console.log('==================================================================');
    console.log('📌 Uso do Script de Teste de E-mail:');
    console.log('   node backend/src/scripts/sendTestEmail.js <seu-email-aqui>');
    console.log('');
    console.log('Exemplo:');
    console.log('   node backend/src/scripts/sendTestEmail.js gabriel@exemplo.com');
    console.log('==================================================================');
    process.exit(1);
  }

  console.log(`🚀 [TESTE REAL RESEND] Enviando e-mail de teste para: ${targetEmail}...`);

  const mockOrder = {
    orderNumber: 'PAT-7788',
    customerName: 'Gabriel Teste',
    customerEmail: targetEmail,
    deliveryAddress: 'Av. Fleming, 800 - Pampulha, Belo Horizonte - MG',
    paymentMethod: 'PIX',
    subtotal: 52.00,
    discountAmount: 5.00,
    deliveryFee: 0.00,
    totalAmount: 47.00,
    couponCode: 'PATTIES10',
    items: [
      { quantity: 2, productName: 'Original Burger Smash', unitPrice: 24.00 },
      { quantity: 1, productName: 'Refresco Groselha Hibiscus', unitPrice: 12.00 }
    ]
  };

  const result = await mailService.sendOrderConfirmation(mockOrder);

  if (result?.success) {
    console.log(`✅ [SUCESSO] E-mail enviado com sucesso via Resend!`);
    console.log(`   ID do envio: ${result.id || 'simulado/local'}`);
    console.log(`   Verifique a caixa de entrada (e spam) de: ${targetEmail}`);
  } else {
    console.log(`❌ [ERRO] O Resend retornou um aviso ou erro:`);
    console.log(`   ${result?.error || 'Erro desconhecido'}`);
    console.log('');
    console.log('💡 DICA RESEND:');
    console.log('   Antes de verificar seu domínio próprio, o Resend só permite');
    console.log('   enviar e-mails de teste para o e-mail que você usou no cadastro do resend.com.');
  }

  process.exit(0);
}

run().catch((err) => {
  console.error('Erro na execução do teste:', err);
  process.exit(1);
});
