/**
 * Bulb crates: four slatted crates in a row, each holding three flower bulbs,
 * round at the base and pointed at the tip. The pointer picks a crate by where
 * it is along the row: its bulbs lift up out of the crate, ready to plant,
 * the neighbours' bulbs stir a little after it. At rest the bulbs sit at
 * uneven depths and one crate is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is on a fixed
 * plane through the crates' rims.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 26, CW = 22, CD = 24, H = 12, LIFT = 20, BUMP = 4;
const REST = [2, 0, 5, 1], FAV = 2;
const BUL = [[-5, -5], [5, -2], [-1, 6]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const X1 = (N - 1) * STEP + CW;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[0, 0, 0], [X1, CD, 0], [X1, 0, 0], [0, CD, 0], [0, 0, H + LIFT + 14], [X1, 0, H + LIFT + 14]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const crates = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, cx = x0 + CW / 2, cy = CD / 2;
    const grp = mk("g", {}, g);
    // the back wall and floor first, so bulbs sit inside the crate
    const back = solid(grp);
    const [r, i] = rings(x0, 0, x0 + CW, CD, 2, 1.2);
    put(back, prism(P, front, r, i, 0, H));
    const inside = mk("path", { class: "lo", d: poly(ringAt(P, rrect(x0 + 1.4, 1.4, x0 + CW - 1.4, CD - 1.4, 1.2, 4), H)) }, grp);
    const bulbs = BUL.map(([dx, dy]) => ({ x: cx + dx, y: cy + dy, sil: mk("path", { class: "" }, grp), cr: mk("path", { class: "nf lo" }, grp) }));
    // the near walls: one plate over the bulbs' feet, with a slat line round it
    const nw = [P(x0, CD, H), P(x0 + CW, CD, H), P(x0 + CW, 0, H), P(x0 + CW, 0, 0), P(x0 + CW, CD, 0), P(x0, CD, 0)];
    const lip = mk("path", { class: "sil", d: poly(nw) }, grp);
    mk("path", { class: "nf lo", d: open([P(x0 + 1, CD, H * 0.5), P(x0 + CW, CD, H * 0.5), P(x0 + CW, 1, H * 0.5)]) }, grp);
    crates.push({ k, back, lip, bulbs, z: tween(REST[k]), last: NaN });
  }

  function bulb(b, z) {
    const pts = [];
    for (let j = 0; j < 14; j++) {
      const a = (j / 14) * Math.PI * 2;
      pts.push(P(b.x + 4 * Math.cos(a), b.y + 4 * Math.sin(a), z + 3.5));
      pts.push(P(b.x + 2.6 * Math.cos(a), b.y + 2.6 * Math.sin(a), z + 0.6));
    }
    pts.push(P(b.x, b.y, z + 11));
    b.sil.setAttribute("d", poly(hull(pts)));
    b.cr.setAttribute("d", seg(P(b.x, b.y, z + 11), P(b.x, b.y, z + 13.5)) + seg(P(b.x - 1, b.y + 1, z + 0.4), P(b.x - 1.6, b.y + 1.6, z - 0.8)));
  }
  function draw(c, lift) {
    if (lift === c.last) return;
    c.last = lift;
    c.bulbs.forEach((b, j) => bulb(b, H - 7 + lift + (j === 1 ? 1.5 : 0)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    crates.forEach((c) => { draw(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    if (x < -4 || x > X1 + 4 || y < -6 || y > CD + 6) return -1;
    return clamp(Math.round((x - CW / 2) / STEP), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    crates.forEach((c, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : Math.max(0, BUMP - Math.abs(k - a));
      tset(c.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      c.back.sil.classList.toggle("hi", on); c.lip.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "crate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tulipbulbs",
  means: "Four bulb crates in a row: the bulbs in the crate under the pointer lift out to be planted, the next ones stir after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[121, 156], [174, 182], [279, 234], null],
  mount,
});
