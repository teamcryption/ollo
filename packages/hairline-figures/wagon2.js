/**
 * Pull wagon: a child's wagon, a rounded tub on four spoked wheels with a
 * long pull handle on a pivot at its nose. The pointer is where the child
 * pulls from: the handle swings round its pivot to point at it, on a spring,
 * clamped to the reach of a real pivot. At rest the handle lies off to one
 * side and the tub's rim is bright.
 *
 * The pattern: a continuous aim (one spring on the handle's angle); the hit
 * is on the floor's plane, which never moves.
 */
const {
  Cam, fit, poly, prism, proj, rings, seg, unproj, spring, stepS, clamp, rad, facing,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const L = 50, PX = 36, PZ = 9, REST = rad(-26), MAXA = rad(78), WR = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-36, -24, 0], [PX + L, -L, 0], [PX + L, L, 0], [-36, 24, 30], [PX, 0, 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  mk("path", { class: "dash", d: seg(P(-40, 0, 0), P(PX, 0, 0)) }, g);

  const wheel = (x, y) => {
    const pts = [], sp = [];
    for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; pts.push(P(x + WR * Math.cos(a), y, WR + WR * Math.sin(a))); }
    for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 + 0.3; sp.push(seg(P(x, y, WR), P(x + (WR - 2) * Math.cos(a), y, WR + (WR - 2) * Math.sin(a)))); }
    const w = mk("g", {}, g);
    mk("path", { class: "sil", d: poly(pts) }, w);
    mk("path", { class: "nf lo", d: sp.join("") }, w);
    place(flatDot(w, C, 0.9, "dot off"), P(x, y, 0));
  };
  // far wheels, the axles, the tub, the near wheels
  wheel(-22, -21); wheel(22, -21);
  mk("path", { class: "nf lo", d: seg(P(-22, -21, WR), P(-22, 21, WR)) + seg(P(22, -21, WR), P(22, 21, WR)) }, g);
  const [ring, inner] = rings(-32, -17, 32, 17, 6, 1.6);
  const tub = solid(g);
  put(tub, prism(P, front, ring, inner, 12, 30));
  mk("path", { class: "nf lo", d: seg(P(-26, 17, 16), P(26, 17, 16)) }, g);
  wheel(-22, 21); wheel(22, 21);
  mk("path", { class: "nf sil", d: seg(P(30, 0, 12), P(PX, 0, PZ)) }, g);
  const pivot = flatDot(g, C, 1.4, "dot m");
  place(pivot, P(PX, 0, 0));
  const handle = mk("path", { class: "nf sil" }, g);

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a), h = L * 0.92, tz = PZ + L * 0.39;
    const tx = PX + h * c, ty = h * s;
    handle.setAttribute("d",
      seg(P(PX - s, c, PZ), P(tx - s, ty + c, tz)) + seg(P(PX + s, -c, PZ), P(tx + s, ty - c, tz)) +
      seg(P(tx - 8 * s, ty + 8 * c, tz), P(tx + 8 * s, ty - 8 * c, tz)) +
      seg(P(tx - 8 * s, ty + 8 * c, tz + 2.4), P(tx + 8 * s, ty - 8 * c, tz + 2.4)) +
      seg(P(PX + 4 * c - 2 * s, 4 * s + 2 * c, PZ + 1.7), P(PX + 4 * c + 2 * s, 4 * s - 2 * c, PZ + 1.7)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function show(on) {
    tub.sil.classList.toggle("hi", !on);
    handle.classList.toggle("hi", on);
    read.textContent = on ? Math.round((sp.t * 180) / Math.PI) + "°" : "rest";
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), dx = x - PX, d = Math.hypot(dx, y);
      if (d > L + 40 || x < -50) { sp.t = REST; show(false); }
      else if (d > 6) { sp.t = clamp(Math.atan2(y, dx), -MAXA, MAXA); show(true); }
      B.wake();
    },
    leave: () => { sp.t = REST; show(false); B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  show(false);
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "wagon2",
  means: "A child's pull wagon whose long handle swings round its pivot to point at the pointer, the way a child would pull it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[293, 245], [118, 254], [359, 103], null],
  mount,
});
