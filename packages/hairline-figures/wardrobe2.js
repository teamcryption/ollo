/**
 * Sliding wardrobe: a tall carcass with two doors on two tracks. The pointer
 * picks a bay by where it stands, and the door covering that bay slides
 * across to open it, showing shelves or a hanging rail. At rest the front
 * door stands part-open, bright. The slider is the slide's reach.
 *
 * The pattern: one of two in a row, a sliding answer.
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 120, D = 40, H = 112, HW = W / 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-2, -2, 0], [W + 2, D + 8, 0], [W + 2, -2, H + 2], [-2, D + 8, H + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, W, D, 3, 1.6);
  put(solid(g), prism(P, front, cr, ci, 0, H));

  // the inside, on the front plane: shelves in the left bay, a rail and hangers in the right
  const F = (x, z) => P(x, D, z);
  let inner = "";
  inner += seg(F(4, 6), F(W - 4, 6)) + seg(F(HW, 6), F(HW, H - 4));
  for (const z of [30, 54, 78]) inner += seg(F(6, z), F(HW - 3, z));
  inner += seg(F(HW + 4, 90), F(W - 6, 90));
  for (const x of [HW + 14, HW + 26, HW + 38, HW + 50]) inner += seg(F(x, 90), F(x - 8, 80)) + seg(F(x, 90), F(x + 8, 80)) + seg(F(x - 8, 80), F(x - 8, 46)) + seg(F(x + 8, 80), F(x + 8, 46)) + seg(F(x - 8, 46), F(x + 8, 46));
  mk("path", { d: inner, class: "nf lo" }, g);

  function door(y0, x0) {
    const s = solid(mk("g", {}, g));
    const pull = mk("path", { class: "nf lo" }, s.g);
    return { s, pull, y0, x: tween(x0), last: NaN };
  }
  const back = door(D + 0.6, 0), fr = door(D + 3.6, HW - 14);
  const doors = [back, fr];

  function draw(d, x) {
    if (x === d.last) return;
    d.last = x;
    const [r, i] = rings(x + 0.6, d.y0, x + HW - 0.6, d.y0 + 2.4, 0.8, 0.4);
    put(d.s, prism(P, front, r, i, 3, H - 2));
    const px = d === back ? x + HW - 6 : x + 6;
    d.pull.setAttribute("d", seg(P(px, d.y0 + 2.4, 46), P(px, d.y0 + 2.4, 70)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const d of doors) { draw(d, tval(d.x, now)); if (!tdone(d.x, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = [F(HW / 2, H / 2), F(HW * 1.5, H / 2)];
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 50 && Math.abs(mids[best][1] - sy) < 110 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    const k = reach / 100;
    tset(back.x, a === 0 ? HW * k : 0, now, 0);
    tset(fr.x, a < 0 ? HW - 14 : a === 1 ? HW - HW * k : HW, now, a === 0 ? 0 : 0);
    back.s.sil.classList.toggle("hi", a === 0);
    fr.s.sil.classList.toggle("hi", a !== 0);
    read.textContent = a < 0 ? "rest" : a === 0 ? "bay 1" : "bay 2";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; const a = act; act = -2; setActive(a); }, destroy: bag.dispose };
}

hairline({
  name: "wardrobe2",
  means: "A wardrobe with two sliding doors: the door over the bay under the pointer slides across to open it, showing shelves or a rail.",
  rules: [1, 4, 5, 6],
  range: [50, 100, 100],
  tour: [[146, 146], [215, 180], [226, 61], null],
  mount,
});
