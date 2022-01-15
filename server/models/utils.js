const LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz"
const UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const NUMBERS = "0123456789"
const SYMBOLS = " !\"\\#$%&'()*+,-./:;<=>?@[]^_`|~"

// make random 20 characters long id
export function newId() {
  let id = ""
  const allCharacter = LOWERCASE_LETTERS.concat(UPPERCASE_LETTERS, NUMBERS)
  for (let i = 0; i<20; i++){
    id +=  allCharacter[Math.floor(Math.random() * allCharacter.length)]
  }
  return id
}


export function generateToken(length) {
  let token = ""
  const allCharacter = LOWERCASE_LETTERS.concat(UPPERCASE_LETTERS, NUMBERS)
  for (let i = 0; i < length; i++) {
    token += allCharacter[Math.floor(Math.random() * allCharacter.length)]
  }
  return token
}
