
        const app = {
            state: {
                cart: JSON.parse(localStorage.getItem('cart')) || [],
                selectedColor: 'Black',
                selectedVariant: 'Standard',
                wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
                darkMode: localStorage.getItem('darkMode') === 'true'
            },

            init() {
                this.setupDarkMode();
                this.setupHamburger();
                this.setupGallery();
                this.setupColorSelection();
                this.setupVariantSelection();
                this.setupQuantitySelector();
                this.setupAddToCart();
                this.setupWishlist();
                this.setupCartButton();
                this.setupProductCards();
                this.updateCartCount();
                console.log('✓ App initialized successfully');
            },

            setupDarkMode() {
                const toggle = document.getElementById('darkModeToggle');
                if (this.state.darkMode) {
                    document.body.classList.add('dark-mode');
                    toggle.textContent = '☀️';
                }
                toggle.addEventListener('click', () => this.toggleDarkMode());
            },

            toggleDarkMode() {
                document.body.classList.toggle('dark-mode');
                this.state.darkMode = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', this.state.darkMode);
                const toggle = document.getElementById('darkModeToggle');
                toggle.textContent = this.state.darkMode ? '☀️' : '🌙';
            },

            setupHamburger() {
                const hamburger = document.getElementById('hamburger');
                const navMenu = document.querySelector('.nav-menu');

                hamburger.addEventListener('click', () => {
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                });

                document.querySelectorAll('.nav-menu a').forEach(link => {
                    link.addEventListener('click', () => {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                    });
                });
            },

            setupGallery() {
                const thumbnails = document.querySelectorAll('.thumbnail');
                const mainImage = document.getElementById('mainImage');

                thumbnails.forEach(thumbnail => {
                    thumbnail.addEventListener('click', () => {
                        const imageUrl = thumbnail.dataset.image;
                        mainImage.src = imageUrl;
                        thumbnails.forEach(t => t.classList.remove('active'));
                        thumbnail.classList.add('active');
                    });
                });

                mainImage.addEventListener('click', () => {
                    this.showToast('📸 Image preview');
                });
            },

            setupColorSelection() {
                document.querySelectorAll('[data-color]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('[data-color]').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.state.selectedColor = e.target.dataset.color;
                    });
                });
            },

            setupVariantSelection() {
                document.querySelectorAll('[data-variant]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('[data-variant]').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.state.selectedVariant = e.target.dataset.variant;
                    });
                });
            },

            setupQuantitySelector() {
                const quantityInput = document.getElementById('quantity');
                const increaseQty = document.getElementById('increaseQty');
                const decreaseQty = document.getElementById('decreaseQty');

                increaseQty.addEventListener('click', () => {
                    quantityInput.value = parseInt(quantityInput.value) + 1;
                });

                decreaseQty.addEventListener('click', () => {
                    if (parseInt(quantityInput.value) > 1) {
                        quantityInput.value = parseInt(quantityInput.value) - 1;
                    }
                });

                quantityInput.addEventListener('change', () => {
                    if (quantityInput.value < 1) quantityInput.value = 1;
                });
            },

            setupAddToCart() {
                const addToCartBtn = document.getElementById('addToCartBtn');
                addToCartBtn.addEventListener('click', () => this.addToCart());
            },

            addToCart() {
                const quantityInput = document.getElementById('quantity');
                const mainImage = document.getElementById('mainImage');
                const quantity = parseInt(quantityInput.value);

                const cartItem = {
                    id: Date.now(),
                    name: 'Premium Wireless Headphones Pro Max',
                    price: 299,
                    color: this.state.selectedColor,
                    variant: this.state.selectedVariant,
                    quantity: quantity,
                    image: mainImage.src
                };

                this.state.cart.push(cartItem);
                localStorage.setItem('cart', JSON.stringify(this.state.cart));
                this.updateCartCount();

                this.showToast(`✓ Added ${quantity} item(s) to cart!`);

                const addToCartBtn = document.getElementById('addToCartBtn');
                addToCartBtn.textContent = '✓ Added!';
                addToCartBtn.style.background = '#4caf50';
                setTimeout(() => {
                    addToCartBtn.textContent = '🛒 Add to Cart';
                    addToCartBtn.style.background = '';
                }, 2000);

                quantityInput.value = 1;
            },

            updateCartCount() {
                const totalItems = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
                document.getElementById('cartCount').textContent = totalItems;
            },

            setupWishlist() {
                const wishlistBtn = document.getElementById('wishlistBtn');
                const productId = 'premium-headphones';

                if (this.state.wishlist.includes(productId)) {
                    wishlistBtn.classList.add('active');
                    wishlistBtn.textContent = '♥';
                }

                wishlistBtn.addEventListener('click', () => {
                    if (this.state.wishlist.includes(productId)) {
                        this.state.wishlist = this.state.wishlist.filter(id => id !== productId);
                        wishlistBtn.classList.remove('active');
                        wishlistBtn.textContent = '♡';
                        this.showToast('❌ Removed from wishlist');
                    } else {
                        this.state.wishlist.push(productId);
                        wishlistBtn.classList.add('active');
                        wishlistBtn.textContent = '♥';
                        this.showToast('❤️ Added to wishlist');
                    }
                    localStorage.setItem('wishlist', JSON.stringify(this.state.wishlist));
                });
            },

            setupCartButton() {
                document.getElementById('cartBtn').addEventListener('click', () => {
                    const totalItems = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
                    this.showToast(`🛒 ${totalItems} item(s) in cart`);
                });
            },

            setupProductCards() {
                document.querySelectorAll('.product-card').forEach((card, index) => {
                    card.addEventListener('click', () => {
                        const title = card.querySelector('.product-card-title').textContent;
                        const price = card.querySelector('.product-card-price').textContent;
                        this.showToast(`📦 ${title} - ${price}`);
                    });
                    card.style.animation = `slideIn 0.5s ease-out ${index * 0.1}s both`;
                });
            },

            showToast(message) {
                const toast = document.createElement('div');
                toast.className = 'toast';
                toast.textContent = message;
                document.body.appendChild(toast);

                setTimeout(() => {
                    toast.style.animation = 'slideIn 0.4s ease-out reverse';
                    setTimeout(() => toast.remove(), 400);
                }, 3000);
            },

            scrollToReviews() {
                document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
            }
        };

        document.addEventListener('DOMContentLoaded', () => app.init());
 