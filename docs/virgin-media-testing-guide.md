# Virgin Media Chatbot Testing Guide

This guide provides comprehensive documentation for testing Virgin Media chatbot scenarios using Botium with WebdriverIO connector.

## Overview

The Virgin Media testing framework includes:
- **5 comprehensive conversation scenarios** covering common customer interactions
- **Botium conversation format** with proper assertions
- **WebdriverIO integration** for web-based chatbot testing
- **Detailed test reporting** with screenshots and logs
- **Error handling** and edge case testing

## Test Scenarios

### 1. Bill Status Check
**File**: `test-data/virgin-media-conversations.json` - "Virgin Media - Bill Status Check"

**Scenario**: Customer checking their bill status and payment options
- Customer requests bill status check
- Bot asks for account number
- Customer provides account number
- Bot displays bill details (£45.50, due date)
- Customer asks about online payment
- Bot provides payment instructions
- Customer thanks and ends conversation

**Key Assertions**:
- Bot asks for account information
- Bot provides bill details with amount and due date
- Bot offers online payment options
- Bot provides helpful closing message

### 2. Internet Issues Report
**File**: `test-data/virgin-media-conversations.json` - "Virgin Media - Internet Issues Report"

**Scenario**: Customer reporting internet connection problems
- Customer reports internet issues
- Bot asks for specific problem details
- Customer describes slow speeds and disconnections
- Bot requests troubleshooting information
- Customer provides WiFi details and device information
- Bot suggests router restart
- Customer reports restart didn't help
- Bot checks for service issues in area
- Bot escalates to technical support
- Bot creates support ticket with reference number

**Key Assertions**:
- Bot asks for specific problem details
- Bot provides troubleshooting steps
- Bot checks for service issues
- Bot creates support ticket with reference
- Bot provides callback timeframe

### 3. Package Inquiry
**File**: `test-data/virgin-media-conversations.json` - "Virgin Media - Package Inquiry"

**Scenario**: New customer inquiring about broadband packages
- Customer expresses interest in packages
- Bot asks for usage requirements
- Customer provides current speed and household details
- Bot recommends M250 package
- Customer asks about faster options
- Bot lists M350, M500, and Gig1 packages
- Customer selects M350 package
- Customer asks about TV add-ons
- Bot offers TV package options
- Customer selects basic TV package
- Bot collects customer details and completes order

**Key Assertions**:
- Bot asks for usage requirements
- Bot recommends appropriate package
- Bot offers upgrade options
- Bot handles TV add-ons
- Bot completes order process
- Bot provides order confirmation

### 4. Bill Payment Issues
**File**: `test-data/virgin-media-conversations.json` - "Virgin Media - Bill Payment Issues"

**Scenario**: Customer having trouble with online bill payment
- Customer reports payment problems
- Bot asks for specific error details
- Customer describes payment failure
- Bot requests payment method and history
- Customer provides payment details
- Bot suggests troubleshooting steps
- Customer reports steps didn't work
- Bot offers alternative payment methods
- Customer requests direct debit setup
- Bot collects bank details and sets up direct debit

**Key Assertions**:
- Bot asks for specific error details
- Bot provides troubleshooting steps
- Bot offers alternative payment methods
- Bot successfully sets up direct debit
- Bot handles current bill payment

### 5. Service Upgrade
**File**: `test-data/virgin-media-conversations.json` - "Virgin Media - Service Upgrade"

**Scenario**: Existing customer upgrading broadband speed
- Customer requests speed upgrade
- Bot asks for account number
- Customer provides account number
- Bot shows current package and upgrade options
- Customer selects M350 upgrade
- Bot provides upgrade details and cost
- Customer asks about downtime
- Bot explains minimal disruption
- Customer confirms upgrade
- Bot processes upgrade and provides confirmation

**Key Assertions**:
- Bot shows current package details
- Bot provides upgrade options
- Bot explains upgrade process
- Bot addresses downtime concerns
- Bot confirms upgrade completion

## Configuration Files

### Botium Configuration
**File**: `src/config/virgin-media-botium.json`

```json
{
  "PROJECTNAME": "Virgin Media Chatbot Testing",
  "CONTAINERMODE": "webdriverio",
  "WEBDRIVERIO_URL": "https://your-virgin-media-chatbot-url.com",
  "WEBDRIVERIO_WAITFORBOTTIMEOUT": 15000,
  "WEBDRIVERIO_WAITFORBOTRESPONSETIMEOUT": 30000
}
```

**Key Settings**:
- **Browser**: Chrome with optimized settings
- **Timeouts**: 15-30 seconds for bot responses
- **Screenshots**: Automatic on failure
- **Logging**: Detailed console and file logging

### WebdriverIO Configuration
**File**: `src/config/wdio.conf.js`

Integrates with existing WebdriverIO setup for:
- Browser automation
- Screenshot capture
- Test reporting
- Parallel execution

## Running Tests

### 1. Using Custom Test Runner
```bash
npm run test:virgin-media
```

**Features**:
- Comprehensive test execution
- Detailed reporting
- Screenshot capture on failure
- JSON test results
- Progress tracking

### 2. Using Botium CLI
```bash
npm run test:virgin-media:botium
```

**Features**:
- Direct Botium execution
- Conversation validation
- Standard Botium reporting

### 3. Using WebdriverIO
```bash
npm run test:virgin-media:webdriverio
```

**Features**:
- WebdriverIO test execution
- Allure reporting
- Screenshot integration
- Parallel execution support

## Test Structure

### Conversation Format
```json
{
  "name": "Test Scenario Name",
  "convo": [
    {
      "sender": "me",
      "messageText": "User message"
    },
    {
      "sender": "bot",
      "messageText": "Expected bot response"
    }
  ]
}
```

### Assertion Types
1. **Exact Match**: Bot response must match exactly
2. **Regex Match**: Bot response must match pattern
3. **Contains**: Bot response must contain text
4. **Intent**: Bot must understand user intent
5. **Script**: Custom JavaScript assertions

### Response Validation
- **Text Matching**: Exact and partial text matching
- **Regex Patterns**: Flexible pattern matching
- **Context Awareness**: Maintains conversation context
- **Error Handling**: Graceful handling of unexpected responses

## Test Results and Reporting

### Screenshots
- **Location**: `./screenshots/virgin-media/`
- **Naming**: `failure_[test_index]_[timestamp].png`
- **Trigger**: Automatic on test failure

### Logs
- **Location**: `./logs/virgin-media-botium.log`
- **Level**: Info with detailed conversation tracking
- **Format**: Structured JSON logging

### Test Reports
- **Location**: `./test-results/virgin-media/`
- **Format**: JSON with detailed test results
- **Content**: Summary, individual results, timestamps

### Report Structure
```json
{
  "summary": {
    "totalTests": 5,
    "passedTests": 4,
    "failedTests": 1,
    "successRate": "80.00%",
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "results": [
    {
      "name": "Bill Status Check",
      "success": true,
      "error": null,
      "duration": 15000,
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## Error Handling

### Common Issues
1. **Element Not Found**: Chat widget selectors may need updating
2. **Timeout Errors**: Increase timeout values for slow responses
3. **Response Mismatch**: Update expected responses for bot changes
4. **Network Issues**: Check internet connectivity and chatbot availability

### Debugging
1. **Enable Debug Logging**: Set log level to "debug"
2. **Check Screenshots**: Review failure screenshots
3. **Validate Selectors**: Use browser dev tools to verify selectors
4. **Test Manually**: Verify chatbot behavior manually

### Troubleshooting Steps
1. **Check Configuration**: Verify URL and selectors
2. **Update Selectors**: Match actual chatbot interface
3. **Adjust Timeouts**: Increase for slow responses
4. **Review Logs**: Check detailed error messages
5. **Test Connectivity**: Ensure chatbot is accessible

## Customization

### Adding New Scenarios
1. **Create Conversation**: Add to `virgin-media-conversations.json`
2. **Define Assertions**: Specify expected bot responses
3. **Update Tests**: Add test cases to `virgin-media-botium.test.js`
4. **Run Validation**: Test new scenarios

### Modifying Existing Scenarios
1. **Update Messages**: Modify conversation flow
2. **Adjust Assertions**: Update expected responses
3. **Test Changes**: Run affected scenarios
4. **Update Documentation**: Reflect changes

### Configuration Updates
1. **URL Changes**: Update `WEBDRIVERIO_URL`
2. **Selector Updates**: Modify element selectors
3. **Timeout Adjustments**: Change response timeouts
4. **Browser Settings**: Modify Chrome options

## Best Practices

### Test Design
1. **Realistic Scenarios**: Use actual customer interactions
2. **Progressive Complexity**: Start simple, add complexity
3. **Error Scenarios**: Include edge cases and errors
4. **Data Validation**: Test with various input data

### Maintenance
1. **Regular Updates**: Keep conversations current
2. **Response Validation**: Verify bot responses regularly
3. **Selector Maintenance**: Update selectors as UI changes
4. **Performance Monitoring**: Track response times

### Documentation
1. **Scenario Descriptions**: Document test purpose
2. **Expected Outcomes**: Define success criteria
3. **Troubleshooting**: Document common issues
4. **Configuration**: Maintain setup instructions

## Integration

### CI/CD Pipeline
```yaml
# Example GitHub Actions workflow
- name: Run Virgin Media Tests
  run: npm run test:virgin-media
  env:
    CHATBOT_URL: ${{ secrets.CHATBOT_URL }}
```

### Reporting Integration
- **Allure Reports**: WebdriverIO integration
- **JUnit Reports**: Standard test reporting
- **Custom Reports**: JSON format for analysis
- **Screenshot Archival**: Failure evidence

### Monitoring
- **Response Times**: Track bot performance
- **Success Rates**: Monitor test reliability
- **Error Patterns**: Identify common issues
- **Coverage Metrics**: Track scenario coverage

## Support

### Resources
- **Botium Documentation**: https://botium.atlassian.net/
- **WebdriverIO Documentation**: https://webdriver.io/
- **Virgin Media API**: Check for official documentation

### Contact
- **Issues**: Create GitHub issues for problems
- **Enhancements**: Submit feature requests
- **Questions**: Use project discussions

This comprehensive testing framework ensures reliable validation of Virgin Media chatbot functionality across all major customer interaction scenarios. 