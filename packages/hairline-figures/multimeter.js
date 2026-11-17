/**
 * Multimeter: a handheld meter lying on the bench, a window at its head, a
 * big rotary dial and the probe jacks at its foot. The pointer over it tilts
 * the meter up on its back edge, as it is propped to be read. At rest it lies
 * nearly flat, its dial bright. The slider is how far it tilts.
 */
const { Cam, circ, fit, facing, poly, prism, proj, rings, ringAt, rrect, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const L = 100, W = 62, H = 12, T0 = 6, TILT = 52;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.2);
  const P0 = proj(C);
  const tp = (deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return (x, y, z) => [L - (L - x) * c - z * s * -1 * -1, y, (L - x) * s + z * c]; };
  const box = [];
  for (const d of [T0, T0 + TILT]) { const f = tp(d); for (const x of [0, L]) for (const y of [0, W]) for (const z of [0, H + 5]) box.push(f(x, y, z)); }
  fit(C, box, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const body = solid(g), win = mk("path", { class: "nf lo" }, g), jacks = mk("path", { class: "nf lo" }, g);
  const dial = solid(g), ptr = mk("path", { class: "nf" }, g);
  dial.sil.classList.add("hi");

  const tw = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const f = tp(T0 + TILT * v), Q = (x, y, z) => P(...f(x, y, z));
    const [br, bi] = rings(0, 0, L, W, 12, 1.8);
    put(body, prism(Q, front, br, bi, 0, H));
    win.setAttribute("d", poly(ringAt(Q, rrect(8, 10, 32, W - 10, 4, 4), H)));
    let j = "";
    for (const y of [16, 31, 46]) j += poly(ringAt(Q, disc(88, y, 3.2, 16), H));
    jacks.setAttribute("d", j);
    put(dial, prism(Q, front, disc(58, W / 2, 17), disc(58, W / 2, 15), H, H + 4));
    ptr.setAttribute("d", seg(Q(46, W / 2 - 6, H + 4), Q(68, W / 2 + 7, H + 4)));
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
    read.textContent = a ? "tilt" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { tset(tw, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "multimeter",
  means: "A multimeter lying on the bench with its dial and jacks: the pointer tilts it up on its back edge to be read.",
  rules: [1, 3, 5, 6],
  range: [0.3, 1, 1],
  tour: [[213, 218], [178, 190], [240, 250], null],
  mount,
});
