/**
 * Device tilt sensor on phones and tablets: holding the phone at an angle
 * moves the foil. On iOS, motion access is requested on the first touch.
 */
import { clamp } from './tilt';

/** iOS 13+ gates motion sensors behind a permission prompt. */
type PermissionedOrientation = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

export function watchDeviceTilt(
  reducedMotion: MediaQueryList,
  onTilt: (x: number, y: number) => void,
  /** Ignore the sensor while this returns true (a finger is on the screen). */
  paused: () => boolean,
): void {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const Orientation = window.DeviceOrientationEvent as
    PermissionedOrientation | undefined;
  if (!coarse || !Orientation || reducedMotion.matches) return;

  let baseline: number | null = null;
  // Sensor angles are in the device frame; remap them to the screen frame.
  const screenAngle = () => ((screen.orientation.angle % 360) + 360) % 360;
  screen.orientation.addEventListener('change', () => (baseline = null));

  window.addEventListener('deviceorientation', (e) => {
    if (e.beta === null || e.gamma === null || paused()) return;
    const { beta, gamma } = e;
    // side: left/right roll as seen on screen; forward: tilt toward the user.
    const [side, forward] = {
      0: [gamma, beta],
      90: [beta, -gamma],
      180: [-gamma, -beta],
      270: [-beta, gamma],
    }[screenAngle() as 0 | 90 | 180 | 270] ?? [gamma, beta];
    // Remember how the phone is held at first, and tilt relative to that,
    // easing the baseline so it re-centres over time.
    baseline ??= clamp(forward, 10, 70);
    baseline += (clamp(forward, 10, 70) - baseline) * 0.01;
    onTilt(
      0.5 + clamp(side / 30, -1, 1) * 0.5,
      0.5 + clamp((forward - baseline) / 25, -1, 1) * 0.5,
    );
  });

  // Android: events flow right away. iOS: they flow too if the visitor
  // already allowed motion access for this site. Otherwise iOS only grants
  // access from a user gesture, so ask on the visitor's first touch
  // anywhere on the page. No button needed; until then (or if refused)
  // touch drag and the idle drift drive the foil.
  if (typeof Orientation.requestPermission === 'function') {
    const request = Orientation.requestPermission;
    document.addEventListener(
      'touchend',
      () => {
        request.call(Orientation).catch(() => {});
      },
      { once: true, passive: true },
    );
  }
}
