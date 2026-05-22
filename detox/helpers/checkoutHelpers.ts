import { by, device, element, expect, waitFor } from 'detox';

/**
 * Navigates through the cart to the checkout screen.
 */
export async function navigateToCheckout(): Promise<void> {
  await element(by.id('cart-tab')).tap();
  await waitFor(element(by.id('checkout-button')))
    .toBeVisible()
    .withTimeout(5000);
  await element(by.id('checkout-button')).tap();
}

/**
 * Fills in the shipping address form.
 */
export async function fillShippingAddress(address: {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}): Promise<void> {
  await element(by.id('shipping-fullName')).typeText(address.fullName);
  await element(by.id('shipping-street')).typeText(address.street);
  await element(by.id('shipping-city')).typeText(address.city);
  await element(by.id('shipping-state')).typeText(address.state);
  await element(by.id('shipping-zip')).typeText(address.zip);
  await element(by.id('shipping-continue')).tap();
}

/**
 * Selects a shipping method by testID.
 */
export async function selectShippingMethod(
  methodId: 'standard' | 'express' | 'overnight'
): Promise<void> {
  await element(by.id(`shipping-method-${methodId}`)).tap();
  await element(by.id('shipping-method-continue')).tap();
}

/**
 * Fills in credit card payment details.
 */
export async function fillCreditCard(card: {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}): Promise<void> {
  await element(by.id('payment-card-number')).typeText(card.number);
  await element(by.id('payment-card-expiry')).typeText(card.expiry);
  await element(by.id('payment-card-cvv')).typeText(card.cvv);
  await element(by.id('payment-card-name')).typeText(card.name);
}

/**
 * Dismisses the keyboard (useful on iOS).
 */
export async function dismissKeyboard(): Promise<void> {
  if (device.getPlatform() === 'ios') {
    await element(by.id('keyboard-dismiss')).tap();
  }
}

/**
 * Waits for the order confirmation screen.
 */
export async function waitForOrderConfirmation(): Promise<void> {
  await waitFor(element(by.id('order-confirmation-screen')))
    .toBeVisible()
    .withTimeout(10000);
}
