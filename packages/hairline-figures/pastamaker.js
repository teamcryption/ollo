/**
 * Pasta machine: a steel roller box clamped to a counter, crank on its
 * side, a sheet of dough coming out the front. The pointer's place along
 * the counter is how far the sheet has run: the crank turns with it and the
 * sheet slides out and lies down. At rest a short tongue shows and the crank
 * is bright. The slider is the longest sheet.
 *
 * The pattern: one part answering a continuous input (slide + turn).
 */
const {
  Cam, clamp, fit, facing, hull, circ, open, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const Z0 = 3, X1 = 14, W = 13, REST = 10;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let most = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-26, -30, 0], [84, 36, 0], [84, -30, 0], [-26, 36, 0], [0, 26, 50], [0, -20, 40]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-26, -30, 84, 36, 8, 2);
  put(solid(g), prism(P, front, cr, ci, 0, Z0));
  const [br, bi] = rings(-X1, -20, X1, 20, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, Z0, Z0 + 30));
  mk("path", { d: open([P(-3, -15, Z0 + 30), P(-3, 15, Z0 + 30)]) + open([P(3, -15, Z0 + 30), P(3, 15, Z0 + 30)]), class: "nf lo" }, g);
  mk("path", { d: open([P(X1, -W, Z0 + 12), P(X1, W, Z0 + 12)]), class: "nf lo" }, g);

  const sheet = mk("path", { class: "sil" }, g), edge = mk("path", { class: "nf lo" }, g);
  const hub = mk("path", { class: "nf" }, g);
  hub.setAttribute("d", poly(hull(circ(4, 20).map((q) => P(q.u, 20, Z0 + 20 + q.v)).concat(circ(4, 20).map((q) => P(q.u, 24, Z0 + 20 + q.v))))));
  const arm = mk("path", { class: "sil" }, g), knob = mk("path", {}, g);

  const run = spring(REST);
  let last = NaN, act = false;
  function draw(L) {
    if (Math.abs(L - last) < 0.02) return;
    last = L;
    const bend = Math.min(L, 12), far = X1 + bend + Math.max(0, L - 12);
    const zb = Z0 + 12 - (Z0 + 11.5 - Z0) * (bend / 12);
    const pts = [P(X1, -W, Z0 + 12), P(X1 + bend, -W, zb), P(far, -W, Z0 + 0.5), P(far, W, Z0 + 0.5), P(X1 + bend, W, zb), P(X1, W, Z0 + 12)];
    sheet.setAttribute("d", poly(pts));
    edge.setAttribute("d", open([P(X1 + bend, -W, zb), P(X1 + bend, W, zb)]) + open([P(far - 1.2, -W, Z0 + 0.5), P(far - 1.2, W, Z0 + 0.5)]));
    const a = L / 9, ex = 15 * Math.cos(a), ez = 15 * Math.sin(a), y = 25;
    const n = [-Math.sin(a) * 2.6, Math.cos(a) * 2.6];
    arm.setAttribute("d", poly(hull([P(n[0], y, Z0 + 20 + n[1]), P(-n[0], y, Z0 + 20 - n[1]), P(ex + n[0], y, Z0 + 20 + ez + n[1]), P(ex - n[0], y, Z0 + 20 + ez - n[1]), P(n[0], y + 1.5, Z0 + 20 + n[1]), P(ex - n[0], y + 1.5, Z0 + 20 + ez - n[1])])));
    knob.setAttribute("d", poly(hull(circ(2.6, 16).map((q) => P(ex + q.u, y + 1.5, Z0 + 20 + ez + q.v)).concat(circ(2.6, 16).map((q) => P(ex + q.u, y + 11, Z0 + 20 + ez + q.v))))));
  }

  const B = register(stage, (dt) => { const m = stepS(run, dt); draw(run.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    const on = !!p;
    let L = REST;
    if (on) { const [wx] = unproj(C, p[0], p[1], Z0); L = clamp(wx - X1, REST, most); }
    run.t = L;
    if (on !== act) { act = on; sheet.classList.toggle("hi", on); arm.classList.toggle("hi", !on); }
    read.textContent = on ? Math.round(L) + " cm" : "rest";
    B.wake();
  }
  aim(null);
  draw(REST);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { most = v; }, destroy: bag.dispose };
}

hairline({
  name: "pastamaker",
  means: "A pasta machine on a counter: moving along the counter turns the crank and runs a sheet of dough out and down.",
  rules: [3, 5, 8, 9],
  range: [40, 56, 66],
  tour: [[162, 158], [252, 203], [264, 223], null],
  mount,
});
