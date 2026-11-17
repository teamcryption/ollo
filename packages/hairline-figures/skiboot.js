/**
 * Ski boot: a hard shell on its sole, a cuff standing over the heel and two
 * buckle levers across the cuff. The pointer over the boot flips the levers
 * open and the cuff flexes forward on its pivot, bright. At rest one lever
 * stands half open, bright. The slider is how far the cuff flexes.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 13, CZ = 20, CH = 46, PX = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-4, -W, 0], [66, W, 0], [66, -W, 0], [-4, W, 0], [0, 0, CZ + CH + 4], [40, 0, CZ + CH], [30, W + 14, CZ + 30]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [or, oi] = rings(-4, -W - 1, 66, W + 1, 8, 1.5);
  put(solid(g), prism(P, front, or, oi, 0, 5));
  const [lr, li] = rings(-2, -W, 62, W, 12, 2);
  put(solid(g), prism(P, front, lr, li, 5, CZ));
  const cuff = mk("path", { class: "sil" }, g), lip = mk("path", { class: "nf lo" }, g);
  const levs = [0, 1].map(() => mk("path", { class: "sil" }, g));
  const flex = spring(4, { k: 70, c: 11 }), open = [spring(30, { k: 80, c: 10 }), spring(0, { k: 80, c: 10 })];

  // a cuff point (x, y, height above the ankle) flexed forward a degrees about the pivot
  const F = (x, y, z, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)), dx = x - PX; return P(PX + dx * c + z * s, y, CZ - dx * s + z * c); };
  const foot = rrect(0, -W + 1, 30, W - 1, 10, 6);
  let last = "";
  function draw() {
    const a = flex.x, key = a.toFixed(2) + open[0].x.toFixed(2) + open[1].x.toFixed(2);
    if (key === last) return;
    last = key;
    const pts = [];
    for (const z of [0, CH]) for (const q of foot) pts.push(F(q.u, q.v, z, a));
    cuff.setAttribute("d", poly(hull(pts)));
    lip.setAttribute("d", poly(foot.map((q) => F(q.u, q.v, CH - 3, a))));
    [14, 32].forEach((zb, i) => {
      const b = rad(open[i].x), l = 20, e = 25;
      const tip = [e - l * Math.cos(b), W - 1 + l * Math.sin(b)];
      levs[i].setAttribute("d", poly(hull([F(e, W - 1, zb - 2.5, a), F(e, W - 1, zb + 2.5, a), F(tip[0], tip[1] + 1.5, zb - 2.5, a), F(tip[0], tip[1] + 1.5, zb + 2.5, a), F(tip[0], tip[1], zb, a)])));
    });
  }

  const B = register(stage, (dt) => { const m = [stepS(flex, dt), stepS(open[0], dt), stepS(open[1], dt)].some(Boolean); draw(); return m; });
  bag.add(B.unregister);
  draw();

  const mid = P(30, 0, CZ);
  let on = null;
  function set(p) {
    const hov = !!p && Math.abs(p[0] - mid[0]) < 110 && Math.abs(p[1] - mid[1]) < 90;
    flex.t = hov ? amp : 4; open[0].t = hov ? 70 : 30; open[1].t = hov ? 62 : 0;
    if (hov !== on) {
      on = hov;
      cuff.classList.toggle("hi", hov);
      levs[0].classList.toggle("hi", !hov);
    }
    read.textContent = hov ? "flex " + Math.round(amp) + "°" : "rest";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (on) flex.t = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "skiboot",
  means: "A ski boot: the pointer flips its buckles open and the cuff flexes forward on its pivot.",
  rules: [1, 3, 4, 5],
  range: [10, 22, 30],
  tour: [[170, 105], [204, 150], [150, 140], null],
  mount,
});
