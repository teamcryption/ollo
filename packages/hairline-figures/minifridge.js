/**
 * Ice bucket: a tapered bucket on a round tray, a champagne bottle leaning
 * in it. The pointer over the bucket lifts the bottle out of the ice and
 * stands it upright; leaving sets it back at its lean. At rest the bottle
 * is the bright mark. The slider is how far it lifts.
 *
 * The pattern: one object answering (lift).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, run, spring, stepS,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const BR = 20, BF = 15, BH = 30, TZ = 3, LEAN = 0.32;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[-30, -30, 0], [30, 30, 0], [30, -30, 0], [-30, 30, 0], [0, 0, TZ + 8 + 36 + 46], [14, 0, TZ + 60]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 28), disc(0, 0, 26), 0, TZ));
  // the bucket: tapered, its back wall first
  const foot = disc(0, 0, BF), top = disc(0, 0, BR), inner = disc(0, 0, BR - 1.6);
  mk("path", { d: poly(hull(ringAt(P, foot, TZ).concat(ringAt(P, top, TZ + BH)))), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, inner, TZ + BH)), class: "nf lo" }, g);
  const bottle = solid(g), neck = solid(g);
  // the front wall covers the bottle's foot
  const fr = run(top, front), ff = run(foot, front);
  mk("path", { d: poly(ringAt(P, fr, TZ + BH).concat(ringAt(P, ff, TZ).reverse())), class: "sil" }, g);
  for (const s of [-1, 1]) {
    const a = ringAt(P, disc(s * (BR + 2.5), 0, 2.4, 14), TZ + BH - 7), b = ringAt(P, disc(s * (BR + 2.5), 0, 2.4, 14), TZ + BH - 4);
    mk("path", { d: poly(hull(a.concat(b))), class: "nf lo" }, g);
  }
  bottle.sil.classList.add("hi");

  const lift = spring(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const z0 = TZ + 4 + t * reach, lean = LEAN * (1 - t);
    const at = (r, z, n) => ringAt(P, disc(lean * (z - z0), 0, r, n), z);
    const body = [], bi = [];
    for (const z of [z0, z0 + 34]) { body.push(...at(6.5, z, 28)); }
    for (let i = 0; i <= 6; i++) { const u = i / 6; body.push(...at(6.5 - 4.2 * u, z0 + 34 + 10 * u, 28)); }
    bottle.sil.setAttribute("d", poly(hull(body)));
    bottle.cr.setAttribute("d", poly(at(6.5, z0 + 22, 28)));
    neck.sil.setAttribute("d", poly(hull(at(2.6, z0 + 44, 16).concat(at(2.6, z0 + 52, 16)))));
    neck.cr.setAttribute("d", "");
  }

  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); return m; });
  bag.add(B.unregister);

  function set(on) {
    lift.t = on ? 1 : 0;
    read.textContent = on ? "lift" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, TZ); set(Math.hypot(x, y) < 30 || Math.hypot(...unproj(C, sx, sy, TZ + BH)) < 24); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "minifridge",
  means: "A champagne bottle leaning in an ice bucket: the pointer over the bucket lifts it out of the ice and stands it upright.",
  rules: [1, 3, 5, 6],
  range: [10, 26, 36],
  tour: [[121, 231], [200, 204], [279, 177], null],
  mount,
});
