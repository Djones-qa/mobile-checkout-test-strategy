/**
 * Maestro script: Simulate a successful biometric authentication.
 *
 * On iOS simulators, Detox exposes matchFace/matchFinger.
 * In Maestro, we trigger the same via the device's simctl or adb.
 *
 * This script is a placeholder — in CI it is replaced by
 * platform-specific commands in the GitHub Actions workflow.
 */

const { platform } = output;

if (platform === 'ios') {
  // xcrun simctl --set testing biometricEnrollment Enrolled
  // xcrun simctl --set testing biometricMatch true
  console.log('[Maestro] iOS: biometric match simulated via simctl');
} else {
  // adb shell am broadcast -a com.android.server.biometrics.BIOMETRIC_MATCH
  console.log('[Maestro] Android: biometric match simulated via adb');
}
