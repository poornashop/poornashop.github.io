// Sample product data
const products = [
    { id: 1, name: "Yellow churidar", price: 450, image: "imgs/1.jpeg" },
    { id: 2, name: "Violet churidar", price: 620, image: "imgs/2.jpeg" },
    { id: 3, name: "Cream churidar", price: 540, image: "imgs/3.jpeg" },
    { id: 4, name: "Pink churidar", price: 600, image: "imgs/4.jpeg" },
    { id: 5, name: "Silver churidar", price: 510, image: "imgs/5.jpeg" },
    { id: 6, name: "Checked churidar", price: 825, image: "imgs/6.jpeg" },
    { id: 7, name: "Cream checked churidar", price: 825, image: "imgs/7.jpeg" },
    { id: 8, name: "Flower churidar", price: 465, image: "imgs/8.jpeg" },
    { id: 9, name: "Shiny churidar", price: 510, image: "imgs/9.jpeg" },
    { id: 10, name: "Cool churidar", price: 1250, image: "imgs/10.jpeg" },
    { id: 11, name: "Magenta churidar", price: 600, image: "imgs/11.jpeg" },
    { id: 12, name: "Blue churidar", price: 510, image: "imgs/12.jpeg" },
    { id: 13, name: "Dark flower churidar", price: 465, image: "imgs/13.jpeg" },
    { id: 14, name: "Silver churidar", price: 990, image: "imgs/14.jpeg" },
    { id: 15, name: "Mixed churidar", price: 620, image: "imgs/15.jpeg" },
    { id: 16, name: "Golden churidar", price: 565, image: "imgs/16.jpeg" },
    { id: 17, name: "Sandy churidar", price: 510, image: "imgs/17.jpeg" },
    { id: 18, name: "Marble churidar", price: 825, image: "imgs/18.jpeg" },
    { id: 19, name: "Mixed blue churidar", price: 620, image: "imgs/19.jpeg" },
    { id: 20, name: "Cold silver churidar", price: 1230, image: "imgs/20.jpeg" },
    { id: 21, name: "Shining dark churidar", price: 510, image: "imgs/20.jpeg" },
    // Add more products as needed
];

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to render products
function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>₹${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productElement);
    });
}

// Function to add product to cart (to be implemented)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    console.log(`Product ${productId} added to cart`);
}

// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    console.log('Form submission started');
    const form = event.target;
    console.log('Form:', form);
    const formData = new FormData(form);
    console.log('FormData:', formData);
    
    // Log each form field
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
    
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    console.log('Parsed form data:', data);
    
    // Send webhook
    sendWebhook(data)
        .then(() => {
            console.log('Webhook sent successfully');
            form.reset();
            alert('Thank you for your message!');
        })
        .catch(error => {
            console.error('Error sending webhook:', error);
            alert('There was an error sending your message. Please try again.');
        });
}

// Function to send webhook
function sendWebhook(data) {
    console.log('Sending webhook');
    const webhookUrl = 'https://discord.com/api/webhooks/1281213731531132949/WOLjI8wgnvkHO5eyQ5-yiNhqWJYQf8bg6Qnc_pdRP_1O_DDhmmFNPBoiqlEBE0VwO7gZ';
    
    const message = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📬 **New Contact Form Submission**

👤 **Contact Details:**
\`\`\`
Name: ${data.name}
Email: ${data.email}
\`\`\`

📝 **Message:**
\`\`\`
${data.message}
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    return fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
    });
}

// Function to update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', handleFormSubmission);
});