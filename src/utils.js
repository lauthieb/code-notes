/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
// eslint-disable-next-line import/prefer-default-export
export const createId = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
  const random = Math.random() * 16 | 0;
  const value = char === 'x' ? random : (random & 0x3 | 0x8);

  return value.toString(16);
});
