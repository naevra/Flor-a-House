// Curtain Loader
document.getElementById("openBtn").onclick = function() {
    let curtain = document.getElementById("curtain");
    curtain.classList.add("open");
    setTimeout(() => {
        curtain.style.display = "none";
    }, 1500);
}

// Enhanced Flower Fall Animation - OPTIMIZED
function createFallingFlowers() {
    // Clear existing flowers first
    document.querySelectorAll('.flower').forEach(flower => flower.remove());
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            let flower = document.createElement("img");
            flower.src = "bunga.png";
            flower.className = "flower";
            flower.style.left = Math.random() * 100 + "vw";
            flower.style.animationDuration = (Math.random() * 4 + 7) + "s";
            flower.style.animationDelay = Math.random() * 3 + "s";
            flower.style.width = (Math.random() * 20 + 15) + "px";
            flower.style.opacity = Math.random() * 0.5 + 0.4;
            flower.style.zIndex = "10";
            document.body.appendChild(flower);
        }, i * 50); // Staggered spawn untuk efek natural
    }
}

// Smooth Scroll for Navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.card, .product, .review').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all .6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(el);
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', function() {
    createFallingFlowers();  // ✅ BUNGA JATUH AKTIF
    initSmoothScroll();
    initScrollAnimations();
    
    // Restart flowers every 30 seconds untuk infinite effect
    setInterval(createFallingFlowers, 30000);
});

// Copy email & WA functionality
document.querySelector('.email-info').addEventListener('click', function() {
    navigator.clipboard.writeText('florea.house@gmail.com');
    const originalText = this.textContent;
    this.innerHTML = '<i class="fas fa-check-circle"></i> Email disalin!';
    this.style.background = 'linear-gradient(135deg, #4ecdc4, #44bd99)';
    
    setTimeout(() => {
        this.textContent = originalText;
        this.style.background = 'linear-gradient(135deg, rgba(255,255,255,.9), rgba(255,248,251,.9))';
    }, 2000);
});
// Shop Now → Join Modal
document.querySelectorAll('a[href="catalog.html"], a[href="shop.html"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('joinModal').classList.add('show');
    });
});

// Global Cart Array
let cart = JSON.parse(localStorage.getItem('floreaCart')) || [];

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; color:#999;">Keranjang kosong</p>';
        cartTotal.textContent = 'Total: Rp 0';
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        itemsHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Rp ${item.price.toLocaleString()} x ${item.quantity}</small>
                </div>
                <div>
                    <button onclick="changeQuantity(${index}, -1)" style="background:#ff5e8a; color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer; margin-right:5px;">-</button>
                    <span style="min-width:20px; display:inline-block;">${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)" style="background:#ff5e8a; color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;">+</button>
                    <button onclick="removeItem(${index})" style="background:#ff4444; color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer; margin-left:10px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    cartTotal.innerHTML = `<strong>Total: Rp ${total.toLocaleString()}</strong>
        <br><button onclick="checkout()" style="margin-top:10px; width:100%; padding:12px; background:linear-gradient(135deg,#ff5e8a,#ff8ba7); color:white; border:none; border-radius:12px; font-weight:600; cursor:pointer;">Checkout</button>`;
    
    // Save to localStorage
    localStorage.setItem('floreaCart', JSON.stringify(cart));
}

// Add to Cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartUI();
    
    // Success feedback
    const button = event.target;
    const originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = '#4ecdc4';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1000);
}

// Change Quantity
function changeQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    updateCartUI();
}

// Remove Item
function removeItem(index) {
    if (confirm('Hapus item ini?')) {
        cart.splice(index, 1);
        updateCartUI();
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Checkout berhasil!\nTotal: Rp ${total.toLocaleString()}\nTerima kasih telah berbelanja! 🌸`);
    
    // Clear cart
    cart = [];
    updateCartUI();
}

// Toggle Cart Visibility
function toggleCart() {
    const cartBox = document.getElementById('cart-box');
    cartBox.style.display = cartBox.style.display === 'none' ? 'block' : 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    
    // Close cart when clicking outside
    document.getElementById('cart-box').addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    document.addEventListener('click', function() {
        document.getElementById('cart-box').style.display = 'none';
    });
});

// Shop Now → Login → Catalog (FIXED)
function triggerShopFlow(e) {
    e.preventDefault();
    
    // Cek apakah sudah login
    if (localStorage.getItem('userLoggedIn') === 'true') {
        // Langsung ke katalog
        window.location.href = 'catalog.html';
    } else {
        // Simpan redirect & ke login
        localStorage.setItem('redirectAfterLogin', 'catalog.html');
        window.location.href = 'login.html';
    }
}

// Update existing shop-redirect logic
document.addEventListener('DOMContentLoaded', function() {
    // Hapus event listener lama jika ada
    const shopTrigger = document.querySelector('.shop-trigger');
    if (shopTrigger) {
        shopTrigger.removeEventListener('click', triggerShopFlow);
        shopTrigger.addEventListener('click', triggerShopFlow);
    }
});

// CLEAR LOGIN LOOP
function clearLoginRedirect() {
    // Hapus redirect setelah berhasil
    if (window.location.pathname.includes('catalog.html') || 
        window.location.pathname.includes('index.html')) {
        localStorage.removeItem('redirectAfterLogin');
    }
}

document.addEventListener('DOMContentLoaded', clearLoginRedirect);