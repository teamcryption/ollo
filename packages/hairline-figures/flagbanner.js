/**
 * Bunting: a string of pennants slung between two posts. The pointer picks a
 * pennant by where it stands: it swings out on the string toward the viewer,
 * and the pennants beside it swing a little, staggered from it. At rest the
 * pennants hang at uneven angles, one bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, fillet, poly, open, prism, proj, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, L = 210, H = 84, SAG = 16, W = 22, D = 34, FAV = 3;
const REST = [14, 26, 8, 30, 12, 24, 6];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const sz = (x) => { const t = x / L; return H - SAG * 4 * t * (1 - t); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[-10, -10, 0], [L + 10, 10, 0], [L / 2, D, H - SAG - 10], [0, 0, H + 6], [L, 0, H + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  function post(x) {
    const grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, 0, 9), disc(x, 0, 7), 0, 3));
    put(solid(grp), prism(P, front, disc(x, 0, 2.6, 16), disc(x, 0, 1.6, 16), 3, H + 4));
    return grp;
  }
  post(0);
  const sp = [];
  for (let i = 0; i <= 40; i++) { const x = (i / 40) * L; sp.push(P(x, 0, sz(x))); }
  mk("path", { d: open(sp), class: "nf" }, g);

  const gap = (L - N * W) / (N + 1), items = [];
  for (let k = 0; k < N; k++) {
    const xa = gap + k * (W + gap), xb = xa + W, path = mk("path", { class: "sil" }, g);
    items.push({ k, xa, xb, path, th: tween(REST[k]), last: NaN, mid: P((xa + xb) / 2, 0, sz(xa + W / 2) - D / 2)[0] });
  }
  post(L);

  function draw(it, th) {
    if (th === it.last) return;
    it.last = th;
    const a = rad(th), xm = (it.xa + it.xb) / 2, zm = (sz(it.xa) + sz(it.xb)) / 2;
    const pts = [P(it.xa, 0, sz(it.xa)), P(it.xb, 0, sz(it.xb)), P(xm, D * Math.sin(a), zm - D * Math.cos(a))];
    it.path.setAttribute("d", poly(fillet(pts, [1.2, 1.2, 1.6])));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.th, now)); if (!tdone(it.th, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const top = P(L / 2, 0, H)[1];
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const dd = Math.abs(it.mid - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && sy > top - 60 && sy < top + 120 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), th = a < 0 ? REST[k] : dd === 0 ? 78 : dd === 1 ? 46 : dd === 2 ? 30 : REST[k];
      tset(it.th, th, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.path.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "flag " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "flagbanner",
  means: "A string of pennants between two posts: the pennant under the pointer swings out on the string, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[110, 83], [200, 141], [290, 173], null],
  mount,
});
