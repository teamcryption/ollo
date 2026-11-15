/**
 * Reaction wheel: a heavy flywheel on a short column over its housing. The
 * pointer is where the wheel leans: the flywheel tilts its axis toward it on a
 * spring and its spokes turn round with it. At rest the wheel leans a little,
 * its hub bright. The slider is how far the wheel may lean.
 *
 * The pattern: a continuous aim (a spring on a tilt vector); the hit is on the
 * floor's plane, which never moves.
 */
const { Cam, fit, hull, poly, proj, spring, stepS, disposer, mk, pointer, register, unproj } = HL;

const D = Math.PI / 180, RW = 34, ZW = 26, TW = 7, MAX = 34 * D, REST = [0.16, -0.08];
const frame = (t, p) => { const ct = Math.cos(t), st = Math.sin(t), cp = Math.cos(p), sp = Math.sin(p); return [[ct * cp, ct * sp, -st], [-sp, cp, 0], [st * cp, st * sp, ct]]; };
const at = (o, F, u, v, w) => [0, 1, 2].map((i) => o[i] + u * F[0][i] + v * F[1][i] + w * F[2][i]);
const ID = frame(0, 0);
function ring(P, o, F, r, w, n = 44, a0 = 0) { const out = []; for (let i = 0; i < n; i++) { const a = a0 + (i / n) * Math.PI * 2; out.push(P(...at(o, F, r * Math.cos(a), r * Math.sin(a), w))); } return out; }
const cyl = (P, o, F, r0, w0, r1, w1) => poly(hull(ring(P, o, F, r0, w0).concat(ring(P, o, F, r1, w1))));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lim = MAX * value;
  const C = Cam(45, 0.5, 3.1);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([(RW + 10) * Math.cos(a), (RW + 10) * Math.sin(a), 0], [(RW + 4) * Math.cos(a), (RW + 4) * Math.sin(a), ZW + 26]); }
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const O = [0, 0, 0];
  mk("path", { class: "sil", d: cyl(P, O, ID, 30, 0, 30, 8) }, g);
  mk("path", { class: "nf lo", d: poly(ring(P, O, ID, 28, 8)) }, g);
  mk("path", { class: "sil", d: cyl(P, O, ID, 5, 8, 5, ZW) }, g);
  const wheel = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g), spokes = mk("path", { class: "nf" }, g), hub = mk("path", { class: "sil" }, g);
  const tx = spring(REST[0]), ty = spring(REST[1]), sp = spring(0);
  let last = "";

  function draw() {
    const vx = tx.x, vy = ty.x, key = vx.toFixed(4) + vy.toFixed(4) + sp.x.toFixed(4);
    if (key === last) return;
    last = key;
    const t = Math.min(lim, Math.hypot(vx, vy)), F = frame(t, Math.atan2(vy, vx)), c = [0, 0, ZW];
    wheel.setAttribute("d", cyl(P, c, F, RW, 0, RW, TW));
    face.setAttribute("d", poly(ring(P, c, F, RW - 3, TW)));
    let d = "";
    for (let k = 0; k < 5; k++) { const a = sp.x + (k / 5) * Math.PI * 2, p0 = P(...at(c, F, 6 * Math.cos(a), 6 * Math.sin(a), TW)), p1 = P(...at(c, F, (RW - 3) * Math.cos(a), (RW - 3) * Math.sin(a), TW)); d += `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)}L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`; }
    spokes.setAttribute("d", d);
    hub.setAttribute("d", cyl(P, c, F, 6, TW, 5, TW + 4));
  }

  const B = register(stage, (dt) => { const m = [stepS(tx, dt), stepS(ty, dt), stepS(sp, dt)].some(Boolean); draw(); return m; });
  bag.add(B.unregister);

  function aim(over) {
    if (over) {
      const r = Math.hypot(over[0], over[1]), k = Math.min(1, r / RW) * lim / Math.max(r, 1e-6);
      tx.t = over[0] * k; ty.t = over[1] * k; sp.t = Math.atan2(over[1], over[0]) * 1.5;
      read.textContent = Math.round(Math.min(1, r / RW) * lim / D) + "°";
    } else { tx.t = REST[0]; ty.t = REST[1]; sp.t = 0; read.textContent = "rest"; }
    wheel.classList.toggle("hi", !!over);
    hub.classList.toggle("hi", !over);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); aim(Math.hypot(x, y) > RW + 30 ? null : [x, y]); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { lim = MAX * v; aim(null); }, destroy: bag.dispose };
}

hairline({
  name: "reactionwheel",
  means: "A reaction wheel on its housing: the flywheel tilts toward the pointer and its spokes turn with it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[200, 290], [275, 268], [200, 165], null],
  mount,
});
