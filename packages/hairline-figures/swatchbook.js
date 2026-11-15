/**
 * Swatch book: a fan deck of fabric swatches riveted at one corner. The
 * pointer opens the fan: every swatch swings round the rivet to its own
 * place, staggered from the one under the pointer, which slides out a
 * little and is bright. At rest the deck is nearly shut, one swatch turned
 * out, bright. The slider is the stagger.
 *
 * The pattern: a swing about one pivot; the hit is on the floor's plane,
 * read against the open fan's target angles, which never move.
 */
const {
  Cam, fit, facing, proj, prism, rrect, seg, unproj, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const N = 6, L = 74, W = 20, T = 1.8, FAV = 3;
const SH = [-8, 8, 26, 56, 76, 98], OPEN = (k) => rad(-24 + k * 26), SHUT = (k) => rad(SH[k]);
const turn = (ring, a, s) => {
  const c = Math.cos(a), n = Math.sin(a);
  return ring.map((q) => ({ u: (q.u + s) * c - q.v * n, v: (q.u + s) * n + q.v * c, nu: q.nu * c - q.nv * n, nv: q.nu * n + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  const ext = [[0, 0, 0]];
  for (let d = -34; d <= 116; d += 8) ext.push([(L + 12) * Math.cos(rad(d)), (L + 12) * Math.sin(rad(d)), N * T]);
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const RING = rrect(-9, -W / 2, L, W / 2, 4, 4), INNER = rrect(-7.6, -W / 2 + 1.4, L - 1.4, W / 2 - 1.4, 2.6, 4);
  const items = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g), band = mk("path", { class: "nf lo" }, s.g);
    items.push({ k, s, band, a: tween(SHUT(k)), o: tween(0), z: k * T * 1.15, last: "" });
  }
  place(flatDot(g, C, 2, "dot m"), P(0, 0, N * T * 1.15 + 0.2));

  function draw(it, a, o) {
    const key = a.toFixed(4) + o.toFixed(3);
    if (key === it.last) return;
    it.last = key;
    put(it.s, prism(P, front, turn(RING, a, o), turn(INNER, a, o), it.z, it.z + T));
    const c = Math.cos(a), n = Math.sin(a), u = L - 24 + o, z = it.z + T;
    it.band.setAttribute("d", seg(P(u * c + (W / 2 - 1.4) * n, u * n - (W / 2 - 1.4) * c, z), P(u * c - (W / 2 - 1.4) * n, u * n + (W / 2 - 1.4) * c, z)));
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const it of items) { draw(it, tval(it.a, now), tval(it.o, now)); if (!tdone(it.a, now) || !tdone(it.o, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0), r = Math.hypot(x, y);
    if (r < 6 || r > L + 16) return -1;
    const t = Math.atan2(y, x);
    let best = -1, bd = rad(24);
    for (let k = 0; k < N; k++) { const d = Math.abs(t - OPEN(k)); if (d < bd) { bd = d; best = k; } }
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    for (const it of items) {
      const dl = from < 0 ? 0 : Math.abs(it.k - from) * stag;
      tset(it.a, a < 0 ? SHUT(it.k) : OPEN(it.k), now, dl);
      tset(it.o, a === it.k ? 12 : 0, now, dl);
      it.s.sil.classList.toggle("hi", it.k === (a < 0 ? FAV : a));
    }
    read.textContent = a < 0 ? "rest" : "swatch " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "swatchbook",
  means: "A fan deck of fabric swatches: the pointer swings the fan open round its rivet, and the swatch under it slides out bright.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[160, 152], [300, 160], [90, 165], null],
  mount,
});
