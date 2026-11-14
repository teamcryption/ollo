/**
 * Note counter: a squat machine with a display window and an exit slot on
 * its front, and a hopper on top holding seven banknotes on edge, fanned a
 * little, each with its watermark oval. The pointer picks a note by where it
 * is along the stack: it rises out of the hopper, its neighbours rise a
 * little after it. At rest the stack is uneven, one note half drawn, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is each note's rest
 * centre on screen x.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, rrect, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, STEP = 4, X0 = 5, TOP = 20, NY0 = 6, NY1 = 30, NH = 13, LIFT = 15, BUMP = 5, T = 0.5;
const X1 = X0 + (N - 1) * STEP + 6;
const REST = [0, 1.5, 0.5, 6, 1, 2, 0], LEAN = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3], FAV = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 4.2);
  fit(C, [[-2, -2, 0], [X1, 36, 0], [-2, 36, 0], [X1, -2, 0], [X0, NY0, TOP + NH + LIFT], [X1, NY1, TOP + NH + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the body, its hopper rim, the display window and exit slot on the near face
  const body = solid(g), [o, i] = rings(-2, -2, X1, 36, 6, 1.6);
  put(body, prism(P, front, o, i, 0, TOP));
  const face = (pts) => poly(pts.map(([u, z]) => P(u, 36, z)));
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(X0 - 2, NY0 - 2, X1 - 4, NY1 + 2, 2, 4), TOP)) +
    face(fillet([[4, 9], [16, 9], [16, 15], [4, 15]], [1.2, 1.2, 1.2, 1.2], 3)) +
    face(fillet([[20, 4], [X1 - 4, 4], [X1 - 4, 6], [20, 6]], [0.8, 0.8, 0.8, 0.8], 3)) }, body.g);

  const notes = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    notes.push({ k, x: X0 + k * STEP, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), z: tween(REST[k]), last: NaN });
  }
  const outline = fillet([[NY0, 0], [NY1, 0], [NY1, NH], [NY0, NH]], [1, 1, 1, 1], 3);
  const oval = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; oval.push([NY0 + 6 + 2.6 * Math.cos(a), NH / 2 + 3.6 * Math.sin(a)]); }
  function draw(s, lift) {
    if (lift === s.last) return;
    s.last = lift;
    const at = (dx) => ([y, z]) => P(s.x + dx + z * LEAN[s.k], y, TOP - 3 + lift + z);
    s.sil.setAttribute("d", poly(hull(outline.map(at(T)).concat(outline.map(at(-T))))));
    s.cr.setAttribute("d", poly(oval.map(at(T))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    notes.forEach((s) => { draw(s, tval(s.z, now)); if (!tdone(s.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest rest centre on screen x, inside the machine's band
  const top = P(X0, NY0, TOP + NH + 8)[1], bot = P(X1, 36, 0)[1];
  function hit([sx, sy]) {
    if (sy < top - 8 || sy > bot) return -1;
    let best = -1, bd = 1e9;
    notes.forEach((s, k) => { const d = Math.abs(P(s.x + 6 * LEAN[k], (NY0 + NY1) / 2, TOP + 6)[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 30 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    notes.forEach((s, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : clamp(BUMP - Math.abs(k - a) * 1.5, 0, BUMP);
      tset(s.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "note " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "notecounter",
  means: "A banknote counter: the note under the pointer rises out of the hopper, its neighbours rise a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[163, 132], [187, 144], [234, 168], null],
  mount,
});
