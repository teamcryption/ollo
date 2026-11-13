/**
 * Turntables: a DJ desk with two decks and a mixer between them. Each deck is
 * a plinth with a platter, a record (label and one groove mark), and a tone
 * arm on its pivot. The pointer picks the deck nearer it: that record spins
 * up on a spring on its rate, and only while the pointer moves, and its tone
 * arm swings onto the record, bright. At rest deck 2's arm is down, bright,
 * and both records are still. The slider is how fast the record spins.
 *
 * The pattern: one of two in a row (bookshelf's pick by rest centre x); a
 * spring on a rate, decaying to rest so the loop sleeps when the pointer does.
 */
const {
  Cam, circ, fit, open, prism, proj, facing, rings, seg, spring, stepS, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const DX = [30, 104], CY = 30, R = 17.5, OFF = 88, ON = 113, ARM = 24, FAV = 1;
const disc = (x, y, r, n = 48) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let speed = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-2, -2, 0], [136, 62, 0], [136, -2, 0], [-2, 62, 0], [0, 0, 22], [136, 0, 22]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-2, -2, 136, 62, 4, 1.4);
  put(solid(g), prism(P, front, dr, di, 0, 6));

  const decks = DX.map((cx, k) => {
    const grp = mk("g", {}, g);
    if (k === 1) {
      const [mr, mi] = rings(58, 8, 76, 52, 2.5, 1);
      const mx = solid(g); put(mx, prism(P, front, mr, mi, 6, 13));
      g.insertBefore(mx.g, grp);
      const f = (x) => seg(P(x, 30, 13), P(x, 46, 13));
      mk("path", { class: "nf lo", d: f(62) + f(67) + f(72) + seg(P(61, 49.5, 13), P(73, 49.5, 13)) }, g).after(mx.g);
      [[62, 14], [67, 14], [72, 14], [62, 20], [67, 20], [72, 20]].forEach(([x, y]) => place(flatDot(g, C, 1.1, "dot off"), P(x, y, 13)));
    }
    const [pr, pi] = rings(cx - 26, 4, cx + 26, 56, 3.5, 1.2);
    put(solid(grp), prism(P, front, pr, pi, 6, 12));
    put(solid(grp), prism(P, front, disc(cx, CY, R + 1.5), disc(cx, CY, R + 0.6), 12, 14.5));
    const rec = solid(grp);
    put(rec, prism(P, front, disc(cx, CY, R), disc(cx, CY, 5.5, 32), 14.5, 15.5));
    const mark = mk("path", { class: "nf lo" }, grp);
    place(flatDot(grp, C, 0.9, "dot m"), P(cx, CY, 15.5));
    const px = cx + 20, py = CY - 20;
    put(solid(grp), prism(P, front, disc(px, py, 2.6, 24), disc(px, py, 1.8, 24), 12, 18));
    const arm = mk("path", { class: "nf sil" }, grp);
    const head = flatDot(grp, C, 1.4, "dot off");
    return { k, cx, px, py, rec, mark, arm, head, ang: (k * 1.3) + 0.4, rate: spring(0), sw: tween(k === FAV ? ON : OFF), last: "" };
  });

  function draw(D, now) {
    const a = tval(D.sw, now), key = D.ang.toFixed(3) + "," + a.toFixed(2);
    if (key === D.last) return;
    D.last = key;
    const c = Math.cos(D.ang), s = Math.sin(D.ang);
    D.mark.setAttribute("d", seg(P(D.cx + 7 * c, CY + 7 * s, 15.5), P(D.cx + 15.5 * c, CY + 15.5 * s, 15.5)));
    const r = (a * Math.PI) / 180, hx = D.px + ARM * Math.cos(r), hy = D.py + ARM * Math.sin(r);
    const bx = D.px + ARM * 0.82 * Math.cos(r + 0.06), by = D.py + ARM * 0.82 * Math.sin(r + 0.06);
    D.arm.setAttribute("d", open([P(D.px, D.py, 18), P(bx, by, 18), P(hx, hy, 17)]));
    place(D.head, P(hx, hy, 16.6));
  }

  const B = register(stage, (dt, now) => {
    let moving = false;
    for (const D of decks) {
      D.rate.t *= Math.exp(-dt * 2.5);
      if (D.rate.t < 0.02) D.rate.t = 0;
      if (stepS(D.rate, dt) || D.rate.t) moving = true;
      D.ang += D.rate.x * dt;
      draw(D, now);
      if (!tdone(D.sw, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  const mids = decks.map((D) => P(D.cx, CY, 15));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, (m[1] - sy) * 1.6); if (d < bd) { bd = d; best = k; } });
    return bd < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a, move) {
    const now = performance.now();
    if (a >= 0 && move) decks[a].rate.t = 9 * speed;
    if (a !== act) {
      act = a;
      decks.forEach((D, k) => {
        tset(D.sw, k === (a < 0 ? FAV : a) ? ON : OFF, now, 0);
        D.rec.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
      });
      read.textContent = a < 0 ? "rest" : "deck " + (a + 1);
    }
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p), true), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { speed = v; }, destroy: bag.dispose };
}

hairline({
  name: "turntables",
  means: "Two turntables and a mixer: the record nearer the pointer spins up while it moves, and its tone arm swings on.",
  rules: [1, 4, 5, 8],
  range: [0.3, 1, 1.6],
  tour: [[150, 170], [250, 200], [200, 180], null],
  mount,
});
