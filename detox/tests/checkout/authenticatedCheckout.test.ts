import { by, device, element, expect, waitFor } from 'detox';
import { loginWithCredentials, logout } from '../../helpers/authHelpers';
import {
  fillCreditCard,
  fillShippingAddress,
  navigateToCheckout,
  selectShippingMethod,
  waitForOrderConfirmation,
} from '../../helpers/checkoutHelpers';

describe('Authenticated Checkout Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await loginWithCredentials('testuser@example.com', 'SecurePass123!');
  });

  afterAll(async () => {
    await logout();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display saved addresses for authenticated user', async () => {
    await navigateToCheckout();
    await waitFor(element(by.id('saved-addresses-list')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('saved-address-0'))).toBeVisible();
  });

  it('should pre-fill shipping with saved address', async () => {
    await navigateToCheckout();
    await element(by.id('saved-address-0')).tap();
    await element(by.id('use-this-address-button')).tap();
    await waitFor(element(by.id('shipping-method-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should display saved payment methods', async () => {
    await navigateToCheckout();
    await element(by.id('saved-address-0')).tap();
    await element(by.id('use-this-address-button')).tap();
    await selectShippingMethod('express');
    await waitFor(element(by.id('saved-payment-methods')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('saved-card-0'))).toBeVisible();
  });

  it('should complete checkout with saved payment method', async () => {
    await navigateToCheckout();
    await element(by.id('saved-address-0')).tap();
    await element(by.id('use-this-address-button')).tap();
    await selectShippingMethod('standard');
    await element(by.id('saved-card-0')).tap();
    await element(by.id('place-order-button')).tap();
    await waitForOrderConfirmation();
    await expect(element(by.id('order-confirmation-screen'))).toBeVisible();
  });

  it('should allow adding a new address during checkout', async () => {
    await navigateToCheckout();
    await element(by.id('add-new-address-button')).tap();
    await fillShippingAddress({
      fullName: 'John Doe',
      street: '456 New Street',
      city: 'Denver',
      state: 'CO',
      zip: '80201',
    });
    await waitFor(element(by.id('shipping-method-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
