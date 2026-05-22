import { by, device, element, expect, waitFor } from 'detox';

/**
 * Logs in with email and password via the standard login screen.
 */
export async function loginWithCredentials(
  email: string,
  password: string
): Promise<void> {
  await waitFor(element(by.id('login-email')))
    .toBeVisible()
    .withTimeout(5000);
  await element(by.id('login-email')).typeText(email);
  await element(by.id('login-password')).typeText(password);
  await element(by.id('login-submit')).tap();
  await waitFor(element(by.id('home-screen')))
    .toBeVisible()
    .withTimeout(8000);
}

/**
 * Triggers biometric authentication prompt and simulates success.
 * Uses Detox's matchFace / matchFinger APIs for simulator/emulator.
 */
export async function authenticateWithBiometrics(): Promise<void> {
  await waitFor(element(by.id('biometric-prompt')))
    .toBeVisible()
    .withTimeout(5000);

  if (device.getPlatform() === 'ios') {
    await device.matchFace();
  } else {
    await device.matchFinger();
  }
}

/**
 * Simulates a failed biometric attempt.
 */
export async function failBiometricAuth(): Promise<void> {
  if (device.getPlatform() === 'ios') {
    await device.unmatchFace();
  } else {
    await device.unmatchFinger();
  }
}

/**
 * Logs out from the profile screen.
 */
export async function logout(): Promise<void> {
  await element(by.id('profile-tab')).tap();
  await element(by.id('logout-button')).tap();
  await waitFor(element(by.id('login-screen')))
    .toBeVisible()
    .withTimeout(5000);
}
