/**
 * Rope maker: a hand-cranked wheel on a post, three hooks on its face and
 * three strands running from the hooks to a traveller post, where they meet
 * as one rope. The pointer cranks the wheel: sliding along the bench turns
 * it, and the strands twist round each other as the hooks go round. At rest
 * the crank handle is bright. The slider is how many turns the bench holds.
 *
 * The pattern: one part turning to follow the pointer (spring).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CY = 20, CZ = 52, R = 32, WX0 = 24, WX1 = 30, HK = 9, FX = 108, REST = 0.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let turns = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[-2, -14, 0], [124, -14, 0], [124, 54, 0], [-2, 54, 0], [WX0, CY - R, CZ + R], [WX0, CY + R, CZ + R], [FX + 10, 20, 64]], 200, 166);
  const P = proj(C), front = facing(C);
  const disc = (x, r, n = 40, a0 = 0) => {
    const o = [];
    for (let i = 0; i < n; i++) { const a = a0 + (i / n) * Math.PI * 2; o.push(P(x, CY + r * Math.cos(a), CZ + r * Math.sin(a))); }
    return o;
  };
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-2, -14, 124, 54, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  const [pr, pi] = rings(13, 14, 22, 26, 3, 1.2);
  put(solid(g), prism(P, front, pr, pi, 5, CZ + 4));

  // the wheel: a rim in the y-z plane, its inner edge and six spokes
  const wheel = solid(g);
  wheel.sil.setAttribute("d", poly(hull(disc(WX0, R).concat(disc(WX1, R)))));
  wheel.cr.setAttribute("d", poly(disc(WX1, R - 4)));
  const spokes = mk("path", { class: "nf" }, g);
  const hub = solid(g);
  hub.sil.setAttribute("d", poly(hull(disc(WX1, 6, 24).concat(disc(WX1 + 3, 6, 24)))));
  const hooks = mk("path", { class: "nf" }, g);
  const strands = mk("path", { class: "nf" }, g);
  const crank = solid(g), crankArm = mk("path", { class: "nf" }, g);
  const [tr, ti] = rings(FX, 12, FX + 10, 28, 3, 1.2);
  put(solid(g), prism(P, front, tr, ti, 5, 64));
  const rope = mk("path", { class: "nf" }, g);
  rope.setAttribute("d", open([P(FX, CY, CZ), P(FX + 0.5, CY, CZ)]));

  const ang = spring(REST);
  let last = NaN;
  function draw(th) {
    if (th === last) return;
    last = th;
    let d = "";
    for (let k = 0; k < 6; k++) {
      const a = th + (k * Math.PI) / 3, c = Math.cos(a), s = Math.sin(a);
      d += seg(P(WX1, CY + 6 * c, CZ + 6 * s), P(WX1, CY + (R - 4) * c, CZ + (R - 4) * s));
    }
    spokes.setAttribute("d", d);
    let hd = "", sd = "";
    for (let k = 0; k < 3; k++) {
      const a0 = th * 2 + (k * Math.PI * 2) / 3, hx = WX1 + 3;
      const hy = CY + HK * Math.cos(a0), hz = CZ + HK * Math.sin(a0);
      hd += open([P(hx, hy, hz), P(hx + 5, hy, hz), P(hx + 5, hy, hz + 2.5)]);
      const pts = [];
      for (let i = 0; i <= 48; i++) {
        const t = i / 48, x = hx + 5 + t * (FX - hx - 5), r = HK * (1 - t) ** 0.8, a = a0 + t * 5 * Math.PI - th * 2 * t;
        pts.push(P(x, CY + r * Math.cos(a), CZ + r * Math.sin(a)));
      }
      sd += open(pts);
    }
    hooks.setAttribute("d", hd);
    strands.setAttribute("d", sd);
    const ca = th + Math.PI / 6, cy = CY + (R - 6) * Math.cos(ca), cz = CZ + (R - 6) * Math.sin(ca);
    crankArm.setAttribute("d", open([P(WX1 + 3, CY, CZ), P(WX1 + 3, cy, cz)]));
    const pin = (x) => { const o = []; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; o.push(P(x, cy + 3 * Math.cos(a), cz + 3 * Math.sin(a))); } return o; };
    crank.sil.setAttribute("d", poly(hull(pin(WX1 + 3).concat(pin(WX1 + 18)))));
    crank.cr.setAttribute("d", poly(pin(WX1 + 18)));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let act = null;
  function setAt(p) {
    let wx = null;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x > -20 && x < 140 && y > -40 && y < 80) wx = Math.max(0, Math.min(120, x));
    }
    act = wx;
    ang.t = wx === null ? REST : REST + (wx / 120) * turns * Math.PI * 2;
    crank.sil.classList.toggle("hi", true);
    wheel.sil.classList.toggle("hi", wx !== null);
    read.textContent = wx === null ? "rest" : Math.round((wx / 120) * turns * 360) + "°";
    B.wake();
  }
  setAt(null);
  bag.add(pointer(stage, { move: (p) => setAt(p), leave: () => setAt(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { turns = v; if (act !== null) { ang.t = REST + (act / 120) * turns * Math.PI * 2; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "ropemaker",
  means: "A hand-cranked rope maker: sliding along the bench turns the wheel, and the three strands twist into rope.",
  rules: [1, 3, 5, 8],
  range: [0.25, 0.75, 1.5],
  tour: [[165, 170], [199, 219], [235, 262], null],
  mount,
});
