/**
 * Walkie talkies: three handheld radios standing in a charging dock, each a
 * tall rounded body with a speaker grille on its face and a stubby antenna
 * at one shoulder. The pointer picks a radio by where it stands: it lifts out
 * of the dock, bright, and the radios beside it rise a little, staggered from
 * it. At rest the middle radio is half lifted. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 30, DZ = 8, DD = 22, LIFT = 22, FAV = 1;
const X1 = (N - 1) * STEP + 30;
const RADIOS = [[18, 11, 34, 16], [20, 12, 38, 20], [18, 11, 32, 14]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, 0, 0], [X1, DD, 0], [X1, 0, 0], [0, DD, 0], [15, DD / 2, DZ + LIFT + 62], [X1 - 15, DD / 2, DZ + LIFT + 52]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(0, 0, X1, DD, 6, 2);
  put(solid(g), prism(P, front, dr, di, 0, DZ));

  const items = RADIOS.map(([w, d, h, ah], k) => {
    const x = 15 + k * STEP, y = DD / 2, grp = mk("g", {}, g);
    const bay = rings(x - w / 2 - 1.5, y - d / 2 - 1.5, x + w / 2 + 1.5, y + d / 2 + 1.5, 3, 0.6)[0];
    mk("path", { d: "M" + bay.map((q) => P(q.u, q.v, DZ).join(",")).join("L") + "Z", class: "nf lo" }, grp);
    const ant = solid(grp), body = solid(grp), grille = mk("path", { class: "nf lo" }, grp), key = mk("path", { class: "nf" }, grp);
    const rest = k === FAV ? LIFT * 0.55 : 0;
    return { k, x, y, w, d, h, ah, ant, body, grille, key, rest, z: tween(rest), last: NaN };
  });

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const { x, y, w, d, h, ah } = it, z0 = DZ - 4 + lift, z1 = z0 + h;
    const ax = x - w / 2 + 4;
    const [ar, ai] = rings(ax - 2, y - 2, ax + 2, y + 2, 2, 0.6);
    put(it.ant, prism(P, front, ar, ai, z1 - 2, z1 + ah));
    const [br, bi] = rings(x - w / 2, y - d / 2, x + w / 2, y + d / 2, 4, 1.2);
    put(it.body, prism(P, front, br, bi, z0, z1));
    const fy = y + d / 2;
    let gd = "";
    for (let i = 0; i < 4; i++) { const z = z1 - 7 - i * 3; gd += seg(P(x - w / 2 + 4, fy, z), P(x + w / 2 - 4, fy, z)); }
    it.grille.setAttribute("d", gd);
    it.key.setAttribute("d", seg(P(x - 3, fy, z0 + 9), P(x + 3, fy, z0 + 9)) + seg(P(x, fy, z0 + 6), P(x, fy, z0 + 12)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, DZ + 18));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? it.rest : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.body.sil.classList.toggle("hi", on);
      it.ant.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "ch " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "satellitephone",
  means: "Three walkie talkies in a charging dock: the radio under the pointer lifts out, and the radios beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[200, 160], [150, 150], [250, 200], null],
  mount,
});
