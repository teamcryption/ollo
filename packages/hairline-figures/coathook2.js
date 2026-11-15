/**
 * Shoe rack spinner: three round tiers on a centre pole, five shoes on each,
 * toes out. The whole rack turns on one spring so that the middle tier's shoe
 * nearest the pointer comes round to face it, and that shoe is bright. At
 * rest the rack sits a little turned with one shoe bright on the middle tier.
 *
 * The pattern: a continuous aim (spring on one angle); the hit is on the
 * floor's plane, which never moves. Shoes move between the far and near group
 * of their tier as they pass behind the pole.
 */
const {
  Cam, circ, facing, fit, prism, proj, rrect, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, R = 31, TZ = [4, 28, 52], OFF = [0.62, 0, 0.31], REST = 0.35, FAV = 0;
const SHOE = [rrect(10, -3.8, 28, 3.8, 3.6, 4), rrect(11.2, -2.6, 26.8, 2.6, 2.4, 4)];
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.75);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([R * Math.cos(a), R * Math.sin(a), 0], [R * Math.cos(a), R * Math.sin(a), TZ[2] + 8]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(15, 40), circ(13.6, 40), 0, 3));
  const tiers = TZ.map((z, i) => {
    put(solid(g), prism(P, front, circ(R, 64), circ(R - 1.8, 64), z - 2, z));
    const far = mk("g", {}, g);
    put(solid(g), prism(P, front, circ(2.6, 20), null, z, i < 2 ? TZ[i + 1] - 2 : z + 12));
    const near = mk("g", {}, g);
    const shoes = [];
    for (let k = 0; k < N; k++) { const s = solid(far); shoes.push({ s, nearSide: false }); }
    return { z, i, far, near, shoes };
  });

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, pick = FAV;
  function draw() {
    const a0 = sp.x;
    if (Math.abs(a0 - drawn) < 1e-4) return;
    drawn = a0;
    for (const t of tiers) for (let k = 0; k < N; k++) {
      const a = a0 + OFF[t.i] + (k / N) * Math.PI * 2, sh = t.shoes[k];
      put(sh.s, prism(P, front, turn(SHOE[0], a), turn(SHOE[1], a), t.z, t.z + 5.5));
      const nearSide = Math.cos(a) + Math.sin(a) > 0;
      if (nearSide !== sh.nearSide) { sh.nearSide = nearSide; (nearSide ? t.near : t.far).appendChild(sh.s.g); }
    }
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function light(k) {
    pick = k;
    tiers.forEach((t) => t.shoes.forEach((sh, j) => sh.s.sil.classList.toggle("hi", t.i === 1 && j === k)));
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), d = Math.hypot(x, y);
      if (d > R + 40) { sp.t = sp.t + wrap(REST - sp.t); light(FAV); read.textContent = "rest"; return B.wake(); }
      if (d < 4) return;
      const aim = Math.atan2(y, x);
      let bk = 0, bd = Infinity, bt = 0;
      for (let k = 0; k < N; k++) {
        const now = sp.t + (k / N) * Math.PI * 2, dd = wrap(aim - now);
        if (Math.abs(dd) < bd) { bd = Math.abs(dd); bk = k; bt = sp.t + dd; }
      }
      sp.t = bt; light(bk);
      read.textContent = "shoe " + (bk + 1);
      B.wake();
    },
    leave: () => { sp.t = sp.t + wrap(REST - sp.t); light(FAV); read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  light(FAV);
  read.textContent = "rest";
  draw();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "coathook2",
  means: "A spinning shoe rack: the rack turns so the middle tier's shoe nearest the pointer comes round to face it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[297, 208], [200, 296], [103, 208], null],
  mount,
});
