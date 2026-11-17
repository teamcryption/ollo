/**
 * Drop grid: an upright grid of round slots, seven columns by six rows, on a
 * turntable foot, with one disc poised over the middle column. The pointer
 * swings the grid round to face it and the disc drops down its column;
 * leaving turns it back and lifts the disc. At rest the disc is bright.
 * The slider is how far the grid turns.
 *
 * The pattern: one part turning, one dropping (aim).
 */
const { Cam, fit, facing, circ, hull, poly, prism, proj, rad, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const COLS = 7, ROWS = 6, PITCH = 10, HR = 3.6, W = COLS * PITCH + 6, Z0 = 8, HT = ROWS * PITCH + 6, T = 4, REST = -12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let turn = value;
  const C = Cam(45, 0.5, 2.55);
  const R = W / 2 + 2;
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, Z0 + HT + 16], [-R, R, Z0 + HT + 16]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(24, 40), circ(21, 40), 0, Z0 - 2));
  const plate = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g);
  const holes = [];
  for (let i = 0; i < COLS * ROWS; i++) holes.push(mk("path", { class: "nf" }, g));
  const coin = mk("path", { class: "sil hi" }, g);
  const f = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const a = rad(REST - turn * v), c = Math.cos(a), s = Math.sin(a);
    const side = c - s > 0 ? 1 : -1;
    const at = (u, w, z) => P(u * c - w * s, u * s + w * c, z);
    const pts = [];
    for (const u of [-W / 2, W / 2]) for (const w of [-T / 2, T / 2]) for (const z of [Z0, Z0 + HT]) pts.push(at(u, w, z));
    plate.setAttribute("d", poly(hull(pts)));
    const fw = side * T / 2;
    face.setAttribute("d", poly([at(-W / 2 + 2, fw, Z0 + 2), at(W / 2 - 2, fw, Z0 + 2), at(W / 2 - 2, fw, Z0 + HT - 2), at(-W / 2 + 2, fw, Z0 + HT - 2)]));
    const ring = circ(HR, 16);
    holes.forEach((h, i) => {
      const u = ((i % COLS) - 3) * PITCH, z = Z0 + 8 + Math.floor(i / COLS) * PITCH;
      h.setAttribute("d", poly(ring.map((q) => at(u + q.u, fw, z + q.v))));
    });
    const cz = Z0 + HT + 10 - v * (HT + 2), cr = circ(HR + 0.6, 20);
    coin.setAttribute("d", poly(hull(cr.map((q) => at(q.u, fw, cz + q.v)).concat(cr.map((q) => at(q.u, -fw, cz + q.v))))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(f, now)); return !tdone(f, now); });
  bag.add(B.unregister);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(f, o ? 1 : 0, performance.now(), 0);
    read.textContent = o ? "drop" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: () => set(true), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { turn = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "connectfour",
  means: "An upright grid of slots on a turntable: the pointer swings the grid round and drops the waiting disc down the middle column.",
  rules: [3, 5, 6, 8],
  range: [20, 48, 60],
  tour: [[200, 118], [200, 40], [157, 207], null],
  mount,
});
