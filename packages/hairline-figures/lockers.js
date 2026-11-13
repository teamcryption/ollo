/**
 * Parcel lockers: a cabinet of twelve locker doors, four across and three
 * high, each door with a handle by its free edge, hinged on its left. The
 * pointer picks a locker on the cabinet's face: its door swings open on the
 * parcel inside, and the doors around it come ajar, staggered from it. At
 * rest one door stands open on a parcel, bright. The slider is the stagger.
 *
 * The pattern: one of many on a face. Tweens per door; the hit is read on the
 * face plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 4, NR = 3, CW = 24, CH = 22, D = 26, BASE = 6, IN = 1.3, TK = 1.4, OPEN = 105, AJAR = 16;
const W = NC * CW, H = BASE + NR * CH + 3, FAV = [1, 1];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D + CW, 0], [0, 0, H], [W, 0, H], [0, D + CW, H - 3]], 200, 162);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, W, D, 3, 1.3);
  put(solid(g), prism(P, front, cr, ci, 0, H));
  const onFace = (x, z) => P(x, D, z);
  // plinth line across the face
  mk("path", { d: seg(onFace(1, BASE - 1.5), onFace(W - 1, BASE - 1.5)), class: "nf lo" }, g);

  const doors = [];
  for (let c = 0; c < NC; c++) for (let r = 0; r < NR; r++) {
    const x0 = c * CW + IN, x1 = (c + 1) * CW - IN, z0 = BASE + r * CH + IN, z1 = BASE + (r + 1) * CH - IN;
    // the compartment's mouth and the parcel inside, painted before the door that hides them
    mk("path", { d: poly([onFace(x0, z0), onFace(x1, z0), onFace(x1, z1), onFace(x0, z1)]), class: "nf lo" }, g);
    const px0 = x0 + 4, px1 = x1 - 4, pz1 = z0 + CH * 0.62, mid = (px0 + px1) / 2;
    const at = (x, z) => P(x, D - 2, z);
    mk("path", { d: poly([at(px0, z0 + 1), at(px1, z0 + 1), at(px1, pz1), at(px0, pz1)]) }, g);
    mk("path", { d: seg(at(mid, z0 + 1), at(mid, pz1)), class: "nf lo" }, g);
    const grp = mk("g", {}, g);
    const back = mk("path", { class: "lo" }, grp), face = mk("path", { class: "sil" }, grp), handle = mk("path", { class: "nf" }, grp);
    const fav = c === FAV[0] && r === FAV[1];
    doors.push({ c, r, x0, x1, z0, z1, back, face, handle, a: tween(fav ? OPEN * 0.8 : 0), last: NaN });
  }

  function draw(d, a) {
    const cs = Math.cos(rad(a)), sn = Math.sin(rad(a)), w = d.x1 - d.x0;
    const pt = (u, z, t) => P(d.x0 + u * cs + sn * t, D + 0.4 + u * sn - cs * t, z);
    const out = (t) => poly([pt(0, d.z0, t), pt(w, d.z0, t), pt(w, d.z1, t), pt(0, d.z1, t)]);
    const shows = a < 45; // past 45 degrees the door's inside faces the viewer
    d.back.setAttribute("d", out(shows ? -TK : 0));
    d.face.setAttribute("d", out(shows ? 0 : -TK));
    const hz = (d.z0 + d.z1) / 2, t = shows ? 0 : -TK;
    d.handle.setAttribute("d", seg(pt(w - 3, hz - 3.5, t), pt(w - 3, hz + 3.5, t)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const d of doors) {
      const a = tval(d.a, now);
      if (a !== d.last) { draw(d, a); d.last = a; }
      if (!tdone(d.a, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The locker under the point, read on the cabinet's face plane (y = D), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    if (x < 0 || x > W || z < BASE || z > BASE + NR * CH) return -1;
    return clamp(Math.floor(x / CW), 0, NC - 1) * NR + clamp(Math.floor((z - BASE) / CH), 0, NR - 1);
  }

  let act = -2;
  const favI = FAV[0] * NR + FAV[1];
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const ac = a >= 0 ? doors[a] : null, fc = from >= 0 ? doors[from] : null;
    doors.forEach((d, i) => {
      const dist = ac ? Math.abs(d.c - ac.c) + Math.abs(d.r - ac.r) : 0;
      const th = a < 0 ? (i === favI ? OPEN * 0.8 : 0) : dist === 0 ? OPEN : dist === 1 ? AJAR : 0;
      tset(d.a, th, now, fc ? (Math.abs(d.c - fc.c) + Math.abs(d.r - fc.r)) * stag : 0);
      d.face.classList.toggle("hi", i === (a < 0 ? favI : a));
    });
    read.textContent = a < 0 ? "rest" : `locker ${ac.c + 1}·${NR - ac.r}`;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "lockers",
  means: "Twelve parcel lockers: the door under the pointer swings open on its parcel, and the doors around it come ajar.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[145, 178], [200, 150], [255, 148], null],
  mount,
});
