/**
 * Bale wrapper: a round bale lying on a turntable under an overhead wrapping
 * arm that hangs a film roll on a drop post. The pointer over the wrapper
 * swings the arm round the bale and turns the bale on its table; the slider is
 * how far they turn. At rest the turntable rim is the bright mark; when chosen,
 * the bright goes to the film roll.
 */
const {
  Cam, fit, proj, facing, rings, prism, put, solid, mk, hull, poly, circ, seg, unproj,
  tween, tset, tval, tdone, register, pointer, disposer, rad,
} = HL;

const RB = 23, HL2 = 21, ZB = 14 + RB, ARM = 48, TOP = 92;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value, on = false, lastKey = "";
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-56, -56, 0], [56, 56, 0], [56, -56, 0], [-56, 56, 0], [0, 0, 100], [-50, -50, 100], [40, 40, 100]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 2, b = 1) => {
    const [a, i] = rings(x0, y0, x1, y1, r, b), s = solid(g);
    put(s, prism(P, front, a, i, z0, z1)); return s;
  };
  box(-52, -52, -40, -40, 0, TOP + 5, 2, 0.8);
  box(-34, -34, 34, 34, 0, 8, 6, 1.4);
  const table = solid(g);
  put(table, prism(P, front, circ(36, 64), circ(34, 64), 8, 14));
  const back = mk("g", {}, g), baleG = mk("g", {}, g), fore = mk("g", {}, g);
  const bale = mk("path", { class: "sil" }, baleG), endFace = mk("path", { class: "nf" }, baleG);
  const arm = mk("g", {}, g);
  const post = mk("path", { class: "sil" }, arm), roll = mk("path", { class: "sil" }, arm), rollTop = mk("path", { class: "lo" }, arm);
  const film = mk("path", { class: "nf lo" }, arm), boom = mk("path", { class: "sil" }, g);
  mk("path", { class: "sil", d: poly(hull([[-46, -44], [-44, -46], [2, 0], [0, 2]].flatMap(([x, y]) => [P(x, y, TOP + 1), P(x, y, TOP + 5)]))) }, g);
  put(solid(g), prism(P, front, circ(5, 24), circ(4, 24), TOP - 3, TOP + 6));
  const tw = tween(0);

  const ringPts = (c, ax, R, n = 28) => {
    const u = [-ax[1], ax[0], 0], v = [0, 0, 1];
    return Array.from({ length: n }, (_, i) => {
      const q = (i / n) * 2 * Math.PI, cs = Math.cos(q), sn = Math.sin(q);
      return P(c[0] + R * (cs * u[0] + sn * v[0]), c[1] + R * (cs * u[1] + sn * v[1]), c[2] + R * (cs * u[2] + sn * v[2]));
    });
  };

  function draw(now) {
    const t = tval(tw, now), key = t.toFixed(4) + "," + amt;
    if (key === lastKey) return;
    lastKey = key;
    const phi = rad(25 + t * 150 * amt), psi = rad(-20 + t * 130 * amt);
    const ax = [Math.cos(phi), Math.sin(phi)], e1 = [HL2 * ax[0], HL2 * ax[1], ZB], e2 = [-e1[0], -e1[1], ZB];
    const r1 = ringPts(e1, ax, RB), r2 = ringPts(e2, ax, RB);
    bale.setAttribute("d", poly(hull(r1.concat(r2))));
    endFace.setAttribute("d", poly(ax[0] + ax[1] > 0 ? r1 : r2));
    
    const px = ARM * Math.cos(psi), py = ARM * Math.sin(psi);
    const nx = -Math.sin(psi) * 2.5, ny = Math.cos(psi) * 2.5;
    boom.setAttribute("d", poly(hull([[0, 0], [px, py]].flatMap(([x, y]) => [P(x + nx, y + ny, TOP - 3), P(x - nx, y - ny, TOP - 3), P(x + nx, y + ny, TOP + 1), P(x - nx, y - ny, TOP + 1)]))));
    post.setAttribute("d", poly(hull([...ringPts([px, py, TOP], [0, 0, 1].slice(0, 2), 0.01), P(px - 2, py, TOP), P(px + 2, py, TOP), P(px - 2, py, 30), P(px + 2, py, 30)])));
    const rc = circ(7, 24), at = (z) => rc.map((q) => P(px + q.u, py + q.v, z));
    roll.setAttribute("d", poly(hull(at(38).concat(at(70)))));
    rollTop.setAttribute("d", poly(at(70)));
    const toward = [-Math.cos(psi), -Math.sin(psi)];
    film.setAttribute("d", seg(P(px + 7 * toward[0], py + 7 * toward[1], 66), P(px + 25 * toward[0], py + 25 * toward[1], ZB + 18)) + seg(P(px + 7 * toward[0], py + 7 * toward[1], 42), P(px + 25 * toward[0], py + 25 * toward[1], ZB - 10)));
    (px + py > 0 ? fore : back).append(arm);
  }

  const B = register(stage, (dt, now) => { draw(now); return !tdone(tw, now); });
  bag.add(B.unregister);

  function retarget() {
    tset(tw, on ? 1 : 0, performance.now(), 0);
    table.sil.classList.toggle("hi", !on);
    roll.classList.toggle("hi", on);
    read.textContent = on ? `arm ${Math.round(130 * amt)}°` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], ZB);
      on = Math.hypot(x, y) < 58;
      retarget();
    },
    leave: () => { on = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { amt = v; lastKey = ""; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "balewrapper",
  means: "A bale wrapper: the pointer swings its film arm round the bale and turns the bale on its table.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[200, 184], [124, 184], [276, 184], null],
  mount,
});
