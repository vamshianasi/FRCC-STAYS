// Simulated UPI verification. Replace with a real gateway call.
const UPI_REGEX = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;

export function isValidUpiFormat(upiId) {
  return UPI_REGEX.test(upiId.trim());
}

// Simulated account holder lookup. Returns a Promise so a real gateway can replace it.
export function verifyUpi(upiId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!isValidUpiFormat(upiId)) {
        reject(new Error('Invalid UPI ID format'));
        return;
      }
      // Simulated: derive a name from the handle
      const handle = upiId.split('@')[0];
      const name = handle
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .trim() || 'Account Holder';
      resolve({ holderName: name, verified: true });
    }, 900);
  });
}
