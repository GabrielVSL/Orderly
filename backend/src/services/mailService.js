const { Resend } = require('resend');

// Inicializa o cliente Resend caso a chave esteja presente no ambiente
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Remetente padrão: usa a variável de ambiente ou o remetente oficial de onboarding do Resend
const defaultSender = process.env.EMAIL_FROM || 'Patties Burger <onboarding@resend.dev>';
const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Sanitiza texto para inserção segura em HTML (Prevenção de XSS e Phishing Injection)
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Utilitário de formatação de moeda para os templates de e-mail
 */
function formatCurrency(val) {
  return Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Gera o HTML oficial do e-mail de Recuperação de Senha
 */
function generatePasswordResetHtml(user = {}, resetUrl = '') {
  const rawName = user?.name ? user.name.split(' ')[0] : 'Cliente';
  const userName = escapeHtml(rawName);
  const effectiveResetUrl = encodeURI(resetUrl || `${frontendBaseUrl}/reset-password?token=demo123456789`);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinição de Senha • Patties Burger</title>
</head>
<body style="margin: 0; padding: 0; background-color: #E4DFD5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #141413;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #E4DFD5; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Container Principal -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #FAF7F2; border: 2px solid #141413; box-shadow: 6px 6px 0px rgba(20,20,19,0.15);">
          
          <!-- Topo Editorial Preto Retrô -->
          <tr>
            <td style="background-color: #141413; padding: 24px; text-align: center; border-bottom: 2px solid #141413;">
              <span style="font-family: monospace; font-size: 10px; font-weight: bold; color: #FEDB00; letter-spacing: 0.22em; text-transform: uppercase; display: block; margin-bottom: 6px;">
                ★ PATTIES DIRECT • SEGURANÇA DA CONTA ★
              </span>
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; color: #FFFFFF; font-weight: normal; letter-spacing: -0.02em;">
                Patties<span style="color: #FEDB00; font-size: 14px; vertical-align: super;">®</span>
              </h1>
            </td>
          </tr>

          <!-- Corpo do E-mail -->
          <tr>
            <td style="padding: 32px 28px;">
              <span style="font-family: monospace; font-size: 9px; font-weight: bold; color: #D71920; letter-spacing: 0.2em; text-transform: uppercase; display: block; margin-bottom: 8px;">
                01 / SOLICITAÇÃO DE ACESSO
              </span>
              
              <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 22px; color: #141413; line-height: 1.3;">
                Olá, ${userName}! Vamos redefinir sua senha?
              </h2>

              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: rgba(20,20,19,0.8);">
                Recebemos uma solicitação de redefinição de senha para a sua conta vinculada a este endereço de e-mail. Para escolher uma nova senha segura e acessar suas comandas, clique no botão abaixo:
              </p>

              <!-- Box Informativo de Prazo -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F3EFE6; border: 1px dashed rgba(20,20,19,0.3); margin: 20px 0;">
                <tr>
                  <td style="padding: 14px 18px; text-align: center;">
                    <span style="font-family: monospace; font-size: 11px; color: #141413; font-weight: bold;">
                      ⏱ Este link é seguro e expira automaticamente em <strong>30 minutos</strong>.
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Botão Principal CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 26px 0;">
                <tr>
                  <td align="center">
                    <a href="${effectiveResetUrl}" target="_blank" style="background-color: #D71920; color: #FFFFFF; font-family: monospace; font-size: 13px; font-weight: bold; text-decoration: none; padding: 15px 32px; display: inline-block; text-transform: uppercase; letter-spacing: 0.18em; border: 2px solid #141413; box-shadow: 3px 3px 0px #141413;">
                      Criar Nova Senha ➔
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Link Alternativo -->
              <p style="margin: 24px 0 0 0; font-family: monospace; font-size: 11px; color: rgba(20,20,19,0.6); line-height: 1.5; word-break: break-all;">
                Se o botão acima não funcionar, copie e cole o link a seguir no seu navegador:<br>
                <a href="${effectiveResetUrl}" style="color: #2F66FF; text-decoration: underline;">${effectiveResetUrl}</a>
              </p>

              <!-- Aviso de Segurança Anti-Spam -->
              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(20,20,19,0.15);">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: rgba(20,20,19,0.65);">
                  🔒 <em>Se você não solicitou a troca de senha, nenhuma ação é necessária. Sua senha atual permanece 100% segura e protegida com criptografia Bcrypt.</em>
                </p>
              </div>
            </td>
          </tr>

          <!-- Rodapé Diner Retrô -->
          <tr>
            <td style="background-color: #EAE5DC; padding: 18px 24px; text-align: center; border-top: 1px solid rgba(20,20,19,0.15);">
              <span style="font-family: monospace; font-size: 10px; color: rgba(20,20,19,0.6); text-transform: uppercase; letter-spacing: 0.15em; display: block;">
                Patties Burger Direct • Ultra Smash Burgers na Chapa a 250°C
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Gera o HTML oficial da Comanda de Pedido
 */
function generateOrderConfirmationHtml(order = {}) {
  const rawCustomerName = order.customerName ? order.customerName.split(' ')[0] : 'Cliente';
  const customerName = escapeHtml(rawCustomerName);
  const orderNumber = escapeHtml(order.orderNumber || 'PAT-5593');
  const trackingUrl = encodeURI(`${frontendBaseUrl}/orders/${order.orderNumber || 'PAT-5593'}`);

  // Itens padrão para exibição caso não haja
  const items = (order.items && order.items.length > 0)
    ? order.items
    : [
        { quantity: 2, productName: 'Original Burger Smash', unitPrice: 24.00 },
        { quantity: 1, productName: 'Skinny Classic Fries', unitPrice: 16.00 },
        { quantity: 1, productName: 'Refresco Groselha Hibiscus', unitPrice: 12.00 },
      ];

  const itemsHtml = items.map((item) => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(20,20,19,0.1); font-size: 13px; color: #141413;">
        <strong>${Number(item.quantity)}x</strong> ${escapeHtml(item.productName)}
        ${item.notes ? `<br><span style="font-family: monospace; font-size: 10px; color: #D71920; font-weight: bold;">★ ${escapeHtml(item.notes)}</span>` : ''}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(20,20,19,0.1); font-family: monospace; font-size: 13px; color: #D71920; text-align: right; font-weight: bold;">
        ${formatCurrency(item.quantity * Number(item.unitPrice))}
      </td>
    </tr>
  `).join('');

  const subtotal = order.subtotal || 76.00;
  const discountAmount = order.discountAmount || 0;
  const deliveryFee = order.deliveryFee || 0;
  const totalAmount = order.totalAmount || (subtotal - discountAmount + deliveryFee);
  const deliveryAddress = escapeHtml(order.deliveryAddress || 'Av. Fleming, 800 - Pampulha, Belo Horizonte - MG');
  const paymentMethod = escapeHtml((order.paymentMethod || 'PIX').toUpperCase());
  const couponCode = escapeHtml(order.couponCode || 'Cupom');

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comanda #${orderNumber} Emitida • Patties Burger</title>
</head>
<body style="margin: 0; padding: 0; background-color: #E4DFD5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #141413;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #E4DFD5; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Container Principal -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #FAF7F2; border: 2px solid #141413; box-shadow: 6px 6px 0px rgba(20,20,19,0.15);">
          
          <!-- Topo Editorial com Comanda Destacada -->
          <tr>
            <td style="background-color: #141413; padding: 24px; text-align: center; border-bottom: 2px solid #141413;">
              <span style="font-family: monospace; font-size: 10px; font-weight: bold; color: #FEDB00; letter-spacing: 0.22em; text-transform: uppercase; display: block; margin-bottom: 8px;">
                ★ PATTIES DIRECT • COMANDA DE CHAPA ★
              </span>
              <h1 style="margin: 0 0 10px 0; font-family: Georgia, serif; font-size: 26px; color: #FFFFFF; font-weight: normal;">
                Pedido Confirmado no Caixa!
              </h1>
              <div style="display: inline-block; background-color: #FEDB00; color: #0E132A; font-family: monospace; font-size: 16px; font-weight: 900; padding: 6px 16px; border: 1px solid #FFFFFF; letter-spacing: 0.16em;">
                #${orderNumber}
              </div>
            </td>
          </tr>

          <!-- Corpo do E-mail -->
          <tr>
            <td style="padding: 30px 26px;">
              <h2 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 20px; color: #141413;">
                Olá, ${customerName}!
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: rgba(20,20,19,0.8);">
                A chapa de ferro do Patties já está quente a 250°C. Seus smash burgers serão prensados com crostinha crocante, batatinhas e bebida gelada.
              </p>

              <!-- Tabela de Itens da Comanda -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 16px;">
                <tr>
                  <th align="left" style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: rgba(20,20,19,0.5); padding-bottom: 8px; border-bottom: 2px solid #141413;">
                    Item Selecionado
                  </th>
                  <th align="right" style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: rgba(20,20,19,0.5); padding-bottom: 8px; border-bottom: 2px solid #141413;">
                    Valor
                  </th>
                </tr>
                ${itemsHtml}
              </table>

              <!-- Totais Financeiros -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-family: monospace; font-size: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 4px 0; color: rgba(20,20,19,0.7);">Subtotal</td>
                  <td style="padding: 4px 0; text-align: right; color: #141413;">${formatCurrency(subtotal)}</td>
                </tr>
                ${Number(discountAmount) > 0 ? `
                <tr>
                  <td style="padding: 4px 0; color: #D71920; font-weight: bold;">Desconto (${couponCode})</td>
                  <td style="padding: 4px 0; text-align: right; color: #D71920; font-weight: bold;">-${formatCurrency(discountAmount)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 4px 0; color: rgba(20,20,19,0.7);">Taxa de Entrega</td>
                  <td style="padding: 4px 0; text-align: right; color: #141413;">
                    ${Number(deliveryFee) === 0 ? '<strong style="color: #059669;">Grátis</strong>' : formatCurrency(deliveryFee)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 0 0; border-top: 1px solid rgba(20,20,19,0.2); font-size: 14px; font-weight: bold; color: #141413;">
                    TOTAL DA COMANDA
                  </td>
                  <td style="padding: 10px 0 0 0; border-top: 1px solid rgba(20,20,19,0.2); font-size: 18px; font-weight: bold; color: #D71920; text-align: right;">
                    ${formatCurrency(totalAmount)}
                  </td>
                </tr>
              </table>

              <!-- Dados de Entrega -->
              <div style="background-color: #F3EFE6; border: 1px solid rgba(20,20,19,0.15); padding: 14px 18px; margin-bottom: 24px;">
                <span style="font-family: monospace; font-size: 9px; font-weight: bold; color: rgba(20,20,19,0.6); text-transform: uppercase; letter-spacing: 0.16em; display: block; margin-bottom: 4px;">
                  Destino da Entrega
                </span>
                <p style="margin: 0; font-size: 13px; font-weight: bold; color: #141413;">
                  ${deliveryAddress}
                </p>
                <span style="font-family: monospace; font-size: 10px; color: rgba(20,20,19,0.5); display: block; margin-top: 4px;">
                  Método de Pagamento: <strong>${paymentMethod}</strong>
                </span>
              </div>

              <!-- Botão Acompanhar Pedido ao Vivo -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
                <tr>
                  <td align="center">
                    <a href="${trackingUrl}" target="_blank" style="background-color: #D71920; color: #FFFFFF; font-family: monospace; font-size: 13px; font-weight: bold; text-decoration: none; padding: 15px 32px; display: inline-block; text-transform: uppercase; letter-spacing: 0.18em; border: 2px solid #141413; box-shadow: 3px 3px 0px #141413;">
                      Acompanhar Pedido no Mapa ➔
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Rodapé Diner Retrô -->
          <tr>
            <td style="background-color: #EAE5DC; padding: 18px 24px; text-align: center; border-top: 1px solid rgba(20,20,19,0.15);">
              <span style="font-family: monospace; font-size: 10px; color: rgba(20,20,19,0.6); text-transform: uppercase; letter-spacing: 0.15em; display: block;">
                Patties Burger • Chapa de Ferro Quente a 250°C
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * 1. Envio de E-mail para Recuperação de Senha
 */
async function sendPasswordReset(user, resetUrl) {
  const recipient = user?.email;
  if (!recipient) return null;

  const subject = '🔐 Redefinição de Senha • Patties Burger';
  const html = generatePasswordResetHtml(user, resetUrl);

  return deliverEmail({ to: recipient, subject, html, tag: 'RECUPERAÇÃO DE SENHA' });
}

/**
 * 2. Envio de E-mail para Pedido Realizado / Comanda Emitida
 */
async function sendOrderConfirmation(order) {
  if (!order || !order.customerEmail) return null;

  const recipient = order.customerEmail;
  const orderNumber = order.orderNumber || 'PAT-5593';
  const subject = `🍔 Comanda #${orderNumber} Emitida! Seu pedido já está na chapa`;
  const html = generateOrderConfirmationHtml(order);

  return deliverEmail({ to: recipient, subject, html, tag: 'CONFIRMAÇÃO DE PEDIDO' });
}

/**
 * Gera o HTML oficial do e-mail de Boas-Vindas
 */
function generateWelcomeHtml(user = {}) {
  const rawName = user?.name ? user.name.split(' ')[0] : 'Cliente';
  const userName = escapeHtml(rawName);
  const orderUrl = `${frontendBaseUrl}/order`;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao Patties Burger</title>
</head>
<body style="margin: 0; padding: 0; background-color: #E4DFD5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #141413;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #E4DFD5; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Container Principal -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #FAF7F2; border: 2px solid #141413; box-shadow: 6px 6px 0px rgba(20,20,19,0.15);">
          
          <!-- Topo Editorial Preto Retrô -->
          <tr>
            <td style="background-color: #141413; padding: 26px 24px; text-align: center; border-bottom: 2px solid #141413;">
              <span style="font-family: monospace; font-size: 10px; font-weight: bold; color: #FEDB00; letter-spacing: 0.22em; text-transform: uppercase; display: block; margin-bottom: 6px;">
                ★ PATTIES DIRECT • BEM-VINDO À FAMÍLIA ★
              </span>
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #FFFFFF; font-weight: normal; letter-spacing: -0.02em;">
                Patties<span style="color: #FEDB00; font-size: 14px; vertical-align: super;">®</span>
              </h1>
              <span style="display: block; font-family: monospace; font-size: 9px; color: rgba(255,255,255,0.6); margin-top: 4px; letter-spacing: 0.15em;">
                EST. 2019 • ORIGINAL ULTRA SMASH BURGER
              </span>
            </td>
          </tr>

          <!-- Corpo do E-mail -->
          <tr>
            <td style="padding: 32px 28px;">
              <span style="font-family: monospace; font-size: 9px; font-weight: bold; color: #D71920; letter-spacing: 0.2em; text-transform: uppercase; display: block; margin-bottom: 8px;">
                ACESSO CONFIRMADO NO CAIXA
              </span>
              
              <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 24px; color: #141413; line-height: 1.25;">
                Olá, ${userName}! A chapa já está no ponto.
              </h2>

              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: rgba(20,20,19,0.85);">
                Que honra ter você com a gente no <strong>Patties Direct</strong>! Agora você pode montar seus smash burgers favoritos, personalizar o ponto da crostinha, adicionar Nhonhonese verde e acompanhar a entrega ao vivo no mapa em tempo real.
              </p>

              <!-- Box Destaque: Presente de Boas-Vindas -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FEDB00; border: 2px solid #141413; margin: 24px 0;">
                <tr>
                  <td style="padding: 18px 20px; text-align: center;">
                    <span style="font-family: monospace; font-size: 10px; font-weight: 900; color: #0E132A; letter-spacing: 0.2em; text-transform: uppercase; display: block; margin-bottom: 4px;">
                      🎁 SEU PRESENTE DE BOAS-VINDAS
                    </span>
                    <div style="font-family: monospace; font-size: 24px; font-weight: 900; color: #D71920; letter-spacing: 0.15em; margin: 6px 0;">
                      PRIMEIRACOMPRA
                    </div>
                    <span style="font-family: Georgia, serif; font-style: italic; font-size: 13px; color: #0E132A; display: block;">
                      Garante 15% de desconto no seu primeiro pedido na chapa.
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.6; color: rgba(20,20,19,0.7);">
                Basta aplicar o cupom no carrinho antes de fechar o pedido. Além disso, pedidos acima de R$ 50,00 contam com <strong>Frete Grátis</strong> automático!
              </p>

              <!-- Botão CTA Principal -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
                <tr>
                  <td align="center">
                    <a href="${orderUrl}" target="_blank" style="display: inline-block; background-color: #D71920; color: #FFFFFF; font-family: monospace; font-size: 12px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.2em; padding: 16px 32px; border: 2px solid #141413; box-shadow: 4px 4px 0px #141413;">
                      Pedir Agora no Cardápio ➔
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Dica de Comandas -->
              <div style="background-color: #F3EFE6; border: 1px dashed rgba(20,20,19,0.3); padding: 14px 18px; margin-top: 24px;">
                <span style="font-family: monospace; font-size: 10px; font-weight: bold; color: #141413; text-transform: uppercase; letter-spacing: 0.15em; display: block; margin-bottom: 4px;">
                  📋 Central de Comandas
                </span>
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: rgba(20,20,19,0.75);">
                  Todos os pedidos que você realizar com a sua conta ficam salvos na sua central de comandas para consulta rápida e rastreio pelo mapa.
                </p>
              </div>

            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="background-color: #F3EFE6; padding: 20px; text-align: center; border-top: 1px solid rgba(20,20,19,0.15);">
              <span style="font-family: monospace; font-size: 10px; color: rgba(20,20,19,0.6); text-transform: uppercase; letter-spacing: 0.15em; display: block;">
                Patties Burger • Chapa de Ferro Quente a 250°C
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * 3. Envio de E-mail de Boas-Vindas
 */
async function sendWelcomeEmail(user) {
  const recipient = user?.email;
  if (!recipient) return null;

  const rawName = user?.name ? user.name.split(' ')[0] : 'Cliente';
  const subject = `🍔 Bem-vindo ao Patties Burger, ${rawName}! Sua conta está pronta para a chapa`;
  const html = generateWelcomeHtml(user);

  return deliverEmail({ to: recipient, subject, html, tag: 'BOAS-VINDAS' });
}

/**
 * Função central de entrega: utiliza o Resend com fallback silencioso para logs caso esteja em ambiente de testes ou sem chave
 */
async function deliverEmail({ to, subject, html, tag }) {
  // Em ambiente de teste unitário, apenas registra log para manter testes rápidos e determinísticos
  if (process.env.NODE_ENV === 'test') {
    console.log(`[TEST MAIL] Simulação de envio para ${to}: ${subject}`);
    return { success: true, simulated: true };
  }

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: defaultSender,
        to: [to],
        subject,
        html,
      });

      console.log(`✉️ [RESEND SUCESSO - ${tag}] E-mail despachado para ${to} (ID: ${response.data?.id || 'ok'})`);
      return { success: true, id: response.data?.id };
    } catch (err) {
      console.warn(`⚠️ [RESEND AVISO - ${tag}] Falha ao despachar e-mail via API:`, err.message);
      return { success: false, error: err.message };
    }
  } else {
    console.log('====================================================');
    console.log(`📨 [MENSAGERIA PATTIES - ${tag}]`);
    console.log(`Para: ${to}`);
    console.log(`Assunto: ${subject}`);
    console.log('====================================================');
    return { success: true, localLog: true };
  }
}

module.exports = {
  sendPasswordReset,
  sendOrderConfirmation,
  sendWelcomeEmail,
  generatePasswordResetHtml,
  generateOrderConfirmationHtml,
  generateWelcomeHtml,
  deliverEmail,
};
