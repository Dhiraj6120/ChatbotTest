/**
 * Chatbot Page Object Class
 * 
 * This class extends BasePage and provides specific methods for
 * interacting with chatbot widgets. It includes methods for sending
 * messages, getting responses, and monitoring typing indicators.
 */

const BasePage = require('./base.page.js');

class ChatbotPage extends BasePage {
    constructor() {
        super();
        
        // Chatbot-specific selectors
        this.selectors = {
            // Chat widget container
            chatWidget: '#chat-widget, .chat-container, [data-testid="chat-widget"]',
            
            // Input elements
            messageInput: '#chat-input, .chat-input, input[placeholder*="message"], textarea[placeholder*="message"], [data-testid="chat-input"]',
            
            // Send button
            sendButton: '#send-button, .send-button, button[type="submit"], [data-testid="send-button"], .chat-send-btn',
            
            // Message containers
            messages: '.chat-message, .message, [data-testid="message"], .msg, .conversation-item',
            messageText: '.message-text, .msg-text, .content, [data-testid="message-text"], .chat-bubble-text',
            
            // Bot and user messages
            botMessages: '.bot-message, .assistant-message, [data-testid="bot-message"], .chat-bubble.bot',
            userMessages: '.user-message, .human-message, [data-testid="user-message"], .chat-bubble.user',
            
            // Typing indicator
            typingIndicator: '.loading, .typing-indicator, [data-testid="loading"], .chat-typing, .typing-dots',
            
            // Chat widget toggle
            chatToggle: '#chat-toggle, .chat-toggle, [data-testid="chat-toggle"], .chat-widget-button',
            
            // Error messages
            errorMessage: '.error-message, .chat-error, [data-testid="error"]',
            
            // Welcome message
            welcomeMessage: '.welcome-message, .chat-welcome, [data-testid="welcome"]'
        };

        // Chatbot-specific timeouts
        this.responseTimeout = 30000; // 30 seconds for bot response
        this.typingTimeout = 10000;   // 10 seconds for typing indicator
        this.messageTimeout = 15000;  // 15 seconds for message operations
    }

    /**
     * Open the chatbot page
     * @param {string} url - Optional URL to navigate to
     */
    async open(url = '/') {
        console.log('🤖 Opening chatbot page');
        await this.navigateTo(url);
        await this.waitForChatWidget();
        console.log('✅ Chatbot page opened successfully');
    }

    /**
     * Wait for chat widget to be visible
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForChatWidget(timeout = this.defaultTimeout) {
        console.log('⏳ Waiting for chat widget to be visible');
        await this.waitForElement(this.selectors.chatWidget, timeout);
        console.log('✅ Chat widget is visible');
    }

    /**
     * Send a message to the chatbot
     * @param {string} message - Message to send
     * @param {number} timeout - Timeout in milliseconds
     */
    async sendMessage(message, timeout = this.messageTimeout) {
        console.log(`💬 Sending message: "${message}"`);
        
        // Wait for input field to be ready
        await this.waitForElement(this.selectors.messageInput, timeout);
        
        // Type the message
        await this.safeType(this.selectors.messageInput, message, timeout);
        
        // Click send button
        await this.safeClick(this.selectors.sendButton, timeout);
        
        console.log(`✅ Message sent: "${message}"`);
    }

    /**
     * Get the last response from the chatbot
     * @param {number} timeout - Timeout in milliseconds
     * @returns {string} Last bot response text
     */
    async getLastResponse(timeout = this.responseTimeout) {
        console.log('📝 Getting last bot response');
        
        // Wait for bot response
        await this.waitForResponse(timeout);
        
        // Get all bot messages
        const botMessages = await this.getAllElements(this.selectors.botMessages, timeout);
        
        if (botMessages.length === 0) {
            console.log('⚠️ No bot messages found');
            return null;
        }
        
        // Get the last bot message
        const lastBotMessage = botMessages[botMessages.length - 1];
        const messageTextElement = await lastBotMessage.$(this.selectors.messageText);
        
        if (await messageTextElement.isExisting()) {
            const responseText = await messageTextElement.getText();
            console.log(`✅ Last bot response: "${responseText}"`);
            return responseText;
        } else {
            const responseText = await lastBotMessage.getText();
            console.log(`✅ Last bot response: "${responseText}"`);
            return responseText;
        }
    }

    /**
     * Click a button in the chat interface
     * @param {string} buttonText - Text of the button to click
     * @param {number} timeout - Timeout in milliseconds
     */
    async clickButton(buttonText, timeout = this.defaultTimeout) {
        console.log(`🖱️ Clicking button: "${buttonText}"`);
        
        // Try different button selectors
        const buttonSelectors = [
            `button:contains("${buttonText}")`,
            `[data-testid*="button"]:contains("${buttonText}")`,
            `.chat-button:contains("${buttonText}")`,
            `button[title*="${buttonText}"]`,
            `[aria-label*="${buttonText}"]`
        ];
        
        for (const selector of buttonSelectors) {
            try {
                await this.safeClick(selector, timeout);
                console.log(`✅ Button clicked: "${buttonText}"`);
                return;
            } catch (error) {
                console.log(`⚠️ Button not found with selector: ${selector}`);
                continue;
            }
        }
        
        // If no button found with text, try to find by partial text match
        const allButtons = await this.getAllElements('button, [role="button"]', timeout);
        
        for (const button of allButtons) {
            try {
                const buttonTextContent = await button.getText();
                if (buttonTextContent.toLowerCase().includes(buttonText.toLowerCase())) {
                    await button.click();
                    console.log(`✅ Button clicked by text match: "${buttonText}"`);
                    return;
                }
            } catch (error) {
                continue;
            }
        }
        
        throw new Error(`Button with text "${buttonText}" not found`);
    }

    /**
     * Wait for bot response after sending a message
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForResponse(timeout = this.responseTimeout) {
        console.log('⏳ Waiting for bot response');
        
        // First, wait for typing indicator to appear (if it exists)
        const typingVisible = await this.isTypingIndicatorVisible(this.typingTimeout);
        
        if (typingVisible) {
            console.log('⌨️ Typing indicator visible, waiting for it to disappear');
            await this.waitForElementDisappear(this.selectors.typingIndicator, timeout);
        }
        
        // Wait for a new bot message to appear
        const initialMessageCount = await this.getElementCount(this.selectors.botMessages, this.shortTimeout);
        
        await this.waitForCondition(
            async () => {
                const currentMessageCount = await this.getElementCount(this.selectors.botMessages, this.shortTimeout);
                return currentMessageCount > initialMessageCount;
            },
            timeout,
            'Bot response did not appear within the specified timeout'
        );
        
        console.log('✅ Bot response received');
    }

    /**
     * Check if typing indicator is visible
     * @param {number} timeout - Timeout in milliseconds
     * @returns {boolean} True if typing indicator is visible
     */
    async isTypingIndicatorVisible(timeout = this.typingTimeout) {
        console.log('🔍 Checking if typing indicator is visible');
        
        try {
            const isVisible = await this.isElementDisplayed(this.selectors.typingIndicator, timeout);
            console.log(`✅ Typing indicator visibility: ${isVisible}`);
            return isVisible;
        } catch (error) {
            console.log('❌ Typing indicator not found or not visible');
            return false;
        }
    }

    /**
     * Wait for typing indicator to appear
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForTypingIndicator(timeout = this.typingTimeout) {
        console.log('⏳ Waiting for typing indicator to appear');
        await this.waitForElement(this.selectors.typingIndicator, timeout);
        console.log('✅ Typing indicator appeared');
    }

    /**
     * Wait for typing indicator to disappear
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForTypingIndicatorDisappear(timeout = this.responseTimeout) {
        console.log('⏳ Waiting for typing indicator to disappear');
        await this.waitForElementDisappear(this.selectors.typingIndicator, timeout);
        console.log('✅ Typing indicator disappeared');
    }

    /**
     * Get all messages in the conversation
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Array} Array of message objects with text and sender info
     */
    async getAllMessages(timeout = this.defaultTimeout) {
        console.log('📋 Getting all messages from conversation');
        
        const messages = await this.getAllElements(this.selectors.messages, timeout);
        const messageData = [];
        
        for (const message of messages) {
            try {
                const text = await message.getText();
                const isBot = await message.$(this.selectors.botMessages).isExisting();
                const isUser = await message.$(this.selectors.userMessages).isExisting();
                
                messageData.push({
                    text: text,
                    sender: isBot ? 'bot' : isUser ? 'user' : 'unknown',
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.log('⚠️ Could not extract message data');
            }
        }
        
        console.log(`✅ Retrieved ${messageData.length} messages`);
        return messageData;
    }

    /**
     * Get conversation history as text
     * @param {number} timeout - Timeout in milliseconds
     * @returns {string} Formatted conversation history
     */
    async getConversationHistory(timeout = this.defaultTimeout) {
        console.log('📜 Getting conversation history');
        
        const messages = await this.getAllMessages(timeout);
        let history = '';
        
        for (const message of messages) {
            const prefix = message.sender === 'bot' ? 'Bot: ' : 'User: ';
            history += `${prefix}${message.text}\n`;
        }
        
        console.log('✅ Conversation history retrieved');
        return history.trim();
    }

    /**
     * Clear the conversation
     * @param {number} timeout - Timeout in milliseconds
     */
    async clearConversation(timeout = this.defaultTimeout) {
        console.log('🧹 Clearing conversation');
        
        try {
            // Try to find and click a clear/reset button
            const clearSelectors = [
                '[data-testid="clear-chat"]',
                '.clear-chat',
                '.reset-chat',
                'button:contains("Clear")',
                'button:contains("Reset")'
            ];
            
            for (const selector of clearSelectors) {
                try {
                    await this.safeClick(selector, timeout);
                    console.log('✅ Conversation cleared via button');
                    return;
                } catch (error) {
                    continue;
                }
            }
            
            // If no clear button found, refresh the page
            console.log('🔄 No clear button found, refreshing page');
            await this.refreshPage();
            await this.waitForChatWidget();
            
        } catch (error) {
            console.log('⚠️ Could not clear conversation, refreshing page');
            await this.refreshPage();
            await this.waitForChatWidget();
        }
        
        console.log('✅ Conversation cleared');
    }

    /**
     * Check if chat widget is open/visible
     * @param {number} timeout - Timeout in milliseconds
     * @returns {boolean} True if chat widget is visible
     */
    async isChatWidgetOpen(timeout = this.shortTimeout) {
        console.log('🔍 Checking if chat widget is open');
        
        try {
            const isVisible = await this.isElementDisplayed(this.selectors.chatWidget, timeout);
            console.log(`✅ Chat widget open status: ${isVisible}`);
            return isVisible;
        } catch (error) {
            console.log('❌ Chat widget not found or not visible');
            return false;
        }
    }

    /**
     * Open chat widget if it's closed
     * @param {number} timeout - Timeout in milliseconds
     */
    async openChatWidget(timeout = this.defaultTimeout) {
        console.log('🔓 Opening chat widget');
        
        const isOpen = await this.isChatWidgetOpen(this.shortTimeout);
        
        if (!isOpen) {
            try {
                await this.safeClick(this.selectors.chatToggle, timeout);
                await this.waitForChatWidget();
                console.log('✅ Chat widget opened');
            } catch (error) {
                console.log('⚠️ Could not open chat widget');
                throw error;
            }
        } else {
            console.log('✅ Chat widget is already open');
        }
    }

    /**
     * Close chat widget if it's open
     * @param {number} timeout - Timeout in milliseconds
     */
    async closeChatWidget(timeout = this.defaultTimeout) {
        console.log('🔒 Closing chat widget');
        
        const isOpen = await this.isChatWidgetOpen(this.shortTimeout);
        
        if (isOpen) {
            try {
                await this.safeClick(this.selectors.chatToggle, timeout);
                await this.waitForElementDisappear(this.selectors.chatWidget, timeout);
                console.log('✅ Chat widget closed');
            } catch (error) {
                console.log('⚠️ Could not close chat widget');
                throw error;
            }
        } else {
            console.log('✅ Chat widget is already closed');
        }
    }

    /**
     * Wait for welcome message
     * @param {number} timeout - Timeout in milliseconds
     * @returns {string} Welcome message text
     */
    async waitForWelcomeMessage(timeout = this.defaultTimeout) {
        console.log('⏳ Waiting for welcome message');
        
        try {
            const welcomeText = await this.getElementText(this.selectors.welcomeMessage, timeout);
            console.log(`✅ Welcome message: "${welcomeText}"`);
            return welcomeText;
        } catch (error) {
            console.log('⚠️ Welcome message not found');
            return null;
        }
    }

    /**
     * Check for error messages
     * @param {number} timeout - Timeout in milliseconds
     * @returns {string|null} Error message text or null if no error
     */
    async checkForErrors(timeout = this.shortTimeout) {
        console.log('🔍 Checking for error messages');
        
        try {
            const errorText = await this.getElementText(this.selectors.errorMessage, timeout);
            console.log(`❌ Error message found: "${errorText}"`);
            return errorText;
        } catch (error) {
            console.log('✅ No error messages found');
            return null;
        }
    }

    /**
     * Send message and wait for response
     * @param {string} message - Message to send
     * @param {number} timeout - Timeout in milliseconds
     * @returns {string} Bot response
     */
    async sendMessageAndWaitForResponse(message, timeout = this.responseTimeout) {
        console.log(`💬 Sending message and waiting for response: "${message}"`);
        
        await this.sendMessage(message, timeout);
        await this.waitForResponse(timeout);
        const response = await this.getLastResponse(timeout);
        
        console.log(`✅ Message sent and response received: "${response}"`);
        return response;
    }

    /**
     * Verify bot response contains expected text
     * @param {string} expectedText - Expected text in response
     * @param {number} timeout - Timeout in milliseconds
     * @returns {boolean} True if response contains expected text
     */
    async verifyResponseContains(expectedText, timeout = this.responseTimeout) {
        console.log(`🔍 Verifying response contains: "${expectedText}"`);
        
        const response = await this.getLastResponse(timeout);
        
        if (!response) {
            console.log('❌ No response received');
            return false;
        }
        
        const containsText = response.toLowerCase().includes(expectedText.toLowerCase());
        console.log(`✅ Response verification: ${containsText}`);
        return containsText;
    }

    /**
     * Get message count by sender
     * @param {string} sender - 'bot' or 'user'
     * @param {number} timeout - Timeout in milliseconds
     * @returns {number} Number of messages from the sender
     */
    async getMessageCount(sender, timeout = this.defaultTimeout) {
        console.log(`📊 Getting message count for ${sender}`);
        
        const selector = sender === 'bot' ? this.selectors.botMessages : this.selectors.userMessages;
        const count = await this.getElementCount(selector, timeout);
        
        console.log(`✅ ${sender} message count: ${count}`);
        return count;
    }
}

module.exports = ChatbotPage; 