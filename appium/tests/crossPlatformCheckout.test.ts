import CheckoutPage from '../pages/CheckoutPage';

describe('Cross-Platform Checkout — Appium', () => {
  beforeEach(async () => {
    await browser.reloadSession();
  });

  it('should complete guest checkout on both iOS and Android', async () => {
    await CheckoutPage.navigateToCheckout();
    await CheckoutPage.fillGuestEmail('crossplatform@example.com');

    await CheckoutPage.fillShippingAddress({
      fullName: 'Cross Platform User',
      street: '789 Platform Ave',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
    });

    await CheckoutPage.selectStandardShipping();

    await CheckoutPage.fillCreditCard({
      number: '4111111111111111',
      expiry: '12/27',
      cvv: '123',
      name: 'Cross Platform User',
    });

    await CheckoutPage.placeOrder();
    await CheckoutPage.waitForConfirmation();

    await expect(CheckoutPage.orderConfirmationScreen).toBeDisplayed();
    await expect(CheckoutPage.orderNumber).toBeDisplayed();
  });

  it('should display correct currency and locale formatting', async () => {
    const priceElement = await $('~product-price-0');
    await priceElement.waitForDisplayed({ timeout: 5000 });
    const priceText = await priceElement.getText();

    // Verify price format matches locale (e.g., $XX.XX)
    expect(priceText).toMatch(/^\$\d+\.\d{2}$/);
  });

  it('should handle back navigation correctly on both platforms', async () => {
    await CheckoutPage.navigateToCheckout();
    await CheckoutPage.fillGuestEmail('nav@example.com');

    // Navigate back
    await browser.back();

    const cartScreen = await $('~cart-screen');
    await cartScreen.waitForDisplayed({ timeout: 5000 });
    await expect(cartScreen).toBeDisplayed();
  });

  it('should scroll to bottom of long product list', async () => {
    const productList = await $('~product-list');
    await productList.waitForDisplayed({ timeout: 5000 });

    // Scroll down to load more items
    await browser.execute('mobile: scroll', { direction: 'down' });
    await browser.execute('mobile: scroll', { direction: 'down' });

    const lastProduct = await $('~product-item-19');
    await expect(lastProduct).toBeDisplayed();
  });

  it('should handle deep link to checkout screen', async () => {
    const isIOS = (await browser.capabilities).platformName?.toLowerCase() === 'ios';
    const deepLink = isIOS
      ? 'mobilecheckout://checkout'
      : 'intent://checkout#Intent;scheme=mobilecheckout;end';

    await browser.url(deepLink);

    const checkoutScreen = await $('~checkout-screen');
    await checkoutScreen.waitForDisplayed({ timeout: 8000 });
    await expect(checkoutScreen).toBeDisplayed();
  });
});
