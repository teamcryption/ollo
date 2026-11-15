/**
 * Shelf truck: a two-deck shelf trolley on four casters with a push handle
 * at one end. The pointer on the floor turns the whole truck on its casters
 * to face it, clamped to a quarter turn. At rest it stands square, the push
 * handle bright. The slider is the spring's stiffness.
 */
const { Cam, clamp, fit, hull, poly, proj, seg, unproj, spring, stepS, disposer, mk, pointer, register } = HL;

function boxD(P, T, a, b) {
  const c = [];
  for (const x of [a[0], b[0]]) for (const y of [a[1], b[1]]) for (const z of [a[2], b[2]]) c.push(T([x, y, z]));
  const s = c.map((p) => P(...p));
  let n = 0, best = -1e9;
  c.forEach((p, i) => { const v = p[0] + p[1] + p[2] * 0.8; if (v > best) { best = v; n = i; } });
  return { sil: poly(hull(s)), cr: seg(s[n], s[n ^ 4]) + seg(s[n], s[n ^ 2]) + seg(s[n], s[n ^ 1]), d: c.reduce((m, p) => m + p[0] + p[1] + p[2] * 0.3, 0) / 8 };
}
const PARTS = [];
for (const x of [-17, 17]) for (const y of [-10, 10]) PARTS.push([[x - 2, y - 2, 0], [x + 2, y + 2, 5]]);
PARTS.push([[-20, -12, 5], [20, 12, 8]]);
for (const x of [-18, 18]) for (const y of [-10.5, 10.5]) PARTS.push([[x - 0.9, y - 0.9, 8], [x + 0.9, y + 0.9, 22]]);
PARTS.push([[-20, -12, 22], [20, 12, 24.5]]);
PARTS.push([[-6, -8, 24.5], [8, 6, 33]]);
const HI0 = PARTS.length;
for (const y of [-10.5, 10.5]) PARTS.push([[-22.5, y - 0.9, 8], [-20.7, y + 0.9, 42]]);
PARTS.push([[-22.5, -11.4, 40], [-20.7, 11.4, 42]]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 4.2);
  fit(C, [[-26, -26, 0], [26, 26, 0], [26, -26, 0], [-26, 26, 0], [-26, 0, 42], [0, 26, 42], [26, 0, 42], [0, -26, 42]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const pool = PARTS.map(() => { const sg = mk("g", {}, g); return { g: sg, sil: mk("path", { class: "sil" }, sg), cr: mk("path", { class: "nf lo" }, sg) }; });
  const sp = spring(0, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;
  function draw(th) {
    if (th === last) return;
    last = th;
    const c = Math.cos(th), s = Math.sin(th);
    const T = ([x, y, z]) => [x * c - y * s, x * s + y * c, z];
    const ds = PARTS.map((p, i) => ({ i, ...boxD(P, T, p[0], p[1]) })).sort((a, b) => a.d - b.d);
    ds.forEach((d, k) => {
      const o = pool[k];
      o.sil.setAttribute("d", d.sil); o.cr.setAttribute("d", d.cr);
      o.sil.classList.toggle("hi", d.i >= HI0);
    });
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(p) {
    if (!p) { sp.t = 0; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    const r = Math.hypot(x, y);
    if (r < 8 || r > 90) return;
    const a = clamp(Math.atan2(y, x), -1.2, 1.2);
    sp.t = a;
    read.textContent = Math.round((a * 180) / Math.PI) + "\u00b0";
    B.wake();
  }
  draw(0); read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "shelftruck",
  means: "A two-deck shelf trolley: it turns on its casters to face the pointer on the floor, push handle trailing behind.",
  rules: [1, 3, 5],
  range: [0.5, 1, 2],
  tour: [[111, 291], [390, 232], [20, 202], null],
  mount,
});
