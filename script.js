// Ghxst Music Producer 2024 - Interactive JavaScript

// Global state
const state = {
    user: null,
    subscription: null,
    currentPlan: 'free'
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupAnimations();
});

// Initialize application
function initializeApp() {
    console.log('🎵 Ghxst Music Producer 2024 Initialized');
    
    // Check for existing user session
    const savedUser = localStorage.getItem('ghxst_user');
    if (savedUser) {
        state.user = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    
    // Initialize audio context (for future audio features)
    try {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('✅ Audio Context initialized');
    } catch (error) {
        console.log('❌ Audio Context not supported');
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const startProducingBtn = document.getElementById('startProducingBtn');
    const downloadDesktopBtn = document.getElementById('downloadDesktopBtn');
    
    // Pricing buttons
    const freeSignupBtn = document.getElementById('freeSignupBtn');
    const proSignupBtn = document.getElementById('proSignupBtn');
    const studioSignupBtn = document.getElementById('studioSignupBtn');
    
    // Download buttons
    const downloadWindowsBtn = document.getElementById('downloadWindowsBtn');
    const downloadMacBtn = document.getElementById('downloadMacBtn');
    const downloadLinuxBtn = document.getElementById('downloadLinuxBtn');
    
    // DAW controls
    const playBtn = document.getElementById('playBtn');
    
    // Event listeners
    if (loginBtn) loginBtn.addEventListener('click', handleLogin);
    if (signupBtn) signupBtn.addEventListener('click', handleSignup);
    if (startProducingBtn) startProducingBtn.addEventListener('click', handleStartProducing);
    if (downloadDesktopBtn) downloadDesktopBtn.addEventListener('click', handleDesktopDownload);
    
    if (freeSignupBtn) freeSignupBtn.addEventListener('click', () => handlePlanSelection('free'));
    if (proSignupBtn) proSignupBtn.addEventListener('click', () => handlePlanSelection('pro'));
    if (studioSignupBtn) studioSignupBtn.addEventListener('click', () => handlePlanSelection('studio'));
    
    if (downloadWindowsBtn) downloadWindowsBtn.addEventListener('click', () => handlePlatformDownload('windows'));
    if (downloadMacBtn) downloadMacBtn.addEventListener('click', () => handlePlatformDownload('mac'));
    if (downloadLinuxBtn) downloadLinuxBtn.addEventListener('click', () => handlePlatformDownload('linux'));
    
    if (playBtn) playBtn.addEventListener('click', handlePlayDemo);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

// Setup animations and visual effects
function setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Authentication handlers
function handleLogin() {
    showLoading('Logging in...');
    
    // Simulate login process
    setTimeout(() => {
        const mockUser = {
            id: 'user_' + Date.now(),
            email: 'user@example.com',
            name: 'Music Producer',
            plan: 'free',
            joinDate: new Date().toISOString()
        };
        
        state.user = mockUser;
        localStorage.setItem('ghxst_user', JSON.stringify(mockUser));
        
        hideLoading();
        updateUIForLoggedInUser();
        showNotification('Welcome back! 🎵', 'success');
    }, 1500);
}

function handleSignup() {
    showModal({
        title: 'Start Your Music Journey',
        content: `
            <div class="signup-form">
                <input type="email" placeholder="Enter your email" id="signupEmail">
                <input type="password" placeholder="Create password" id="signupPassword">
                <button class="btn btn-primary" onclick="processSignup()">Create Account</button>
            </div>
        `
    });
}

function processSignup() {
    const email = document.getElementById('signupEmail')?.value;
    const password = document.getElementById('signupPassword')?.value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    showLoading('Creating your account...');
    
    setTimeout(() => {
        const newUser = {
            id: 'user_' + Date.now(),
            email: email,
            name: email.split('@')[0],
            plan: 'free',
            joinDate: new Date().toISOString()
        };
        
        state.user = newUser;
        localStorage.setItem('ghxst_user', JSON.stringify(newUser));
        
        hideLoading();
        closeModal();
        updateUIForLoggedInUser();
        showNotification('Account created successfully! 🎉', 'success');
    }, 2000);
}

// Plan selection and Square payments
function handlePlanSelection(plan) {
    if (!state.user) {
        showNotification('Please sign up first to choose a plan', 'info');
        handleSignup();
        return;
    }
    
    const planDetails = {
        free: { name: 'Free', price: 0 },
        pro: { name: 'Pro', price: 19 },
        studio: { name: 'Studio', price: 49 }
    };
    
    if (plan === 'free') {
        state.user.plan = 'free';
        localStorage.setItem('ghxst_user', JSON.stringify(state.user));
        showNotification('Switched to Free plan', 'success');
        return;
    }
    
    // For paid plans, show Square payment form
    showSquarePaymentForm(planDetails[plan]);
}

function showSquarePaymentForm(planDetails) {
    showModal({
        title: `Subscribe to ${planDetails.name} Plan`,
        content: `
            <div class="payment-form">
                <div class="plan-summary">
                    <h3>${planDetails.name} Plan</h3>
                    <p class="price">$${planDetails.price}/month</p>
                </div>
                
                <div id="card-container">
                    <!-- Square payment form would be loaded here -->
                    <div class="mock-card-form">
                        <input type="text" placeholder="1234 5678 9012 3456" maxlength="19" id="cardNumber">
                        <div class="card-row">
                            <input type="text" placeholder="MM/YY" maxlength="5" id="expiry">
                            <input type="text" placeholder="CVV" maxlength="4" id="cvv">
                        </div>
                        <input type="text" placeholder="Cardholder Name" id="cardName">
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="processPayment('${planDetails.name.toLowerCase()}', ${planDetails.price})">Start Subscription - $${planDetails.price}/month</button>
                
                <p class="payment-note">Secure payment powered by Square. Cancel anytime.</p>
            </div>
        `
    });
    
    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    // Format expiry input
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', formatExpiry);
    }
}

function processPayment(plan, amount) {
    const cardNumber = document.getElementById('cardNumber')?.value;
    const expiry = document.getElementById('expiry')?.value;
    const cvv = document.getElementById('cvv')?.value;
    const cardName = document.getElementById('cardName')?.value;
    
    if (!cardNumber || !expiry || !cvv || !cardName) {
        showNotification('Please fill in all payment details', 'error');
        return;
    }
    
    showLoading('Processing payment...');
    
    // Simulate Square payment processing
    setTimeout(() => {
        // In real implementation, this would call Square's Payment API
        const paymentSuccess = Math.random() > 0.1; // 90% success rate for demo
        
        if (paymentSuccess) {
            state.user.plan = plan;
            state.user.subscription = {
                plan: plan,
                amount: amount,
                startDate: new Date().toISOString(),
                status: 'active'
            };
            
            localStorage.setItem('ghxst_user', JSON.stringify(state.user));
            
            hideLoading();
            closeModal();
            showNotification(`Successfully subscribed to ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan! 🎉`, 'success');
            updateUIForLoggedInUser();
        } else {
            hideLoading();
            showNotification('Payment failed. Please try again.', 'error');
        }
    }, 3000);
}

// Download handlers
function handleDesktopDownload() {
    showModal({
        title: 'Download Desktop App',
        content: `
            <div class="download-options">
                <p>Choose your operating system:</p>
                <div class="download-buttons">
                    <button class="btn btn-primary" onclick="handlePlatformDownload('windows')">🪟 Windows</button>
                    <button class="btn btn-primary" onclick="handlePlatformDownload('mac')">🍎 macOS</button>
                    <button class="btn btn-primary" onclick="handlePlatformDownload('linux')">🐧 Linux</button>
                </div>
            </div>
        `
    });
}

function handlePlatformDownload(platform) {
    const downloadUrls = {
        windows: '#', // In real app, these would be actual download URLs
        mac: '#',
        linux: '#'
    };
    
    showLoading(`Preparing ${platform} download...`);
    
    setTimeout(() => {
        hideLoading();
        showNotification(`${platform.charAt(0).toUpperCase() + platform.slice(1)} download will begin shortly`, 'success');
        
        // In real implementation, trigger actual download
        console.log(`Would download ${platform} version from:`, downloadUrls[platform]);
        
        if (document.querySelector('.modal')) {
            closeModal();
        }
    }, 2000);
}

// Audio demo functionality
function handlePlayDemo() {
    const playBtn = document.getElementById('playBtn');
    if (!playBtn) return;
    
    if (playBtn.textContent === '▶') {
        playBtn.textContent = '⏸';
        playBtn.style.background = '#ffa502';
        
        // Animate waveforms
        document.querySelectorAll('.waveform').forEach(waveform => {
            waveform.style.animationPlayState = 'running';
        });
        
        showNotification('Demo track playing 🎵', 'info');
        
        // Auto-stop after 10 seconds
        setTimeout(() => {
            if (playBtn.textContent === '⏸') {
                handlePlayDemo();
            }
        }, 10000);
    } else {
        playBtn.textContent = '▶';
        playBtn.style.background = '#00ff88';
        
        // Stop waveform animations
        document.querySelectorAll('.waveform').forEach(waveform => {
            waveform.style.animationPlayState = 'paused';
        });
    }
}

function handleStartProducing() {
    if (!state.user) {
        showNotification('Please sign up first to start producing', 'info');
        handleSignup();
        return;
    }
    
    showModal({
        title: '🎵 Welcome to Ghxst Studio',
        content: `
            <div class="studio-welcome">
                <p>Ready to create your next masterpiece?</p>
                <div class="studio-options">
                    <button class="btn btn-primary" onclick="launchWebStudio()">Launch Web Studio</button>
                    <button class="btn btn-outline" onclick="handleDesktopDownload()">Download Desktop App</button>
                </div>
            </div>
        `
    });
}

function launchWebStudio() {
    showLoading('Loading Ghxst Studio...');
    
    setTimeout(() => {
        hideLoading();
        closeModal();
        showNotification('Web Studio launching soon! 🚀', 'success');
        // In real app, this would redirect to the studio interface
    }, 2000);
}

// UI utility functions
function updateUIForLoggedInUser() {
    if (!state.user) return;
    
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (loginBtn) {
        loginBtn.textContent = state.user.name || 'Profile';
        loginBtn.onclick = showUserProfile;
    }
    
    if (signupBtn) {
        signupBtn.textContent = 'Studio';
        signupBtn.onclick = handleStartProducing;
    }
}

function showUserProfile() {
    if (!state.user) return;
    
    showModal({
        title: 'User Profile',
        content: `
            <div class="user-profile">
                <h3>Welcome back, ${state.user.name}!</h3>
                <p><strong>Email:</strong> ${state.user.email}</p>
                <p><strong>Plan:</strong> ${state.user.plan.charAt(0).toUpperCase() + state.user.plan.slice(1)}</p>
                <p><strong>Member since:</strong> ${new Date(state.user.joinDate).toLocaleDateString()}</p>
                
                <div class="profile-actions">
                    <button class="btn btn-outline" onclick="logout()">Logout</button>
                    <button class="btn btn-primary" onclick="handleStartProducing()">Open Studio</button>
                </div>
            </div>
        `
    });
}

function logout() {
    localStorage.removeItem('ghxst_user');
    state.user = null;
    state.subscription = null;
    
    closeModal();
    
    // Reset UI
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = handleLogin;
    }
    
    if (signupBtn) {
        signupBtn.textContent = 'Start Free Trial';
        signupBtn.onclick = handleSignup;
    }
    
    showNotification('Logged out successfully', 'info');
}

// Modal system
function showModal({ title, content }) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles if not already present
    if (!document.querySelector('#modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            .modal-content {
                background: white;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            .modal-header {
                padding: 24px 24px 16px;
                border-bottom: 1px solid #eee;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .modal-header h2 {
                margin: 0;
                color: #333;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            .modal-body {
                padding: 24px;
            }
            .signup-form input,
            .mock-card-form input {
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #ddd;
                border-radius: 8px;
                margin-bottom: 16px;
                font-size: 16px;
            }
            .card-row {
                display: flex;
                gap: 12px;
            }
            .payment-note {
                text-align: center;
                color: #666;
                font-size: 14px;
                margin-top: 16px;
            }
            .download-options,
            .studio-welcome {
                text-align: center;
            }
            .download-buttons {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-top: 20px;
            }
            .studio-options {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-top: 20px;
            }
            .user-profile {
                text-align: center;
            }
            .profile-actions {
                display: flex;
                gap: 12px;
                margin-top: 20px;
                justify-content: center;
            }
        `;
        document.head.appendChild(styles);
    }
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10001;
                animation: slideIn 0.3s ease;
                max-width: 300px;
            }
            .notification-info { background: #3498db; }
            .notification-success { background: #2ecc71; }
            .notification-error { background: #e74c3c; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Loading overlay
function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.querySelector('p').textContent = message;
        overlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Input formatters
function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, '').substring(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;
}

function formatExpiry(e) {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    e.target.value = value;
}

// Export for global access (for onclick handlers)
window.processSignup = processSignup;
window.processPayment = processPayment;
window.closeModal = closeModal;
window.launchWebStudio = launchWebStudio;
window.logout = logout;
window.handlePlatformDownload = handlePlatformDownload;

console.log('🎵 Ghxst Music Producer 2024 - Ready to rock! 🚀');