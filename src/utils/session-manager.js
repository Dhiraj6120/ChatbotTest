/**
 * Session Manager Utility
 * Handles browser session validation and error recovery
 */

class SessionManager {
    /**
     * Check if the browser session is still valid
     * @returns {Promise<boolean>} True if session is valid, false otherwise
     */
    static async isSessionValid() {
        try {
            await browser.getTitle();
            return true;
        } catch (error) {
            if (this.isSessionError(error)) {
                console.log('Browser session is invalid or disconnected');
                return false;
            }
            throw error;
        }
    }

    /**
     * Check if an error is related to invalid session
     * @param {Error} error - The error to check
     * @returns {boolean} True if it's a session error
     */
    static isSessionError(error) {
        const sessionErrorMessages = [
            'invalid session id',
            'no such session',
            'chrome not reachable',
            'session not created',
            'session does not exist'
        ];
        
        return sessionErrorMessages.some(msg => 
            error.message.toLowerCase().includes(msg.toLowerCase())
        );
    }

    /**
     * Safely execute a browser command with session validation
     * @param {Function} command - The browser command to execute
     * @param {string} commandName - Name of the command for logging
     * @returns {Promise<any>} Result of the command
     */
    static async safeExecute(command, commandName = 'browser command') {
        try {
            if (!(await this.isSessionValid())) {
                throw new Error(`Cannot execute ${commandName}: Browser session is invalid`);
            }
            return await command();
        } catch (error) {
            if (this.isSessionError(error)) {
                console.log(`Session error during ${commandName}: ${error.message}`);
                throw new Error(`Browser session lost during ${commandName}`);
            }
            throw error;
        }
    }

    /**
     * Wait for session to be valid with timeout
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise<boolean>} True if session becomes valid, false if timeout
     */
    static async waitForValidSession(timeout = 10000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            if (await this.isSessionValid()) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        return false;
    }

    /**
     * Force quit browser session if it's stuck
     */
    static async forceQuit() {
        try {
            await browser.deleteSession();
        } catch (error) {
            console.log('Could not delete session gracefully');
        }
    }
}

module.exports = SessionManager; 