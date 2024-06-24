var errors = {};
const namePattern = /^[a-zA-Zא-ת]+[a-zA-Zא-ת\s]*$/;
const cardNumberPattern = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
const cardExpiryPattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
const cardCvvPattern = /^[0-9]{3,4}$/;

export const cardValidation = (values) => {
    errors = {}

    if (!values.name) {
        errors.name = 'Name is required';
    } else if (!namePattern.test(values.name)) {
        errors.name = 'Name can only contain letters and spaces';
    }

    if (!values.cardNumber) {
        errors.cardNumber = 'Card Number is required';
    } else if (!cardNumberPattern.test(values.cardNumber)) {
        errors.cardNumber = 'Invalid card number';
    }

    if (!values.cardExpiry) {
        errors.cardExpiry = 'Card Expiry is required';
    } else if (!cardExpiryPattern.test(values.cardExpiry)) {
        errors.cardExpiry = 'Invalid card expiry (MM/YY)';
    }

    if (!values.cvv) {
        errors.cvv = 'Card CVV is required';
    } else if (!cardCvvPattern.test(values.cvv)) {
        errors.cvv = 'Invalid card CVV';
    }

    return errors;
}