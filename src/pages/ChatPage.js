const BasePage = require('./base.page.js');

class ChatPage extends BasePage {
    constructor() {
        super();
        
        this.selectors = {
            chatContainer: '#chat-container',
            messageInput: '#message-input',
            sendButton: '#send-button',
            messages: '.message',
            messageText: '.message-text',
            botMessage: '.bot-message',
            userMessage: '.user-message',
            loadingIndicator: '.loading-indicator'
        };
    }

    async open() {
        await browser.url('/');
        await this.waitForChatContainer();
    }

    async waitForChatContainer() {
        await $(this.selectors.chatContainer).waitForDisplayed({ timeout: 10000 });
    }

    async sendMessage(message) {
        await $(this.selectors.messageInput).setValue(message);
        await $(this.selectors.sendButton).click();
    }

    async waitForBotResponse(timeout = 10000) {
        await $(this.selectors.loadingIndicator).waitForDisplayed({ timeout: 5000 });
        await $(this.selectors.loadingIndicator).waitForDisplayed({ reverse: true, timeout });
    }

    async getLastBotMessage() {
        const botMessages = await $$(this.selectors.botMessage);
        if (botMessages.length > 0) {
            const lastMessage = botMessages[botMessages.length - 1];
            return await lastMessage.$(this.selectors.messageText).getText();
        }
        return null;
    }

    async getAllMessages() {
        const messages = await $$(this.selectors.messages);
        const messageTexts = [];
        
        for (const message of messages) {
            const text = await message.$(this.selectors.messageText).getText();
            const isBot = await message.hasClass('bot-message');
            messageTexts.push({
                text,
                isBot
            });
        }
        
        return messageTexts;
    }

    async clearChat() {
        // Implementation depends on the chatbot interface
        // This is a placeholder for clearing chat history
        await browser.refresh();
        await this.waitForChatContainer();
    }

    async isMessageDisplayed(expectedMessage) {
        const messages = await this.getAllMessages();
        return messages.some(msg => msg.text.includes(expectedMessage));
    }
}

module.exports = new ChatPage(); 