/**
 * Ice scoop: a hotel ice scoop, a round-bottomed trough with a slanted lip
 * and a round handle, lying on a drip tray beside a few cubes. The pointer on
 * the scoop picks it up: it lifts off the tray and tips its lip forward to
 * pour. At rest the scoop lies on the tray and its mouth is bright. The
 * slider is how far it tips.
 *
 * The pattern: one part turning; the hit is the rest pose's outline.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 14, LEN = 50, LIP = 36, HL_ = 34, HR = 3.4, Z0 = 4 + R, N = 18;
const rad = (d) => (d * Math.PI) / 180;
const lipX = (t) => LIP + (LEN - LIP) * (1 - Math.sin(t));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tip = value;
  const C = Cam(45, 0.5, 2.2);
  // local scoop: top edge at z 0, bottom at -R; back plate at x 0
  const back = [], lip = [], backIn = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI, y = R * Math.cos(t), z = -R * Math.sin(t);
    back.push([0, y, z]); backIn.push([1.6, y * 0.88, z * 0.88]); lip.push([lipX(t), y, z]);
  }
  const handle = [];
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2, dy = HR * Math.cos(t), dz = HR * Math.sin(t);
    handle.push([0, dy, -R * 0.55 + dz], [-HL_, dy, -R * 0.15 + dz]);
  }
  const pose = (a, lift) => ([x, y, z]) => {
    const c = Math.cos(a), s = Math.sin(a), dx = x, dz = z + R;
    return [dx * c - dz * s, y, -R + dx * s + dz * c + Z0 + lift];
  };
  const POUR = (a) => pose(-rad(a), 6 + 46 * Math.sin(rad(a)));
  const ext = [[-46, -28, 0], [98, 28, 0], [98, -28, 0], [-46, 28, 0]]
    .concat([...back, ...lip, ...handle].map(pose(rad(4), 0)), [...back, ...lip, ...handle].map(POUR(70)));
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [r, i] = rings(-46, -28, 98, 28, 8, 2); put(solid(g), prism(P, front, r, i, 0, 3)); }
  for (const [x, y] of [[62, 2], [74, -12], [80, 6]]) { const [r, i] = rings(x, y, x + 9, y + 9, 1.6, 0.8); put(solid(g), prism(P, front, r, i, 3, 12)); }
  const hd = mk("path", { class: "sil" }, g), shell = mk("path", { class: "sil" }, g);
  const inner = mk("path", { class: "nf lo" }, g), mouth = mk("path", { class: "nf" }, g);

  const ang = tween(-4);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const T = POUR(a), Q = (p) => P(...T(p));
    hd.setAttribute("d", poly(hull(handle.map(Q))));
    shell.setAttribute("d", poly(hull([...back, ...lip].map(Q))));
    inner.setAttribute("d", "M" + backIn.map(Q).map((p) => p.join(",")).join("L"));
    const ring = [[0, -R, 0], [0, R, 0], ...lip.slice(1, -1), [LEN, -R, 0]];
    mouth.setAttribute("d", poly(ring.map(Q)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const outline = hull([...back, ...lip, ...handle].map((p) => P(...POUR(-4)(p))));
  function inside([x, y]) {
    let s = 0;
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i], b = outline[(i + 1) % outline.length], cr = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
      if (cr !== 0) { if (s && Math.sign(cr) !== s) return false; s = Math.sign(cr); }
    }
    return true;
  }
  let on = null;
  function setOn(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? tip : -4, performance.now(), 0);
    shell.classList.toggle("hi", o); hd.classList.toggle("hi", o);
    mouth.classList.toggle("hi", !o);
    read.textContent = o ? "tip " + Math.round(tip) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tip = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "iceshovel",
  means: "A hotel ice scoop on a drip tray: the pointer picks it up and it tips its lip forward to pour.",
  rules: [1, 4, 5, 8],
  range: [20, 45, 70],
  tour: [[198, 189], [140, 165], [222, 196], null],
  mount,
});
