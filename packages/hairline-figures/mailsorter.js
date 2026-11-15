/**
 * Mail sorter: a pigeonhole cabinet, four columns by three rows, a letter in
 * every hole. The pointer picks a hole by its rest position on the face: that
 * letter slides far out, the others ease out after it, staggered by distance.
 * At rest the letters sit at uneven depths, one bright. The slider is the stagger.
 */
const { Cam, fit, hull, poly, proj, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const NC = 4, NR = 3, CW = 11, RH = 10, D = 16, X1 = NC * CW, Z1 = NR * RH + 2, OUT = 15;
const REST = [3, 1, 5, 2, 1, 4, 2, 6, 4, 2, 3, 1], FAV = 7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.9);
  fit(C, [[0, 0, 0], [X1, D + OUT + 2, 0], [0, D + OUT, Z1], [X1, 0, Z1 + 4]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const bx = (x0, y0, z0, x1, y1, z1) => { const c = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) c.push(P(x, y, z)); return poly(hull(c)); };
  const cab = solid(g);
  let c = seg(P(X1, D, Z1), P(0, D, Z1)) + seg(P(X1, D, Z1), P(X1, 0, Z1)) + seg(P(X1, D, Z1), P(X1, D, 0));
  for (let i = 1; i < NC; i++) c += seg(P(i * CW, D, 1), P(i * CW, D, Z1 - 1));
  for (let r = 0; r <= NR; r++) c += seg(P(1, D, 1 + r * RH), P(X1 - 1, D, 1 + r * RH));
  c += seg(P(1, D, 1), P(1, D, Z1 - 1)) + seg(P(X1 - 1, D, 1), P(X1 - 1, D, Z1 - 1));
  put(cab, { sil: bx(0, 0, 0, X1, D, Z1), crease: c });
  const L = [];
  for (let r = 0; r < NR; r++) for (let k = 0; k < NC; k++) {
    const i = r * NC + k;
    L.push({ i, r, k, s: solid(g), y: tween(REST[i]), last: NaN, at: P(k * CW + CW / 2, D, 1 + r * RH + 3) });
  }
  function draw(l, o) {
    if (o === l.last) return;
    l.last = o;
    const x0 = l.k * CW + 2, x1 = x0 + CW - 4, z0 = 1 + l.r * RH + 1, z1 = z0 + 2.2, y1 = D + o, xm = (x0 + x1) / 2;
    l.s.sil.setAttribute("d", bx(x0, D - 0.2, z0, x1, y1, z1));
    l.s.cr.setAttribute("d", seg(P(x1, y1, z1), P(x0, y1, z1)) + seg(P(x1, y1, z1), P(x1, D, z1)) + seg(P(x0 + 1, y1 - 3, z1), P(xm, y1 - 1.2, z1)) + seg(P(xm, y1 - 1.2, z1), P(x1 - 1, y1 - 3, z1)));
  }
  const B = register(stage, (_dt, now) => { let m = false; L.forEach((l) => { draw(l, tval(l.y, now)); if (!tdone(l.y, now)) m = true; }); return m; });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    let best = -1, bd = 22 * 22;
    L.forEach((l) => { const d = (l.at[0] - sx) ** 2 + (l.at[1] - sy) ** 2; if (d < bd) { bd = d; best = l.i; } });
    return best;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const fr = from >= 0 ? L[from] : null;
    L.forEach((l) => {
      const dist = fr ? Math.abs(l.k - fr.k) + Math.abs(l.r - fr.r) : 0;
      const o = a < 0 ? REST[l.i] : l.i === a ? OUT : Math.max(2, 9 - dist * 2.2);
      tset(l.y, o, now, fr ? dist * stag : 0);
      l.s.sil.classList.toggle("hi", l.i === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "box " + String.fromCharCode(65 + L[a].r) + (L[a].k + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "mailsorter",
  means: "A pigeonhole mail sorter: the letter in the hole under the pointer slides far out, the rest ease out after it.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[203, 124], [182, 140], [218, 243], null],
  mount,
});
