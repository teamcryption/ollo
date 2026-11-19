/**
 * Sausage stuffer: an upright canister on a foot plate, the stuffing tube
 * reaching out of its base, a gear box on its lid with a crank on its side and
 * the plunger's rack standing out of the top. The pointer turns the crank:
 * the further along the plate it goes, the further the crank turns and the
 * lower the rack sinks, on one spring. At rest the rack stands high and the
 * tube's mouth is bright. The slider is how far one pass may push.
 *
 * The pattern: a continuous aim on one value, read on the floor's plane,
 * which never moves.
 */
const {
  Cam, clamp, fit, poly, prism, proj, rings, rrect, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid, hull, rad,
} = HL;

const ZT = 56, ZH = 68, AX = 62, ARM = 27, T0 = 0.12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-22, -22, 0], [22, 22, 0], [-22, 46, 0], [0, 0, 122], [24, 0, AX + ARM], [24, 0, AX - ARM]], 200, 166);
  const P = proj(C), front = HL.facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-22, -22, 22, 22, 6, 1.6), 0, 5));
  put(solid(g), prism(P, front, rrect(-15, -15, 15, 15, 15, 14), rrect(-13.4, -13.4, 13.4, 13.4, 13.4, 14), 5, ZT));
  put(solid(g), prism(P, front, ...rings(-11, -9, 11, 9, 3, 1.2), ZT, ZH));
  const rack = solid(g), cap = solid(g), arm = mk("path", { class: "sil" }, g), knob = mk("path", { class: "sil" }, g);
  mk("path", { class: "sil", d: poly(hull(ring(11, 15, 3.5, 0, AX))) }, g);
  // the stuffing tube, tapering out of the canister's foot towards the viewer
  const tubePts = ring(0, 14, 5, 1, 14).concat(ring(0, 44, 2.6, 1, 14));
  mk("path", { class: "sil", d: poly(hull(tubePts)) }, g);
  const mouth = mk("path", { class: "nf sil", d: poly(ring(0, 44, 2.6, 1, 14)) }, g);
  // a circle of radius r about an axis along x (k = 0) or along y (k = 1)
  function ring(a, b, r, k, z) {
    const p = [], q = (i) => [Math.cos(i * Math.PI / 12) * r, z + Math.sin(i * Math.PI / 12) * r];
    if (k) for (let i = 0; i < 24; i++) { const [c, s] = q(i); p.push(P(a + c, b, s)); }
    else for (const x of [a, b]) for (let i = 0; i < 24; i++) { const [c, s] = q(i); p.push(P(x, c, s)); }
    return p;
  }
  const sp = spring(T0);
  let drawn = NaN;
  function draw(t) {
    if (Math.abs(t - drawn) < 1e-3) return;
    drawn = t;
    const h = 118 - 46 * t, a = rad(40 + 320 * t);
    put(rack, prism(P, front, ...rings(-4, -4, 4, 4, 1.5, 0.8), ZH, h));
    put(cap, prism(P, front, ...rings(-8, -5, 8, 5, 2, 1), h, h + 4));
    const ey = ARM * Math.cos(a), ez = AX + ARM * Math.sin(a);
    const bar = [];
    for (const [y, z] of [[0, AX], [ey, ez]]) for (const d of [-2, 2]) for (const x of [14, 16]) bar.push(P(x, y + d * Math.sin(a), z - d * Math.cos(a)));
    arm.setAttribute("d", poly(hull(bar)));
    const kp = [];
    for (const x of [16, 26]) for (let i = 0; i < 16; i++) kp.push(P(x, ey + 2.6 * Math.cos(i * Math.PI / 8), ez + 2.6 * Math.sin(i * Math.PI / 8)));
    knob.setAttribute("d", poly(hull(kp)));
  }
  const L = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(L.unregister);

  function set(t) {
    const on = t !== null;
    sp.t = on ? T0 + (0.98 - T0) * t * reach : T0;
    mouth.classList.toggle("hi", !on);
    knob.classList.toggle("hi", on);
    read.textContent = on ? "push " + Math.round(sp.t * 100) : "rest";
    L.wake();
  }
  let cur = null;
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      cur = x > -40 && x < 50 && y > -40 && y < 60 ? clamp((50 - y) / 90, 0, 1) : null;
      set(cur);
    },
    leave: () => { cur = null; set(null); },
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => { reach = v; set(cur); }, destroy: bag.dispose };
}

hairline({
  name: "sausagefiller",
  means: "A sausage stuffer: the pointer turns the crank on its gear box and the plunger's rack sinks into the canister.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.8, 1],
  tour: [[221, 272], [281, 242], [251, 257], null],
  mount,
});
