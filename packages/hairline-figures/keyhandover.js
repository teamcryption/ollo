/**
 * Key tags: an estate agent's key board with two rows of four hooks, a key
 * and a tag hanging from each ring. The pointer picks a key on the board's
 * face: it swings out on its hook and its tag turns over, so its punched hole
 * changes side; the keys beside it sway a little, staggered from it. At rest
 * the keys hang at uneven angles, one bright. The slider is the stagger.
 *
 * The pattern: one of many on a face (lockers), read on the board's face
 * plane, which never moves; tweens for the swing and the turn.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, poly, prism, proj, rings, seg, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 4, NR = 2, CW = 26, RH = 44, M = 8, W = 2 * M + NC * CW, H = NR * RH + 10, D = 6, Y = D + 1.5, FAV = 5;
const LEAN = [4, -3, 6, -2, -5, 3, 12, -4];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [W, D + 4, 0], [W, 0, 0], [0, D + 4, 0], [0, 0, H], [W, 0, H], [0, D + 4, H]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 3, 1.3);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const keys = [];
  for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) {
    const i = r * NC + c, hx = M + CW * (c + 0.5), hz = H - 8 - r * RH;
    mk("path", { d: seg(P(hx, D, hz), P(hx, Y + 1, hz)), class: "nf" }, g);
    const kg = mk("g", {}, g);
    keys.push({ i, c, r, hx, hz, key: mk("path", {}, kg), tag: mk("path", {}, kg), hole: mk("path", { class: "nf lo" }, kg), sw: tween(LEAN[i]), fl: tween(0), last: "" });
  }
  const ring = circ(1, 10);
  const circle = (u, v, R) => poly(ring.map((q) => P(u + q.u * R, Y, v + q.v * R)));

  function draw(k, a, f) {
    const sig = a.toFixed(2) + "," + f.toFixed(3);
    if (sig === k.last) return;
    k.last = sig;
    const t = a * Math.PI / 180, s = Math.sin(t), co = Math.cos(t);
    const at = (du, dv) => [k.hx + du * co + dv * s, k.hz - du * s + dv * co];
    // the key: a bow on the ring, a shaft and two teeth, all swung about the hook
    const [bu, bv] = at(0, -6.5);
    let d = circle(bu, bv, 3.4) + circle(bu, bv, 1.3);
    const sh = [[-0.9, -9.6], [0.9, -9.6], [0.9, -24], [-0.9, -24]].map(([u, v]) => P(...at(u, v).slice(0, 1), Y, at(u, v)[1]));
    d += poly(fillet(sh, [0.4, 0.4, 0.4, 0.4], 2));
    const tooth = (v) => poly([[0.9, v], [3.6, v], [3.6, v - 2.2], [0.9, v - 2.2]].map(([u, w]) => { const q = at(u, w); return P(q[0], Y, q[1]); }));
    d += tooth(-17.5) + tooth(-21.8);
    k.key.setAttribute("d", d);
    // the tag: hangs beside the key from the same ring and turns about its own string
    const [tu, tv] = at(-7.5, -4), ph = f * Math.PI, cw = Math.cos(ph), sw = Math.sin(ph);
    const T = (u, v) => P(tu + u * cw, Y + 2 + u * sw, tv + v);
    k.tag.setAttribute("d", seg(P(...at(0, -3.1).slice(0, 1), Y, at(0, -3.1)[1]), T(0, 0)) + poly(fillet([T(-3.6, 0), T(3.6, 0), T(3.6, -15), T(-3.6, -15)], [1.2, 1.2, 1.2, 1.2], 3)));
    k.hole.setAttribute("d", poly(ring.map((q) => T(-1.6 + q.u * 0.9, -2.6 + q.v * 0.9))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of keys) { draw(k, tval(k.sw, now), tval(k.fl, now)); if (!tdone(k.sw, now) || !tdone(k.fl, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The key under the point, read on the board's face plane (y = D), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Yw = x * s + D * c, z = (Yw * C.k - (sy - C.oy) / C.S) / zf;
    if (x < M || x > W - M || z < 4 || z > H - 4) return -1;
    return clamp(Math.floor((H - 4 - z) / RH), 0, NR - 1) * NC + clamp(Math.floor((x - M) / CW), 0, NC - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const ak = a >= 0 ? keys[a] : null, fk = from >= 0 ? keys[from] : null;
    keys.forEach((k) => {
      const d = ak ? Math.abs(k.c - ak.c) + Math.abs(k.r - ak.r) : 9;
      const sw = !ak ? LEAN[k.i] : d === 0 ? 24 : d === 1 ? (k.c < ak.c ? -7 : 7) : d === 2 ? (k.c < ak.c ? -3 : 3) : 0;
      const delay = fk ? (Math.abs(k.c - fk.c) + Math.abs(k.r - fk.r)) * stag : 0;
      tset(k.sw, clamp(sw, -26, 26), now, delay);
      tset(k.fl, d === 0 ? 1 : 0, now, delay);
      const on = k.i === (a < 0 ? FAV : a);
      k.key.classList.toggle("sil", true); k.key.classList.toggle("hi", on); k.tag.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "key " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "keyhandover",
  means: "A key board of eight hooks: the key under the pointer swings out and its tag turns over, the keys beside it sway.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[259, 146], [175, 140], [200, 215], null],
  mount,
});
