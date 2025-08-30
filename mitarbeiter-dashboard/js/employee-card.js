/**
 * Mitarbeiterausweis & Bestellsystem
 * Kompatibel mit bestehender Firebase v8 Implementierung
 */

class EmployeeCardSystem {
    constructor() {
        this.cart = [];
        this.currentUser = null;
        this.employeeData = null;
        this.qrCode = null;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        try {
            // Wait for Firebase to be ready
            if (typeof firebase !== 'undefined') {
                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        this.currentUser = user;
                        this.loadEmployeeData();
                    }
                });
            }
            
            // Load cart from localStorage
            this.loadCartFromStorage();
            
            console.log('✅ Employee Card System initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Employee Card System:', error);
        }
    }

    async loadEmployeeData() {
        try {
            const employeeDoc = await firebase.firestore().collection('employees').doc(this.currentUser.uid).get();
            if (employeeDoc.exists) {
                this.employeeData = { id: employeeDoc.id, ...employeeDoc.data() };
                this.renderEmployeeCard();
                this.generateQRCode();
            }
        } catch (error) {
            console.error('Error loading employee data:', error);
        }
    }

    renderEmployeeCard() {
        if (!this.employeeData) return;

        const cardContainer = document.getElementById('employeeCardContainer');
        if (!cardContainer) return;

        const { firstName, lastName, position, phone, email, avatar } = this.employeeData;
        const fullName = `${firstName} ${lastName}`;
        const website = 'buderus-systeme.de';

        cardContainer.innerHTML = `
            <div class="employee-card-container">
                <h2><i class="fas fa-id-card"></i> Mitarbeiterausweis Vorschau</h2>
                
                <div class="card-preview-wrapper">
                    <div class="employee-card" id="employeeCard">
                        <!-- Obere Hälfte -->
                        <div class="card-top-section">
                            <img src="../assets/logo.png" alt="Logo" class="card-logo">
                            <img src="${avatar || '../assets/avatar.png'}" alt="${fullName}" class="card-avatar">
                            <h3 class="card-name">${fullName}</h3>
                            <p class="card-job-title">${position || 'Mitarbeiter'}</p>
                        </div>
                        
                        <!-- Untere Hälfte -->
                        <div class="card-bottom-section">
                            <div class="card-contact-info">
                                <div class="card-contact-item">📞 ${phone || 'Nicht angegeben'}</div>
                                <div class="card-contact-item">✉️ ${email}</div>
                                <div class="card-contact-item">🌐 ${website}</div>
                            </div>
                            <div class="card-qr-code" id="cardQRCode"></div>
                        </div>
                    </div>
                </div>

                <div class="card-actions">
                    <button class="card-action-btn" onclick="employeeCardSystem.downloadCard()">
                        <i class="fas fa-download"></i>
                        <span>Bild speichern</span>
                    </button>
                    <button class="card-action-btn" onclick="employeeCardSystem.shareCard()">
                        <i class="fas fa-share-alt"></i>
                        <span>Teilen</span>
                    </button>
                    <button class="card-action-btn" onclick="employeeCardSystem.showQRModal()">
                        <i class="fas fa-qrcode"></i>
                        <span>QR-Code anzeigen</span>
                    </button>
                    <button class="card-action-btn primary" onclick="employeeCardSystem.addToCart('employee_card')">
                        <i class="fas fa-shopping-cart"></i>
                        <span>In den Warenkorb</span>
                    </button>
                </div>
            </div>

            <!-- Shopping Cart Section -->
            <div class="shopping-cart-section">
                <div class="cart-header">
                    <h3><i class="fas fa-shopping-cart"></i> Warenkorb</h3>
                    <div class="cart-count" id="cartCount">0</div>
                </div>
                <div class="cart-items" id="cartItems">
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Ihr Warenkorb ist leer</p>
                        <small>Fügen Sie Produkte hinzu, um eine Bestellung aufzugeben</small>
                    </div>
                </div>
                <button class="submit-order-btn" id="submitOrderBtn" onclick="employeeCardSystem.submitOrder()" disabled>
                    <i class="fas fa-paper-plane"></i>
                    Bestellung abschicken
                </button>
            </div>
        `;

        this.updateCartDisplay();
    }

    async generateQRCode() {
        if (!this.employeeData) return;

        try {
            // Use existing QR generation from Firebase Functions
            const qrCodeContainer = document.getElementById('cardQRCode');
            if (!qrCodeContainer) return;

            const employeeUrl = `https://buderus-systeme.de/mitarbeiter/${this.employeeData.firstName.toLowerCase()}-${this.employeeData.lastName.toLowerCase()}.html`;
            
            // Clear container first
            qrCodeContainer.innerHTML = '';
            
            // Generate QR with rounded corners using QRCode.js
            if (typeof QRCode !== 'undefined') {
                const qr = new QRCode(qrCodeContainer, {
                    text: employeeUrl,
                    width: 60,
                    height: 60,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });

                this.qrCode = qr;
            } else {
                // Fallback text if QRCode library not loaded
                qrCodeContainer.innerHTML = '<div style="font-size: 8px; text-align: center;">QR-Code</div>';
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    }

    // Shopping Cart Methods
    addToCart(productType, options = {}) {
        const product = this.getProductConfig(productType);
        if (!product) {
            showToast('error', 'Fehler', 'Produkt nicht gefunden');
            return;
        }

        const existingItem = this.cart.find(item => 
            item.productType === productType && 
            JSON.stringify(item.options) === JSON.stringify(options)
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: Date.now().toString(),
                productType,
                quantity: 1,
                options,
                ...product,
                addedAt: new Date()
            });
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        showToast('success', 'Hinzugefügt', `${product.name} wurde zum Warenkorb hinzugefügt`);
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCartToStorage();
        this.updateCartDisplay();
        showToast('info', 'Entfernt', 'Artikel wurde aus dem Warenkorb entfernt');
    }

    updateQuantity(itemId, change) {
        const item = this.cart.find(item => item.id === itemId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(itemId);
            return;
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const submitBtn = document.getElementById('submitOrderBtn');

        if (!cartItems || !cartCount || !submitBtn) return;

        // Update count
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Update items display
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Ihr Warenkorb ist leer</p>
                    <small>Fügen Sie Produkte hinzu, um eine Bestellung aufzugeben</small>
                </div>
            `;
            submitBtn.disabled = true;
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        ${Object.keys(item.options).length > 0 ? 
                            `<small>Optionen: ${JSON.stringify(item.options)}</small>` : ''
                        }
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="employeeCardSystem.updateQuantity('${item.id}', -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="employeeCardSystem.updateQuantity('${item.id}', 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item-btn" onclick="employeeCardSystem.removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            submitBtn.disabled = false;
        }
    }

    async submitOrder() {
        if (this.cart.length === 0) {
            showToast('warning', 'Warenkorb leer', 'Fügen Sie Artikel hinzu, bevor Sie bestellen');
            return;
        }

        try {
            showToast('info', 'Bestellung wird verarbeitet...', 'Bitte warten');

            // Create order document
            const orderData = {
                userId: this.currentUser.uid,
                employeeData: {
                    name: `${this.employeeData.firstName} ${this.employeeData.lastName}`,
                    email: this.employeeData.email,
                    position: this.employeeData.position
                },
                items: this.cart.map(item => ({
                    productType: item.productType,
                    quantity: item.quantity,
                    options: item.options,
                    status: 'pending'
                })),
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Generate PDF for employee card if in cart
            const cardItem = this.cart.find(item => item.productType === 'employee_card');
            if (cardItem) {
                const pdfUrl = await this.generateCardPDF();
                const cardItemIndex = orderData.items.findIndex(item => item.productType === 'employee_card');
                if (cardItemIndex >= 0) {
                    orderData.items[cardItemIndex].pdfUrl = pdfUrl;
                }
            }

            // Save to Firebase
            await firebase.firestore().collection('orders').add(orderData);

            // Clear cart
            this.cart = [];
            this.saveCartToStorage();
            this.updateCartDisplay();

            showToast('success', 'Bestellung abgeschickt!', 'Ihre Bestellung wurde erfolgreich übermittelt');
            
        } catch (error) {
            console.error('Error submitting order:', error);
            showToast('error', 'Fehler', 'Bestellung konnte nicht übermittelt werden');
        }
    }

    // Product Configuration
    getProductConfig(productType) {
        const products = {
            employee_card: {
                name: 'Mitarbeiterausweis',
                description: 'Professioneller Mitarbeiterausweis mit QR-Code',
                category: 'cards'
            },
            business_card: {
                name: 'Visitenkarte',
                description: 'Klassische Visitenkarte',
                category: 'cards'
            },
            tshirt: {
                name: 'T-Shirt',
                description: 'Firmen T-Shirt',
                category: 'clothing'
            }
        };

        return products[productType] || null;
    }

    // Storage Methods
    saveCartToStorage() {
        localStorage.setItem('employeeCart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        try {
            const stored = localStorage.getItem('employeeCart');
            this.cart = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            this.cart = [];
        }
    }

    // Card Actions
    async downloadCard() {
        try {
            const cardElement = document.getElementById('employeeCard');
            if (!cardElement) return;

            // Check if html2canvas is available
            if (typeof html2canvas === 'undefined') {
                showToast('error', 'Fehler', 'Download-Funktion nicht verfügbar');
                return;
            }

            // Use html2canvas for high-quality capture
            const canvas = await html2canvas(cardElement, {
                scale: 3,
                backgroundColor: null,
                logging: false
            });

            // Download as PNG
            const link = document.createElement('a');
            link.download = `mitarbeiterausweis-${this.employeeData.firstName}-${this.employeeData.lastName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            showToast('success', 'Download gestartet', 'Ihr Mitarbeiterausweis wurde heruntergeladen');
        } catch (error) {
            console.error('Error downloading card:', error);
            showToast('error', 'Fehler', 'Download fehlgeschlagen');
        }
    }

    async shareCard() {
        try {
            const cardElement = document.getElementById('employeeCard');
            
            if (typeof html2canvas === 'undefined') {
                // Fallback: Share URL only
                const url = `https://buderus-systeme.de/mitarbeiter/${this.employeeData.firstName.toLowerCase()}-${this.employeeData.lastName.toLowerCase()}.html`;
                
                if (navigator.share) {
                    await navigator.share({
                        title: 'Mein Mitarbeiterausweis',
                        text: `Mitarbeiterausweis von ${this.employeeData.firstName} ${this.employeeData.lastName}`,
                        url: url
                    });
                } else {
                    await navigator.clipboard.writeText(url);
                    showToast('info', 'Link kopiert', 'Der Link zu Ihrem Profil wurde in die Zwischenablage kopiert');
                }
                return;
            }
            
            const canvas = await html2canvas(cardElement, { scale: 2 });
            
            canvas.toBlob(async (blob) => {
                const file = new File([blob], `mitarbeiterausweis-${this.employeeData.firstName}-${this.employeeData.lastName}.png`, {
                    type: 'image/png'
                });

                if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'Mein Mitarbeiterausweis',
                        text: `Mitarbeiterausweis von ${this.employeeData.firstName} ${this.employeeData.lastName}`,
                        files: [file]
                    });
                } else {
                    // Fallback: Copy link to clipboard
                    const url = `https://buderus-systeme.de/mitarbeiter/${this.employeeData.firstName.toLowerCase()}-${this.employeeData.lastName.toLowerCase()}.html`;
                    await navigator.clipboard.writeText(url);
                    showToast('info', 'Link kopiert', 'Der Link zu Ihrem Profil wurde in die Zwischenablage kopiert');
                }
            }, 'image/png');
        } catch (error) {
            console.error('Error sharing card:', error);
            showToast('error', 'Fehler', 'Teilen fehlgeschlagen');
        }
    }

    showQRModal() {
        // Create modal for QR code display
        const modal = document.createElement('div');
        modal.className = 'qr-modal';
        modal.innerHTML = `
            <div class="qr-modal-content">
                <div class="qr-modal-header">
                    <h3>QR-Code für Ihr Profil</h3>
                    <button class="qr-modal-close" onclick="this.closest('.qr-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="qr-modal-body">
                    <div id="modalQRCode"></div>
                    <p>Scannen Sie diesen Code, um direkt zu Ihrem öffentlichen Profil zu gelangen</p>
                    <div class="qr-actions">
                        <button onclick="employeeCardSystem.downloadQR()" class="btn-secondary">
                            <i class="fas fa-download"></i> QR-Code herunterladen
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Generate QR in modal
        const modalQRContainer = document.getElementById('modalQRCode');
        const employeeUrl = `https://buderus-systeme.de/mitarbeiter/${this.employeeData.firstName.toLowerCase()}-${this.employeeData.lastName.toLowerCase()}.html`;
        
        if (typeof QRCode !== 'undefined') {
            new QRCode(modalQRContainer, {
                text: employeeUrl,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
        } else {
            modalQRContainer.innerHTML = `<div style="padding: 50px; text-align: center;">QR-Code für: ${employeeUrl}</div>`;
        }

        // Add modal styles if not exists
        if (!document.getElementById('qrModalStyles')) {
            const style = document.createElement('style');
            style.id = 'qrModalStyles';
            style.textContent = `
                .qr-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }
                .qr-modal-content {
                    background: white;
                    border-radius: 12px;
                    padding: 30px;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                }
                .qr-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .qr-modal-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #666;
                }
                .qr-actions {
                    margin-top: 20px;
                }
                .btn-secondary {
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 10px 20px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    async generateCardPDF() {
        // This would generate a PDF version for printing
        // For now, return a placeholder URL
        return `https://placeholder-pdf-url.com/card-${this.currentUser.uid}.pdf`;
    }
}

// Initialize the system
const employeeCardSystem = new EmployeeCardSystem();

// Make it globally available
window.employeeCardSystem = employeeCardSystem;
