
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // const valid_map = ['admin', 'editor','17828019562']
  // return valid_map.indexOf(str.trim()) >= 0
  return /^[A-Za-z]+[A-Za-z0-9_@]{2,19}/.test(str)
}

/**
 * @param {string} phone
 * @returns {Boolean}
 */
 export function validPhone(str) {
  // const valid_map = ['admin', 'editor','17828019562']
  // return valid_map.indexOf(str.trim()) >= 0
  return /^1[0-9]{10}/.test(str)
}

