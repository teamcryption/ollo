/**
 * Pie dish: a round dish with a crimped rim and a woven lattice on top. The
 * pointer over the pie turns the lattice and its crimp marks, as a hand turns
 * the dish to work its edge. At rest the lattice sits square, bright. The
 * slider is how far it turns.
 */
const { Cam, circ, fit, facing, prism, proj, rrect, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const R = 40, RI = 33, ZT = 9, TURN = 45;
const disc = (r, n = 64) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.78);
  const box = [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, 0, ZT + 2]];
  fit(C, box, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(R + 4), disc(R + 2), 0, 3));
  put(solid(g), prism(P, front, disc(R), disc(RI), 3, ZT));
  const lat = mk("path", { class: "nf hi" }, g), crimp = mk("path", { class: "nf lo" }, g);

  const tw = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const t = (8 + TURN * v) * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
    const at = (u, w, z = ZT) => P(u * c - w * s, u * s + w * c, z);
    let d = "";
    for (let k = -3; k <= 3; k++) for (const o of [-2.2, 2.2]) {
      const w = k * 9 + o, h = Math.sqrt(RI * RI - w * w);
      d += seg(at(-h, w), at(h, w)) + seg(at(w, -h), at(w, h));
    }
    lat.setAttribute("d", d);
    let e = "";
    for (let i = 0; i < 28; i++) { const q = i / 28 * 2 * Math.PI; e += seg(at(RI * Math.cos(q), RI * Math.sin(q)), at(R * Math.cos(q), R * Math.sin(q))); }
    crimp.setAttribute("d", e);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const sp = box.map((p) => P(...p));
  const xs = sp.map((p) => p[0]), ys = sp.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) - 8 && sx < Math.max(...xs) + 8 && sy > Math.min(...ys) - 8 && sy < Math.max(...ys) + 8;
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? reach : 0, performance.now(), 0);
    read.textContent = a ? "turn" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { tset(tw, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "piecrimper",
  means: "A pie dish with a lattice top: the pointer turns the dish, its lattice and crimped edge swinging round.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[200, 160], [210, 150], [190, 170], null],
  mount,
});
