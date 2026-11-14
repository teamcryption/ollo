/**
 * Graphics cards: four cards standing in a row of slots on a board, each a
 * long thin shroud with two fans on its open side. The pointer picks a card
 * by where it is along the row: that card lifts out of its slot, its
 * neighbours rise a little after it. At rest the cards sit seated at uneven
 * heights, one half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is on a fixed plane
 * through the cards' resting middles.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 14, X0 = 10, T = 4, Y0 = 6, Y1 = 50, H = 22, LIFT = 18, XB = X0 + (N - 1) * STEP + 12;
const REST = [0.5, 7, 1.5, 0], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[0, 0, -4], [XB, 0, -4], [XB, Y1 + 6, -4], [0, Y1 + 6, -4], [X0, Y0, H + LIFT], [XB, Y1, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the board: a low slab with a slot under each card
  const [bo, bi] = rings(0, 0, XB, Y1 + 6, 4, 1.4);
  const board = solid(g);
  put(board, prism(P, front, bo, bi, -4, 0));
  let slots = "";
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP;
    slots += poly([P(x - 1, Y0 - 1, 0), P(x + T + 1, Y0 - 1, 0), P(x + T + 1, Y1 + 1, 0), P(x - 1, Y1 + 1, 0)]);
  }
  mk("path", { class: "nf lo", d: slots }, board.g);

  // a card: a thin tall solid along y, two fans on its +x face
  const cards = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g);
    cards.push({ k, x: X0 + k * STEP, s, fans: mk("path", { class: "nf lo" }, s.g), z: tween(REST[k]), last: NaN });
  }
  function fan(x, yc, zc, r) {
    const ring = [], hub = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ring.push(P(x, yc + r * Math.cos(a), zc + r * Math.sin(a)));
      hub.push(P(x, yc + r * 0.3 * Math.cos(a), zc + r * 0.3 * Math.sin(a)));
    }
    return poly(ring) + poly(hub);
  }
  function draw(c, z) {
    if (z === c.last) return;
    c.last = z;
    const [r, i] = rings(c.x, Y0, c.x + T, Y1, 1.6, 0.8);
    put(c.s, prism(P, front, r, i, z, z + H));
    c.fans.setAttribute("d", fan(c.x + T, Y0 + 11.5, z + H / 2, 8) + fan(c.x + T, Y1 - 11.5, z + H / 2, 8));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    cards.forEach((c) => { draw(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H / 2);
    if (x < -6 || x > XB + 6 || y < Y0 - 8 || y > Y1 + 8) return -1;
    return clamp(Math.round((x - X0 - T / 2) / STEP), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cards.forEach((c, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : Math.max(0, 4 - Math.abs(k - a) * 1.5);
      tset(c.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      c.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "gpu " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "gpus",
  means: "Graphics cards in a row of slots: the card under the pointer lifts out, its neighbours rising a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[159, 155], [188, 169], [245, 198], null],
  mount,
});
