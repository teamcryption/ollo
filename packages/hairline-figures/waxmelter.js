/**
 * Seed drill hopper: a long seed box on a two-wheeled frame with a hinged lid. The pointer over the drill swings the lid open; at rest it sits ajar, bright.
 *
 * The pattern: one part answers by opening about a fixed pivot.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const S0 = [["c",-6,16,14,-2,16,14,14],["c",82,16,14,86,16,14,14],["c",-2,16,14,82,16,14,2],["b",0,0,24,80,32,52],["b",10,30,4,13,33,24],["b",40,30,4,43,33,24],["b",67,30,4,70,33,24]];
const S1 = [["b",-1,0,52,81,34,55],["b",-1,32,46,81,34,55,0,1],["b",36,24,55,44,34,58]];
const PIV = [0,0,52], AX = "x", REST = 0.22, K = 1.6, SC = 2.5;

function rot(p, a) {
  const q = [p[0] - PIV[0], p[1] - PIV[1], p[2] - PIV[2]], c = Math.cos(a), s = Math.sin(a);
  let r;
  if (AX === "x") r = [q[0], q[1] * c - q[2] * s, q[1] * s + q[2] * c];
  else if (AX === "y") r = [q[0] * c + q[2] * s, q[1], -q[0] * s + q[2] * c];
  else r = [q[0] * c - q[1] * s, q[0] * s + q[1] * c, q[2]];
  return [r[0] + PIV[0], r[1] + PIV[1], r[2] + PIV[2]];
}
function pts(s) {
  if (s[0] === "b") { const [, a, b, c, d, e, f] = s, o = []; for (const x of [a, d]) for (const y of [b, e]) for (const z of [c, f]) o.push([x, y, z]); return o; }
  const [, ax, ay, az, bx, by, bz, r] = s, v = [bx - ax, by - ay, bz - az], L = Math.hypot(...v), w = v.map((t) => t / L);
  let u = Math.abs(w[2]) < 0.9 ? [w[1], -w[0], 0] : [1, 0, 0];
  const ul = Math.hypot(...u); u = u.map((t) => t / ul);
  const n = [w[1] * u[2] - w[2] * u[1], w[2] * u[0] - w[0] * u[2], w[0] * u[1] - w[1] * u[0]], o = [];
  for (let i = 0; i < 20; i++) { const t = (i / 20) * Math.PI * 2, cc = Math.cos(t) * r, ss = Math.sin(t) * r;
    for (const [px, py, pz] of [[ax, ay, az], [bx, by, bz]]) o.push([px + u[0] * cc + n[0] * ss, py + u[1] * cc + n[1] * ss, pz + u[2] * cc + n[2] * ss]); }
  return o;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const C = Cam(45, 0.5, SC), all = [];
  S0.forEach((s) => all.push(...pts(s)));
  for (const a of [REST, 1]) S1.forEach((s) => all.push(...pts(s).map((p) => rot(p, a * K))));
  fit(C, all, 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const shp = (ps) => poly(hull(ps.map((p) => P(...p))));
  const back = mk("g", {}, g), front = mk("g", {}, g);
  S0.forEach((s, i) => mk("path", { d: shp(pts(s)), class: s[8] ? "nf lo" : "" }, s[9] ? front : back));
  const mg = mk("g", {}, g);
  front.before(mg);
  const mp = S1.map((s, i) => mk("path", { class: i === 0 ? "sil" : s[8] ? "nf" : "" }, mg));
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    S1.forEach((s, i) => mp[i].setAttribute("d", shp(pts(s).map((p) => rot(p, a * amax / 100 * K)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const sp = []; S0.forEach((s) => sp.push(...pts(s).map((p) => P(...p)))); S1.forEach((s) => sp.push(...pts(s).map((p) => P(...rot(p, REST * K)))));
  const bx = [Math.min(...sp.map((q) => q[0])) - 8, Math.max(...sp.map((q) => q[0])) + 8, Math.min(...sp.map((q) => q[1])) - 30, Math.max(...sp.map((q) => q[1])) + 8];
  let act = null;
  function set(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? 1 : REST, performance.now(), 0);
    mp[0].classList.add("hi");
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > bx[0] && x < bx[1] && y > bx[2] + 22 && y < bx[3]), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "waxmelter",
  means: "A seed drill hopper on its wheels: the pointer over it swings the long hinged lid open to show the seed box.",
  rules: [1, 3, 4, 5],
  range: [40, 70, 100],
  tour: [[171,154],[157,209],[242,189],null],
  mount,
});
