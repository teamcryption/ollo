/**
 * Label printer: a desk label printer, its lid hinged along the back edge
 * over a tape roll, a strip of label tape fed out of the front slot. The
 * pointer over the printer opens the lid on its hinge to show the roll and
 * feeds the tape further out. At rest the lid sits a little ajar and the
 * short tape end is the bright mark. The slider is how far the lid opens.
 */
const { Cam, facing, fit, prism, proj, rings, rrect, hull, poly, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const X = 26, Y = 20, ZT = 22, TH = 3, OPEN = 100, TAPE0 = 5, TAPE1 = 30;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-X, -Y, 0], [X, Y + TAPE1, 0], [-X, -Y - 4, ZT + 2 * Y + 2], [X, -Y - 4, ZT + 2 * Y + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let amp = value;

  const BODY = rings(-X, -Y, X, Y, 7, 1.8);
  put(solid(g), prism(P, front, BODY[0], BODY[1], 0, ZT));
  // the roll in its well, seen when the lid lifts
  const well = rings(-14, -14, 14, 10, 5, 1.2);
  mk("path", { class: "lo nf", d: prism(P, front, well[0], null, ZT, ZT).sil }, g);
  const roll = solid(g);
  const rc = HL.circ(8, 32).map((q) => ({ ...q, u: q.u, v: q.v - 2 }));
  put(roll, prism(P, front, rc, HL.circ(3, 24).map((q) => ({ ...q, v: q.v - 2 })), ZT - 6, ZT - 0.5));
  // the slot on the front face
  mk("path", { class: "lo nf", d: `M${P(-11, Y, 6)}L${P(11, Y, 6)}` }, g);

  const tape = solid(g), lid = solid(g);
  const LID = rrect(-X, -Y, X, Y, 7, 4), LIDI = rrect(-X + 2, -Y + 2, X - 2, Y - 2, 5, 4);
  const at = (q, a, t) => {
    const d = q.v + Y, c = Math.cos(a), s = Math.sin(a);
    return P(q.u, -Y + d * c - t * s, ZT + d * s + t * c);
  };
  const sp = { lid: spring(8), tape: spring(TAPE0) }, drawn = { lid: NaN, tape: NaN };

  function draw() {
    if (sp.lid.x !== drawn.lid) {
      drawn.lid = sp.lid.x;
      const a = rad(sp.lid.x), up = -0.5 * Math.sin(a) + 0.7 * Math.cos(a) > 0;
      const pts = LID.map((q) => at(q, a, 0)).concat(LID.map((q) => at(q, a, TH)));
      lid.sil.setAttribute("d", poly(hull(pts)));
      lid.cr.setAttribute("d", poly(LIDI.map((q) => at(q, a, up ? TH : 0))));
    }
    if (sp.tape.x !== drawn.tape) {
      drawn.tape = sp.tape.x;
      const r = rings(-10, Y - 1, 10, Y + sp.tape.x, 0.8, 0.3);
      put(tape, prism(P, front, r[0], null, 5.4, 6.2));
    }
  }

  const B = register(stage, (dt) => {
    const m = [stepS(sp.lid, dt), stepS(sp.tape, dt)].some(Boolean);
    draw();
    return m;
  });
  bag.add(B.unregister);

  let on = false;
  function apply() {
    sp.lid.t = on ? OPEN * amp : 8;
    sp.tape.t = on ? TAPE1 * Math.min(1, amp) : TAPE0;
    lid.sil.classList.toggle("hi", on);
    tape.sil.classList.toggle("hi", !on);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      const n = Math.abs(x) < X + 16 && y > -Y - 90 && y < Y + TAPE1 + 10;
      if (n !== on) { on = n; apply(); }
    },
    leave: () => { on = false; apply(); },
  }));
  bag.add(() => svg.replaceChildren());
  apply();
  draw();
  return { set: (v) => { amp = v; apply(); }, destroy: bag.dispose };
}

hairline({
  name: "printer2",
  means: "A label printer: the pointer opens its hinged lid over the tape roll and feeds the label tape out of the front slot.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.1],
  tour: [[171, 179], [171, 90], [95, 262], null],
  mount,
});
