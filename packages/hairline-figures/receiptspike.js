/**
 * Receipt spike: a weighted base with a steel spike, five paper slips
 * pierced on it at loose angles. The pointer picks a slip by where it lies:
 * it rides up the spike and turns square, and the slips beside it rise a
 * little, staggered from it. At rest one slip sits proud, bright. The slider
 * is the stagger.
 *
 * The pattern: stepped parts, picked on their own rest tops.
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rrect, rings, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, GAP = 9, Z0 = 10, LIFT = 6, FAV = 2, TIP = Z0 + N * GAP + 10;
const ANG = [-10, 28, -24, 52, 12], OFF = [4, -3, 2, -5, 3];
const disc = (r, n = 32) => circ(r, n);
function slip(th, off) {
  const c = Math.cos(th), s = Math.sin(th);
  return rrect(-17 + off, -11, 17 + off, 11, 1.5, 4).map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.5);
  fit(C, [[-24, -24, 0], [24, 24, 0], [24, -24, 0], [-24, 24, 0], [-20, -20, TIP], [20, 20, TIP], [0, 0, TIP + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(20, 40), disc(18.5, 40), 0, 5));
  const foot = solid(g);
  const rest = (k) => (k === FAV ? 3 : 0);
  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), paper = mk("path", { class: "sil" }, grp), edge = mk("path", { class: "nf lo" }, grp), post = solid(grp);
    items.push({ k, paper, edge, post, z: tween(rest(k)), th: tween(ANG[k]), last: NaN, lt: NaN });
  }
  const zAt = (k, now) => Z0 + k * GAP + tval(items[k].z, now);

  function draw(now) {
    put(foot, prism(P, front, disc(1.1, 12), disc(0.6, 12), 5, zAt(0, now)));
    items.forEach((it, k) => {
      const z = zAt(k, now), th = tval(it.th, now);
      if (z !== it.last || th !== it.lt) {
        it.last = z; it.lt = th;
        const ring = slip((th * Math.PI) / 180, OFF[k]);
        it.paper.setAttribute("d", poly(ringAt(P, ring, z)));
        it.edge.setAttribute("d", poly(ringAt(P, ring, z - 0.6)));
      }
      const top = k < N - 1 ? zAt(k + 1, now) : TIP;
      put(it.post, prism(P, front, disc(1.1, 12), disc(0.6, 12), z, top));
    });
  }

  const L = register(stage, (_dt, now) => {
    draw(now);
    return items.some((it) => !tdone(it.z, now) || !tdone(it.th, now));
  });
  bag.add(L.unregister);
  items.forEach((it) => it.edge.parentNode.insertBefore(it.edge, it.paper));

  function hit([sx, sy]) {
    for (let k = N - 1; k >= 0; k--) {
      const [x, y] = unproj(C, sx, sy, Z0 + k * GAP);
      if (Math.hypot(x, y) < 17) return k;
    }
    return -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(it.z, a < 0 ? rest(k) : dd === 0 ? LIFT : dd === 1 ? 2 : 0, now, d);
      tset(it.th, a === k ? 0 : ANG[k], now, d);
      it.paper.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "slip " + (a + 1);
    L.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "receiptspike",
  means: "Paper slips pierced on a spike: the slip under the pointer rides up and turns square, and its neighbours lift after it.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[155, 217], [200, 162], [240, 125], null],
  mount,
});
