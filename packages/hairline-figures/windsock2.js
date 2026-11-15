/**
 * Wind vane: a weathervane on a mast over a plinth, four compass arms tipped
 * with balls, and a long arrow with a split tail fin on the pivot. The pointer
 * is where the wind comes from: the arrow swings on a spring to point at it,
 * and lights. At rest the arrow sits off the arms at an easy angle, and the
 * north tip is the bright mark. The slider is how briskly the vane swings.
 *
 * The pattern: a continuous aim (one spring on an angle); the hit is the
 * ground plane, which never moves.
 */
const {
  Cam, circ, facing, fit, fillet, poly, prism, proj, rings, seg, unproj, spring, stepS, rad,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const H = 64, HA = 50, ARM = 22, TH = 1.3, REST = rad(160);
const VANE = [[42, 0], [28, 8.5], [28, 1.8], [-24, 1.8], [-37, 13], [-46, 13], [-39, 0], [-46, -13], [-37, -13], [-24, -1.8], [28, -1.8], [28, -8.5]];
const RAD = [0.6, 1.2, 0.8, 0.8, 1.5, 1.5, 1.2, 1.5, 1.5, 0.8, 0.8, 1.2];
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.8);
  const ext = [[-24, -24, 0], [24, 24, 0], [24, -24, 0], [-24, 24, 0]];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ext.push([46 * Math.cos(a), 46 * Math.sin(a), H + 13], [46 * Math.cos(a), 46 * Math.sin(a), H - 13]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [b0, b1] = rings(-20, -20, 20, 20, 6, 1.6);
  put(solid(g), prism(P, front, b0, b1, 0, 5));
  const [c0, c1] = rings(-8, -8, 8, 8, 4, 1.2);
  put(solid(g), prism(P, front, c0, c1, 5, 8));
  const tips = [[ARM, 0], [0, ARM], [-ARM, 0], [0, -ARM]];
  const far = tips.filter(([x, y]) => x + y < 0), near = tips.filter(([x, y]) => x + y > 0);
  mk("path", { class: "nf sil", d: far.map(([x, y]) => seg(P(0, 0, HA), P(x, y, HA))).join("") }, g);
  for (const [x, y] of far) place(flatDot(g, C, 1.8, "dot off"), P(x, y, HA));
  put(solid(g), prism(P, front, circ(2.2, 20), null, 8, H - 2));
  put(solid(g), prism(P, front, circ(3.6, 20), circ(2.8, 20), HA - 1.5, HA + 1.5));
  mk("path", { class: "nf sil", d: near.map(([x, y]) => seg(P(0, 0, HA), P(x, y, HA))).join("") }, g);
  for (const [x, y] of near) place(flatDot(g, C, 1.8, "dot off"), P(x, y, HA));
  const back = mk("path", { class: "sil" }, g);
  const vane = solid(g);
  put(solid(g), prism(P, front, circ(3, 20), circ(2.2, 20), H - 2.5, H + 2.5));
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;

  function plate(a, off) {
    const c = Math.cos(a), s = Math.sin(a), nx = -s * off, ny = c * off;
    return poly(fillet(VANE.map(([u, z]) => P(u * c + nx, u * s + ny, H + z)), RAD));
  }
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const side = Math.cos(a) - Math.sin(a) > 0 ? 1 : -1; // +n side faces the viewer
    back.setAttribute("d", plate(a, -side * TH));
    vane.sil.setAttribute("d", plate(a, 0));
    const c = Math.cos(a), s = Math.sin(a), Q = (u, z) => P(u * c, u * s, H + z);
    vane.cr.setAttribute("d", seg(Q(-24, 0), Q(26, 0)) + seg(Q(-36.5, 10), Q(-40, 1.5)) + seg(Q(-36.5, -10), Q(-40, -1.5)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const all = [...g.querySelectorAll("ellipse, circle")];
  let over = null;
  function retarget() {
    const aim = over ? Math.atan2(over[1], over[0]) : REST;
    sp.t = sp.t + wrap(aim - sp.t);
    vane.sil.classList.toggle("hi", !!over);
    all.forEach((d, i) => d.setAttribute("class", !over && i === all.length - 1 ? "dot" : "dot off"));
    const deg = Math.round(((aim * 180) / Math.PI + 405) % 360);
    read.textContent = over ? String(deg).padStart(3, "0") + "°" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r < 6 || r > 140 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "windsock2",
  means: "A wind vane on a mast: the arrow swings round to point at the pointer, as if the wind came from there, and lights.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[91, 242], [358, 267], [200, 207], null],
  mount,
});
