import { by, device, element, expect, waitFor } from 'detox';
import {
  fillCreditCard,
  fillShippingAddress,
  navigateToCheckout,
  selectShippingMethod,
  waitForOrderConfirmation,
} from '../../helpers/checkoutHelpers';

describe('Guest Checkout Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should allow a guest user to browse products without logging in', async () => {
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('product-list'))).toBeVisible();
  });

  it('should add a product to cart as a guest', async () => {
    await element(by.id('product-item-0')).tap();
    await waitFor(element(by.id('product-detail-screen')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('add-to-cart-button')).tap();
    await waitFor(element(by.id('cart-badge')))
      .toBeVisible()
      .withTimeout(3000);
    await expect(element(by.id('cart-badge'))).toHaveText('1');
  });

  it('should complete guest checkout with credit card', async () => {
    await navigateToCheckout();

    // Guest email prompt
    await waitFor(element(by.id('guest-email-input')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('guest-email-input')).typeText('guest@example.com');
    await element(by.id('guest-email-continue')).tap();

    await fillShippingAddress({
      fullName: 'Jane Guest',
      street: '123 Test Lane',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    });

    await selectShippingMethod('standard');

    await fillCreditCard({
      number: '4111111111111111',
      expiry: '12/27',
      cvv: '123',
      name: 'Jane Guest',
    });

    await element(by.id('place-order-button')).tap();
    await waitForOrderConfirmation();

    await expect(element(by.id('order-confirmation-screen'))).toBeVisible();
    await expect(element(by.id('order-number'))).toBeVisible();
  });

  it('should show validation error for invalid guest email', async () => {
    await navigateToCheckout();
    await element(by.id('guest-email-input')).typeText('not-an-email');
    await element(by.id('guest-email-continue')).tap();
    await expect(element(by.id('guest-email-error'))).toBeVisible();
    await expect(element(by.id('guest-email-error'))).toHaveText(
      'Please enter a valid email address'
    );
  });
});
