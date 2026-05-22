import { by, device, element, expect, waitFor } from 'detox';
import {
  authenticateWithBiometrics,
  failBiometricAuth,
  loginWithCredentials,
} from '../../helpers/authHelpers';

describe('Biometric Authentication', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { faceid: 'YES', finger: 'YES' },
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should prompt for biometric auth when enabled in settings', async () => {
    // First login with credentials to enable biometrics
    await loginWithCredentials('testuser@example.com', 'SecurePass123!');
    await element(by.id('profile-tab')).tap();
    await element(by.id('enable-biometrics-toggle')).tap();
    await waitFor(element(by.id('biometric-enabled-confirmation')))
      .toBeVisible()
      .withTimeout(3000);

    // Reload and expect biometric prompt
    await device.reloadReactNative();
    await waitFor(element(by.id('biometric-prompt')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should authenticate successfully with valid biometrics', async () => {
    await waitFor(element(by.id('biometric-prompt')))
      .toBeVisible()
      .withTimeout(5000);
    await authenticateWithBiometrics();
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should fall back to password after failed biometric attempt', async () => {
    await waitFor(element(by.id('biometric-prompt')))
      .toBeVisible()
      .withTimeout(5000);
    await failBiometricAuth();
    await waitFor(element(by.id('biometric-fallback-password')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('biometric-fallback-password'))).toBeVisible();
  });

  it('should lock account after 3 consecutive failed biometric attempts', async () => {
    for (let i = 0; i < 3; i++) {
      await waitFor(element(by.id('biometric-prompt')))
        .toBeVisible()
        .withTimeout(5000);
      await failBiometricAuth();
    }
    await waitFor(element(by.id('account-locked-screen')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('account-locked-screen'))).toBeVisible();
  });

  it('should require biometric confirmation before placing high-value order', async () => {
    await authenticateWithBiometrics();
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);

    // Add expensive item and proceed to checkout
    await element(by.id('product-item-premium-0')).tap();
    await element(by.id('add-to-cart-button')).tap();
    await element(by.id('cart-tab')).tap();
    await element(by.id('checkout-button')).tap();
    await element(by.id('saved-address-0')).tap();
    await element(by.id('use-this-address-button')).tap();
    await element(by.id('shipping-method-standard')).tap();
    await element(by.id('shipping-method-continue')).tap();
    await element(by.id('saved-card-0')).tap();
    await element(by.id('place-order-button')).tap();

    // High-value order triggers re-authentication
    await waitFor(element(by.id('biometric-reauth-prompt')))
      .toBeVisible()
      .withTimeout(5000);
    await authenticateWithBiometrics();
    await waitFor(element(by.id('order-confirmation-screen')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
