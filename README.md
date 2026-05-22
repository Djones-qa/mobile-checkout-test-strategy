# Mobile Checkout Test Strategy

[![Detox iOS](https://img.shields.io/github/actions/workflow/status/Djones-qa/mobile-checkout-test-strategy/detox-ios.yml?branch=master&label=Detox%20iOS&logo=apple&logoColor=white)](https://github.com/Djones-qa/mobile-checkout-test-strategy/actions/workflows/detox-ios.yml)
[![Detox Android](https://img.shields.io/github/actions/workflow/status/Djones-qa/mobile-checkout-test-strategy/detox-android.yml?branch=master&label=Detox%20Android&logo=android&logoColor=white)](https://github.com/Djones-qa/mobile-checkout-test-strategy/actions/workflows/detox-android.yml)
[![Appium Cross-Platform](https://img.shields.io/github/actions/workflow/status/Djones-qa/mobile-checkout-test-strategy/appium-cross-platform.yml?branch=master&label=Appium&logo=appium&logoColor=white)](https://github.com/Djones-qa/mobile-checkout-test-strategy/actions/workflows/appium-cross-platform.yml)
[![Percy Visual](https://img.shields.io/badge/Percy-Visual%20Regression-9E66BF?logo=percy&logoColor=white)](https://github.com/Djones-qa/mobile-checkout-test-strategy/actions/workflows/percy-visual.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.73-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

End-to-end, cross-platform, and visual regression test suite for a React Native checkout flow. Covers iOS and Android across Detox, Appium + WebdriverIO, Maestro, and Percy + Storybook.

---

## Stack

| Tool | Purpose |
|---|---|
| **Detox** | React Native E2E — iOS simulator + Android emulator |
| **Appium + WebdriverIO** | Cross-platform device testing with Page Object Model |
| **Maestro** | Lightweight YAML-driven mobile flow tests |
| **Percy + Storybook** | Mobile component visual regression |
| **GitHub Actions** | CI matrix across iOS versions and Android API levels |

---

## Project Structure

```
mobile-checkout-test-strategy/
├── .github/
│   └── workflows/
│       ├── detox-ios.yml              # iOS simulator matrix (17.2, 16.4 × 2 devices)
│       ├── detox-android.yml          # Android emulator matrix (API 34, 31)
│       ├── appium-cross-platform.yml  # Nightly cross-platform Appium run
│       └── percy-visual.yml           # Percy visual regression on PRs
├── detox/
│   ├── jest.config.js
│   ├── helpers/
│   │   ├── authHelpers.ts             # Login, biometric auth, logout utilities
│   │   └── checkoutHelpers.ts         # Navigation, form fill, order confirmation
│   └── tests/
│       ├── auth/
│       │   └── biometricAuth.test.ts  # Face ID / fingerprint flows
│       ├── checkout/
│       │   ├── authenticatedCheckout.test.ts
│       │   ├── guestCheckout.test.ts
│       │   └── paymentMethods.test.ts # Apple Pay, Google Pay, card decline
│       ├── offline/
│       │   └── offlinePayment.test.ts # Offline banner, queued orders
│       └── permissions/
│           └── devicePermissions.test.ts # Camera, location, notifications
├── appium/
│   ├── wdio.conf.js                   # WebdriverIO config (iOS + Android caps)
│   ├── pages/
│   │   └── CheckoutPage.ts            # Page Object Model
│   └── tests/
│       └── crossPlatformCheckout.test.ts
├── maestro/
│   ├── flows/
│   │   ├── guestCheckout.yaml         # Full guest checkout happy path
│   │   ├── biometricLogin.yaml        # Biometric auth flow
│   │   └── offlineBanner.yaml         # Offline network handling
│   └── scripts/
│       ├── setAirplaneMode.js
│       └── simulateBiometricSuccess.js
├── storybook/
│   └── stories/
│       ├── CheckoutButton.stories.tsx
│       ├── PaymentForm.stories.tsx
│       └── OrderConfirmation.stories.tsx
├── .detoxrc.js
├── package.json
└── tsconfig.json
```

---

## Running Tests

### Detox — iOS

```bash
# Build
npm run detox:build:ios

# Run all tests
npm run detox:test:ios
```

### Detox — Android

```bash
npm run detox:build:android
npm run detox:test:android
```

### Appium + WebdriverIO

```bash
# Start Appium server first
appium --relaxed-security

# Run tests
npm run appium:test
```

### Maestro

```bash
# Install Maestro CLI
curl -Ls "https://get.maestro.mobile.dev" | bash

# Run a flow
maestro test maestro/flows/guestCheckout.yaml

# Run all flows
npm run maestro:test
```

### Percy Visual Regression

```bash
# Start Storybook
npm run storybook

# In another terminal
PERCY_TOKEN=<your-token> npm run percy:storybook
```

---

## CI Workflows

| Workflow | Trigger | Matrix |
|---|---|---|
| `detox-ios.yml` | push/PR to main | iOS 17.2 + 16.4 × iPhone 15 Pro + SE |
| `detox-android.yml` | push/PR to main | API 34 + 31 |
| `appium-cross-platform.yml` | push to main + nightly | iOS + Android |
| `percy-visual.yml` | PR to main | Storybook + Detox screenshots |

---

## Key Test Scenarios

### Biometric Auth
- Successful Face ID / fingerprint login
- Fallback to password after failed biometric
- Account lock after 3 failed attempts
- Re-authentication for high-value orders

### Device Permissions
- Camera permission for barcode scanning (granted / denied)
- Location permission for store pickup
- Notification permission for order updates

### Offline Handling
- Offline banner display
- Checkout button disabled when offline
- Order queued and submitted on reconnect
- Cart persistence across network loss

### Payment Methods
- Apple Pay (iOS) / Google Pay (Android)
- Credit card — success, decline, validation errors
- Save card for future use
- CVV and expiry validation

### Cross-Platform (Appium)
- Guest checkout on iOS and Android
- Currency/locale formatting
- Back navigation
- Deep link to checkout screen

---

## Secrets Required

| Secret | Used By |
|---|---|
| `PERCY_TOKEN` | Percy visual regression workflows |

Add these in **GitHub → Settings → Secrets and variables → Actions**.

---

## Author

**Darrius Jones**

[![GitHub](https://img.shields.io/badge/GitHub-Djones--qa-181717?logo=github&logoColor=white)](https://github.com/Djones-qa)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Darrius%20Jones-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/darrius-jones-28226b350/)

---

## License

This project is licensed under the [MIT License](./LICENSE).

```
MIT License

Copyright (c) 2026 Darrius Jones

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
