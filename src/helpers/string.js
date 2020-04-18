/* eslint-disable no-useless-escape */
export const normalizeJSX = code =>
  code
    .replace(/WithStyles/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/Icon \/>/g, ' />')
    .replace(/pure/g, '');

export default {
  normalizeJSX,
};
