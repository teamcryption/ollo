/**
 * Skateboard: a deck with kicktails on two trucks and four wheels. The
 * pointer over the board leans the deck into a carve: the deck rolls on its
 * long axis and both trucks steer, the front one way and the back the other.
 * At rest the front truck is bright. The slider is how far it leans.
 */
const { Cam, fit, proj, rrect, hull, poly, open, rad, tween, tset, tval, tdone, mk, pointer, register, disposer, solid, unproj } = HL;

const HL2 = 50, HW = 11, DZ = 13, TX = 31, REST = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-HL2 - 2, -HW - 6, 0], [HL2 + 2, HW + 6, 0], [-HL2, HW + 6, 0], [HL2, -HW - 6, 0], [HL2, 0, DZ + 14], [-HL2, 0, DZ + 14]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // deck outline in plan, with the kicktails rising at either end
  const plan = rrect(-HL2, -HW, HL2, HW, HW - 1, 6), inner = rrect(-HL2 + 2.5, -HW + 2.5, HL2 - 2.5, HW - 2.5, HW - 3.5, 6);
  const lift = (x) => (Math.abs(x) > 36 ? (Math.abs(x) - 36) * 0.45 : 0);
  const trucks = [-1, 1].map((s) => {
    const t = { s, wl: [mk("path", {}, g), mk("path", {}, g)], bar: solid(g) };
    return t;
  });
  const deck = solid(g);
  const nose = mk("path", { class: "lo nf" }, g), tail = mk("path", { class: "lo nf" }, g);
  const lean = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const r = rad(a), c = Math.cos(r), sn = Math.sin(r);
    const roll = (x, y, z) => [x, y * c - (z - DZ) * sn, DZ + y * sn + (z - DZ) * c];
    const pts = [];
    for (const dz of [0, 2]) for (const q of plan) pts.push(P(...roll(q.u, q.v, DZ + dz + lift(q.u))));
    deck.sil.setAttribute("d", poly(hull(pts)));
    deck.cr.setAttribute("d", poly(inner.map((q) => P(...roll(q.u, q.v, DZ + 2 + lift(q.u))))));
    nose.setAttribute("d", open([-HW + 3, HW - 3].map((y) => P(...roll(36, y, DZ + 2)))));
    tail.setAttribute("d", open([-HW + 3, HW - 3].map((y) => P(...roll(-36, y, DZ + 2)))));
    for (const t of trucks) {
      const yaw = r * 0.9 * t.s, dx = -Math.sin(yaw), dy = Math.cos(yaw), cx = t.s * TX;
      const bp = [];
      for (const k of [-1, 1]) for (const z of [5.5, 8.5]) bp.push(P(cx + dx * 10 * k, dy * 10 * k, z));
      bp.push(P(cx - 3, 0, DZ), P(cx + 3, 0, DZ));
      t.bar.sil.setAttribute("d", poly(hull(bp)));
      [-1, 1].forEach((k, i) => {
        const wp = [], ox = cx + dx * 12.5 * k, oy = dy * 12.5 * k;
        for (const e of [-2, 2]) for (let j = 0; j < 20; j++) { const th = (j / 20) * 2 * Math.PI, u = 4.6 * Math.cos(th); wp.push(P(ox + dy * u + dx * e, oy - dx * u + dy * e, 4.6 + 4.6 * Math.sin(th))); }
        t.wl[i].setAttribute("d", poly(hull(wp)));
      });
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(lean, now)); return !tdone(lean, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(lean, v ? amp : REST, performance.now(), 0);
    deck.sil.classList.toggle("hi", v);
    trucks[1].bar.sil.classList.toggle("hi", !v);
    read.textContent = v ? "carve " + Math.round(amp) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, DZ);
    return Math.abs(x) < HL2 + 6 && Math.abs(y) < HW + 10;
  }
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "skateboard",
  means: "A skateboard: the pointer leans the deck into a carve, the deck rolls and both trucks steer.",
  rules: [1, 3, 5, 9],
  range: [10, 24, 34],
  tour: [[200, 152], [160, 132], [240, 172], null],
  mount,
});
