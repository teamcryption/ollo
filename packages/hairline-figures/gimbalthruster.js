/**
 * Gimbal engine: a rocket engine bell hung from its thrust mount. The pointer
 * is where the engine steers: the bell swings on its gimbal so its mouth points
 * toward it, on a spring. At rest the bell hangs a little off true, the mount
 * bright. The slider is how far the gimbal may swing.
 *
 * The pattern: a continuous aim (a spring on a tilt vector); the hit is on the
 * floor's plane, which never moves.
 */
const { Cam, fit, hull, poly, proj, spring, stepS, disposer, mk, pointer, register, unproj } = HL;

const D = Math.PI / 180, ZP = 52, MAX = 22 * D, REST = [-0.1, 0.12], RB = 26, LB = 46;
const frame = (t, p) => { const ct = Math.cos(t), st = Math.sin(t), cp = Math.cos(p), sp = Math.sin(p); return [[ct * cp, ct * sp, -st], [-sp, cp, 0], [st * cp, st * sp, ct]]; };
const at = (o, F, u, v, w) => [0, 1, 2].map((i) => o[i] + u * F[0][i] + v * F[1][i] + w * F[2][i]);
const ID = frame(0, 0);
function ring(P, o, F, r, w, n = 44) { const out = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; out.push(P(...at(o, F, r * Math.cos(a), r * Math.sin(a), w))); } return out; }
const cyl = (P, o, F, r0, w0, r1, w1) => poly(hull(ring(P, o, F, r0, w0).concat(ring(P, o, F, r1, w1))));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lim = MAX * value;
  const C = Cam(45, 0.5, 3.0);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([(RB + 18) * Math.cos(a), (RB + 18) * Math.sin(a), ZP - LB - 4], [24 * Math.cos(a), 24 * Math.sin(a), ZP + 16]); }
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const bell = mk("path", { class: "sil" }, g), band = mk("path", { class: "nf lo" }, g), throat = mk("path", { class: "sil" }, g);
  const O = [0, 0, ZP];
  const plate = mk("path", { class: "sil", d: cyl(P, O, ID, 22, 6, 22, 12) }, g);
  mk("path", { class: "nf lo", d: poly(ring(P, O, ID, 20, 12)) }, g);
  mk("path", { class: "sil", d: cyl(P, O, ID, 7, 0, 9, 6) }, g);
  const tx = spring(REST[0]), ty = spring(REST[1]);
  let last = "";

  function draw() {
    const key = tx.x.toFixed(4) + ty.x.toFixed(4);
    if (key === last) return;
    last = key;
    const t = Math.min(lim, Math.hypot(tx.x, ty.x)), F = frame(t, Math.atan2(ty.x, tx.x) + Math.PI);
    bell.setAttribute("d", cyl(P, O, F, 7, -6, RB, -LB));
    band.setAttribute("d", poly(ring(P, O, F, 7 + (RB - 7) * 0.55, -6 - (LB - 6) * 0.55)));
    throat.setAttribute("d", cyl(P, O, F, 6, 0, 8, -8));
  }

  const B = register(stage, (dt) => { const m = [stepS(tx, dt), stepS(ty, dt)].some(Boolean); draw(); return m; });
  bag.add(B.unregister);

  function aim(over) {
    if (over) {
      const r = Math.hypot(over[0], over[1]), f = Math.min(1, r / 40), k = f * lim / Math.max(r, 1e-6);
      tx.t = over[0] * k; ty.t = over[1] * k;
      read.textContent = Math.round(f * lim / D) + "°";
    } else { tx.t = REST[0]; ty.t = REST[1]; read.textContent = "rest"; }
    bell.classList.toggle("hi", !!over);
    plate.classList.toggle("hi", !over);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); aim(Math.hypot(x, y) > 90 ? null : [x, y]); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { lim = MAX * v; aim(null); }, destroy: bag.dispose };
}

hairline({
  name: "gimbalthruster",
  means: "A rocket engine on its gimbal: the bell swings so its mouth points toward the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[232, 279], [285, 284], [200, 157], null],
  mount,
});
