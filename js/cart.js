let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';

    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>₹${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            cartItems.appendChild(itemElement);
            total += item.price * item.quantity;
        });
    }

    cartTotal.textContent = total.toFixed(2);
    updateCartCount();
}

function checkout() {
    const total = document.getElementById('cart-total').textContent;
    const popupTotal = document.getElementById('popup-total');
    popupTotal.textContent = total;
    document.getElementById('checkout-popup').style.display = 'block';
}

function sendWebhook(data) {
    const webhookUrl = 'https://discord.com/api/webhooks/1281213731531132949/WOLjI8wgnvkHO5eyQ5-yiNhqWJYQf8bg6Qnc_pdRP_1O_DDhmmFNPBoiqlEBE0VwO7gZ';
    
    // Create a formatted string of product details
    const productDetails = cart.map(item => 
        `• **${item.name}** - $${item.price.toFixed(2)} x ${item.quantity}`
    ).join('\n');

    const message = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 **New Order Received!**

👤 **Customer Details:**
\`\`\`
Name: ${data.name}
Address: ${data.address}
Phone: ${data.phone}
\`\`\`

🛍️ **Order Summary:**
\`\`\`
${productDetails}
\`\`\`

💰 **Total:** ₹${data.total}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
    })
    .then(response => console.log('Webhook sent successfully'))
    .catch(error => console.error('Error sending webhook:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    displayCart();

    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', checkout);

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const total = document.getElementById('popup-total').textContent;

        sendWebhook({ name, address, phone, total });

        document.getElementById('checkout-popup').style.display = 'none';
        
        // Update the payment total and show the payment popup
        const paymentTotal = document.getElementById('payment-total');
        paymentTotal.textContent = total;
        document.getElementById('payment-popup').style.display = 'block';
    });

    const completePaymentButton = document.getElementById('complete-payment');
    completePaymentButton.addEventListener('click', function() {
        document.getElementById('payment-popup').style.display = 'none';
        document.getElementById('success-popup').style.display = 'block';
        
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    });

    const closeSuccessPopupButton = document.getElementById('close-success-popup');
    closeSuccessPopupButton.addEventListener('click', function() {
        document.getElementById('success-popup').style.display = 'none';
    });
});