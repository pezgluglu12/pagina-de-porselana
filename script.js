// Aplicación de Manualidades Creativas - JavaScript
class ManualidadesApp {
    constructor() {
        this.currentSection = 'home';
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.following = JSON.parse(localStorage.getItem('following')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateFavoritesUI();
        this.updateFollowingUI();
        this.showLoading(false);
    }

    setupEventListeners() {
        // Navegación principal
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('href').substring(1);
                this.navigateToSection(section);
            });
        });

        // Botones de acción rápida
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.handleQuickAction(category);
            });
        });

        // Filtros de categorías
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.filterCategories(tab.dataset.filter);
            });
        });

        // Botones de favoritos
        document.querySelectorAll('.btn-favorite, .favorite, .pin-save').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(btn);
            });
        });

        // Botones de seguir
        document.querySelectorAll('.btn-follow').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFollow(btn);
            });
        });

        // Botones de reproducción de video
        document.querySelectorAll('.play-button, .play-button-large').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playVideo(btn);
            });
        });

        // Búsqueda
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Botones de control de video
        document.querySelectorAll('.btn-control').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleVideoControl(btn);
            });
        });

        // Eliminar de favoritos
        document.querySelectorAll('.btn-remove-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFromFavorites(btn);
            });
        });

        // Categorías populares
        document.querySelectorAll('.category-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.filterByTag(tag.textContent.trim());
            });
        });

        // Tarjetas de tutorial
        document.querySelectorAll('.tutorial-card').forEach(card => {
            card.addEventListener('click', () => {
                this.openTutorial(card);
            });
        });

        // Tarjetas de creador
        document.querySelectorAll('.creator-card, .creator-card-large').forEach(card => {
            card.addEventListener('click', () => {
                this.openCreatorProfile(card);
            });
        });

        // Pins del grid
        document.querySelectorAll('.pin').forEach(pin => {
            pin.addEventListener('click', () => {
                this.openPin(pin);
            });
        });

        // Botones de compartir
        document.querySelectorAll('.pin-share').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.sharePin(btn);
            });
        });

        // Botones de más opciones
        document.querySelectorAll('.pin-more').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showPinOptions(btn);
            });
        });

        // Tarjetas de tendencias
        document.querySelectorAll('.trending-card').forEach(card => {
            card.addEventListener('click', () => {
                this.openTrending(card);
            });
        });

        // Tarjetas de desafíos
        document.querySelectorAll('.challenge-card').forEach(card => {
            card.addEventListener('click', () => {
                this.openChallenge(card);
            });
        });

        // Botón de cargar más
        const loadMoreBtn = document.querySelector('.btn-load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMorePins();
            });
        }

        // Controles de vista
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleView(btn);
            });
        });

        // Dropdown de perfil
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleProfileDropdown();
            });
        }

        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', () => {
            this.closeProfileDropdown();
        });
    }

    navigateToSection(sectionName) {
        // Ocultar sección actual
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar nueva sección
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Actualizar navegación
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionName}"]`).classList.add('active');

        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    handleQuickAction(category) {
        switch (category) {
            case 'material':
                this.navigateToSection('categories');
                this.filterCategories('material');
                break;
            case 'theme':
                this.navigateToSection('categories');
                this.filterCategories('theme');
                break;
            case 'favorites':
                this.navigateToSection('favorites');
                break;
            case 'creators':
                this.navigateToSection('creators');
                break;
        }
    }

    filterCategories(filter) {
        // Actualizar pestañas activas
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Filtrar categorías
        document.querySelectorAll('.category-card').forEach(card => {
            const cardType = card.dataset.type;
            if (filter === 'all' || cardType === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    }

    toggleFavorite(button) {
        const tutorialCard = button.closest('.tutorial-card');
        const tutorialId = tutorialCard ? tutorialCard.dataset.id || 'tutorial-1' : 'tutorial-1';
        
        if (this.favorites.includes(tutorialId)) {
            this.favorites = this.favorites.filter(id => id !== tutorialId);
            button.innerHTML = '<i class="far fa-heart"></i>';
            button.classList.remove('favorited');
        } else {
            this.favorites.push(tutorialId);
            button.innerHTML = '<i class="fas fa-heart"></i>';
            button.classList.add('favorited');
        }

        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.updateFavoritesUI();
        this.showNotification('Tutorial guardado en favoritos', 'success');
    }

    toggleFollow(button) {
        const creatorName = button.closest('.creator-card, .tutorial-author-detail')?.querySelector('h3')?.textContent || 'Creator';
        
        if (this.following.includes(creatorName)) {
            this.following = this.following.filter(name => name !== creatorName);
            button.textContent = 'Seguir';
            button.classList.remove('following');
        } else {
            this.following.push(creatorName);
            button.textContent = 'Siguiendo';
            button.classList.add('following');
        }

        localStorage.setItem('following', JSON.stringify(this.following));
        this.updateFollowingUI();
        this.showNotification(`Ahora sigues a ${creatorName}`, 'success');
    }

    playVideo(button) {
        // Simular reproducción de video
        this.showLoading(true);
        
        setTimeout(() => {
            this.showLoading(false);
            this.showNotification('Reproduciendo video...', 'info');
            
            // Simular apertura de modal de video
            this.openVideoModal();
        }, 1000);
    }

    openVideoModal() {
        // Crear modal de video
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-content">
                <div class="video-modal-header">
                    <h3>Muñecos de Porcelana Fría</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="video-modal-body">
                    <div class="video-placeholder">
                        <i class="fas fa-play-circle"></i>
                        <p>Video tutorial se reproduciría aquí</p>
                    </div>
                </div>
                <div class="video-modal-footer">
                    <button class="btn-primary">Ver tutorial completo</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Cerrar modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    handleVideoControl(button) {
        const action = button.textContent.trim();
        
        switch (action) {
            case 'Descargar PDF':
                this.showNotification('Descargando PDF...', 'info');
                // Simular descarga
                setTimeout(() => {
                    this.showNotification('PDF descargado exitosamente', 'success');
                }, 2000);
                break;
            case 'Guardar':
                this.toggleFavorite(button);
                break;
            case 'Compartir':
                this.shareTutorial();
                break;
        }
    }

    shareTutorial() {
        if (navigator.share) {
            navigator.share({
                title: 'Manualidades Creativas',
                text: 'Mira este increíble tutorial de manualidades',
                url: window.location.href
            });
        } else {
            // Fallback para navegadores que no soportan Web Share API
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Enlace copiado al portapapeles', 'success');
            });
        }
    }

    handleSearch(query) {
        if (query.length < 2) return;

        this.showLoading(true);
        
        // Simular búsqueda
        setTimeout(() => {
            this.showLoading(false);
            this.showNotification(`Buscando: "${query}"`, 'info');
            
            // Aquí se implementaría la lógica de búsqueda real
            this.filterTutorials(query);
        }, 500);
    }

    filterTutorials(query) {
        const tutorials = document.querySelectorAll('.tutorial-card');
        tutorials.forEach(tutorial => {
            const title = tutorial.querySelector('h3')?.textContent.toLowerCase() || '';
            const author = tutorial.querySelector('.tutorial-author span')?.textContent.toLowerCase() || '';
            
            if (title.includes(query.toLowerCase()) || author.includes(query.toLowerCase())) {
                tutorial.style.display = 'block';
            } else {
                tutorial.style.display = 'none';
            }
        });
    }

    filterByTag(tagName) {
        this.showNotification(`Filtrando por: ${tagName}`, 'info');
        
        // Simular filtrado por etiqueta
        const tutorials = document.querySelectorAll('.tutorial-card');
        tutorials.forEach(tutorial => {
            const title = tutorial.querySelector('h3')?.textContent.toLowerCase() || '';
            if (title.includes(tagName.toLowerCase())) {
                tutorial.style.display = 'block';
                tutorial.style.animation = 'fadeIn 0.5s ease-out';
            } else {
                tutorial.style.display = 'none';
            }
        });
    }

    openTutorial(card) {
        this.navigateToSection('tutorial-detail');
        this.showNotification('Abriendo tutorial...', 'info');
    }

    openCreatorProfile(card) {
        const creatorName = card.querySelector('h3')?.textContent || 'Creator';
        this.showNotification(`Abriendo perfil de ${creatorName}`, 'info');
    }

    removeFromFavorites(button) {
        const tutorialCard = button.closest('.tutorial-card');
        const tutorialId = tutorialCard?.dataset.id || 'tutorial-1';
        
        this.favorites = this.favorites.filter(id => id !== tutorialId);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        
        tutorialCard.remove();
        this.updateFavoritesUI();
        this.showNotification('Tutorial eliminado de favoritos', 'success');
    }

    // Nuevas funciones para pins
    openPin(pin) {
        const pinTitle = pin.querySelector('h3')?.textContent || 'Pin';
        this.showNotification(`Abriendo: ${pinTitle}`, 'info');
        // Aquí se implementaría la lógica para abrir el pin en detalle
    }

    sharePin(button) {
        const pin = button.closest('.pin');
        const pinTitle = pin.querySelector('h3')?.textContent || 'Pin';
        
        if (navigator.share) {
            navigator.share({
                title: pinTitle,
                text: 'Mira este increíble tutorial de manualidades',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Enlace copiado al portapapeles', 'success');
            });
        }
    }

    showPinOptions(button) {
        const pin = button.closest('.pin');
        const pinTitle = pin.querySelector('h3')?.textContent || 'Pin';
        
        // Crear menú de opciones
        const options = [
            { text: 'Guardar en tablero', action: () => this.saveToBoard(pin) },
            { text: 'Compartir', action: () => this.sharePin(button) },
            { text: 'Reportar', action: () => this.reportPin(pin) },
            { text: 'Copiar enlace', action: () => this.copyPinLink(pin) }
        ];
        
        this.showContextMenu(button, options);
    }

    saveToBoard(pin) {
        this.showNotification('Pin guardado en tu tablero', 'success');
    }

    reportPin(pin) {
        this.showNotification('Pin reportado', 'info');
    }

    copyPinLink(pin) {
        navigator.clipboard.writeText(window.location.href).then(() => {
            this.showNotification('Enlace copiado', 'success');
        });
    }

    showContextMenu(button, options) {
        // Crear menú contextual
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = options.map(option => 
            `<div class="context-menu-item" data-action="${option.text}">${option.text}</div>`
        ).join('');
        
        document.body.appendChild(menu);
        
        // Posicionar menú
        const rect = button.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.left = `${rect.left}px`;
        menu.style.zIndex = '10000';
        
        // Añadir eventos
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = options.find(opt => opt.text === item.dataset.action);
                if (action) action.action();
                menu.remove();
            });
        });
        
        // Cerrar menú al hacer click fuera
        setTimeout(() => {
            document.addEventListener('click', () => {
                menu.remove();
            }, { once: true });
        }, 100);
    }

    openTrending(card) {
        const trendingTitle = card.querySelector('h3')?.textContent || 'Tendencia';
        this.showNotification(`Explorando: ${trendingTitle}`, 'info');
    }

    openChallenge(card) {
        const challengeTitle = card.querySelector('h3')?.textContent || 'Desafío';
        this.showNotification(`Uniéndote a: ${challengeTitle}`, 'info');
    }

    loadMorePins() {
        this.showLoading(true);
        
        setTimeout(() => {
            this.showLoading(false);
            this.showNotification('Cargando más ideas...', 'info');
            
            // Simular carga de más pins
            this.addMorePins();
        }, 1500);
    }

    addMorePins() {
        const pinsGrid = document.getElementById('pinsGrid');
        if (!pinsGrid) return;
        
        // Crear nuevos pins
        const newPins = [
            {
                title: 'Técnicas de Acuarela',
                author: 'Elena Rodríguez',
                category: 'pintura',
                stats: { views: '1.2k', likes: '89' }
            },
            {
                title: 'Joyería con Alambre',
                author: 'Miguel Santos',
                category: 'jewelry',
                stats: { views: '856', likes: '67' }
            },
            {
                title: 'Decoración con Plantas',
                author: 'Carmen López',
                category: 'naturaleza',
                stats: { views: '2.1k', likes: '156' }
            }
        ];
        
        newPins.forEach(pin => {
            const pinElement = this.createPinElement(pin);
            pinsGrid.appendChild(pinElement);
        });
    }

    createPinElement(pinData) {
        const pin = document.createElement('div');
        pin.className = 'pin pin-medium';
        pin.dataset.category = pinData.category;
        
        pin.innerHTML = `
            <div class="pin-image">
                <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="${pinData.title}">
                <div class="pin-overlay">
                    <button class="pin-save">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="pin-share">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
            <div class="pin-content">
                <h3>${pinData.title}</h3>
                <p class="pin-author">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="${pinData.author}">
                    <span>${pinData.author}</span>
                </p>
                <div class="pin-stats">
                    <span><i class="fas fa-eye"></i> ${pinData.stats.views}</span>
                    <span><i class="fas fa-heart"></i> ${pinData.stats.likes}</span>
                </div>
            </div>
        `;
        
        // Añadir event listeners
        pin.addEventListener('click', () => this.openPin(pin));
        pin.querySelector('.pin-save').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(e.target);
        });
        pin.querySelector('.pin-share').addEventListener('click', (e) => {
            e.stopPropagation();
            this.sharePin(e.target);
        });
        
        return pin;
    }

    toggleView(button) {
        // Actualizar botones activos
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        const view = button.dataset.view;
        const pinsGrid = document.getElementById('pinsGrid');
        
        if (view === 'list') {
            pinsGrid.style.gridTemplateColumns = '1fr';
            pinsGrid.classList.add('list-view');
        } else {
            pinsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
            pinsGrid.classList.remove('list-view');
        }
        
        this.showNotification(`Vista cambiada a: ${view === 'list' ? 'Lista' : 'Grid'}`, 'info');
    }

    toggleProfileDropdown() {
        const dropdown = document.querySelector('.profile-dropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    }

    closeProfileDropdown() {
        const dropdown = document.querySelector('.profile-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    updateFavoritesUI() {
        // Actualizar contador de favoritos en la navegación
        const favoriteCount = this.favorites.length;
        const favoriteNav = document.querySelector('[href="#favorites"]');
        if (favoriteNav) {
            const countBadge = favoriteNav.querySelector('.count-badge') || 
                document.createElement('span');
            countBadge.className = 'count-badge';
            countBadge.textContent = favoriteCount;
            if (!favoriteNav.querySelector('.count-badge')) {
                favoriteNav.appendChild(countBadge);
            }
        }

        // Actualizar botones de favoritos
        document.querySelectorAll('.btn-favorite, .favorite').forEach(btn => {
            const tutorialCard = btn.closest('.tutorial-card');
            const tutorialId = tutorialCard?.dataset.id || 'tutorial-1';
            
            if (this.favorites.includes(tutorialId)) {
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                btn.classList.add('favorited');
            } else {
                btn.innerHTML = '<i class="far fa-heart"></i>';
                btn.classList.remove('favorited');
            }
        });
    }

    updateFollowingUI() {
        // Actualizar botones de seguir
        document.querySelectorAll('.btn-follow').forEach(btn => {
            const creatorName = btn.closest('.creator-card, .tutorial-author-detail')?.querySelector('h3')?.textContent || 'Creator';
            
            if (this.following.includes(creatorName)) {
                btn.textContent = 'Siguiendo';
                btn.classList.add('following');
            } else {
                btn.textContent = 'Seguir';
                btn.classList.remove('following');
            }
        });
    }

    showLoading(show) {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            if (show) {
                loadingOverlay.classList.add('show');
            } else {
                loadingOverlay.classList.remove('show');
            }
        }
    }

    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Remover notificación después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            warning: '#FF9800',
            info: '#2196F3'
        };
        return colors[type] || '#2196F3';
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ManualidadesApp();
});

// Añadir estilos CSS para las notificaciones
const notificationStyles = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .count-badge {
        background: var(--secondary-color);
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        margin-left: 5px;
    }

    .video-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }

    .video-modal-content {
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
    }

    .video-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }

    .close-modal {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }

    .video-modal-body {
        padding: 20px;
    }

    .video-placeholder {
        background: #f5f5f5;
        border-radius: 8px;
        height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #666;
    }

    .video-placeholder i {
        font-size: 48px;
        margin-bottom: 10px;
        color: var(--primary-color);
    }

    .video-modal-footer {
        padding: 20px;
        border-top: 1px solid #eee;
        text-align: center;
    }

    .favorited {
        color: var(--secondary-color) !important;
    }

    .following {
        background: var(--success-color) !important;
        color: white !important;
    }
`;

// Añadir estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
