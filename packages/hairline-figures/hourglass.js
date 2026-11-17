/**
 * Hourglass: a sand glass on a pivot between two uprights. The pointer tips
 * it: across the frame the glass swings round its pivot on a spring, from a
 * slight lean at rest towards lying on its side. The glass stays bright. The
 * slider is how far it may tip.
 */
const {
  Cam, circ, fit, prism, proj, rings, rrect, facing, hull, poly, open, clamp,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const ZC = 38, H = 22, W = 15, REST = 0.22;
const PLATE = rrect(-W, -W, W, W, 4, 4), PIN = rrect(-W + 1.6, -W + 1.6, W - 1.6, W - 1.6, 2.6, 4);
const VIEW = [0.61, 0.61, 0.5];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.6);
  const R = 31, ext = [];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ext.push([R * Math.cos(a), -24, ZC + R * Math.sin(a)], [R * Math.cos(a), 24, ZC + R * Math.sin(a)]); }
  ext.push([-30, -30, 0], [30, 30, 0]);
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-26, -30, 26, 30, 5, 1.6), 0, 3));
  put(solid(g), prism(P, front, ...rings(-3, -26, 3, -21, 1.4, 0.6), 3, ZC + 4));
  const glassG = mk("g", {}, g);
  put(solid(g), prism(P, front, ...rings(-3, 21, 3, 26, 1.4, 0.6), 3, ZC + 4));

  // parts in local coords: list of [ring, z0, z1, crease ring]
  const parts = [];
  const plate = (z0, z1) => ({ rings: [[PLATE, z0], [PLATE, z1]], cap: [PIN, z0, z1], s: solid(glassG) });
  const pillar = (x, y) => ({ rings: [[circ(1.3, 12).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), -H + 3], [circ(1.3, 12).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), H - 3]], s: solid(glassG), c: [x, y] });
  const bulb = (sg) => ({ rings: [[circ(1.6, 16), sg * 1], [circ(10.5, 24), sg * 9], [circ(9, 24), sg * 15.5], [circ(6, 24), sg * (H - 3)]], s: solid(glassG), glass: true });
  const sand = { rings: [[circ(8.6, 24), 9.5], [circ(6, 24), H - 3.2], [circ(1.2, 12), 4.5]], s: solid(glassG) };
  parts.push(plate(-H, -H + 3), pillar(-11, -11), pillar(11, -11), bulb(-1), bulb(1), sand, pillar(-11, 11), pillar(11, 11), plate(H - 3, H));
  for (const p of parts) if (p.glass) p.s.sil.classList.add("hi");

  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const c = Math.cos(t), s = Math.sin(t);
    const W3 = (u, v, z) => [u * c + z * s, v, ZC - u * s + z * c];
    const depth = [];
    for (const p of parts) {
      const pts = [];
      for (const [ring, z] of p.rings) for (const q of ring) pts.push(P(...W3(q.u, q.v, z)));
      let cr = "";
      if (p.cap) {
        const [ring, z0, z1] = p.cap, nz = [s, 0, c];
        const dot = nz[0] * VIEW[0] + nz[2] * VIEW[2];
        const z = dot > 0 ? z1 : z0;
        cr = poly(ring.map((q) => P(...W3(q.u, q.v, z))));
      }
      put(p.s, { sil: poly(hull(pts)), crease: cr });
      const zm = (p.rings[0][1] + p.rings[p.rings.length - 1][1]) / 2, cx = p.c ? p.c[0] : 0, cy = p.c ? p.c[1] : 0;
      const w = W3(cx, cy, zm);
      depth.push([w[0] + w[1] + (w[2] - ZC) * 0.8, p]);
    }
    depth.sort((a, b) => a[0] - b[0]);
    for (const [, p] of depth) glassG.appendChild(p.s.g);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(sx) {
    if (sx == null) { sp.t = REST; read.textContent = "rest"; }
    else { sp.t = clamp((sx - 120) / 170, 0, 1) * (Math.PI / 2) * value; read.textContent = Math.round(sp.t * 180 / Math.PI) + "°"; }
    B.wake();
  }
  let cur = null;
  bag.add(pointer(stage, {
    move: (p) => { cur = p[0]; aim(cur); },
    leave: () => { cur = null; aim(null); },
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { value = v; if (cur != null) aim(cur); }, destroy: bag.dispose };
}

hairline({
  name: "hourglass",
  means: "An hourglass on a pivot: the pointer tips it over on its spring, from a slight lean towards lying on its side.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[200, 88], [290, 140], [150, 160], null],
  mount,
});
