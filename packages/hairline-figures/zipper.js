/**
 * Zipper: a zip lying flat, two tapes meeting along a row of teeth, the
 * slider riding the row with its pull tab. The pointer slides the slider
 * along the zip: ahead of it the teeth stay meshed, behind it the tapes
 * part in a widening V. At rest the zip is a third open and the tab is
 * bright. The slider is how wide the tapes spread.
 *
 * The pattern: one continuous value along a track (slide).
 */
const {
  Cam, fit, facing, fillet, poly, open, prism, proj, rings, unproj, clamp,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const L = 170, W = 17, ZT = 1.5, REST = L * 0.4, DX = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let spread = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-26, -50, 0], [L + 4, -50, 0], [L + 4, 50, 0], [-26, 50, 0], [0, 0, 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const tapes = [-1, 1].map((sd) => ({ sd, edge: mk("path", { class: "nf lo" }, g), face: mk("path", { class: "sil" }, g) }));
  const teeth = mk("path", { class: "nf lo" }, g);
  const body = solid(g), tab = solid(g);
  const s = spring(REST);
  let last = NaN;

  const gap = (x, at) => clamp((x - at) * spread, 0, 24);
  function draw(at) {
    if (at === last) return;
    last = at;
    for (const t of tapes) {
      const inn = [], out = [];
      for (let x = 0; x <= L; x += DX) { const gp = gap(x, at); inn.push([x, t.sd * gp]); out.push([x, t.sd * (gp + W)]); }
      const pts = inn.concat(out.reverse()).map(([x, y]) => P(x, y, ZT)), n = inn.length;
      const rad = pts.map((_, i) => (i === 0 || i === n - 1 || i === n || i === 2 * n - 1 ? 5 : 0));
      t.face.setAttribute("d", poly(fillet(pts, rad)));
      const lo = (t.sd > 0 ? out.slice().reverse() : [[L, t.sd * (gap(L, at) + W)], [L, t.sd * gap(L, at)]]).map(([x, y]) => P(x, y, 0));
      t.edge.setAttribute("d", open(lo));
    }
    let d = "";
    for (let i = 0, x = 3; x < L - 2; i++, x += 6) {
      const sd = i % 2 ? 1 : -1, yi = sd * gap(x, at), a = yi - sd * 2.6, b = yi + sd * 3.2;
      d += poly([P(x - 2, a, ZT), P(x + 2, a, ZT), P(x + 2, b, ZT), P(x - 2, b, ZT)]) + " ";
    }
    teeth.setAttribute("d", d);
    const [br, bi] = rings(at - 10, -8, at + 10, 8, 5, 1.6);
    put(body, prism(P, front, br, bi, ZT, ZT + 6));
    const [tr, ti] = rings(at - 30, -5, at - 8, 5, 4, 1.4);
    put(tab, prism(P, front, tr, ti, ZT + 6, ZT + 7.6));
  }

  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);

  let act = null;
  function setAt(x) {
    s.t = x === null ? REST : clamp(x, 32, L - 10);
    if (x === null) read.textContent = "rest"; else read.textContent = Math.round((1 - s.t / L) * 100) + "%";
    const on = x !== null;
    if (on !== act) { act = on; body.sil.classList.toggle("hi", on); tab.sil.classList.toggle("hi", !on); }
    B.wake();
  }
  setAt(null);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return Math.abs(y) < 52 && x > -30 && x < L + 14 ? x : null;
  }
  bag.add(pointer(stage, { move: (p) => setAt(hit(p)), leave: () => setAt(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { spread = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "zipper",
  means: "A zip lying flat: the pointer slides the pull along the teeth, and behind it the two tapes part in a widening V.",
  rules: [1, 3, 5, 8],
  range: [0.2, 0.45, 0.7],
  tour: [[154, 145], [287, 212], [253, 240], null],
  mount,
});
