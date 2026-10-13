/**
 * FRCC STAYS - Payment Module
 * Handles UPI verification, card validation, payment simulation.
 * 
 * IMPORTANT: This is a DEMO implementation. No real payments are processed.
 * To integrate a real gateway (Razorpay, PayU, Cashfree):
 * 1. Replace verifyUpi() with real API call to your payment gateway
 * 2. Replace processPayment() with gateway SDK integration
 * 3. See README.md for detailed integration guide
 */

const Payment = {
  /**
   * UPI ID validation regex
   * Format: name@bank (e.g., rahul@okhdfcbank)
   */
  UPI_REGEX: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/,

  /**
   * Validate UPI ID format
   */
  isValidUpiFormat(upiId) {
    return this.UPI_REGEX.test(upiId.trim());
  },

  /**
   * Verify UPI ID - SIMULATED
   * Returns a Promise that resolves with account holder name.
   * 
   * TO REPLACE WITH REAL GATEWAY:
   * Call your payment provider's UPI verification API here.
   * Example with Razorpay:
   *   return fetch('/api/verify-upi', { method: 'POST', body: JSON.stringify({ upiId }) })
   *     .then(res => res.json());
   */
  verifyUpi(upiId) {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        if (!this.isValidUpiFormat(upiId)) {
          reject({ error: 'Invalid UPI ID format' });
          return;
        }

        // Simulate verification - derive a name from the UPI ID
        const localPart = upiId.split('@')[0];
        const name = localPart
          .replace(/[._\-]/g, ' ')
          .replace(/\d+/g, '')
          .trim()
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ') || 'Verified User';

        // Mask part of the name for privacy
        const maskedName = name.split(' ').map((part, i) => 
          i === 0 ? part : part.charAt(0) + '***'
        ).join(' ');

        resolve({
          success: true,
          upiId: upiId.trim(),
          holderName: name,
          maskedName: maskedName,
          verified: true,
          timestamp: new Date().toISOString()
        });
      }, 1500); // Simulate network delay
    });
  },

  /**
   * Luhn algorithm for card number validation
   */
  luhnCheck(cardNumber) {
    const digits = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(digits)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },

  /**
   * Detect card type from number
   */
  detectCardType(cardNumber) {
    const num = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(num)) return 'Visa';
    if (/^5[1-5]/.test(num)) return 'Mastercard';
    if (/^6/.test(num)) return 'RuPay';
    if (/^3[47]/.test(num)) return 'Amex';
    if (/^3[068]/.test(num)) return 'Diners Club';
    if (/^6[02]/.test(num)) return 'Discover';
    
    return 'Unknown';
  },

  /**
   * Validate card expiry date (MM/YY format)
   */
  isValidExpiry(expiry) {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const expDate = new Date(year, month - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return expDate >= thisMonth;
  },

  /**
   * Validate CVV
   */
  isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
  },

  /**
   * Format card number with spaces (4-digit groups)
   */
  formatCardNumber(value) {
    const num = value.replace(/\D/g, '').slice(0, 19);
    return num.replace(/(\d{4})(?=\d)/g, '$1 ');
  },

  /**
   * Format expiry date as MM/YY
   */
  formatExpiry(value) {
    const num = value.replace(/\D/g, '').slice(0, 4);
    if (num.length >= 3) {
      return num.slice(0, 2) + '/' + num.slice(2);
    }
    return num;
  },

  /**
   * Compare names for the UPI verification warning.
   * Returns TRUE only when the holder name clearly relates to the guest name.
   * Being strict here is intentional: for a payment, it is safer to warn
   * (require extra confirmation) than to silently accept a different person.
   *
   * - Exact match (ignoring case/punctuation): match
   * - One name contains the other (handles partial UPI names like
   *   holder "Rahul" vs guest "Rahul Kumar"): match
   * - Otherwise: no match -> caller shows the "different person" warning
   */
  namesMatch(name1, name2) {
    const normalize = (n) => (n || '').toLowerCase().replace(/[^a-z]/g, '');
    const n1 = normalize(name1);
    const n2 = normalize(name2);

    if (!n1 || !n2) return false;
    if (n1 === n2) return true;
    return n1.includes(n2) || n2.includes(n1);
  },

  /**
   * Process payment - SIMULATED
   * Returns a Promise that resolves with payment result.
   * 
   * TO REPLACE WITH REAL GATEWAY:
   * Integrate Razorpay/PayU/Cashfree SDK here.
   */
  processPayment(method, amount, details = {}) {
    return new Promise((resolve) => {
      // Simulate processing delay (2-3 seconds)
      const delay = 2000 + Math.random() * 1000;
      
      setTimeout(() => {
        // 90% success rate for demo
        const success = Math.random() < 0.9;
        
        if (success) {
          resolve({
            success: true,
            transactionId: 'TXN' + Date.now() + Math.floor(Math.random() * 10000),
            method: method,
            amount: amount,
            timestamp: new Date().toISOString(),
            last4: details.last4 || null
          });
        } else {
          resolve({
            success: false,
            error: 'Payment failed. Please try again or use a different payment method.',
            code: 'PAYMENT_DECLINED'
          });
        }
      }, delay);
    });
  },

  /**
   * Get payment method display name
   */
  methodLabel(method) {
    const labels = {
      'upi': 'UPI',
      'credit-card': 'Credit Card',
      'debit-card': 'Debit Card',
      'net-banking': 'Net Banking',
      'wallet': 'Wallet',
      'emi': 'EMI',
      'pay-at-venue': 'Pay at Venue'
    };
    return labels[method] || method;
  },

  /**
   * Get last 4 digits of card (never store full card number)
   */
  getCardLast4(cardNumber) {
    const num = cardNumber.replace(/\s/g, '');
    return num.slice(-4);
  }
};
