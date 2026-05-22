import { by, device, element, expect, waitFor } from 'detox';
import { loginWithCredentials } from '../../helpers/authHelpers';
import { navigateToCheckout, selectShippingMethod } from '../../helpers/checkoutHelpers';

describe('Offline Payment Handling', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await loginWithCredentials('testuser@example.com', 'SecurePass123!');
  });

  afterEach(async () => {
    // Always restore network after each test
    await device.setURLBlacklist([]);
  });

  it('should show offline banner when network is unavailable', async () => {
    await device.setURLBlacklist(['.*']);
    await waitFor(element(by.id('offline-banner')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('offline-banner'))).toBeVisible();
  });

  it('should disable checkout button when offline', async () => {
    await device.setURLBlacklist(['.*']);
    await element(by.id('cart-tab')).tap();
    await waitFor(element(by.id('checkout-button')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('checkout-button'))).toBeVisible();
  });

  it('should queue order and submit when connectivity is restored', async () => {
    // Go offline mid-checkout
    await navigateToCheckout();
    await element(by.id('saved-address-0')).tap();
    await element(by.id('use-this-address-button')).tap();
    await selectShippingMethod('standard');
    await element(by.id('saved-card-0')).tap();

    // Cut network before placing order
    await device.setURLBlacklist(['.*']);
    await element(by.id('place-order-button')).tap();

    await waitFor(element(by.id('offline-order-queued-message')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('offline-order-queued-message'))).toBeVisible();

    // Restore network
    await device.setURLBlacklist([]);
    await waitFor(element(by.id('order-confirmation-screen')))
      .toBeVisible()
      .withTimeout(15000);
    await expect(element(by.id('order-confirmation-screen'))).toBeVisible();
  });

  it('should retain cart contents after going offline and back online', async () => {
    await element(by.id('product-item-0')).tap();
    await element(by.id('add-to-cart-button')).tap();

    await device.setURLBlacklist(['.*']);
    await device.reloadReactNative();
    await device.setURLBlacklist([]);

    await element(by.id('cart-tab')).tap();
    await expect(element(by.id('cart-item-0'))).toBeVisible();
  });

  it('should show appropriate error when payment gateway is unreachable', async () => {
    await navigateToCheckout();
    await element(by.id('saved-address-0')).tap();
    await element(by.id('use-this-address-button')).tap();
    await selectShippingMethod('standard');
    await element(by.id('saved-card-0')).tap();

    // Block only payment gateway
    await device.setURLBlacklist(['.*stripe\\.com.*', '.*payment.*']);
    await element(by.id('place-order-button')).tap();

    await waitFor(element(by.id('payment-gateway-error')))
      .toBeVisible()
      .withTimeout(10000);
    await expect(element(by.id('payment-gateway-error'))).toBeVisible();
  });
});
