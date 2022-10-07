module.exports = {
  calculate: (x, y, operator) => {
    const allowedOperators = ["+", "-", "*", "/"]
    if (!allowedOperators.some(_operator => _operator === operator))
      return new Error('Invalid operator')
    if (operator === '+') return x + y;
    if (operator === '-') return x - y;
    if (operator === '*') return x * y;
    if (operator === '/') return x / y;
  }
}