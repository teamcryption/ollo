const N = `{ noAccent: true, containers: ['circle', 'square'] }`;
const FACE = `body(R(3.5, 3.5, 17, 17, 4))`;
export default {
  text: [
    `icon('number-zero', 'Number Zero', ['0', 'zero', 'digit', 'numeral', 'count'], [line(E(12, 12, 4.5, 7.5))], ${N})`,
    `icon('number-one', 'Number One', ['1', 'one', 'digit', 'first', 'count'], [line('M9.5 7.5 13 4.5v15M9.5 19.5h7')], ${N})`,
    `icon('number-two', 'Number Two', ['2', 'two', 'digit', 'second', 'count'], [line('M7.5 8c.5-2.2 2.3-3.5 4.5-3.5 2.6 0 4.5 1.8 4.5 4.2 0 1.6-.8 2.8-2.2 4.2l-6.8 6.6h9')], ${N})`,
    `icon('number-three', 'Number Three', ['3', 'three', 'digit', 'third', 'count'], [line('M7.5 6c1-1 2.6-1.5 4.3-1.5 2.6 0 4.2 1.4 4.2 3.5s-1.7 3.5-4.5 3.5c3 0 5 1.6 5 4s-2 4-4.5 4c-1.9 0-3.6-.6-4.5-1.8')], ${N})`,
    `icon('number-four', 'Number Four', ['4', 'four', 'digit', 'fourth', 'count'], [line('M14.5 19.5v-15L7 15h10')], ${N})`,
    `icon('number-five', 'Number Five', ['5', 'five', 'digit', 'fifth', 'count'], [line('M16 4.5H8.5L8 11c1-.7 2.3-1 3.7-1 2.8 0 4.8 2 4.8 4.7s-2 4.8-4.8 4.8c-2 0-3.6-.8-4.4-2')], ${N})`,
    `icon('number-six', 'Number Six', ['6', 'six', 'digit', 'sixth', 'count'], [line('M15.5 5.5c-.9-.7-2.1-1-3.3-1-3.3 0-5 3-5 8 0 4.3 2 7 4.8 7s4.7-2 4.7-4.6-1.9-4.6-4.6-4.6-4.9 2-4.9 4.6')], ${N})`,
    `icon('number-seven', 'Number Seven', ['7', 'seven', 'digit', 'seventh', 'count'], [line('M7.5 4.5h9L11 19.5')], ${N})`,
    `icon('number-eight', 'Number Eight', ['8', 'eight', 'digit', 'eighth', 'count'], [line(E(12, 8.2, 3.8, 3.7) + E(12, 15.4, 4.3, 4.1))], ${N})`,
    `icon('number-nine', 'Number Nine', ['9', 'nine', 'digit', 'ninth', 'count'], [line('M16.5 9.5c0 2.6-2 4.6-4.6 4.6S7.3 12.1 7.3 9.5s1.9-5 4.6-5 4.6 2.4 4.6 5v10')], ${N})`,
  ],
  gaming: [
    `icon('dice-one', 'Dice One', ['die', 'roll', 'one', 'board game', 'chance'], [${FACE}, line(D(12, 12))], { noAccent: true })`,
    `icon('dice-two', 'Dice Two', ['die', 'roll', 'two', 'board game', 'chance'], [${FACE}, line(D(8, 8) + D(16, 16))], { noAccent: true })`,
    `icon('dice-three', 'Dice Three', ['die', 'roll', 'three', 'board game', 'chance'], [${FACE}, line(D(8, 8) + D(12, 12) + D(16, 16))], { noAccent: true })`,
    `icon('dice-four', 'Dice Four', ['die', 'roll', 'four', 'board game', 'chance'], [${FACE}, line(D(8, 8) + D(16, 8) + D(8, 16) + D(16, 16))], { noAccent: true })`,
    `icon('dice-six', 'Dice Six', ['die', 'roll', 'six', 'board game', 'chance'], [${FACE}, line(D(8, 7.5) + D(16, 7.5) + D(8, 12) + D(16, 12) + D(8, 16.5) + D(16, 16.5))], { noAccent: true })`,
  ],
};
