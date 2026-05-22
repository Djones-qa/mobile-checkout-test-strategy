import { $ } from '@wdio/globals';

/**
 * Page Object for the mobile checkout flow.
 * Uses accessibility IDs for cross-platform compatibility.
 */
class CheckoutPage {
  // ─── Selectors ────────────────────────────────────────────────────────────

  get cartTab() {
    return $('~cart-tab');
  }

  get checkoutButton() {
    return $('~checkout-button');
  }

  get guestEmailInput() {
    return $('~guest-email-input');
  }

  get guestEmailContinue() {
    return $('~guest-email-continue');
  }

  get shippingFullName() {
    return $('~shipping-fullName');
  }

  get shippingStreet() {
    return $('~shipping-street');
  }

  get shippingCity() {
    return $('~shipping-city');
  }

  get shippingState() {
    return $('~shipping-state');
  }

  get shippingZip() {
    return $('~shipping-zip');
  }

  get shippingContinue() {
    return $('~shipping-continue');
  }

  get standardShipping() {
    return $('~shipping-method-standard');
  }

  get expressShipping() {
    return $('~shipping-method-express');
  }

  get shippingMethodContinue() {
    return $('~shipping-method-continue');
  }

  get cardNumberInput() {
    return $('~payment-card-number');
  }

  get cardExpiryInput() {
    return $('~payment-card-expiry');
  }

  get cardCvvInput() {
    return $('~payment-card-cvv');
  }

  get cardNameInput() {
    return $('~payment-card-name');
  }

  get placeOrderButton() {
    return $('~place-order-button');
  }

  get orderConfirmationScreen() {
    return $('~order-confirmation-screen');
  }

  get orderNumber() {
    return $('~order-number');
  }

  get paymentErrorMessage() {
    return $('~payment-error-message');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async navigateToCheckout(): Promise<void> {
    await this.cartTab.click();
    await this.checkoutButton.waitForDisplayed({ timeout: 5000 });
    await this.checkoutButton.click();
  }

  async fillGuestEmail(email: string): Promise<void> {
    await this.guestEmailInput.waitForDisplayed({ timeout: 5000 });
    await this.guestEmailInput.setValue(email);
    await this.guestEmailContinue.click();
  }

  async fillShippingAddress(address: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  }): Promise<void> {
    await this.shippingFullName.setValue(address.fullName);
    await this.shippingStreet.setValue(address.street);
    await this.shippingCity.setValue(address.city);
    await this.shippingState.setValue(address.state);
    await this.shippingZip.setValue(address.zip);
    await this.shippingContinue.click();
  }

  async selectStandardShipping(): Promise<void> {
    await this.standardShipping.click();
    await this.shippingMethodContinue.click();
  }

  async fillCreditCard(card: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  }): Promise<void> {
    await this.cardNumberInput.setValue(card.number);
    await this.cardExpiryInput.setValue(card.expiry);
    await this.cardCvvInput.setValue(card.cvv);
    await this.cardNameInput.setValue(card.name);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  async waitForConfirmation(timeout = 10000): Promise<void> {
    await this.orderConfirmationScreen.waitForDisplayed({ timeout });
  }
}

export default new CheckoutPage();
