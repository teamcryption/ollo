/**
 * Telescope mirror: seven hexagonal mirror segments on a round backplane,
 * the outer six set a little higher, as a dish. The pointer picks a segment
 * by where it stands on its own rest top: its actuators push it up, and the
 * segments around it rise a little, staggered from it. At rest one outer
 * segment is raised, bright. The slider is the stagger.
 *
 * The pattern: one of many on a plane, stepped parts (terrain).
 */
const {
  Cam, circ, fit, facing, fillet, prism, proj, ringAt, poly, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid, seg,
} = HL;

const R = 16, GAP = 2.5, D = R * Math.sqrt(3) + GAP, BR = 56, BZ = 6, TH = 3, LIFT = 16, FAV = 2;
const hex = (x, y, r) => {
  const pts = [];
  for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3; pts.push([x + r * Math.cos(a), y + r * Math.sin(a)]); }
  return fillet(pts, [2, 2, 2, 2, 2, 2], 3).map(([u, v]) => {
    const nu = u - x, nv = v - y, l = Math.hypot(nu, nv) || 1;
    return { u, v, nu: nu / l, nv: nv / l };
  });
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-BR, -BR, 0], [BR, BR, 0], [BR, -BR, 0], [-BR, BR, 0], [0, -D, BZ + 2 + TH + LIFT + 4], [0, D, BZ + 2 + TH + LIFT + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(BR, 48), circ(BR - 2.5, 48), 0, BZ));

  const cells = [{ x: 0, y: 0, z0: BZ + 0.6 }];
  for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + (i * Math.PI) / 3; cells.push({ x: D * Math.cos(a), y: D * Math.sin(a), z0: BZ + 2.2 }); }
  cells.forEach((c, k) => { c.k = k; });
  const order = cells.slice().sort((a, b) => a.x + a.y - (b.x + b.y));
  for (const c of order) {
    c.grp = mk("g", {}, g);
    c.post = mk("path", { class: "lo nf" }, c.grp);
    c.s = solid(c.grp);
    c.ring = hex(c.x, c.y, R); c.inner = hex(c.x, c.y, R - 2);
    c.z = tween(c.k === FAV ? LIFT * 0.7 : 0); c.last = NaN;
  }

  function draw(c, lift) {
    if (lift === c.last) return;
    c.last = lift;
    const z = c.z0 + lift;
    put(c.s, prism(P, front, c.ring, c.inner, z, z + TH));
    const b = P(c.x, c.y, BZ), t = P(c.x, c.y, z);
    c.post.setAttribute("d", lift > 0.3 ? seg(P(c.x - 4, c.y, BZ), P(c.x - 4, c.y, z)) + seg(P(c.x + 4, c.y, BZ), P(c.x + 4, c.y, z)) + seg(b, t) : "");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of order) { draw(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    for (const c of cells) {
      const [wx, wy] = unproj(C, sx, sy, c.z0 + TH);
      const d = Math.hypot(wx - c.x, wy - c.y);
      if (d < bd) { bd = d; best = c.k; }
    }
    return bd < R ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    for (const c of cells) {
      const dd = a < 0 ? 9 : Math.round(Math.hypot(c.x - cells[a].x, c.y - cells[a].y) / D);
      const z = a < 0 ? (c.k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      const df = from < 0 ? 0 : Math.round(Math.hypot(c.x - cells[from].x, c.y - cells[from].y) / D);
      tset(c.z, z, now, df * stag);
      c.s.sil.classList.toggle("hi", c.k === (a < 0 ? FAV : a));
    }
    read.textContent = a < 0 ? "rest" : "seg " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "telescopemirror",
  means: "Seven hexagonal mirror segments on a backplane: the one under the pointer is pushed up on its actuators, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 149], [181, 112], [219, 182], null],
  mount,
});
