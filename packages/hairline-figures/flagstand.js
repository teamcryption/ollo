/**
 * Flag stand: a weighted round base, a tall pole with a ball finial and a
 * flag hung from it. The flag swings round the pole to stream toward the
 * pointer, rippling along its length. At rest it hangs out to one side,
 * bright. The slider is the rest heading.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PH = 90, FT = 86, FB = 54, L = 80, K = 12;
const disc = (r, n = 32) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rest = rad(value);
  const C = Cam(45, 0.5, 2.0);
  const box = [];
  for (let a = 0; a < 8; a++) box.push([Math.cos(a * Math.PI / 4) * L, Math.sin(a * Math.PI / 4) * L, FB - 4]);
  fit(C, box.concat([[0, 0, PH + 6], [-20, -20, 0], [20, 20, 0]]), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(18, 40), disc(16, 40), 0, 3));
  put(solid(g), prism(P, front, disc(11, 32), disc(9.5, 32), 3, 7));
  const fg = mk("g", {}, g);
  const flag = mk("path", { class: "sil hi" }, fg), hem = mk("path", { class: "nf lo" }, fg);
  const pg = mk("g", {}, g);
  put(solid(pg), prism(P, front, disc(1.6, 16), disc(1, 16), 7, PH));
  const ball = ringAt(P, disc(3.4, 16), PH + 3.4).concat(ringAt(P, disc(2.2, 16), PH + 6), ringAt(P, disc(2.2, 16), PH + 0.8));
  mk("path", { d: poly(hull(ball)) }, pg);

  const A = spring(rest), W = spring(0);
  let last = "";
  function draw(th, wv) {
    const key = th.toFixed(4) + wv.toFixed(3);
    if (key === last) return;
    last = key;
    const c = Math.cos(th), s = Math.sin(th), top = [], bot = [], mid = [];
    for (let i = 0; i <= K; i++) {
      const d = (i / K) * L, off = Math.sin(i / K * 5 + wv) * 4.5 * (i / K);
      const x = c * d - s * off, y = s * d + c * off, sag = (i / K) * 3;
      top.push(P(x, y, FT - sag * 0.4)); bot.push(P(x, y, FB - sag)); mid.push(P(x, y, (FT + FB) / 2 - sag * 0.7));
    }
    flag.setAttribute("d", poly(top.concat(bot.reverse())));
    hem.setAttribute("d", "M" + mid.map((q) => q.join(",")).join("L"));
    fg.parentNode.insertBefore(pg, c + s > 0 ? fg : fg.nextSibling);
  }
  draw(rest, 0);
  const B = register(stage, (dt) => {
    const m1 = stepS(A, dt), m2 = stepS(W, dt);
    draw(A.x, W.x);
    return m1 || m2;
  });
  bag.add(B.unregister);

  function aim(th) {
    let t = th;
    while (t - A.t > Math.PI) t -= 2 * Math.PI;
    while (t - A.t < -Math.PI) t += 2 * Math.PI;
    W.t += (t - A.t) * 0.8;
    A.t = t;
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, (FT + FB) / 2);
    if (Math.hypot(x, y) < 4) return;
    aim(Math.atan2(y, x));
    read.textContent = String(((Math.round(A.t * 180 / Math.PI) % 360) + 360) % 360).padStart(3, "0") + "°";
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { aim(rest); read.textContent = "rest"; } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { rest = rad(v); aim(rest); }, destroy: bag.dispose };
}

hairline({
  name: "flagstand",
  means: "An indoor flag stand: the flag swings round its pole to stream toward the pointer, rippling as it turns.",
  rules: [1, 3, 5, 8],
  range: [100, 135, 170],
  tour: [[94, 61], [306, 61], [306, 167], null],
  mount,
});
