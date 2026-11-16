/**
 * Net post: two volleyball posts on base plates with a meshed net strung
 * between them, a bright tape along its top. The pointer slides the net up
 * and down the posts, higher the nearer the pointer to the top of the frame.
 * At rest it hangs at a middle height. The slider is the net's travel.
 *
 * The pattern: one part sliding along a fixed guide.
 */
const { Cam, fit, hull, poly, proj, clamp, lerp, spring, stepS, disposer, mk, pointer, register, seg, circ, ringAt } = HL;

const X = 110, PH = 100, NH = 26, REST = 0.5;
function cyl(P, x, y, z0, z1, r) {
  const c = circ(r, 24).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
  return poly(hull(ringAt(P, c, z0).concat(ringAt(P, c, z1))));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-12, -12, 0], [X + 12, 12, 0], [X + 12, -12, 0], [-12, 12, 0], [0, 0, PH + 4], [X, 0, PH + 4]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  for (const x of [0, X]) mk("path", { class: "sil", d: poly(hull(ringAt(P, circ(10, 24).map((q) => ({ ...q, u: q.u + x })), 0).concat(ringAt(P, circ(10, 24).map((q) => ({ ...q, u: q.u + x })), 3)))) }, g);
  mk("path", { class: "sil", d: cyl(P, 0, 0, 3, PH, 3) }, g);
  const mesh = mk("path", { class: "nf lo" }, g), frame = mk("path", { class: "nf sil" }, g), tape = mk("path", { class: "sil hi" }, g);
  mk("path", { class: "sil", d: cyl(P, X, 0, 3, PH, 3) }, g);
  const z = spring(0);
  let last = NaN;
  const lo = () => 12, hi = () => 12 + travel;

  function draw(h) {
    if (h === last) return;
    last = h;
    let d = "";
    for (let x = 3 + 6; x < X - 3; x += 6) d += seg(P(x, 0, h), P(x, 0, h + NH));
    for (let k = 1; k < 5; k++) d += seg(P(3, 0, h + (k * NH) / 5), P(X - 3, 0, h + (k * NH) / 5));
    mesh.setAttribute("d", d);
    frame.setAttribute("d", poly([P(3, 0, h), P(X - 3, 0, h), P(X - 3, 0, h + NH), P(3, 0, h + NH)]));
    tape.setAttribute("d", poly([P(3, 0, h + NH), P(X - 3, 0, h + NH), P(X - 3, 0, h + NH + 4), P(3, 0, h + NH + 4)]));
  }

  const B = register(stage, (dt) => { const m = stepS(z, dt); draw(z.x); return m; });
  bag.add(B.unregister);

  function aim(t, rest) {
    z.t = lerp(lo(), hi(), t);
    read.textContent = rest ? "rest" : Math.round(t * 100) + "%";
    B.wake();
  }
  z.x = lerp(lo(), hi(), REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([, sy]) => aim(clamp((260 - sy) / 200, 0, 1)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; aim(REST, true); }, destroy: bag.dispose };
}

hairline({
  name: "netpost",
  means: "Two volleyball posts with a net between them: the net slides up and down the posts with the pointer's height.",
  rules: [1, 3, 5],
  range: [40, 55, 66],
  tour: [[200, 79], [200, 172], [200, 104], null],
  mount,
});
