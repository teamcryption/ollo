/**
 * Lockbox: a realtor's key safe, a squat body with a keypad on its face and
 * a steel shackle on top. The pointer on it opens it: the shackle lifts and
 * swings round on its left leg, and the key vault under the keypad drops
 * open. At rest the shackle sits a little proud, bright. The slider is how
 * far the shackle swings.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 44, D = 28, H = 56, VZ = 18, DROP = 9, LX0 = 11, LX1 = 33, SH = 26, RI = 11;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[0, 0, -DROP], [W, D, -DROP], [W, 0, 0], [0, D, H + SH + 28], [W, D, H], [-24, D / 2, H + SH + 28], [LX0, D / 2 + 30, H + SH + 28], [0, 0, H]], 200, 150);
  const P = proj(C), front = facing(C);
  const onFace = (y) => (q) => P(q.u, y, q.v);

  const g = mk("g", {}, svg);
  const shk = mk("path", { class: "nf" }, g);
  const body = solid(g);
  const [br, bi] = rings(0, 0, W, D, 4, 1.6);
  put(body, prism(P, front, br, bi, VZ, H));
  const pad = mk("path", { class: "nf lo" }, body.g);
  let k = poly(rrect(9, VZ + 8, W - 9, H - 8, 2, 3).map(onFace(D)));
  for (let c = 0; c < 3; c++) for (let r = 0; r < 4; r++) {
    const x = 15 + c * 7, z = VZ + 13 + r * 7.5;
    k += poly(rrect(x - 2, z - 2, x + 2, z + 2, 0.8, 2).map(onFace(D)));
  }
  pad.setAttribute("d", k);
  const vault = solid(g);
  const lip = mk("path", { class: "nf lo" }, vault.g);
  g.insertBefore(vault.g, body.g);

  // the shackle: a U in the x-z plane, two lines for its thickness
  const U = (r) => {
    const pts = [];
    pts.push([LX0 + 11 - r, -8]);
    for (let i = 0; i <= 12; i++) { const a = Math.PI - (i / 12) * Math.PI; pts.push([LX0 + 11 + r * Math.cos(a), SH + r * Math.sin(a) * 0.9]); }
    pts.push([LX0 + 11 + r, -8]);
    return pts;
  };
  const u0 = U(RI + 2.2), u1 = U(RI - 2.2);
  const st = tween(0), last = [NaN];
  function draw(s) {
    const lift = 3 + s * 6, a = s * swing * Math.PI / 180;
    const pt = ([x, z]) => P(LX0 + (x - LX0) * Math.cos(a), D / 2 + (x - LX0) * Math.sin(a), H + lift + z);
    shk.setAttribute("d", "M" + u0.map((q) => pt(q).join(",")).join("L") + "M" + u1.map((q) => pt(q).join(",")).join("L"));
    const z1 = VZ - s * DROP, z0 = z1 - VZ + 1;
    const [r, i] = rings(1, 1, W - 1, D - 1, 3.4, 1.2);
    put(vault, prism(P, front, r, i, z0, z1));
    lip.setAttribute("d", poly(rrect(W / 2 - 8, z1 - 5, W / 2 + 8, z1 - 3, 0.8, 2).map(onFace(D - 1))));
  }

  const B = register(stage, (_dt, now) => {
    const s = tval(st, now);
    if (s !== last[0]) { draw(s); last[0] = s; }
    return !tdone(st, now);
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(st, a ? 1 : 0, performance.now(), 0);
    shk.classList.toggle("hi", !a);
    vault.sil.classList.toggle("hi", !!a);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, { move: () => setActive(1), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; last[0] = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "lockbox",
  means: "A realtor's key lockbox: under the pointer its shackle lifts and swings round, and the key vault drops open below the keypad.",
  rules: [3, 4, 5, 6],
  range: [60, 120, 170],
  tour: [[209, 142], [224, 176], [194, 237], null],
  mount,
});
