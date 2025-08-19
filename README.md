# Virgin Media Chatbot Demo

A simple demonstration of Virgin Media chatbot automation using WebdriverIO.

## 🎯 Overview

This is a **demo framework** with a single test case that demonstrates:
- Opening the Virgin Media website
- Clicking the chat button (`#openChatIconVertical`)
- Waiting for the chat to load
- Interacting with the chat input field (`.DraftEditor-root`)
- Taking screenshots and logging

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Chrome browser
- ChromeDriver (automatically managed)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd virgin-media-chatbot-demo

# Install dependencies
npm install

# Run the demo test
npm test
```

## 📋 Available Commands

### Main Demo
```bash
# Run the demo test (opens browser)
npm test

# Run the demo test (headless mode)
npm run test:headless

# Run the demo test with debug output
npm run test:debug
```

### Cleanup and Reporting
```bash
# Clean all old logs and screenshots
npm run clean:all

# Clean before running tests (automatic)
npm run clean:before-test

# Generate Allure report
npm run report:allure

# Serve Allure report
npm run report:allure:serve
```

## 🏗️ Project Structure

```
virgin-media-chatbot-demo/
├── src/
│   ├── config/
│   │   └── wdio.conf.js              # WebdriverIO configuration
│   ├── tests/
│   │   └── virgin-media-manual.test.js # Single demo test case
│   ├── pages/
│   │   ├── base.page.js              # Base page object
│   │   └── chatbot.page.js           # Chatbot page object
│   └── utils/                        # Utility functions
├── screenshots/                      # Test screenshots (auto-cleaned)
├── logs/                            # Test logs (auto-cleaned)
├── allure-results/                  # Allure results (auto-cleaned)
└── test-results/                    # Test results (auto-cleaned)
```

## 🔧 Demo Test Flow

The single demo test case demonstrates:

1. **Website Navigation**: Opens Virgin Media moving home page
2. **Chat Activation**: Clicks the chat button (`#openChatIconVertical`)
3. **Wait Period**: Waits 20 seconds for chat to fully load
4. **Input Interaction**: Types a demo message in the `.DraftEditor-root` element
5. **Screenshot**: Takes a screenshot for demo purposes
6. **Browser Viewing**: Keeps browser open for 10 seconds to view results

## 📊 Reporting

### Allure Reports

The framework generates comprehensive Allure reports including:
- Test execution timeline
- Screenshots
- Browser console logs
- Environment details

### Screenshots

- Automatic screenshots on test completion
- Cleaned automatically before each test run
- Saved as `virgin-media-demo-test.png`

### Logs

- Detailed test execution logs
- Browser console logs
- Cleaned automatically before each test run

## 🧹 Automatic Cleanup

The framework automatically cleans old logs and screenshots before each test run to ensure:
- Only the latest test results are available
- Clean test environment for each run
- Reduced disk space usage
- Clear reporting without old artifacts

## 🐛 Troubleshooting

### Common Issues

1. **Chrome not launching**: Ensure Chrome is installed and up to date
2. **Element not found**: Check if Virgin Media website structure has changed
3. **Test timeout**: Increase timeout values in configuration files

### Debug Mode

Run the demo in debug mode for detailed logging:

```bash
npm run test:debug
```

## 📝 Logs and Screenshots Management

### Automatic Cleanup

- **Before each test run**: All old logs and screenshots are automatically removed
- **Fresh environment**: Each test run starts with a clean slate
- **Latest results only**: Only the most recent test artifacts are preserved

### Manual Cleanup

If you need to manually clean up:

```bash
# Clean all artifacts
npm run clean:all

# Clean specific directories
npm run screenshots:clean
npm run logs:clean
npm run report:clean
```

## 🤝 Contributing

This is a demo framework. For production use, consider:
1. Adding more test scenarios
2. Implementing proper error handling
3. Adding data-driven testing
4. Setting up CI/CD integration

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section
2. Review the logs in the `logs/` directory
3. Check screenshots in the `screenshots/` directory
4. Create an issue with detailed information 