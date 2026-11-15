/**
 * Key cutter: a bench machine with a cutting wheel on a post at the back and
 * a carriage at the front holding a key in its vice. The pointer's place
 * along the machine slides the carriage there, so the key's blade runs past
 * the wheel. At rest the key is bright. The slider is how far the carriage
 * may travel.
 */
const { Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, unproj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const L = 64, D = 34, TOP = 10, WX = 32, WZ = 30, WR = 10, C0 = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[0, 0, 0], [L, D, 0], [L, 0, 0], [0, D, 0], [WX, 6, WZ + WR], [L, D, TOP + 14]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const box = (x0, y0, x1, y1, z0, z1, r, b, parent = g) => { const s = solid(parent), [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(0, 0, L, D, 0, TOP, 3, 1.2);
  box(WX - 6, 2, WX + 6, 9, TOP, WZ + 2, 2, 0.8);
  const circ = (y, r) => { const o = []; for (let i = 0; i < 30; i++) { const a = (i / 30) * Math.PI * 2; o.push(P(WX + r * Math.cos(a), y, WZ + r * Math.sin(a))); } return o; };
  const wheel = mk("g", {}, g);
  const teeth = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; teeth.push(seg2(a)); }
  function seg2(a) { return open([P(WX + (WR - 1.5) * Math.cos(a), 12, WZ + (WR - 1.5) * Math.sin(a)), P(WX + WR * Math.cos(a), 12, WZ + WR * Math.sin(a))]); }
  mk("path", { class: "sil", d: poly(hull(circ(9, WR).concat(circ(12, WR)))) }, wheel);
  mk("path", { class: "nf lo", d: poly(circ(12, WR)) + poly(circ(12, 2.5)) + teeth.join("") }, wheel);

  const car = mk("g", {}, g), cbase = solid(car), vice = solid(car), key = mk("path", { class: "sil" }, car), kcr = mk("path", { class: "nf lo" }, car);
  const cx = tween(C0);
  let last = NaN;
  function draw(c) {
    if (c === last) return;
    last = c;
    let [o, i] = rings(c - 12, 16, c + 12, 31, 2.5, 1);
    put(cbase, prism(P, front, o, i, TOP, TOP + 5));
    [o, i] = rings(c + 2, 18, c + 10, 29, 1.8, 0.8);
    put(vice, prism(P, front, o, i, TOP + 5, TOP + 13));
    const y = 15.5, z = TOP + 9, k = (x, dz) => P(x, y, z + dz);
    const head = []; for (let j = 0; j < 20; j++) { const a = (j / 20) * Math.PI * 2; head.push(P(c + 16 + 5 * Math.cos(a), y, z + 5 * Math.sin(a))); }
    const blade = [k(c - 16, 2), k(c - 18, 0), k(c - 16, -2), k(c - 13, -2), k(c - 11, -3.5), k(c - 9, -2), k(c - 6, -3.5), k(c - 4, -2), k(c - 1, -3.5), k(c + 1, -2), k(c + 11, -2), k(c + 11, 2)];
    key.setAttribute("d", poly(hull(head)) + poly(blade));
    const hole = []; for (let j = 0; j < 12; j++) { const a = (j / 12) * Math.PI * 2; hole.push(P(c + 18 + 1.6 * Math.cos(a), y, z + 1.6 * Math.sin(a))); }
    kcr.setAttribute("d", open([k(c - 15, 0.6), k(c + 10, 0.6)]) + poly(hole));
  }

  const B = register(stage, (_dt, now) => { draw(tval(cx, now)); return !tdone(cx, now); });
  bag.add(B.unregister);

  // the hit: the pointer on the bench top, a plane that never moves
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOP);
    if (x < -10 || x > L + 10 || y < -10 || y > D + 10) return -1;
    return x;
  }

  let act = -2;
  function setActive(x) {
    const lo = WX - reach, hi = WX + reach, c = x < 0 ? C0 : Math.round(clamp(x, lo, hi));
    if (c === act) return;
    act = c;
    tset(cx, c, performance.now(), 0);
    read.textContent = x < 0 ? "rest" : "cut " + Math.round(Math.abs(c - WX) + 1);
    B.wake();
  }
  key.classList.add("hi");
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; act = -2; }, destroy: bag.dispose };
}

hairline({
  name: "vendlocker",
  means: "A key cutting machine: the pointer's place along the bench slides the carriage there, running the key's blade past the wheel.",
  rules: [1, 3, 4, 5],
  range: [6, 14, 20],
  tour: [[151, 123], [216, 156], [240, 167], null],
  mount,
});
