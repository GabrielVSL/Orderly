export const formatCurrency = (value) => {
  const numericValue = typeof value === 'number' ? value : Number(value) || 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
};

export default formatCurrency;
