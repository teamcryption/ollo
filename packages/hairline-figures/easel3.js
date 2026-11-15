/**
 * Paint easel: a studio A-frame easel, two splayed front legs and a mast,
 * a ledge holding a canvas, and a back leg propping it. The pointer across
 * the easel tilts the whole front back on its feet, the back leg swinging
 * out to hold it; left stands it near upright. At rest the canvas, bright,
 * leans gently back.
 */
const { Cam, clamp, fit, hull, poly, proj, seg, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const F = 30, TOP = 100, BL = 104, REST = 12, MINA = 2, MAXA = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.35);
  const tilt = (a) => { const c = Math.cos(a), s = Math.sin(a); return ([x, y, z]) => [x, F + (y - F) * c - z * s, (y - F) * s + z * c]; };
  const lo = tilt((MINA * Math.PI) / 180), hiT = tilt((MAXA * Math.PI) / 180);
  fit(C, [[0, F + 10, 0], [50, F + 10, 0], lo([25, 34, TOP]), hiT([25, 34, TOP]), [25, F - 70, 0], [25, F - 20, 0], hiT([6, 36, 72]), lo([46, 38, 26])], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const parts = ["back", "legL", "legR", "mast", "ledge", "canvas"].map(() => ({ s: mk("path", { class: "sil" }, g), c: mk("path", { class: "nf lo" }, g) }));
  const [back, legL, legR, mast, ledge, canvas] = parts;
  const ang = tween(REST);
  let last = NaN;
  function box(f, x0, x1, y0, y1, z0, z1) {
    const c = [];
    for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) c.push(P(...f([x, y, z])));
    return { sil: poly(hull(c)), cr: seg(c[7], c[3]) + seg(c[7], c[5]) + seg(c[7], c[6]) };
  }
  const set = (p, b, extra) => { p.s.setAttribute("d", b.sil); p.c.setAttribute("d", b.cr + (extra || "")); };
  function leg(f, xa, xb) {
    const pts = [];
    for (const y of [F, F + 2.5]) for (const [x, z] of [[xa - 2, 0], [xa + 2, 0], [xb - 1.2, TOP - 6], [xb + 1.2, TOP - 6]]) pts.push(P(...f([x, y, z])));
    return { sil: poly(hull(pts)), cr: "" };
  }
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const f = tilt((deg * Math.PI) / 180), top = f([25, 32, TOP - 4]);
    const fy = top[1] - Math.sqrt(Math.max(0, BL * BL - top[2] * top[2]));
    const bp = [];
    for (const dx of [-1.6, 1.6]) { bp.push(P(25 + dx, top[1], top[2]), P(25 + dx * 1.6, fy, 0)); }
    set(back, { sil: poly(hull(bp)), cr: "" });
    set(legL, leg(f, 8, 23));
    set(legR, leg(f, 42, 27));
    set(mast, box(f, 23, 27, F + 1, F + 4, 0, TOP));
    set(ledge, box(f, 4, 46, F + 2, F + 10, 24, 27.5));
    set(canvas, box(f, 6, 44, F + 4, F + 6.5, 27.5, 72), seg(P(...f([9, F + 6.5, 31])), P(...f([41, F + 6.5, 31]))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // the hit: fixed screen band across the easel's rest width
  const r0 = tilt((REST * Math.PI) / 180), xs = [P(...r0([4, F, 0]))[0], P(...r0([46, F, 0]))[0], P(...r0([4, F, 72]))[0], P(...r0([46, F, 72]))[0]];
  const ys = [P(...r0([25, F, TOP]))[1], P(25, F + 10, 0)[1]];
  const xl = Math.min(...xs), xr = Math.max(...xs);
  function hit([sx, sy]) {
    if (sx < xl - 10 || sx > xr + 10 || sy < ys[0] - 10 || sy > ys[1] + 10) return -1;
    return clamp((sx - xl) / (xr - xl), 0, 1);
  }
  let cur = -2;
  function setT(t) {
    const deg = t < 0 ? REST : Math.round(MINA + (MAXA - MINA) * Math.pow(t, 0.5 + reach));
    if (deg === cur) return;
    cur = deg;
    tset(ang, deg, performance.now(), 0);
    canvas.s.classList.add("hi");
    read.textContent = t < 0 ? "rest" : deg + "°";
    B.wake();
  }
  setT(-1);
  bag.add(pointer(stage, { move: (p) => setT(hit(p)), leave: () => setT(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "easel3",
  means: "A studio easel with a canvas: the pointer across it tilts the whole front back on its feet, the back leg swinging out to prop it.",
  rules: [1, 3, 5, 6],
  range: [0, 0.5, 1],
  tour: [[126, 161], [196, 196], [161, 138], null],
  mount,
});
