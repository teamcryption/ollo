/**
 * Stud finder: a hand-sized finder lying on a strip of wall with its studs
 * marked as dim lines. The pointer over the wall slides the finder along it
 * to the next stud, its sensor line lighting where it stops. At rest the
 * finder sits short of the first stud, bright. The slider is how far it slides.
 */
const { Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const WL = 170, WW = 46, WZ = 5, FL = 50, FW = 34, FZ = 16, X0 = 8, SL = 100;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  const box = [[0, 0, 0], [WL, WW, 0], [WL, 0, 0], [0, WW, 0], [X0, 6, WZ + FZ + 3], [WL - 8, 6, WZ + FZ + 3]];
  fit(C, box, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, 0, WL, WW, 5, 2);
  put(solid(g), prism(P, front, wr, wi, 0, WZ));
  let st = "";
  for (const x of [72, 138]) st += seg(P(x, 3, WZ), P(x, WW - 3, WZ));
  mk("path", { d: st, class: "nf lo" }, g);
  const body = solid(g), pad = solid(g), sensor = mk("path", { class: "nf" }, g);
  body.sil.classList.add("hi");

  const tw = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const x = X0 + SL * v, y = (WW - FW) / 2;
    const [br, bi] = rings(x, y, x + FL, y + FW, 12, 1.6);
    put(body, prism(P, front, br, bi, WZ, WZ + FZ));
    const [pr, pi] = rings(x + 8, y + 7, x + 32, y + FW - 7, 6, 1.2);
    put(pad, prism(P, front, pr, pi, WZ + FZ, WZ + FZ + 2.5));
    sensor.setAttribute("d", seg(P(x + FL - 7, y + 6, WZ + FZ), P(x + FL - 7, y + FW - 6, WZ + FZ)));
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
    read.textContent = a ? "stud" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { tset(tw, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "stud",
  means: "A stud finder on a strip of wall: the pointer slides it along the wall to the next stud.",
  rules: [1, 3, 5, 6],
  range: [0.3, 1, 1],
  tour: [[124, 108], [200, 175], [270, 230], null],
  mount,
});
