/**
 * Flip chart: a pad of pages clamped to the top of an easel board, a marker
 * ledge across its foot. The pointer picks a page by where it is across the
 * board: the pages before it flip up over the clamp, staggered from it, and
 * the chosen page hangs bright. At rest the top page is lifted a little off
 * the pad, bright. The slider is the stagger.
 *
 * The pattern: which-of-many by fixed screen bands across the rest board;
 * paint order follows each page's depth.
 */
const {
  Cam, clamp, facing, fillet, fit, poly, prism, proj, rad, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 60, Z0 = 24, Z1 = 84, L = 54, REST = [28, 4, 0, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-2, -20, 0], [W + 2, 6, 0], [W + 2, -20, 0], [-2, 6, 0], [0, -12, Z1 + L], [W, -12, Z1 + L], [W, L * 0.7, Z1]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r, b, parent) => { const [a, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent || g); put(s, prism(P, front, a, i, z0, z1)); return s; };

  // the stand: a back leg, the board, then the pages, the ledge and the front legs
  box(W / 2 - 1.5, -20, W / 2 + 1.5, -17, 0, Z1 - 8, 1.2, 0.5);
  box(-1, -2, W + 1, 0, Z0 - 4, Z1 + 1, 0.9, 0.4);
  const pg = mk("g", {}, g);
  box(-3, 0, W + 3, 7, Z0 - 4, Z0 - 1, 1.5, 0.6);
  box(3, 1, 6, 4, 0, Z0 - 4, 1.2, 0.5);
  box(W - 6, 1, W - 3, 4, 0, Z0 - 4, 1.2, 0.5);
  box(-2, -1, W + 2, 4.5, Z1, Z1 + 3, 1.5, 0.6);

  const pages = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, pg);
    pages.push({ k, py: 0.6 + (N - 1 - k) * 0.7, grp, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), a: tween(REST[k]), last: NaN, my: 0 });
  }
  const corners = fillet([[1, 0], [W - 1, 0], [W - 1, L], [1, L]], [0.1, 0.1, 3, 3], 4);
  const lines = [[8, 12, 34], [8, 20, 48], [8, 28, 26]];

  function draw(p, a) {
    if (a === p.last) return false;
    p.last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const at = (u, d) => P(u, p.py + d * s, Z1 - d * c);
    p.sil.setAttribute("d", poly(corners.map(([u, d]) => at(u, d))));
    p.cr.setAttribute("d", lines.map(([u, d, w]) => "M" + at(u, d).join(",") + "L" + at(u + w, d).join(",")).join(""));
    p.my = p.py + (L / 2) * s;
    return true;
  }

  const B = register(stage, (_dt, now) => {
    let moving = false, changed = false;
    pages.forEach((p) => { if (draw(p, tval(p.a, now))) changed = true; if (!tdone(p.a, now)) moving = true; });
    if (changed) pages.slice().sort((a, b) => a.my - b.my).forEach((p) => pg.appendChild(p.grp));
    return moving;
  });
  bag.add(B.unregister);

  // the hit: bands across the board at rest, fixed in screen space
  const xl = P(0, 0, (Z0 + Z1) / 2)[0], xr = P(W, 0, (Z0 + Z1) / 2)[0];
  const top = P(0, 0, Z1 + 4)[1], bot = P(W, 0, Z0 - 4)[1];
  function hit([sx, sy]) {
    if (sx < xl - 4 || sx > xr + 4 || sy < top - 6 || sy > bot + 6) return -1;
    return clamp(Math.floor(((sx - xl) / (xr - xl)) * N), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    pages.forEach((p, k) => {
      const t = a < 0 ? REST[k] : k < a ? 168 - 5 * k : k === a ? 6 : 0;
      tset(p.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      p.sil.classList.toggle("hi", k === (a < 0 ? 0 : a));
    });
    read.textContent = a < 0 ? "rest" : "page " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "easelboard",
  means: "A flip chart on an easel: point across the board and the pages before that one flip up over the clamp, one after another.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[151, 180], [197, 203], [219, 214], null],
  mount,
});
