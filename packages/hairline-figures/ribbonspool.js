/**
 * Ribbon rack: a rail on two posts over a base, with five ribbon spools on
 * it. The pointer picks a spool by where it is along the rail: its ribbon
 * unrolls down to the base and the other spools slide away along the rail,
 * staggered from it. At rest one spool is bright. The slider is the stagger.
 */
const { Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 5, STEP = 14, R = 9, W = 8, RAIL = 26, FAV = 2, SPREAD = 4, L0 = 3, L1 = 24;
const XL = -12, XR = (N - 1) * STEP + 12;

function circX(P, x, y, z, r) { const o = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; o.push(P(x, y + r * Math.cos(a), z + r * Math.sin(a))); } return o; }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[XL - 4, -12, 0], [XR + 4, 14, 0], [XL - 4, 14, 0], [XR + 4, -12, 0], [XL, 0, RAIL + R + 2], [XR, 0, RAIL + R + 2]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const base = solid(g);
  const [br, bi] = rings(XL - 4, -12, XR + 4, 14, 4, 1.2);
  put(base, prism(P, front, br, bi, 0, 4));
  const postL = solid(g);
  const [pr, pi] = rings(XL - 2, -2, XL + 2, 2, 1.5, 0.6);
  put(postL, prism(P, front, pr, pi, 4, RAIL + 2));
  mk("path", { class: "nf lo", d: open([P(XL, 0, RAIL), P(XR, 0, RAIL)]) }, g);

  const spools = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    spools.push({ k, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), tail: mk("path", { class: "sil" }, grp), dx: tween(0), len: tween(L0), last: "" });
  }
  const postR = solid(g);
  const [qr, qi] = rings(XR - 2, -2, XR + 2, 2, 1.5, 0.6);
  put(postR, prism(P, front, qr, qi, 4, RAIL + 2));

  function draw(s, dx, len) {
    const key = dx.toFixed(2) + "/" + len.toFixed(2);
    if (key === s.last) return;
    s.last = key;
    const x = s.k * STEP + dx, a = x - W / 2, b = x + W / 2;
    s.sil.setAttribute("d", poly(hull(circX(P, a, 0, RAIL, R).concat(circX(P, b, 0, RAIL, R)))));
    s.cr.setAttribute("d", poly(circX(P, b, 0, RAIL, R)) + poly(circX(P, b, 0, RAIL, 3.2)) + poly(circX(P, b, 0, RAIL, 1.2)));
    const w = W / 2 - 1, y = R, zt = RAIL, zb = RAIL - len;
    s.tail.setAttribute("d", poly([P(x - w, y, zt), P(x + w, y, zt), P(x + w, y + 0.2, zb), P(x, y + 0.2, zb + 2.5), P(x - w, y + 0.2, zb)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    spools.forEach((s) => { draw(s, tval(s.dx, now), tval(s.len, now)); if (!tdone(s.dx, now) || !tdone(s.len, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the spool whose rest centre is nearest the pointer's screen x
  const cx = spools.map((s) => P(s.k * STEP, 0, RAIL)[0]);
  const yTop = P(XL, 0, RAIL + R + 4)[1], yBot = P(XR, 14, 0)[1];
  function hit([sx, sy]) {
    if (sy < yTop - 30 || sy > yBot + 10 || sx < cx[0] - 30 || sx > cx[N - 1] + 30) return -1;
    let best = 0;
    cx.forEach((c, k) => { if (Math.abs(sx - c) < Math.abs(sx - cx[best])) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    spools.forEach((s, k) => {
      const dx = a < 0 || k === a ? 0 : Math.sign(k - a) * clamp(SPREAD + 2 - Math.abs(k - a), 2, SPREAD);
      const d = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(s.dx, dx, now, d);
      tset(s.len, k === a ? L1 : L0, now, d);
      s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "reel " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "ribbonspool",
  means: "A ribbon rack: the spool under the pointer unrolls its ribbon and the others slide away along the rail.",
  rules: [1, 2, 4, 5],
  range: [0, 40, 90],
  tour: [[120, 86], [202, 109], [284, 168], null],
  mount,
});
