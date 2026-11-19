/**
 * Soft-serve machine: a tall cabinet with its freezing head standing out at
 * the front, the nozzle under it, a cone waiting on the drip tray and a long
 * draw lever on the head's face. The pointer pulls the lever: the nearer it
 * comes to the front, the further the lever swings down and the higher the
 * swirl rises in the cone, on one spring. At rest the lever stands up and the
 * nozzle is bright. The slider is how far the lever may be drawn.
 *
 * The pattern: a continuous aim on one value, read on the floor's plane,
 * which never moves.
 */
const {
  Cam, clamp, fit, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid, hull, rad,
} = HL;

const CX = 40, CZ = 26, PZ = 62, LV = 34, T0 = 0.08;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, -20, 0], [50, 20, 0], [0, -20, 84], [46 + LV, 0, PZ], [46, 0, PZ + LV]], 200, 166);
  const P = proj(C), front = HL.facing(C);
  const g = mk("g", {}, svg);
  const circ = (x, y, r, z, n) => { const p = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; p.push(P(x + r * Math.cos(a), y + r * Math.sin(a), z)); } return p; };
  put(solid(g), prism(P, front, ...rings(0, -20, 30, 20, 5, 1.6), 0, 84));
  mk("path", { class: "nf lo", d: seg(P(30, -14, 30), P(30, 14, 30)) }, g);
  put(solid(g), prism(P, front, ...rings(26, -14, 50, 14, 4, 1.2), 0, 4));
  put(solid(g), prism(P, front, ...rings(28, -9, 46, 9, 4, 1.2), PZ - 8, PZ + 6));
  const nozzle = mk("path", { class: "sil", d: poly(hull(circ(CX, 0, 3, PZ - 8, 16).concat(circ(CX, 0, 2, PZ - 14, 16)))) }, g);
  // the cone on the tray, its tip down in the holder
  mk("path", { class: "sil", d: poly(hull([P(CX, 0, 6)].concat(circ(CX, 0, 7, CZ, 24)))) }, g);
  mk("path", { class: "nf lo", d: seg(P(CX - 3, 4, 16), P(CX + 3, -1, 21)) + seg(P(CX - 4, -3, 18), P(CX + 2, 3, 12)) }, g);
  const tiers = [0, 1, 2, 3, 4].map(() => mk("path", { class: "sil" }, g));
  const lever = mk("path", { class: "sil" }, g), knob = mk("path", { class: "sil" }, g);
  const sp = spring(T0);
  let drawn = NaN;
  function draw(t) {
    if (Math.abs(t - drawn) < 1e-3) return;
    drawn = t;
    const H = 26 * t;
    tiers.forEach((el, i) => {
      const z = CZ + i * 5.2, r = 7.4 - i * 1.4, h = clamp(H - i * 5.2, 0, 5.2);
      el.setAttribute("d", h > 0.2 ? poly(hull(circ(CX, 0, r, z, 24).concat(circ(CX, 0, Math.max(r - 1.4 * h / 5.2, 1), z + h, 24)))) : "");
    });
    const a = rad(78 - 100 * t), c = Math.cos(a), s = Math.sin(a), bar = [], kp = [];
    for (const d of [0, LV]) for (const w of [-2.2, 2.2]) for (const y of [-2, 2]) bar.push(P(47 + d * c - w * s, y, PZ + d * s + w * c));
    lever.setAttribute("d", poly(hull(bar)));
    for (let i = 0; i < 3; i++) kp.push(...circ(47 + LV * c, 0, 4.5, PZ + LV * s - 3 + i * 3, 16));
    knob.setAttribute("d", poly(hull(kp)));
  }
  const L = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(L.unregister);

  function set(t) {
    const on = t !== null;
    sp.t = on ? T0 + (1 - T0) * t * reach : T0;
    nozzle.classList.toggle("hi", !on);
    lever.classList.toggle("hi", on);
    knob.classList.toggle("hi", on);
    read.textContent = on ? "pull " + Math.round(sp.t * 100) : "rest";
    L.wake();
  }
  let cur = null;
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      cur = x > -20 && x < 90 && y > -36 && y < 36 ? clamp((x + 10) / 70, 0, 1) : null;
      set(cur);
    },
    leave: () => { cur = null; set(null); },
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => { reach = v; set(cur); }, destroy: bag.dispose };
}

hairline({
  name: "softserve",
  means: "A soft-serve machine: the pointer draws the lever down on the freezing head and the swirl rises into the cone under the nozzle.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.8, 1],
  tour: [[131, 242], [176, 264], [221, 287], null],
  mount,
});
