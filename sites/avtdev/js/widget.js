/**
 * Chat Widget - Встраиваемый виджет чата
 * API Base URL: {{ base_url }}
 */
(function() {
    'use strict';

    // Prevent multiple initializations
    if (window.chatWidgetInitialized) {
        console.warn('Chat Widget already initialized');
        return;
    }
    window.chatWidgetInitialized = true;

    // Configuration
    const CONFIG = {
        apiUrl: '{{ api_url }}',
        position: '{{ default_config.position }}',
        autoOpen: '{{ default_config.auto_open|tojson }}',
        showWelcomeMessage: '{{ default_config.show_welcome_message|tojson }}',
        welcomeMessage: '{{ default_config.welcome_message|tojson }}',
        debug: '{{ debug|tojson }}''
    };

    // Logging helper
    function log(...args) {
        if (CONFIG.debug) {
            console.log('[ChatWidget]', ...args);
        }
    }

    // CSS Styles
    const CSS = `{{ css_content | safe }}`;

    // HTML Template
    const HTML = `
        <div class="chat-widget-container" id="chatWidgetContainer">
            <button class="chat-toggle" id="chatToggle" title="Открыть чат">💬</button>
            <div class="chat-widget" id="chatWidget">
                <div class="chat-header">
                    <h3 class="chat-title">{{ widget_title }}</h3>
                    <button class="chat-close" id="chatClose" title="Закрыть чат">×</button>
                </div>
                <div class="chat-messages" id="chatMessages"></div>
                <div class="chat-input-container">
                    <textarea class="chat-input" id="chatInput" placeholder="{{ input_placeholder }}" rows="1"></textarea>
                    <button style="display:none" class="chat-send-btn" id="chatSendBtn" title="Отправить"></button>
                </div>
            </div>
        </div>
    `;

    // Utility functions
    const Utils = {
        generateId() {
            return 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },

        throttle(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        formatTime(timestamp) {
            return new Intl.DateTimeFormat('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            }).format(new Date(timestamp));
        }
    };

    // ChatWidget Class
    class ChatWidget {
        constructor(config = {}) {
            this.config = { ...CONFIG, ...config };
            this.chatId = this.initializeChatId();
            this.isOpen = false;
            this.isLoading = false;
            this.messageHistory = [];
            this.eventListeners = {};

            log('Initializing ChatWidget with config:', this.config);
            this.initWidget();
        }

        initializeChatId() {
            let chatId = localStorage.getItem('chat_widget_id');
            if (!chatId) {
                chatId = Utils.generateId();
                localStorage.setItem('chat_widget_id', chatId);
                log('Generated new chat ID:', chatId);
            } else {
                log('Using existing chat ID:', chatId);
            }
            return chatId;
        }

        initWidget() {
            this.injectStyles();
            this.injectHTML();
            this.initElements();
            this.bindEvents();
            this.loadChatHistory();

            if (this.config.autoOpen) {
                setTimeout(() => this.openChat(), 1000);
            }

            this.emit('initialized');
        }

        injectStyles() {
            if (document.getElementById('chat-widget-styles')) return;

            const style = document.createElement('style');
            style.id = 'chat-widget-styles';
            style.textContent = CSS;
            document.head.appendChild(style);
            log('Styles injected');
        }

        injectHTML() {
            if (document.getElementById('chatWidgetContainer')) return;

            const container = document.createElement('div');
            container.innerHTML = HTML;

            const widgetContainer = container.firstElementChild;
            if (this.config.position === 'bottom-left') {
                widgetContainer.classList.add('bottom-left');
            }

            document.body.appendChild(widgetContainer);
            log('HTML injected');
        }

        initElements() {
            this.container = document.getElementById('chatWidgetContainer');
            this.toggle = document.getElementById('chatToggle');
            this.widget = document.getElementById('chatWidget');
            this.closeBtn = document.getElementById('chatClose');
            this.messages = document.getElementById('chatMessages');
            this.input = document.getElementById('chatInput');
            this.sendBtn = document.getElementById('chatSendBtn');

            if (!this.container) {
                throw new Error('Failed to initialize widget elements');
            }
            log('Elements initialized');
        }

        bindEvents() {
            this.toggle.addEventListener('click', () => this.toggleChat());
            this.closeBtn.addEventListener('click', () => this.closeChat());
            this.sendBtn.addEventListener('click', () => this.sendMessage());

            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            this.input.addEventListener('input', Utils.debounce(() => this.autoResizeInput(), 100));

            // ESC key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeChat();
                }
            });

            // Visibility change handler
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && this.isOpen) {
                    this.clearNotification();
                }
            });

            log('Events bound');
        }

        autoResizeInput() {
            this.input.style.height = 'auto';
            this.input.style.height = Math.min(this.input.scrollHeight, 100) + 'px';
        }

        toggleChat() {
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }

        openChat() {
            this.widget.classList.add('open');
            this.toggle.classList.add('hidden');
            this.isOpen = true;
            this.clearNotification();

            setTimeout(() => {
                this.input.focus();
                this.scrollToBottom();
            }, 300);

            this.emit('opened');
            log('Chat opened');
        }

        closeChat() {
            this.widget.classList.remove('open');
            this.toggle.classList.remove('hidden');
            this.isOpen = false;

            this.emit('closed');
            log('Chat closed');
        }

        addMessage(text, isUser = false, options = {}) {
            const { isTyping = false, isError = false, timestamp = Date.now() } = options;

            const messageEl = document.createElement('div');
            messageEl.className = `message ${isUser ? 'user' : 'bot'}${isTyping ? ' typing' : ''}${isError ? ' error' : ''}`;

            if (isTyping) {
                messageEl.innerHTML = `Печатает<span class="typing-dots"></span>`;
            } else {
                messageEl.textContent = text;
                if (this.config.debug) {
                    messageEl.title = `Sent at: ${Utils.formatTime(timestamp)}`;
                }
            }

            this.messages.appendChild(messageEl);
            this.scrollToBottom();

            if (!isTyping && !isError) {
                this.messageHistory.push({ text, isUser, timestamp });
                this.saveChatHistory();
            }

            this.emit('messageAdded', { text, isUser, isTyping, isError });
            return messageEl;
        }

        removeMessage(messageEl) {
            if (messageEl && messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }

        scrollToBottom() {
            this.messages.scrollTop = this.messages.scrollHeight;
        }

        clearNotification() {
            this.toggle.classList.remove('has-notification');
        }

        showNotification() {
            if (!this.isOpen) {
                this.toggle.classList.add('has-notification');
            }
        }

        saveChatHistory() {
            try {
                localStorage.setItem('chat_widget_history', JSON.stringify(this.messageHistory));
                log('Chat history saved');
            } catch (error) {
                console.warn('Failed to save chat history:', error);
            }
        }

        loadChatHistory() {
            try {
                const history = localStorage.getItem('chat_widget_history');
                if (history) {
                    this.messageHistory = JSON.parse(history);
                    this.messageHistory.forEach(msg => {
                        this.addMessageToDOM(msg.text, msg.isUser, msg.timestamp);
                    });
                    log('Chat history loaded:', this.messageHistory.length, 'messages');
                } else if (this.config.showWelcomeMessage) {
                    this.addMessageToDOM(this.config.welcomeMessage, false);
                }
            } catch (error) {
                console.warn('Failed to load chat history:', error);
                if (this.config.showWelcomeMessage) {
                    this.addMessageToDOM(this.config.welcomeMessage, false);
                }
            }
        }

        addMessageToDOM(text, isUser, timestamp) {
            const messageEl = document.createElement('div');
            messageEl.className = `message ${isUser ? 'user' : 'bot'}`;
            messageEl.textContent = text;

            if (timestamp && this.config.debug) {
                messageEl.title = `Sent at: ${Utils.formatTime(timestamp)}`;
            }

            this.messages.appendChild(messageEl);
        }

        async sendMessage() {
            const text = this.input.value.trim();
            if (!text || this.isLoading) return;

            this.input.value = '';
            this.autoResizeInput();
            this.addMessage(text, true);
            this.setLoading(true);

            const typingEl = this.addMessage('', false, { isTyping: true });

            try {
                log('Sending message:', text);
                const response = await fetch(`${this.config.apiUrl}/message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: this.chatId,
                        message: text
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                this.removeMessage(typingEl);

                if (data.reply) {
                    this.addMessage(data.reply, false);
                    this.showNotification();
                    this.emit('messageReceived', { reply: data.reply });
                    log('Message received:', data.reply);
                } else {
                    this.addMessage('{{ error_messages.general }}', false, { isError: true });
                }

            } catch (error) {
                console.error('Error sending message:', error);
                this.removeMessage(typingEl);
                this.addMessage('{{ error_messages.connection }}', false, { isError: true });
                this.emit('error', { error });
            } finally {
                this.setLoading(false);
            }
        }

        setLoading(loading) {
            this.isLoading = loading;
            this.sendBtn.disabled = loading;
            this.input.disabled = loading;

            this.sendBtn.innerHTML = loading ? '⏳' : '🚀';
            this.emit('loadingChanged', { loading });
        }

        // Event system
        on(event, callback) {
            if (!this.eventListeners[event]) {
                this.eventListeners[event] = [];
            }
            this.eventListeners[event].push(callback);
        }

        off(event, callback) {
            if (this.eventListeners[event]) {
                const index = this.eventListeners[event].indexOf(callback);
                if (index > -1) {
                    this.eventListeners[event].splice(index, 1);
                }
            }
        }

        emit(event, data) {
            if (this.eventListeners[event]) {
                this.eventListeners[event].forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error('Error in event listener:', error);
                    }
                });
            }
        }

        // Public API methods
        open() {
            this.openChat();
        }

        close() {
            this.closeChat();
        }

        sendMessageProgrammatically(message) {
            this.input.value = message;
            this.sendMessage();
        }

        clearHistory() {
            this.messageHistory = [];
            this.messages.innerHTML = '';
            localStorage.removeItem('chat_widget_history');

            if (this.config.showWelcomeMessage) {
                this.addMessageToDOM(this.config.welcomeMessage, false);
            }

            this.emit('historyCleared');
            log('History cleared');
        }

        getHistory() {
            return [...this.messageHistory];
        }

        updateConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            this.emit('configUpdated', { config: this.config });
            log('Config updated:', newConfig);
        }

        destroy() {
            // Remove event listeners
            document.removeEventListener('keydown', this.escKeyHandler);
            document.removeEventListener('visibilitychange', this.visibilityHandler);

            // Remove DOM elements
            if (this.container) {
                this.container.remove();
            }

            const styles = document.getElementById('chat-widget-styles');
            if (styles) {
                styles.remove();
            }

            // Reset global state
            window.chatWidgetInitialized = false;
            delete window.chatWidget;

            this.emit('destroyed');
            log('Widget destroyed');
        }
    }

    // Initialize widget when DOM is ready
    function initChatWidget() {
        try {
            // Allow custom configuration via global variable
            const customConfig = window.ChatWidgetConfig || {};
            window.chatWidget = new ChatWidget(customConfig);

            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('chatWidgetLoaded', {
                detail: { widget: window.chatWidget }
            }));

            log('Widget initialization complete');
        } catch (error) {
            console.error('Failed to initialize chat widget:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatWidget);
    } else {
        initChatWidget();
    }

})();
