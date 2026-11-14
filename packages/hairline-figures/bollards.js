/**
 * Bollards: a row of five retractable steel posts set in a kerb slab, each
 * in its own ground sleeve with a band near its crown. The pointer picks a
 * post by where it is along the row: that post sinks into its sleeve, the
 * others rise to full height, staggered from it. At rest one post stands
 * half sunk, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is the nearest post's
 * rest centre by screen x.
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 16, R = 4, FULL = 26, LOW = 3;
const REST = [19, 16, 9, 21, 17], FAV = 2, XE = (N - 1) * STEP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-12, -12, -3], [XE + 12, 12, -3], [XE + 12, -12, -3], [-12, 12, -3], [0, 0, FULL], [XE, 0, FULL]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the kerb slab, a thin plate, and each post's sleeve on it
  const slab = solid(g);
  put(slab, prism(P, front, ...rings(-12, -12, XE + 12, 12, 6, 1.4), -3, 0));
  let sleeves = "";
  for (let k = 0; k < N; k++) sleeves += poly(ringAt(P, rings(k * STEP - R - 1.8, -R - 1.8, k * STEP + R + 1.8, R + 1.8, R + 1.8, 0.5)[0], 0));
  mk("path", { class: "nf lo", d: sleeves }, slab.g);

  const posts = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g);
    posts.push({ x: k * STEP, s, band: mk("path", { class: "nf lo" }, s.g), z: tween(REST[k]), last: NaN });
  }
  function draw(p, h) {
    if (h === p.last) return;
    p.last = h;
    const [ring, inner] = rings(p.x - R, -R, p.x + R, R, R, 0.9);
    put(p.s, prism(P, front, ring, inner, 0, h));
    p.band.setAttribute("d", h > 7 ? open(ringAt(P, run(ring, front), h - 5)) : "");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    posts.forEach((p) => { draw(p, tval(p.z, now)); if (!tdone(p.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest post by its rest centre's screen x, within the row's band
  const cx = posts.map((p) => P(p.x, 0, 0)[0]);
  const top = P(0, 0, FULL)[1] - 10, bot = P(XE, 0, 0)[1] + 16;
  function hit([sx, sy]) {
    if (sy < top || sy > bot || sx < cx[0] - 20 || sx > cx[N - 1] + 20) return -1;
    let best = 0;
    cx.forEach((c, k) => { if (Math.abs(sx - c) < Math.abs(sx - cx[best])) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    posts.forEach((p, k) => {
      tset(p.z, a < 0 ? REST[k] : k === a ? LOW : FULL, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      p.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "post " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bollards",
  means: "A row of retractable bollards: the post under the pointer sinks into its sleeve, the others rise to full height after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[125, 113], [200, 151], [275, 188], null],
  mount,
});
