/**
 * Brush washer: a round tub of water with five brushes standing in it, each
 * a long handle on a ferrule. The pointer is where the brushes lean: every
 * brush tilts toward it on its own spring, and the one nearest is bright.
 * At rest they lean apart, each its own way, one bright. The slider is how
 * far they lean.
 *
 * The pattern: a continuous aim (a spring per lean); the hit is on the
 * floor's plane, which never moves.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, unproj, rad, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const R = 26, H = 16, L = 62, FAV = 2;
const PIV = [[-10, -9], [8, -12], [12, 6], [-4, 11], [-13, 3]];
const REST = [[-0.30, -0.22], [0.12, -0.38], [0.34, 0.12], [-0.08, 0.40], [-0.40, 0.04]];
const disc = (x, y, r, n = 14) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.25);
  const ext = [];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ext.push([R * Math.cos(a), R * Math.sin(a), 0], [(R + 16) * Math.cos(a), (R + 16) * Math.sin(a), H + L * 0.92]); }
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(R, 56), circ(R - 2, 56), 0, H));
  mk("path", { class: "nf lo", d: poly(ringAt(P, circ(R - 6, 48), H - 1.5)) }, g);
  const order = PIV.map((p, k) => k).sort((a, b) => PIV[a][0] + PIV[a][1] - PIV[b][0] - PIV[b][1]);
  const br = [];
  for (const k of order) {
    const grp = mk("g", {}, g), fer = mk("path", {}, grp), han = mk("path", { class: "sil" }, grp), tip = flatDot(grp, C, 1.2, "dot off");
    br[k] = { k, x: PIV[k][0], y: PIV[k][1], fer, han, tip, lx: spring(REST[k][0]), ly: spring(REST[k][1]), last: "" };
  }

  function draw(b) {
    const lx = b.lx.x, ly = b.ly.x, key = lx.toFixed(4) + ly.toFixed(4);
    if (key === b.last) return;
    b.last = key;
    const lz = Math.sqrt(Math.max(0.1, 1 - lx * lx - ly * ly)), z0 = H - 1;
    const at = (d) => [b.x + lx * d, b.y + ly * d, z0 + lz * d];
    const cap = (d0, d1, r) => { const a = at(d0), c = at(d1); return poly(hull(ringAt(P, disc(a[0], a[1], r), a[2]).concat(ringAt(P, disc(c[0], c[1], r), c[2])))); };
    b.fer.setAttribute("d", cap(0, 12, 2.6));
    b.han.setAttribute("d", cap(11, L, 1.7));
    place(b.tip, P(...at(L - 4)));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const b of br) { if (stepS(b.lx, dt)) m = true; if (stepS(b.ly, dt)) m = true; draw(b); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const b of br) {
      if (over) {
        const dx = over[0] - b.x, dy = over[1] - b.y, d = Math.hypot(dx, dy) || 1;
        if (d < bd) { bd = d; near = b; }
        const s = Math.sin(rad(reach));
        b.lx.t = (dx / d) * s; b.ly.t = (dy / d) * s;
      } else { b.lx.t = REST[b.k][0]; b.ly.t = REST[b.k][1]; }
    }
    for (const b of br) b.han.classList.toggle("hi", over ? b === near : b.k === FAV);
    read.textContent = near ? "brush " + (near.k + 1) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r > R + 60 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "brushpot",
  means: "A brush washer tub with five brushes standing in it: every brush leans toward the pointer, and the nearest one is bright.",
  rules: [1, 3, 5, 8],
  range: [14, 30, 40],
  tour: [[210, 184], [150, 210], [260, 230], null],
  mount,
});
