/**
 * Windsocks: three striped socks on tall poles along the grass at the edge of
 * a runway, its edge lights in a row. The pointer is the wind: every sock
 * swings on its own spring to stream toward it, and fills out straight the
 * nearer it is, hanging slack when far. The nearest sock is bright. At rest
 * the socks drift each their own way, half full, one bright. The slider is
 * how quickly they follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (terrain's spring, an angle and a fill per
 * sock); the hit is on the plane of the sock mouths, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, flatDot, hull, open, place, poly, prism, proj, rad, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const POLES = [[0, 0], [50, 16], [100, -6]], H = 44, L = 27, R0 = 5, R1 = 2.4, FAV = 1;
const REST = [[150, 0.45], [205, 0.7], [120, 0.35]];
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.75);
  const ext = [[-20, 34, 0], [130, 34, 0], [-20, 66, 0], [130, 66, 0]];
  for (const [x, y] of POLES) ext.push([x - L, y - L, H], [x + L, y + L, H], [x - L, y + L, H], [x + L, y - L, H], [x, y, 0]);
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const O = P(0, 0, 0), ax = [0, 1, 2].map((i) => { const q = P(i === 0, i === 1, i === 2); return [q[0] - O[0], q[1] - O[1]]; });
  let view = cross(ax.map((a) => a[0]), ax.map((a) => a[1]));
  if (view[2] < 0) view = view.map((v) => -v);

  // the runway's edge, with its lights
  const [rr, ri] = rings(-20, 34, 130, 66, 4, 2);
  put(solid(g), prism(P, front, rr, ri, 0, 1.2));
  for (let x = -10; x <= 120; x += 26) place(flatDot(g, C, 1.3, "dot off"), P(x, 37, 1.2));

  const socks = POLES.map(([px, py], k) => {
    const grp = mk("g", {}, g), pole = mk("g", {}, grp);
    put(solid(pole), prism(P, front, rings(px - 4, py - 4, px + 4, py + 4, 2, 1)[0], null, 0, 1.6));
    put(solid(pole), prism(P, front, disc(px, py, 1.1), null, 1.6, H + 2.5));
    const sock = mk("g", {}, grp);
    const s = {
      k, px, py, grp, pole, sock, after: null, drawn: "",
      sil: mk("path", { class: "sil" }, sock), mouth: mk("path", { class: "nf lo" }, sock), bands: mk("path", { class: "nf lo" }, sock),
      th: spring(rad(REST[k][0]), { k: 100 * value, c: 18 * Math.sqrt(value) }), f: spring(REST[k][1], { k: 100 * value, c: 18 * Math.sqrt(value) }),
    };
    return s;
  });

  function draw(s) {
    const th = s.th.x, f = clamp(s.f.x, 0, 1), key = th.toFixed(4) + f.toFixed(4);
    if (key === s.drawn) return;
    s.drawn = key;
    const dr = (1 - f) * rad(62), d = [Math.cos(th) * Math.cos(dr), Math.sin(th) * Math.cos(dr), -Math.sin(dr)];
    const e1 = [-Math.sin(th), Math.cos(th), 0], e2 = cross(d, e1);
    const top = [s.px, s.py, H + 1.5], len = L * (0.82 + 0.18 * f);
    const ring = (t, r, a0 = 0, span = Math.PI * 2, n = 24) => {
      const c = top.map((v, i) => v + d[i] * (1.5 + t * len)), out = [];
      for (let i = 0; i <= n; i++) { const a = a0 + (i / n) * span, ca = Math.cos(a), sa = Math.sin(a); out.push(P(...c.map((v, j) => v + r * (ca * e1[j] + sa * e2[j])))); }
      return out;
    };
    const rad0 = R0, rad1 = R1 * (0.7 + 0.3 * f);
    s.sil.setAttribute("d", poly(hull(ring(0, rad0).concat(ring(1, rad1)))));
    const a0 = Math.atan2(dot(e2, view), dot(e1, view)) - Math.PI / 2;
    s.mouth.setAttribute("d", dot(d, view) < 0 ? poly(ring(0, rad0)) : open(ring(0, rad0, a0, Math.PI)));
    s.bands.setAttribute("d", [1 / 3, 2 / 3].map((t) => open(ring(t, rad0 + (rad1 - rad0) * t, a0, Math.PI, 14))).join(""));
    const after = d[0] + d[1] > 0;
    if (after !== s.after) { s.after = after; if (after) s.pole.after(s.sock); else s.sock.after(s.pole); }
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const s of socks) { if (stepS(s.th, dt)) m = true; if (stepS(s.f, dt)) m = true; draw(s); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const s of socks) {
      let aim = rad(REST[s.k][0]), fill = REST[s.k][1];
      if (over) {
        const dd = Math.hypot(over[0] - s.px, over[1] - s.py);
        if (dd < bd) { bd = dd; near = s; }
        if (dd > 3) aim = Math.atan2(over[1] - s.py, over[0] - s.px); else aim = s.th.t;
        fill = 0.3 + 0.7 * clamp(1 - dd / 110, 0, 1);
      }
      s.th.t = s.th.t + wrap(aim - s.th.t);
      s.f.t = fill;
    }
    for (const s of socks) s.sil.classList.toggle("hi", over ? s === near : s.k === FAV);
    if (near) { const deg = Math.round((((Math.atan2(over[1] - near.py, over[0] - near.px) * 180) / Math.PI + 135 + 360) % 360) / 10) * 10; read.textContent = "wind " + deg + "°"; }
    else read.textContent = "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], H), dx = x - 50, dy = y - 3;
      over = Math.hypot(dx, dy) > 120 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const s of socks) for (const sp of [s.th, s.f]) { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "windsocks",
  means: "Three windsocks at a runway's edge: every sock swings to stream toward the pointer like wind, and fills out straight when it is near.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[160, 100], [204, 145], [266, 188], null],
  mount,
});
