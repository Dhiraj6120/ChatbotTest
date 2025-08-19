# Quick Start Guide

Get up and running with the Chatbot Testing Framework in 5 minutes! 🚀

## Prerequisites

- Node.js 16+ 
- npm 8+
- Chrome browser
- Java (for Allure reports)

## 🚀 Quick Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd chatbot-testing-project
npm run setup
```

This will:
- ✅ Check Node.js and npm versions
- ✅ Install all dependencies
- ✅ Create necessary directories
- ✅ Validate configurations
- ✅ Check test syntax

### 2. Configure Your Chatbot

Update the chatbot URL in configuration files:

**For WebdriverIO tests:**
```bash
# Edit src/config/wdio.conf.js
baseUrl: 'https://your-chatbot-website.com'
```

**For Botium tests:**
```bash
# Edit src/config/botium.json
"WEBDRIVERIO_URL": "https://your-chatbot-website.com"
```

### 3. Run Your First Test

```bash
# Run a demo test
npm run test:demo

# Run Virgin Media tests
npm run test:virgin-media

# Run utilities example
npm run test:utilities
```

### 4. Generate Reports

```bash
# Generate and open Allure report
npm run report:allure
```

## 🧪 Test Commands Cheat Sheet

| Command | Description |
|---------|-------------|
| `npm test` | Run all WebdriverIO tests |
| `npm run test:botium` | Run Botium tests |
| `npm run test:virgin-media` | Run Virgin Media tests |
| `npm run test:parallel` | Run tests in parallel |
| `npm run test:headless` | Run tests in headless mode |
| `npm run test:debug` | Run tests with debug output |
| `npm run report:allure` | Generate Allure report |
| `npm run clean:all` | Clean all test artifacts |

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/config/wdio.conf.js` | WebdriverIO configuration |
| `src/config/botium.json` | Botium configuration |
| `src/pages/chatbot.page.js` | Chatbot page object |
| `src/utils/index.js` | Utility functions |
| `test-data/` | Test data files |
| `docs/` | Documentation |

## 🔧 Customization

### Add Your Own Tests

1. **Create test file:**
```javascript
// src/tests/my-tests.test.js
const ChatbotPage = require('../pages/chatbot.page.js');

describe('My Chatbot Tests', () => {
    it('should handle my scenario', async () => {
        // Your test code here
    });
});
```

2. **Run your tests:**
```bash
npm run test -- --spec src/tests/my-tests.test.js
```

### Add Test Data

1. **JSON data:**
```json
// test-data/my-data.json
{
  "scenarios": [
    {
      "name": "My Test",
      "input": "Hello",
      "expected": "Hi there"
    }
  ]
}
```

2. **Use in tests:**
```javascript
const { testDataManager } = require('../utils');
const data = testDataManager.loadJsonData('my-data.json');
```

## 🐛 Troubleshooting

### Common Issues

**Chrome Driver Issues:**
```bash
npm install chromedriver --save-dev
```

**Allure Report Issues:**
```bash
npm install allure-commandline --save-dev
```

**Configuration Issues:**
```bash
npm run validate:all
```

### Debug Mode

```bash
# Run with verbose logging
npm run test:debug

# Check test syntax
node -c src/tests/*.test.js
```

## 📊 Understanding Reports

### Allure Report Sections

- **Overview**: Test summary and trends
- **Behaviors**: Test scenarios and steps
- **Suites**: Test suite organization
- **Timeline**: Test execution timeline
- **Categories**: Test failure categories

### Report Features

- 📸 **Screenshots**: Automatic on failures
- 📝 **Logs**: Browser console logs
- ⏱️ **Timing**: Response times and performance
- 🔍 **Environment**: Test environment details

## 🚀 Next Steps

1. **Read the full documentation:**
   - [README.md](README.md) - Complete guide
   - [docs/utilities-guide.md](docs/utilities-guide.md) - Utilities documentation
   - [docs/virgin-media-testing-guide.md](docs/virgin-media-testing-guide.md) - Virgin Media guide

2. **Explore examples:**
   - `src/tests/utilities-example.test.js` - Utility usage examples
   - `src/tests/page-objects.test.js` - Page object examples
   - `src/tests/data-driven.test.js` - Data-driven testing examples

3. **Customize for your needs:**
   - Update selectors in page objects
   - Add your own test scenarios
   - Extend utility functions

## 🆘 Need Help?

- 📖 Check the [README.md](README.md) for detailed documentation
- 🐛 Review the troubleshooting section
- 💬 Create an issue in the repository
- 🔍 Use debug mode: `npm run test:debug`

---

**Happy Testing! 🧪✨** 