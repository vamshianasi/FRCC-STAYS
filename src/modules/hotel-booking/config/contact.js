/**
 * FRCC contact details — single source of truth.
 *
 * Every place that shows FRCC's own contact details (footer, support text,
 * receipts, WhatsApp messages) imports from here instead of hard-coding the
 * number or an address, so there is exactly one copy to keep up to date.
 */

/** The FRCC contact number, exactly as it is shown: +91 78936 16262 */
export const FRCC_PHONE = '+91 78936 16262';

/** Dialable form used by tel: links (digits only). */
export const FRCC_PHONE_TEL = 'tel:+917893616262';

/**
 * FRCC addresses, in the order they must be shown: Vijayawada first, then
 * Hyderabad. The text is copied exactly and must not be re-phrased.
 */
export const FRCC_ADDRESSES = [
  {
    city: 'Vijayawada',
    address:
      'D.No. 24-29-210A, Durgapuram, Gulabithota Road, Vijayawada, NTR District, Andhra Pradesh – 520003.',
  },
  {
    city: 'Hyderabad',
    address:
      'Second Floor, Samridhi Vasyam, D No 1/98/9/3/23, Capital Pk Rd, Above Axis bank Image gardens branch, Jaihind Enclave, Madhapur, Hyderabad, Telangana 500081.',
  },
];

/** Address rows in display order: [{ city, address }]. */
export const FRCC_ADDRESS_LIST = FRCC_ADDRESSES;
