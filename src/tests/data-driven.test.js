const ChatPage = require('../pages/ChatPage');
const fs = require('fs');
const path = require('path');

// Read test data from CSV
function readTestData() {
    const csvPath = path.join(__dirname, '../../test-data/test-scenarios.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const testCase = {};
        headers.forEach((header, index) => {
            testCase[header.trim()] = values[index] ? values[index].trim() : '';
        });
        return testCase;
    });
}

const testCases = readTestData();

describe('Data-Driven Chatbot Tests', () => {
    beforeEach(async () => {
        await ChatPage.open();
    });

    afterEach(async () => {
        await ChatPage.clearChat();
    });

    testCases.forEach(testCase => {
        it(`should handle ${testCase.scenario} scenario`, async () => {
            if (testCase.user_input) {
                await ChatPage.sendMessage(testCase.user_input);
                await ChatPage.waitForBotResponse(parseInt(testCase.timeout) || 5000);
                
                const botResponse = await ChatPage.getLastBotMessage();
                expect(botResponse).toBeTruthy();
                
                if (testCase.expected_response) {
                    expect(botResponse).toContain(testCase.expected_response);
                }
            } else {
                // Handle empty input case
                await ChatPage.sendMessage('');
                await ChatPage.waitForBotResponse(parseInt(testCase.timeout) || 3000);
                
                const botResponse = await ChatPage.getLastBotMessage();
                expect(botResponse).toBeDefined();
            }
        });
    });
}); 