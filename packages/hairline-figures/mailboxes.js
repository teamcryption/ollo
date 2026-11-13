/**
 * Mailboxes: four round-topped mailboxes on posts along a kerb, each with a
 * door on its street end and a flag on its side. The pointer picks a mailbox
 * by where it stands: its door drops open and its flag swings up, and the
 * flags beside it lift a little, staggered from it. At rest one flag is up,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, BW = 14, BL = 30, BH = 10, POST = 34, FAV = 2;
const X1 = (N - 1) * STEP + BW;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-8, -8, 0], [X1 + 8, BL + 22, 0], [X1 + 8, -8, 0], [-8, BL + 22, 0], [0, 0, POST + BH + BW / 2 + 16], [X1, 0, POST + BH + BW / 2 + 16]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [kr, ki] = rings(-8, -8, X1 + 8, BL + 6, 4, 1.4);
  put(solid(g), prism(P, front, kr, ki, 0, 3));

  const boxes = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, xc = x0 + BW / 2;
    const [pr, pi] = rings(xc - 2, BL / 2 - 2, xc + 2, BL / 2 + 2, 1, 0.4);
    put(solid(g), prism(P, front, pr, pi, 3, POST));
    // the box: a round-topped tube along y, as the hull of its two end profiles
    const prof = (y) => {
      const pts = [P(x0, y, POST), P(x0 + BW, y, POST)];
      for (let i = 0; i <= 10; i++) { const t = (Math.PI * i) / 10; pts.push(P(xc + (BW / 2) * Math.cos(t), y, POST + BH + (BW / 2) * Math.sin(t))); }
      return pts;
    };
    const body = mk("path", { d: poly(hull(prof(0).concat(prof(BL)))), class: "sil" }, g);
    const mouth = mk("path", { d: poly(prof(BL)), class: "nf lo" }, g);
    const door = mk("path", { class: "sil" }, g), flag = mk("path", { class: "sil" }, g), pin = mk("path", { class: "nf" }, g);
    boxes.push({ k, x0, xc, body, mouth, door, flag, pin, a: tween(k === FAV ? 1 : 0), last: NaN });
  }

  function draw(b, t) {
    if (t === b.last) return;
    b.last = t;
    // the door hinges at the bottom of the street end and drops toward the reader
    const da = rad(78 * t), ca = Math.cos(da), sa = Math.sin(da), y = BL;
    const dp = (x, h) => P(x, y + h * sa, POST + h * ca);
    const pts = [dp(b.x0, 0), dp(b.x0 + BW, 0)];
    for (let i = 0; i <= 10; i++) { const th = (Math.PI * i) / 10; const hz = BH + (BW / 2) * Math.sin(th); pts.push(P(b.xc + (BW / 2) * Math.cos(th), y + hz * sa, POST + hz * ca)); }
    b.door.setAttribute("d", poly(hull(pts)));
    // the flag on the +x side, pivoting near the back: down along the box at rest, up when raised
    const fa = rad(90 * t), px = b.x0 + BW + 0.6, py = 6, pz = POST + BH * 0.6;
    const fl = (u, v) => P(px, py + u * Math.cos(fa) - v * Math.sin(fa), pz + u * Math.sin(fa) + v * Math.cos(fa));
    b.flag.setAttribute("d", poly([fl(0, -1), fl(14, -1), fl(14, 4), fl(9, 4), fl(9, 1), fl(0, 1)]));
    b.pin.setAttribute("d", seg(P(px, py, pz), P(px + 1, py, pz)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of boxes) { draw(b, tval(b.a, now)); if (!tdone(b.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = boxes.map((b) => P(b.xc, BL / 2, POST * 0.7));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    boxes.forEach((b, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? 1 : 0) : dd === 0 ? 1 : dd === 1 ? 0.3 : 0;
      tset(b.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      b.flag.classList.toggle("hi", on); b.body.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "mailbox " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "mailboxes",
  means: "Four mailboxes on posts: the one under the pointer drops its door and raises its flag, and the flags beside it lift.",
  rules: [1, 2, 5, 10],
  range: [0, 45, 90],
  tour: [[141, 139], [232, 185], [278, 208], null],
  mount,
});
