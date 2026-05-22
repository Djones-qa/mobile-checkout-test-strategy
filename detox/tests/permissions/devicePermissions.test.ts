import { by, device, element, expect, waitFor } from 'detox';
import { loginWithCredentials } from '../../helpers/authHelpers';

describe('Device Permissions', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
    await loginWithCredentials('testuser@example.com', 'SecurePass123!');
  });

  it('should request camera permission for barcode scanning', async () => {
    await element(by.id('scan-barcode-button')).tap();
    await waitFor(element(by.id('camera-permission-dialog')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('camera-permission-dialog'))).toBeVisible();
  });

  it('should open camera after camera permission is granted', async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { camera: 'YES' },
    });
    await loginWithCredentials('testuser@example.com', 'SecurePass123!');
    await element(by.id('scan-barcode-button')).tap();
    await waitFor(element(by.id('camera-view')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('camera-view'))).toBeVisible();
  });

  it('should show fallback UI when camera permission is denied', async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { camera: 'NO' },
    });
    await loginWithCredentials('testuser@example.com', 'SecurePass123!');
    await element(by.id('scan-barcode-button')).tap();
    await waitFor(element(by.id('camera-denied-fallback')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('camera-denied-fallback'))).toBeVisible();
  });

  it('should request location permission for store pickup', async () => {
    await element(by.id('cart-tab')).tap();
    await element(by.id('checkout-button')).tap();
    await element(by.id('store-pickup-option')).tap();
    await waitFor(element(by.id('location-permission-dialog')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('location-permission-dialog'))).toBeVisible();
  });

  it('should show nearest stores after location permission is granted', async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { location: 'always' },
    });
    await loginWithCredentials('testuser@example.com', 'SecurePass123!');
    await element(by.id('cart-tab')).tap();
    await element(by.id('checkout-button')).tap();
    await element(by.id('store-pickup-option')).tap();
    await waitFor(element(by.id('nearby-stores-list')))
      .toBeVisible()
      .withTimeout(8000);
    await expect(element(by.id('nearby-stores-list'))).toBeVisible();
  });

  it('should request notification permission for order updates', async () => {
    await waitFor(element(by.id('order-confirmation-screen')))
      .toBeVisible()
      .withTimeout(5000)
      .catch(() => null); // may not be on this screen

    await element(by.id('profile-tab')).tap();
    await element(by.id('notification-settings')).tap();
    await element(by.id('enable-order-notifications-toggle')).tap();
    await waitFor(element(by.id('notification-permission-dialog')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('notification-permission-dialog'))).toBeVisible();
  });
});
