/**
 * Rowing boats: three boats moored side by side along a dock. The pointer
 * picks a boat by where it stands: it slides out from the dock onto the
 * lake, and the boats beside it drift a little, staggered from it. At rest
 * one boat is already out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, BL = 64, BW = 18, GAP = 26, OUT = 34, FAV = 1, HZ = 9, S = 1.75;
const Y = (k) => 4 + k * GAP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[-26, -4, 0], [-26, Y(N - 1) + BW + 4, 0], [BL + OUT + 4, -4, 0], [BL + OUT + 4, Y(N - 1) + BW + 4, HZ]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let wd = "";
  for (const [x, y] of [[BL + 20, -6], [BL + 52, 30], [BL + 30, Y(N - 1) + BW + 8]]) wd += seg(P(x, y, 0), P(x + 18, y, 0));
  mk("path", { d: wd, class: "nf dash" }, g);
  const [dr, di] = rings(-26, -4, -6, Y(N - 1) + BW + 4, 2, 1);
  put(solid(g), prism(P, front, dr, di, 0, 6));
  let pd = "";
  for (let i = 1; i < 6; i++) { const y = -4 + (i * (Y(N - 1) + BW + 8)) / 6; pd += seg(P(-25, y, 6), P(-7, y, 6)); }
  mk("path", { d: pd, class: "nf lo" }, g);

  const boats = [];
  for (let k = 0; k < N; k++) boats.push({ k, y: Y(k), s: solid(mk("g", {}, g)), z: tween(k === FAV ? OUT * 0.7 : 0), last: NaN });
  boats.forEach((b) => { b.seat = mk("path", { class: "nf lo" }, b.s.g); });

  function draw(b, dx) {
    if (dx === b.last) return;
    b.last = dx;
    const x0 = dx, y0 = b.y;
    const foot = rrect(x0 + 8, y0 + 4, x0 + BL - 8, y0 + BW - 4, 5, 6);
    const top = rrect(x0, y0, x0 + BL, y0 + BW, BW / 2, 6), inner = rrect(x0 + 1.6, y0 + 1.6, x0 + BL - 1.6, y0 + BW - 1.6, BW / 2 - 1.6, 6);
    b.s.sil.setAttribute("d", poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, HZ)))));
    b.s.cr.setAttribute("d", open(ringAt(P, run(inner, front), HZ)));
    let d = "";
    for (const f of [0.35, 0.62]) d += seg(P(x0 + BL * f, y0 + 1.6, HZ - 1), P(x0 + BL * f, y0 + BW - 1.6, HZ - 1));
    b.seat.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of boats) { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    boats.forEach((b, k) => {
      const [ux, uy] = HL.unproj(C, sx, sy, HZ);
      const dd = Math.abs(uy - (b.y + BW / 2));
      if (ux > -30 && ux < BL + OUT + 6 && dd < bd) { bd = dd; best = k; }
    });
    return bd < GAP / 2 + 4 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    boats.forEach((b, k) => {
      const dd = Math.abs(k - a), x = a < 0 ? (k === FAV ? OUT * 0.7 : 0) : dd === 0 ? OUT : dd === 1 ? 6 : 0;
      tset(b.z, x, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "boat " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "rowboats",
  means: "Three rowing boats moored at a dock: the boat under the pointer slides out onto the lake, the boats beside it drift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[222, 143], [190, 159], [158, 175], null],
  mount,
});
