/**
 * Log flume: a trough on legs that runs flat, drops down a chute and runs
 * out at the bottom, with a hollowed log boat waiting at the top. The
 * pointer over the flume sends the log down the drop, pitching nose-down on
 * the slope. At rest the log is bright. The slider is how far it runs.
 *
 * The pattern: one part answering as a whole (cloches, one item).
 */
const {
  Cam, fit, hull, open, poly, proj, rrect, unproj, tset, tval, tdone, tween,
  disposer, mk, pointer, register,
} = HL;

const L = 200, HW = 14, X0 = 24, BL = 44, BW = 22, BH = 11;
const sm = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };
const prof = (x) => 4 + 60 * (1 - sm((x - 50) / 90));
const slope = (x) => Math.atan2(prof(x + 1) - prof(x - 1), 2);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[0, -HW, 0], [L, HW, 0], [0, HW, 80], [L, -HW, 0], [0, -HW, 80]], 200, 162);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const line = (y, dz) => { const pts = []; for (let x = 0; x <= L; x += 4) pts.push(P(x, y, prof(x) + dz)); return open(pts); };
  let legs = "";
  for (let x = 10; x < 140; x += 26) for (const y of [-HW, HW]) legs += "M" + P(x, y, 0).join(",") + "L" + P(x, y, prof(x)).join(",");
  mk("path", { d: legs, class: "nf lo dash" }, g);
  mk("path", { d: line(-HW, 9), class: "nf" }, g);
  mk("path", { d: line(-HW, 0) + line(HW, 0).replace(/^M/, "M"), class: "nf lo" }, g);
  mk("path", { d: open([P(0, -HW, prof(0)), P(0, -HW, prof(0) + 9)]) + open([P(L, -HW, prof(L)), P(L, -HW, prof(L) + 9)]), class: "nf lo" }, g);
  const boat = mk("path", { class: "sil" }, g), seat = mk("path", { class: "nf lo" }, g);
  mk("path", { d: line(HW, 9), class: "nf" }, g);
  mk("path", { d: open([P(0, HW, prof(0)), P(0, HW, prof(0) + 9), P(0, -HW, prof(0) + 9)]) + open([P(L, HW, prof(L)), P(L, HW, prof(L) + 9)]), class: "nf" }, g);

  const foot = rrect(-BL / 2, -BW / 2, BL / 2, BW / 2, 9, 4), top = rrect(-BL / 2, -BW / 2, BL / 2, BW / 2, 10, 4);
  const hollow = rrect(-BL / 2 + 8, -BW / 2 + 4, BL / 2 - 8, BW / 2 - 4, 6, 4);
  const pos = tween(0);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const cx = X0 + d, cz = prof(cx) + 1, a = slope(cx), c = Math.cos(a), s = Math.sin(a);
    const at = (ring, h) => ring.map((q) => P(cx + q.u * c - h * s, q.v, cz + q.u * s + h * c));
    boat.setAttribute("d", poly(hull(at(foot, 0).concat(at(top, BH)))));
    seat.setAttribute("d", poly(at(hollow, BH)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(pos, now)); return !tdone(pos, now); });
  bag.add(B.unregister);

  const mid = P(X0, 0, prof(X0) + BH / 2);
  function hit([sx, sy]) {
    if (Math.hypot(sx - mid[0], sy - mid[1]) < 40) return 1;
    const [x, y] = unproj(C, sx, sy, 0);
    return x > 0 && x < L && Math.abs(y) < HW + 4 ? 1 : -1;
  }
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(pos, a > 0 ? reach : 0, performance.now(), 0);
    boat.classList.add("hi");
    read.textContent = a > 0 ? "run " + Math.round(reach) : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act > 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "logflume",
  means: "A log flume trough with a hollow log boat at the top: the pointer sends the log down the drop, nose-down on the chute.",
  rules: [1, 3, 5, 6],
  range: [70, 120, 150],
  tour: [[114, 77], [200, 200], [160, 150], null],
  mount,
});
