/**
 * Flip book: a small pad of pages on its back cover, bound along one edge.
 * The pointer across the pad thumbs pages over the spine, more the nearer it
 * stands to the spine, staggered from the page it touched. At rest the top
 * pages curl up a little and the top one is bright. The slider is the stagger.
 */
const { Cam, fit, fillet, poly, prism, proj, rings, unproj, clamp, rad, tween, tset, tval, tdone, mk, pointer, put, register, solid, disposer, facing } = HL;

const W = 56, D = 40, N = 9, T = 1.6, Z0 = 3;
const REST = [16, 9, 4];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[-W, 0, 0], [W, D, 0], [W, 0, 0], [-W, D, 0], [0, 0, W + 4], [0, D, W + 4]], 180, 155);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-1, -2, W + 2, D + 2, 3, 1.2);
  put(solid(g), prism(P, front, cr, ci, 0, Z0));
  const pg = mk("g", {}, g);
  const pages = [];
  for (let j = 0; j < N; j++) {
    const el = mk("path", { class: j === 0 ? "sil hi" : "" }, pg);
    pages.push({ j, el, a: tween(REST[j] || 0), z: Z0 + (N - 1 - j) * T, last: NaN, flip: false });
  }

  function draw(p, a) {
    if (a === p.last) return;
    p.last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), z = p.z + T * 0.5;
    const q = [P(0, 0, z), P(W * c, 0, z + W * s), P(W * c, D, z + W * s), P(0, D, z)];
    p.el.setAttribute("d", poly(fillet(q, [0.5, 3, 3, 0.5])));
  }
  let order = "";
  function sortPages(now) {
    const ks = pages.map((p) => ({ p, k: tval(p.a, now) > 90 ? p.j : 100 + N - p.j })).sort((x, y) => x.k - y.k);
    const o = ks.map((x) => x.p.j).join();
    if (o !== order) { order = o; ks.forEach((x) => pg.appendChild(x.p.el)); }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of pages) { draw(p, tval(p.a, now)); if (!tdone(p.a, now)) moving = true; }
    sortPages(now);
    return moving;
  });
  bag.add(B.unregister);

  let act = -2;
  function setK(k) {
    if (k === act) return;
    const now = performance.now(), from = act;
    act = k;
    pages.forEach((p) => {
      const a = k < 0 ? (REST[p.j] || 0) : p.j < k ? 172 - p.j * 1.5 : p.j === k ? 24 : 0;
      tset(p.a, a, now, Math.abs(p.j - Math.max(k, 0)) * stag);
      p.el.classList.toggle("sil", p.j === (k < 0 ? 0 : k));
      p.el.classList.toggle("hi", p.j === (k < 0 ? 0 : k));
    });
    read.textContent = k < 0 ? "rest" : "p " + (k + 1);
    B.wake();
  }
  setK(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [wx, wy] = unproj(C, sx, sy, Z0 + N * T);
      if (wx < -6 || wx > W + 6 || wy < -10 || wy > D + 10) return setK(-1);
      setK(1 + Math.round(clamp((W - wx) / W, 0, 1) * (N - 3)));
    },
    leave: () => setK(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "flipbook",
  means: "A flip book on its cover: the pointer thumbs pages over the spine, more the nearer it is to the spine, one after another.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[191, 165], [241, 190], [290, 214], null],
  mount,
});
