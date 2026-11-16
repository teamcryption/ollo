/**
 * Door wedge: a door on a floor, hung on a post, held open by a wedge
 * pushed under its free end. The pointer's bearing round the hinge swings
 * the door, and the wedge slides along the floor with the door's edge to
 * hold it. At rest the door stands part open and the wedge is bright. The
 * slider is the widest swing.
 *
 * The pattern: one part turned about a fixed axis by a continuous input.
 */
const { Cam, facing, fit, hull, poly, prism, proj, rings, unproj, clamp, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const LD = 52, TD = 2.5, HD = 64, GAP = 3, REST = 72, WL = 16;
const V = [0.61, 0.61, 0.5];
// box faces over corners i = bx + 2 by + 4 bz, outward
const FACES = [[0, 2, 3, 1], [4, 5, 7, 6], [0, 1, 5, 4], [2, 6, 7, 3], [0, 4, 6, 2], [1, 3, 7, 5]];
const WF = [[0, 1, 2], [3, 5, 4], [0, 3, 4, 1], [1, 4, 5, 2], [0, 2, 5, 3]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let MAX = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-10, -10, 0], [LD + 12, LD + 12, 0], [-10, -10, HD + 6], [LD, 0, HD], [0, LD, HD]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const [fr, fi] = rings(-10, -10, LD + 12, LD + 12, 6, 1.8);
  put(solid(g), prism(P, facing(C), fr, fi, -3, 0));
  const post = { sil: mk("path", { class: "sil" }, g), cr: mk("path", { class: "nf lo" }, g) };
  const door = { sil: mk("path", { class: "sil" }, g), cr: mk("path", { class: "nf lo" }, g) };
  const wedge = { sil: mk("path", { class: "sil" }, g), cr: mk("path", { class: "nf lo" }, g) };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const solidOf = (o, pts, faces) => {
    o.sil.setAttribute("d", poly(hull(pts.map((p) => P(...p)))));
    let d = "";
    for (const f of faces) {
      const a = sub(pts[f[1]], pts[f[0]]), b = sub(pts[f[2]], pts[f[0]]);
      const n = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      if (n[0] * V[0] + n[1] * V[1] + n[2] * V[2] > 0) d += poly(f.map((i) => P(...pts[i])));
    }
    o.cr.setAttribute("d", d);
  };
  const box = (x0, x1, y0, y1, z0, z1, tf) => { const r = []; for (let i = 0; i < 8; i++) r.push(tf([i & 1 ? x1 : x0, i & 2 ? y1 : y0, i & 4 ? z1 : z0])); return r; };
  solidOf(post, box(-6, 0, -6, 0, 0, HD + 4, (p) => p), FACES);
  const ang = spring(REST, { k: 70, c: 15 });
  let last = NaN;
  function draw(a) {
    if (a === last) return; last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const R = ([u, w, z]) => [u * c - w * s, u * s + w * c, z];
    solidOf(door, box(0.5, LD, -TD / 2, TD / 2, GAP, HD, R), FACES);
    const u0 = LD - 10, wp = [];
    for (const z of [0, 1]) for (const [w, h] of [[-1, 0.6], [WL, 0], [WL, 7]]) wp.push(R([u0 + z * 9, w, h]));
    // reorder: triangle 0..2 at u0, 3..5 at u0+9
    solidOf(wedge, [wp[0], wp[1], wp[2], wp[3], wp[4], wp[5]].map(([x, y, z], i) => [x, y, i === 0 || i === 3 ? 0 : z]), WF);
    // depth: whichever is nearer paints last
    const dDoor = (LD / 2) * (c * V[0] + s * V[1]), dWedge = R([u0 + 4, WL / 2, 0]);
    const wd = dWedge[0] * V[0] + dWedge[1] * V[1];
    if (wd > dDoor) { g.appendChild(door.sil); g.appendChild(door.cr); g.appendChild(wedge.sil); g.appendChild(wedge.cr); }
    else { g.appendChild(wedge.sil); g.appendChild(wedge.cr); g.appendChild(door.sil); g.appendChild(door.cr); }
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  wedge.sil.classList.add("hi");
  const set = (a) => { ang.t = a; read.textContent = a === REST ? "rest" : Math.round(a) + "°"; B.wake(); };
  set(REST);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, 0);
      if (x < -12 || y < -12 || x > LD + 30 || y > LD + 30) return set(REST);
      set(Math.round(clamp((Math.atan2(y, x) * 180) / Math.PI, 8, MAX)));
    },
    leave: () => set(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { MAX = v; }, destroy: bag.dispose };
}

hairline({
  name: "doorstop",
  means: "A door held open by a wedge on the floor: the pointer swings the door round its hinge and the wedge slides along to hold it.",
  rules: [1, 3, 5, 6],
  range: [45, 85, 90],
  tour: [[150, 215], [205, 222], [251, 223], null],
  mount,
});
