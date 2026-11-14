/**
 * Medal stand: a three-step winners' podium on a low plinth, a standing
 * medal on each step. The pointer picks a step by where it stands: that
 * step rises with its medal and takes the bright edge, its neighbours rise a
 * little, staggered from it. At rest the classic order stands, middle tallest,
 * its medal bright. The slider is how far the chosen step rises.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 30, GAP = 2, DEP = 30, PZ = 3, REST = [22, 34, 14], FAV = 1, MR = 6, STAG = 45;
const NAMES = ["2nd", "1st", "3rd"];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rise = value;
  const C = Cam(45, 0.5, 2.25);
  const X1 = 3 * W + 2 * GAP;
  fit(C, [[-6, -6, 0], [X1 + 6, DEP + 6, 0], [X1 + 6, -6, 0], [-6, DEP + 6, 0], [W * 1.5, DEP / 2, PZ + 34 + 46 + 2 * MR + 4], [X1, DEP / 2, PZ + 46 + 2 * MR]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, X1 + 6, DEP + 6, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, PZ));

  const items = REST.map((h, k) => {
    const x0 = k * (W + GAP), grp = mk("g", {}, g), s = solid(grp);
    const [ring, inner] = rings(x0, 0, x0 + W, DEP, 3, 1.4);
    const medal = mk("path", { class: "sil" }, grp), face = mk("path", { class: "nf lo" }, grp);
    return { k, x: x0 + W / 2, y: DEP / 2, ring, inner, s, medal, face, z: tween(h), last: NaN };
  });

  function vdisc(x, y, z, r, n = 24) {
    const out = [];
    for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; out.push(P(x + r * Math.cos(t) * 0.7071, y - r * Math.cos(t) * 0.7071, z + r * Math.sin(t))); }
    return out;
  }
  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    put(it.s, prism(P, front, it.ring, it.inner, PZ, PZ + h));
    const cz = PZ + h + MR + 3;
    // the medal stands across the step, turned toward the viewer: a disc with its thickness
    it.medal.setAttribute("d", poly(hull(vdisc(it.x, it.y, cz, MR).concat(vdisc(it.x + 1, it.y + 1, cz, MR)))));
    it.face.setAttribute("d", poly(vdisc(it.x + 1, it.y + 1, cz, MR - 2)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // pick by each step's rest centre on screen: a single row
  const mids = items.map((it, k) => P(it.x, it.y, PZ + REST[k] / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), h = a < 0 ? REST[k] : REST[k] + (dd === 0 ? rise : dd === 1 ? rise * 0.2 : 0);
      tset(it.z, h, now, from < 0 ? 0 : Math.abs(k - from) * STAG);
      it.medal.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { rise = v; }, destroy: bag.dispose };
}

hairline({
  name: "trophycase",
  means: "A three-step winners' podium with a medal on each step: the step under the pointer rises with its medal, its neighbours a little.",
  rules: [1, 2, 5, 8],
  range: [20, 38, 46],
  tour: [[149, 183], [200, 197], [251, 242], null],
  mount,
});
