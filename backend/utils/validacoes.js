// Validação de formato de CNPJ (com dígitos verificadores)
function cnpjValido(cnpj) {
  const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  if (!regex.test(cnpj)) return false;

  const numeros = cnpj.replace(/\D/g, "");
  if (numeros.length !== 14) return false;
  if (/^(\d)\1+$/.test(numeros)) return false;

  const calcDigito = (base) => {
    const pesos = base.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = base.split("").reduce((acc, n, i) => acc + n * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const base12 = numeros.slice(0, 12);
  const dig1 = calcDigito(base12);
  const dig2 = calcDigito(base12 + dig1);

  return numeros === base12 + dig1 + dig2;
}

// Validação de e-mail
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = { cnpjValido, emailValido };