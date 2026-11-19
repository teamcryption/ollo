/**
 * Camera obscura: a wooden box with a ground-glass screen on its lid under a
 * hinged hood, and an inner box carrying the lens that slides out of its
 * front to focus. The pointer over the box draws the lens box out. At rest
 * the screen is bright. The slider is how far the lens box slides.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, lerp, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 44, BY = 36, BZ = 30, REST = 5, LY = 18, LZ = 16, LR = 8, LL = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[0, 0, 0], [BX + 46 + LL, 0, 0], [BX + 46 + LL, BY, 0], [0, BY, 0], [0, 0, BZ + 26], [BX, BY, BZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [or, oi] = rings(0, 0, BX, BY, 3, 1.6);
  put(solid(g), prism(P, front, or, oi, 0, BZ));

  // the hood: a flap hinged at the lid's back edge, leaning back
  const hood = [[6, 4], [6, 32]], a = (68 * Math.PI) / 180, H = 24;
  const flap = (d) => hood.map(([x, y]) => P(x - H * Math.cos(a) - d, y, BZ + H * Math.sin(a))).concat(hood.slice().reverse().map(([x, y]) => P(x - d, y, BZ)));
  mk("path", { d: poly(hull(flap(0).concat(flap(1.6)))) }, g);
  mk("path", { d: poly(flap(0)), class: "nf lo" }, g);
  // the ground glass on the lid
  const glass = mk("path", { d: poly([P(10, 6, BZ), P(38, 6, BZ), P(38, 30, BZ), P(10, 30, BZ)]), class: "nf sil" }, g);
  mk("path", { d: poly([P(13, 9, BZ), P(35, 9, BZ), P(35, 27, BZ), P(13, 27, BZ)]), class: "nf lo" }, g);

  // the inner box with the lens, sliding out along +x
  const inner = solid(g);
  const tube = mk("path", { class: "sil" }, g), lensRim = mk("path", { class: "nf lo" }, g), glassL = mk("path", { class: "nf lo" }, g);
  const ring = (x, r) => { const o = []; for (let i = 0; i < 32; i++) { const t = (i / 32) * Math.PI * 2; o.push(P(x, LY + r * Math.cos(t), LZ + r * Math.sin(t))); } return o; };

  const p = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const s = lerp(REST, amp, v), x1 = BX + s;
    const [ir, ii] = rings(BX - 1, 4, x1, BY - 4, 2, 1.4);
    put(inner, prism(P, front, ir, ii, 3.5, BZ - 3.5));
    tube.setAttribute("d", poly(hull(ring(x1, LR).concat(ring(x1 + LL, LR)))));
    lensRim.setAttribute("d", poly(ring(x1 + LL, LR)));
    glassL.setAttribute("d", poly(ring(x1 + LL, LR - 3)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(p, now)); return !tdone(p, now); });
  bag.add(B.unregister);

  const box = [P(0, 0, 0), P(BX + REST + LL, 0, 0), P(BX + REST + LL, BY, 0), P(0, BY, 0), P(0, 0, BZ + 22), P(BX + REST + LL, BY, BZ), P(BX + REST + LL, 0, BZ)];
  const xs = box.map((q) => q[0]), ys = box.map((q) => q[1]);
  const hit = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(p, on ? 1 : 0, performance.now(), 0);
    glass.classList.toggle("hi", !on);
    tube.classList.toggle("hi", on);
    read.textContent = on ? "focus" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (q) => setActive(hit(q)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "cameraobscura",
  means: "A camera obscura box with a ground-glass screen under its hood: the pointer slides the lens box out of the front to focus.",
  rules: [1, 4, 5, 8],
  range: [18, 32, 46],
  tour: [[198, 160], [240, 200], [160, 90], null],
  mount,
});
