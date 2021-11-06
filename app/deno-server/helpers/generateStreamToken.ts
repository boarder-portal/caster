const ALPHABET = 'abcdefghijklmnopqrstyvwxyz0123456789';

export function generateStreamToken(): string {
  let token = '';

  for (let i = 0; i < 40; i++) {
    token += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }

  return token;
}
