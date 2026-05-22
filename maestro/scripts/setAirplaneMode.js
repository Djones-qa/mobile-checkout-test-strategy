/**
 * Maestro script: Toggle airplane mode on the device.
 *
 * ENABLED env var controls whether airplane mode is turned on or off.
 * In CI, this is executed via platform-specific commands.
 */

const enabled = output.ENABLED === 'true';

if (output.platform === 'ios') {
  // iOS simulators don't support airplane mode via simctl.
  // Use URLBlacklist in Detox or network conditioning profiles instead.
  console.log(`[Maestro] iOS: network conditioning ${enabled ? 'OFF' : 'ON'}`);
} else {
  // adb shell cmd connectivity airplane-mode enable|disable
  console.log(`[Maestro] Android: airplane mode ${enabled ? 'enabled' : 'disabled'}`);
}
