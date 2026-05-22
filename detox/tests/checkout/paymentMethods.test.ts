import { by, device, element, expect, waitFor } from 'detox';
import { loginWithCredentials } from '../../helpers/authHelpers';
import {
  fillCreditCard,
  navigateToCheckout,
  selectShippingMethod,
  waitForOrderConfirmation,
} from '../../helpers/checkoutHelpers';

describe('Payment Methods', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await loginWithCredentials('testuser@example.com', 'SecurePass123!');
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete checkout with Apple Pay / Google Pay', async () => {
    await navigateToCheckout();
    await element(by.id('saved-address-0')).tap();
    await element(by.id('use-this-address-button')).tap();
    await selectShippingMethod('standard');

    const platform = device.getPlatform();
    const walletButtonId = platform === 'ios' ? 'apple-pay-button' : 'google-pay-button';

    await waitFor(element(by.id(walletButtonId)))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id(walletButtonId)).tap();

    // Simulator/emulator wallet confirmation
    await waitFor(element(by.id('wallet-confirm-button')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('wallet-confirm-button')).tap();

    await waitForOrderConfirmation();
    await expect(element(by.id('order-confirmation-screen'))).toBeVisible();
  });

  it('should decline an expired credit card', async () => {
    await navigateToCheckout();
    await element(by.id('saved-address-0')).tap();
    await element(by.id('use-this-address-button')).tap();
    await selectShippingMethod('standard');
    await element(by.id('add-new-card-button')).tap();

    await fillCreditCard({
      number: '4000000000000002', // Stripe test decline card
      expiry: '01/20',
      cvv: '123',
      name: 'Test User',
    });

    await element(by.id('place-order-button')).tap();
    await waitFor(element(by.id('payment-error-message')))
      .toBeVisible()
      .withTimeout(8000);
    await expect(element(by.id('payment-error-message'))).toBeVisible();
  });

  it('should show CVV validation error for invalid input', async () => {
    await navigateToCheckout();
    await element(by.id('saved-address-0')).tap();
    await element(by.id('use-this-address-button')).tap();
    await selectShippingMethod('standard');
    await element(by.id('add-new-card-button')).tap();

    await element(by.id('payment-card-number')).typeText('4111111111111111');
    await element(by.id('payment-card-expiry')).typeText('12/27');
    await element(by.id('payment-card-cvv')).typeText('12'); // too short
    await element(by.id('payment-card-name')).typeText('Test User');
    await element(by.id('place-order-button')).tap();

    await expect(element(by.id('cvv-error'))).toBeVisible();
  });

  it('should save a new card for future use when checkbox is checked', async () => {
    await navigateToCheckout();
    await element(by.id('saved-address-0')).tap();
    await element(by.id('use-this-address-button')).tap();
    await selectShippingMethod('standard');
    await element(by.id('add-new-card-button')).tap();

    await fillCreditCard({
      number: '5555555555554444',
      expiry: '08/28',
      cvv: '321',
      name: 'Test User',
    });

    await element(by.id('save-card-checkbox')).tap();
    await element(by.id('place-order-button')).tap();
    await waitForOrderConfirmation();

    // Verify card appears in saved methods on next visit
    await device.reloadReactNative();
    await navigateToCheckout();
    await element(by.id('saved-address-0')).tap();
    await element(by.id('use-this-address-button')).tap();
    await selectShippingMethod('standard');
    await expect(element(by.id('saved-card-1'))).toBeVisible();
  });
});
