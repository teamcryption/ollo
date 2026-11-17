/**
 * Devtank: a film developing tank, a tall drum with the reel's spiral just
 * inside its mouth, closed by a wide light-tight lid with a pouring funnel
 * on top. The pointer over the tank lifts the lid clear and swings it aside,
 * showing the reel. At rest the lid sits snug, its rim bright. The slider is
 * how far the lid lifts.
 *
 * The pattern: one part lifting off; the hit is the rest box.
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 22, TZ = 54, LR = 25, LH = 13, FR = 9;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.95);
  const ext = [[-R - 2, -R - 2, 0], [R + 2, R + 2, 0], [R + 2, -R - 2, 0], [-R - 2, R + 2, 0], [0, 0, TZ + LH + 9], [24, -24, TZ + 18 + LH + 8], [24 + LR, -24, TZ + 18], [24, -24 - LR, TZ + 18], [24 - 7, -24 - 7, TZ + 18 + LH + 8]];
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the drum, with a foot ring and the reel's spiral in its mouth
  put(solid(g), prism(P, front, disc(0, 0, R + 2), disc(0, 0, R + 0.8), 0, 4));
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 1.6), 4, TZ));
  const sp = [];
  for (let i = 0; i <= 160; i++) { const a = (i / 160) * Math.PI * 9, r = 4 + (i / 160) * (R - 7); sp.push(P(r * Math.cos(a), r * Math.sin(a), TZ - 1)); }
  mk("path", { class: "nf lo", d: open(sp) + poly(ringAt(P, disc(0, 0, 3.4, 16), TZ - 1)) }, g);
  const lidG = mk("g", {}, g);
  const lid = solid(lidG), fun = solid(lidG), cap = mk("path", { class: "nf lo" }, lidG);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const z = TZ - 6 + t * lift, x = t * 24, y = -t * 24;
    put(lid, prism(P, front, disc(x, y, LR), disc(x, y, LR - 2), z, z + LH));
    put(fun, prism(P, front, disc(x, y, FR), disc(x, y, FR - 1.4), z + LH, z + LH + 7));
    cap.setAttribute("d", poly(ringAt(P, disc(x, y, 4, 20), z + LH + 7)));
  }
  const tw = tween(0);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const pts = ext.slice(0, 5).map((p) => P(...p));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a > 0 ? 1 : 0, performance.now(), 0);
    lid.sil.classList.add("hi");
    read.textContent = a > 0 ? "lid off" : "rest";
    B.wake();
  }
  setActive(0);
  const hit = ([sx, sy]) => (sx > x0 - 10 && sx < x1 + 10 && sy > y0 - 10 && sy < y1 + 6 ? 1 : 0);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "devtank",
  means: "A film developing tank: with the pointer over it, the light-tight lid lifts clear and swings aside to show the reel.",
  rules: [1, 5, 6],
  range: [12, 20, 24],
  tour: [[174, 98], [174, 223], [196, 160], null],
  mount,
});
