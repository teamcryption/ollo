/**
 * Dropper bottle: a squat square bottle with a shoulder and neck, closed by a
 * dropper cap, a collar under a rubber bulb with a glass pipette below. The
 * pointer on the bottle opens it: the cap draws up and swings aside so the
 * pipette slides out of the neck, a drop at its tip. At rest the cap sits a
 * little proud, the bulb bright. The slider is how far it draws out.
 *
 * The pattern: one part answering a hit on its rest pose.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const BW = 17, BH = 30, NZ = 36, CZ = 41, PL = 30, REST = 0.08;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.32);
  fit(C, [[-BW - 2, -BW - 2, 0], [BW + 2, BW + 2, 0], [BW, -BW, 0], [-BW, BW, 0], [0, 0, CZ + 58], [26, 0, CZ + 50]], 200, 158);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const pip = mk("path", { class: "nf sil" }, g);
  const [br, bi] = rings(-BW, -BW, BW, BW, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BH));
  put(solid(g), { sil: poly(hull(ringAt(P, br, BH).concat(ringAt(P, circ(6, 24), NZ)))), crease: "" });
  put(solid(g), prism(P, front, circ(6, 24), circ(4.8, 24), NZ, CZ));
  const cap = mk("g", {}, g), collar = solid(cap), bulb = mk("path", { class: "sil hi" }, cap);
  const drop = flatDot(cap, C, 1.6, "dot");
  const tw = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const z = CZ + 0.5 + t * 26 * reach, dx = t * 22 * reach;
    pip.setAttribute("d", seg(P(dx, 0, z), P(dx * 0.4, 0, z - PL)) + seg(P(dx + 1.2, 0, z), P(dx * 0.4 + 1.2, 0, z - PL)));
    put(collar, prism(P, front, disc(dx, 0, 7.5), disc(dx, 0, 6.3), z, z + 6));
    const pts = [];
    for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(dx, 0, 5.6 * Math.cos(a) + 0.4, 20), z + 6 + 18 * Math.sin(a))); }
    bulb.setAttribute("d", poly(hull(pts)));
    place(drop, P(dx * 0.4 + 0.6, 0, z - PL - 3));
    drop.setAttribute("class", t > 0.5 ? "dot" : "dot off");
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, 30);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(tw, o ? 1 : REST, performance.now(), 0);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 70 && Math.abs(sy - mid[1]) < 110),
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "dropperbottle",
  means: "A dropper bottle: the pointer draws the cap up and aside, and the glass pipette slides out of the neck with a drop.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[200, 121], [200, 200], [215, 160], null],
  mount,
});
