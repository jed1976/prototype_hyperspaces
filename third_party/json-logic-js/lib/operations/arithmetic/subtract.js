function subtract(a, b) {
  if (b === undefined) {
    return -a;
  }

  return a - b;
}

subtract.op = '-';
export default subtract;