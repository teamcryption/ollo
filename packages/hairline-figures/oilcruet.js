/**
 * Oil cruet: one glass cruet, a round bulb on a foot narrowing to a long
 * neck, closed by a tall teardrop stopper. At rest the stopper sits a little
 * proud of the lip, bright. The pointer over the cruet draws the stopper up
 * out of the neck. The slider is how far it lifts.
 *
 * The pattern: one part answers (cloche).
 */
const {
  Cam, circ, fit, hull, poly, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const LIP = 54, REST = 3;
const BULB = [[11, 0], [12.5, 2], [19, 5], [22.5, 12], [22, 19], [17, 27], [9, 33]];
const NECK = [[6, 30], [5, 36], [4.5, 48], [6.5, 52], [6.5, LIP]];
const STOP = [[2.5, -5], [3, 0], [5.5, 4], [8, 10], [7.5, 15], [5, 20], [2, 23.5], [0.5, 24.5]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 3.05);
  fit(C, [[-23, -23, 0], [23, 23, 0], [23, -23, 0], [-23, 23, 0], [0, 0, LIP + 26 + 26]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const shell = (prof, dz, n = 36) => { const o = []; for (const [r, z] of prof) o.push(...ringAt(P, circ(r, n), z + dz)); return poly(hull(o)); };
  mk("path", { d: shell(BULB, 0), class: "sil" }, g);
  mk("path", { d: shell(NECK, 0, 28), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, circ(5, 28), LIP)), class: "nf lo" }, g);
  const stop = mk("path", { class: "sil hi" }, g);
  const z = tween(REST);
  let last = NaN;
  function draw(h) {
    if (h === last) return;
    last = h;
    stop.setAttribute("d", shell(STOP, LIP + h, 24));
  }
  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, 40);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(z, a ? lift : REST, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 70 && Math.abs(sy - mid[1]) < 120), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (act) { tset(z, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "oilcruet",
  means: "A glass oil cruet with a tall teardrop stopper: the pointer over the cruet draws the stopper up out of the neck.",
  rules: [1, 4, 5, 8],
  range: [10, 17, 21],
  tour: [[200, 170], [200, 110], [215, 230], null],
  mount,
});
