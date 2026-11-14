/**
 * Calculatorroll: an adding machine, a block body with a grid of nine keys
 * and a paper roll at its back, the tape standing up out of it. The pointer
 * picks a key on its rest top: the key presses down and the tape feeds out
 * a little further. At rest one key is half down, bright. The slider is how
 * far a press feeds the tape.
 *
 * The pattern: one of many on a face plane (depositboxes).
 */
const {
  Cam, fit, hull, open, poly, prism, proj, rings, facing, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid, seg,
} = HL;

const BX = 92, BY = 70, BZ = 16, KS = 15, KG = 4, KH = 6, RX = 14, RZ = BZ + 9, RR = 9, FAV = 4;
const KX0 = 32, KY0 = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let feed = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, 0], [BX, BY, 0], [BX, 0, 0], [0, BY, 0], [RX, 12, RZ + 74], [RX, BY - 12, RZ + 74]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BX, BY, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  // the tape, then the roll in front of its foot
  const tape = mk("path", { class: "sil" }, g), lines = mk("path", { class: "lo nf" }, g);
  const roll = mk("path", { class: "sil" }, g), rollEnd = mk("path", { class: "nf lo" }, g);
  const circle = (y) => { const pts = []; for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; pts.push(P(RX + RR * Math.cos(t), y, RZ + RR * Math.sin(t))); } return pts; };
  roll.setAttribute("d", poly(hull(circle(10).concat(circle(BY - 10)))));
  rollEnd.setAttribute("d", poly(circle(BY - 10)));
  const tp = tween(20);
  let lastT = NaN;
  function drawTape(h) {
    if (h === lastT) return;
    lastT = h;
    const x = RX + RR - 1, z0 = RZ, z1 = RZ + h, y0 = 13, y1 = BY - 13;
    tape.setAttribute("d", poly([P(x, y0, z0), P(x, y1, z0), P(x, y1, z1), P(x - 3, y0 + (y1 - y0) * 0.5, z1 + 3), P(x, y0, z1)]));
    let d = "";
    for (let zz = z1 - 6; zz > z0 + RR; zz -= 7) d += seg(P(x, y0 + 6, zz), P(x, y1 - 6 - ((zz * 7) % 14), zz));
    lines.setAttribute("d", d);
  }

  const keys = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const x0 = KX0 + i * (KS + KG), y0 = KY0 + j * (KS + KG);
    keys.push({ i, j, x0, y0, s: null, z: tween(0), last: NaN });
  }
  keys.sort((a, b) => a.x0 + a.y0 - (b.x0 + b.y0));
  keys.forEach((k) => { k.s = solid(g); k.n = k.i * 3 + k.j; });
  const [kr, ki] = rings(0, 0, KS, KS, 4, 1.4);
  const shift = (ring, dx, dy) => ring.map((q) => ({ ...q, u: q.u + dx, v: q.v + dy }));
  function drawKey(k, d) {
    if (d === k.last) return;
    k.last = d;
    put(k.s, prism(P, front, shift(kr, k.x0, k.y0), shift(ki, k.x0, k.y0), BZ, BZ + KH - d));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of keys) { drawKey(k, tval(k.z, now)); if (!tdone(k.z, now)) moving = true; }
    drawTape(tval(tp, now)); if (!tdone(tp, now)) moving = true;
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, BZ + KH);
    for (const k of keys) if (wx > k.x0 - KG / 2 && wx < k.x0 + KS + KG / 2 && wy > k.y0 - KG / 2 && wy < k.y0 + KS + KG / 2) return k.n;
    return -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    const on = a < 0 ? FAV : a;
    keys.forEach((k) => {
      tset(k.z, k.n === a ? KH - 1.5 : a < 0 && k.n === FAV ? 2.5 : 0, now, 0);
      k.s.sil.classList.toggle("hi", k.n === on);
    });
    tset(tp, a < 0 ? 20 : 26 + feed * (2.5 + (a % 3)) + 5 * Math.floor(a / 3), now, 0);
    read.textContent = a < 0 ? "rest" : "key " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { feed = v; }, destroy: bag.dispose };
}

hairline({
  name: "calculatorroll",
  means: "An adding machine with nine keys and a paper roll: the key under the pointer presses down and the tape feeds out.",
  rules: [1, 4, 5, 8],
  range: [4, 8, 12],
  tour: [[217, 191], [217, 218], [217, 245], null],
  mount,
});
