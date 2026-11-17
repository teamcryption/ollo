/**
 * Door hanger: a door with its knob, and a card hung on the knob by its
 * round hole. The pointer is a draught across the door: the card swings on
 * the knob toward it, on a spring. At rest the card hangs at a slight angle,
 * bright. The slider is how far it can swing.
 *
 * The pattern: a continuous swing (a spring on an angle), hit by screen x.
 */
const {
  Cam, clamp, fit, hull, poly, proj, rrect, circ, spring, stepS, rad,
  disposer, mk, pointer, register,
} = HL;

const K = [22, 0, 70], CW = 17, CH = 42, DROP = 34, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-42, 0, 0], [42, 0, 130], [K[0] - 48, 10, -8], [K[0] + 48, 10, -8]], 200, 184);
  const P = proj(C), g = mk("g", {}, svg);
  const add = (a, b, s) => a.map((x, i) => x + b[i] * s);
  function slab(c, U, V, W, a, b, t, r, ring) {
    const pts = [], R = ring || rrect(-a, -b, a, b, r, 4), at = (q, z) => P(...add(add(add(c, U, q.u), V, q.v), W, z));
    for (const q of R) pts.push(at(q, -t / 2), at(q, t / 2));
    const inner = rrect(-a + 2, -b + 2, a - 2, b - 2, Math.max(1, r - 2), 4).map((q) => at(q, t / 2));
    return { sil: poly(hull(pts)), cr: poly(inner) };
  }
  // the door, a leaf facing +y, then its frame lip
  const door = slab([0, -3, 65], [1, 0, 0], [0, 0, 1], [0, 1, 0], 40, 63, 4, 3);
  mk("path", { d: door.sil, class: "sil" }, g);
  mk("path", { d: door.cr, class: "nf lo" }, g);
  const pane = slab([0, -1, 100], [1, 0, 0], [0, 0, 1], [0, 1, 0], 20, 18, 0.5, 2);
  mk("path", { d: pane.cr, class: "nf lo" }, g);
  const rose = slab(K, [1, 0, 0], [0, 0, 1], [0, 1, 0], 5, 5, 3, 5, circ(5, 24));
  mk("path", { d: rose.sil, class: "sil" }, g);
  const card = mk("path", { class: "sil" }, g), crc = mk("path", { class: "nf lo" }, g), hole = mk("path", { class: "nf" }, g);
  const knob = slab(add(K, [0, 1, 0], 6), [1, 0, 0], [0, 0, 1], [0, 1, 0], 4, 4, 8, 4, circ(4, 20));
  const kn = mk("path", { d: knob.sil, class: "sil" }, g);

  const th = spring(REST);
  let last = NaN;
  function draw() {
    if (th.x === last) return;
    last = th.x;
    const a = rad(th.x), D = [Math.sin(a), 0, -Math.cos(a)], U = [Math.cos(a), 0, Math.sin(a)];
    const c = add(add(K, D, DROP), [0, 1, 0], 4);
    const s = slab(c, U, [-D[0], 0, -D[2]], [0, 1, 0], CW, CH, 1.6, 4);
    card.setAttribute("d", s.sil); crc.setAttribute("d", s.cr);
    hole.setAttribute("d", poly(circ(5.5, 20).map((q) => P(...add(add(K, U, q.u), [-D[0], 0, -D[2]], q.v).map((x, i) => x + (i === 1 ? 4.8 : 0))))));
  }
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);
  const kx = P(...K)[0];
  function aim(p) {
    const on = p && Math.abs(p[0] - 200) < 190;
    th.t = on ? clamp((p[0] - kx) / 70, -1, 1) * 40 * reach : REST;
    card.classList.toggle("hi", true);
    read.textContent = on ? "swing " + Math.round(th.t) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "doorhanger",
  means: "A card hung on a door knob: it swings on the knob toward the pointer, and settles back at a slight angle.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[150, 198], [280, 198], [208, 198], null],
  mount,
});
