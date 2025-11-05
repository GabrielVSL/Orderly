const cartService = require('../services/cartService');

// Simulate checkout process
const processCheckout = async () => {
    try {
        await cartService.checkoutCart();
        return { 
            status: 200, 
            message: 'Order processed successfully.' 
        };
    } catch (error) {
        throw new Error ('Error processing Checkout: ' + error.message);
    }
};

module.exports = {
    processCheckout,
};