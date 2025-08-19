/**
 * Virgin Media Botium Test Suite
 * 
 * This test suite uses Botium conversations to test Virgin Media chatbot scenarios
 * including bill status checks, internet issues reporting, and package inquiries.
 */

const BotiumConnectorWebdriverio = require('botium-connector-webdriverio');
const { BotDriver, Capabilities } = require('botium-core');

describe('Virgin Media Chatbot Tests', () => {
    let driver;

    beforeAll(async () => {
        console.log('🤖 Initializing Botium driver for Virgin Media tests...');
        
        // Initialize Botium driver with WebdriverIO connector
        driver = new BotDriver(Capabilities.botium({
            CONTAINERMODE: 'webdriverio',
            WEBDRIVERIO_CAPABILITIES: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-web-security'],
                    prefs: {
                        'profile.default_content_setting_values.notifications': 2
                    }
                }
            },
            WEBDRIVERIO_URL: 'https://www.virginmedia.com/help/moving-home',
            WEBDRIVERIO_WAITFORBOTTIMEOUT: 15000,
            WEBDRIVERIO_WAITFORBOTINTERVAL: 500,
            WEBDRIVERIO_WAITFORBOTRESPONSETIMEOUT: 30000,
            
            // Chat widget selectors
            WEBDRIVERIO_SELECTOR_CHATBUTTON: '#chat-button, .chat-toggle, [data-testid="chat-toggle"]',
            WEBDRIVERIO_SELECTOR_CHATFRAME: '#chat-frame, .chat-widget, [data-testid="chat-widget"]',
            WEBDRIVERIO_SELECTOR_INPUT: '#chat-input, .chat-input, input[placeholder*="message"], textarea[placeholder*="message"]',
            WEBDRIVERIO_SELECTOR_SENDBUTTON: '#send-button, .send-button, button[type="submit"], [data-testid="send-button"]',
            WEBDRIVERIO_SELECTOR_MESSAGES: '.chat-message, .message, [data-testid="message"], .msg',
            WEBDRIVERIO_SELECTOR_MESSAGETEXT: '.message-text, .msg-text, .content, [data-testid="message-text"]',
            WEBDRIVERIO_SELECTOR_LOADING: '.loading, .typing-indicator, [data-testid="loading"]',
            
            // Interaction settings
            WEBDRIVERIO_CLEAR_INPUT_BEFORE_SEND: true,
            WEBDRIVERIO_SEND_KEYS_DELAY: 100,
            WEBDRIVERIO_CLICK_DELAY: 200,
            
            // Screenshot and logging
            WEBDRIVERIO_SCREENSHOT_ON_FAILURE: true,
            WEBDRIVERIO_SCREENSHOT_PATH: './screenshots/virgin-media',
            
            // Timeouts
            WEBDRIVERIO_IMPLICIT_WAIT: 5000,
            WEBDRIVERIO_PAGE_LOAD_TIMEOUT: 30000,
            WEBDRIVERIO_SCRIPT_TIMEOUT: 30000
        }));

        await driver.Build();
        await driver.Start();
        console.log('✅ Botium driver initialized successfully');
    });

    afterAll(async () => {
        console.log('🧹 Cleaning up Botium driver...');
        if (driver) {
            await driver.Stop();
            await driver.Clean();
        }
        console.log('✅ Botium driver cleaned up');
    });

    beforeEach(async () => {
        console.log('🔄 Starting new test scenario...');
        // Navigate to the chat page and ensure chat widget is open
        await driver.Build();
        await driver.Start();
    });

    afterEach(async () => {
        console.log('🧹 Cleaning up after test...');
        await driver.Stop();
        await driver.Clean();
    });

    describe('Bill Status Check Scenarios', () => {
        it('should handle bill status inquiry with account number', async () => {
            console.log('🧪 Testing bill status inquiry...');
            
            const convo = {
                name: 'Bill Status Check',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'Hi, I need to check my bill status'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Hello! I'd be happy to help you check your bill status.*account number.*phone number", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'My account number is 12345678'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Thank you for providing your account number.*check your bill status", "i")
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("I can see your account details.*bill.*due.*Would you like me to help", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[4]);
            
            console.log('✅ Bill status inquiry test completed');
        });

        it('should provide online payment options', async () => {
            console.log('🧪 Testing online payment options...');
            
            const convo = {
                name: 'Online Payment Options',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'Can I pay my bill online?'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Absolutely! You can pay your bill online.*virginmedia\\.com.*Pay Bill", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'No, that\'s all I need. Thank you'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("You're welcome!.*further assistance.*Virgin Media services", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            
            console.log('✅ Online payment options test completed');
        });
    });

    describe('Internet Issues Reporting', () => {
        it('should handle internet connection problems', async () => {
            console.log('🧪 Testing internet connection problems...');
            
            const convo = {
                name: 'Internet Connection Issues',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'Hello, I\'m having internet connection problems'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("I'm sorry to hear you're experiencing internet connection issues.*specific problems.*slow speeds.*no connection.*intermittent disconnections", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'My internet is very slow and keeps disconnecting'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("I understand this can be frustrating.*troubleshoot.*WiFi.*ethernet.*How long.*devices affected", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'I\'m on WiFi and it\'s been happening for the past 2 hours. All my devices are affected'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Thank you for that information.*troubleshooting steps.*Restart your Virgin Media router.*unplugging.*30 seconds", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            await driver.UserSays(convo.convo[4]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[5]);
            
            console.log('✅ Internet connection problems test completed');
        });

        it('should escalate to technical support when router restart fails', async () => {
            console.log('🧪 Testing escalation to technical support...');
            
            const convo = {
                name: 'Technical Support Escalation',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'I\'ve already tried restarting the router but it didn\'t help'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("I see the router restart didn't resolve the issue.*known service problems.*postcode.*network issues", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'My postcode is SW1A 1AA'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Thank you for your postcode.*no reported service issues.*escalate.*technical team.*support ticket", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'My number is 07700 900123'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Perfect! I've created a support ticket.*technical team will call.*07700 900123.*2 hours.*ticket reference number.*VM-2024-001234", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            await driver.UserSays(convo.convo[4]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[5]);
            
            console.log('✅ Technical support escalation test completed');
        });
    });

    describe('Package Inquiry and Sales', () => {
        it('should recommend appropriate broadband packages', async () => {
            console.log('🧪 Testing broadband package recommendations...');
            
            const convo = {
                name: 'Broadband Package Recommendations',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'Hi, I\'m interested in your broadband packages'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Hello! Great choice looking at Virgin Media.*broadband needs.*several excellent packages.*current broadband speed.*people use the internet.*mainly use the internet for", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'I currently have 50Mbps, there are 3 people in my household, and we mainly use it for streaming, gaming, and work'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Perfect! Based on your needs.*M250 Fibre Broadband package.*264Mbps.*streaming.*gaming.*multiple users.*£32 per month.*18-month contract.*free installation.*no setup fees", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            
            console.log('✅ Broadband package recommendations test completed');
        });

        it('should offer faster package options', async () => {
            console.log('🧪 Testing faster package options...');
            
            const convo = {
                name: 'Faster Package Options',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'That sounds good. Do you have any faster options?'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Absolutely! We also offer.*M350 Fibre Broadband.*362Mbps.*£38/month.*M500 Fibre Broadband.*516Mbps.*£44/month.*Gig1 Fibre Broadband.*1,130Mbps.*£62/month.*free installation.*no setup fees", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'I think the M350 package would be perfect for us'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Excellent choice! The M350 package.*362Mbps.*4K streaming.*online gaming.*multiple devices.*£38 per month.*18-month contract.*free installation.*no setup fees.*30-day money-back guarantee", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            
            console.log('✅ Faster package options test completed');
        });

        it('should handle TV package add-ons', async () => {
            console.log('🧪 Testing TV package add-ons...');
            
            const convo = {
                name: 'TV Package Add-ons',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'Can I add TV to that package?'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Yes! You can add TV to your M350 broadband package.*M350 \\+ TV 360.*£48/month.*100\\+ channels.*M350 \\+ TV 360 \\+ Movies.*£58/month.*Sky Cinema.*M350 \\+ TV 360 \\+ Sports.*£68/month.*Sky Sports", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'I\'ll go with the basic TV package'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Great choice! So your package will be.*M350 Fibre Broadband \\+ TV 360.*£48/month.*362Mbps broadband.*100\\+ TV channels.*free installation.*no setup fees.*18-month contract", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            
            console.log('✅ TV package add-ons test completed');
        });

        it('should complete package order process', async () => {
            console.log('🧪 Testing package order completion...');
            
            const convo = {
                name: 'Package Order Completion',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'Yes, I\'d like to proceed. My postcode is SW1A 1AA'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Perfect! I can confirm.*M350 Fibre Broadband \\+ TV 360.*available at your address.*£48.*contact details.*full name.*phone number.*email address", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'My name is John Smith, phone 07700 900123, email john.smith@email.com'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Thank you, John!.*order summary.*M350 Fibre Broadband \\+ TV 360.*£48/month.*Installation: Free.*Contract: 18 months.*Expected installation date.*Within 2 weeks.*confirmation email.*john\\.smith@email\\.com", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'No, that\'s everything. Thank you!'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("You're very welcome, John! Welcome to Virgin Media!.*confirmation email.*installation team.*contact you.*24 hours.*schedule your installation.*questions.*installation.*feel free to get in touch.*Enjoy your new Virgin Media services", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            await driver.UserSays(convo.convo[4]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[5]);
            
            console.log('✅ Package order completion test completed');
        });
    });

    describe('Bill Payment Issues', () => {
        it('should handle online payment failures', async () => {
            console.log('🧪 Testing online payment failure handling...');
            
            const convo = {
                name: 'Online Payment Failure',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'I\'m having trouble paying my bill online'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("I'm sorry to hear you're having trouble.*online bill payment.*specific issue.*error message.*payment not going through", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'I keep getting an error message saying \'Payment failed\''
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("I understand this can be frustrating.*troubleshoot.*payment issue.*debit card.*credit card.*direct debit.*exact error message.*successfully paid online before", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'I\'m using a debit card and the message just says \'Payment failed. Please try again.\' I\'ve paid online before without issues'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Thank you for that information.*temporary issue.*solutions.*Clear your browser cache.*cookies.*different browser.*Chrome.*Firefox.*Safari.*card details.*entered correctly.*bank.*restrictions.*card", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            await driver.UserSays(convo.convo[4]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[5]);
            
            console.log('✅ Online payment failure handling test completed');
        });

        it('should offer alternative payment methods', async () => {
            console.log('🧪 Testing alternative payment methods...');
            
            const convo = {
                name: 'Alternative Payment Methods',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'I\'ve tried different browsers and cleared the cache, but it\'s still not working'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("I see the browser changes didn't resolve the issue.*system problem.*known payment system issues.*Paying over the phone.*0345 454 1111.*Setting up a direct debit.*automatic payments.*Virgin Media store.*pay in person", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'Can I set up a direct debit instead?'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Absolutely! Setting up a direct debit.*great solution.*prevent future payment issues.*account number.*bank details.*account number first", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            
            console.log('✅ Alternative payment methods test completed');
        });

        it('should complete direct debit setup', async () => {
            console.log('🧪 Testing direct debit setup...');
            
            const convo = {
                name: 'Direct Debit Setup',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'My account number is 12345678'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Thank you for your account number.*account details.*direct debit.*bank account number.*sort code.*account holder name.*Virgin Media account", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'My bank details are: Account 12345678, Sort code 12-34-56, Name John Smith'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Perfect! I've set up your direct debit.*future bills.*automatically deducted.*bank account.*due date.*first automatic payment.*next bill due date.*confirmation letter.*post.*5-7 days", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            
            console.log('✅ Direct debit setup test completed');
        });
    });

    describe('Service Upgrade Scenarios', () => {
        it('should handle broadband speed upgrade requests', async () => {
            console.log('🧪 Testing broadband speed upgrade...');
            
            const convo = {
                name: 'Broadband Speed Upgrade',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'I want to upgrade my broadband speed'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Great! I'd be happy to help you upgrade.*broadband speed.*recommend the best upgrade option.*account number.*current package.*available at your address", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'My account number is 12345678'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Thank you! I can see you currently have.*M100 Fibre Broadband package.*£28/month.*upgrade options.*M250 Fibre.*£32/month.*264Mbps.*M350 Fibre.*£38/month.*362Mbps.*M500 Fibre.*£44/month.*516Mbps.*Gig1 Fibre.*£62/month.*1,130Mbps", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            
            console.log('✅ Broadband speed upgrade test completed');
        });

        it('should provide upgrade details and confirm upgrade', async () => {
            console.log('🧪 Testing upgrade confirmation...');
            
            const convo = {
                name: 'Upgrade Confirmation',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'I\'d like to upgrade to M350'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Excellent choice! Upgrading to M350.*faster speeds.*New speed: 362Mbps.*108Mbps.*New monthly cost: £38.*increase of £10/month.*Installation: Free.*Contract: 18 months.*upgrade date.*Expected activation.*24-48 hours", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'Will there be any downtime during the upgrade?'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Good question! Most speed upgrades.*remotely.*minimal disruption.*brief disconnection.*5-10 minutes.*activate your new speed.*text message.*upgrade complete.*12am-6am.*minimize disruption", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'That sounds good. Can I proceed with the upgrade?'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Absolutely! I've processed your upgrade.*M350 Fibre Broadband.*Speed: 362Mbps.*Monthly cost: £38.*Contract: 18 months.*Free installation.*confirmation email.*text message.*upgrade details.*speed increase.*active.*24-48 hours", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            await driver.UserSays(convo.convo[4]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[5]);
            
            console.log('✅ Upgrade confirmation test completed');
        });
    });

    describe('Error Handling and Edge Cases', () => {
        it('should handle invalid account numbers gracefully', async () => {
            console.log('🧪 Testing invalid account number handling...');
            
            const convo = {
                name: 'Invalid Account Number',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'Hi, I need to check my bill status'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Hello! I'd be happy to help you check your bill status.*account number.*phone number", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'My account number is INVALID123'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("I'm sorry.*couldn't find an account.*INVALID123.*please check.*account number.*correct.*contact us.*assistance", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            
            console.log('✅ Invalid account number handling test completed');
        });

        it('should handle service unavailability', async () => {
            console.log('🧪 Testing service unavailability...');
            
            const convo = {
                name: 'Service Unavailability',
                convo: [
                    {
                        sender: 'me',
                        messageText: 'Hi, I\'m interested in your broadband packages'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Hello! Great choice looking at Virgin Media.*broadband needs.*current broadband speed.*people use the internet", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'I currently have 50Mbps, there are 3 people in my household, and we mainly use it for streaming, gaming, and work'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("Perfect! Based on your needs.*M250 Fibre Broadband package.*264Mbps.*streaming.*gaming.*multiple users.*£32 per month", "i")
                    },
                    {
                        sender: 'me',
                        messageText: 'Yes, I\'d like to proceed. My postcode is ZZ99 9ZZ'
                    },
                    {
                        sender: 'bot',
                        messageText: new RegExp("I'm sorry.*Virgin Media services.*not available.*postcode.*ZZ99 9ZZ.*check availability.*different postcode.*contact us.*assistance", "i")
                    }
                ]
            };

            await driver.Build();
            await driver.Start();
            await driver.UserSays(convo.convo[0]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[1]);
            await driver.UserSays(convo.convo[2]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[3]);
            await driver.UserSays(convo.convo[4]);
            await driver.WaitBotSays();
            await driver.BotSays(convo.convo[5]);
            
            console.log('✅ Service unavailability test completed');
        });
    });

    describe('Performance and Response Time', () => {
        it('should respond within acceptable time limits', async () => {
            console.log('🧪 Testing response time performance...');
            
            const startTime = Date.now();
            
            await driver.Build();
            await driver.Start();
            await driver.UserSays({
                sender: 'me',
                messageText: 'Hello'
            });
            
            await driver.WaitBotSays();
            const responseTime = Date.now() - startTime;
            
            // Assert response time is within acceptable limits (5 seconds)
            expect(responseTime).toBeLessThan(5000);
            console.log(`✅ Response time: ${responseTime}ms`);
            
            console.log('✅ Response time performance test completed');
        });

        it('should handle multiple rapid messages', async () => {
            console.log('🧪 Testing multiple rapid messages...');
            
            await driver.Build();
            await driver.Start();
            
            // Send multiple messages rapidly
            await driver.UserSays({
                sender: 'me',
                messageText: 'Hi there'
            });
            
            await driver.WaitBotSays();
            
            await driver.UserSays({
                sender: 'me',
                messageText: 'I need help'
            });
            
            await driver.WaitBotSays();
            
            await driver.UserSays({
                sender: 'me',
                messageText: 'With my broadband'
            });
            
            await driver.WaitBotSays();
            
            console.log('✅ Multiple rapid messages test completed');
        });
    });
}); 