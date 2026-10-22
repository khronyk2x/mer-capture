import { describe, it, expect } from 'vitest';
import {
  parseDate,
  daysBetween,
  monthsBetween,
  ageFromDob,
  ageBand,
  parseSex,
  parseViralLoad,
  parseYesNo,
  median,
} from '../lib/normalise';

describe('MER Data Normalisation Engine', () => {
  it('parses valid ISO and formatted dates correctly', () => {
    const res1 = parseDate('2026-03-15');
    expect(res1.date).not.toBeNull();
    expect(res1.date?.getUTCFullYear()).toBe(2026);
    expect(res1.date?.getUTCMonth()).toBe(2); // 0-indexed March

    const res2 = parseDate('15/03/2026');
    expect(res2.date).not.toBeNull();
  });

  it('calculates days between two dates accurately', () => {
    const start = new Date('2026-01-01');
    const end = new Date('2026-01-31');
    expect(daysBetween(start, end)).toBe(30);
  });

  it('calculates months between two dates accurately', () => {
    const start = new Date('2026-01-01');
    const end = new Date('2026-04-01');
    const m = monthsBetween(start, end);
    expect(m).not.toBeNull();
    expect(Math.round(m!)).toBe(3);
  });

  it('calculates age from date of birth', () => {
    const ref = new Date('2026-06-01');
    const dob = new Date('2000-01-01');
    expect(ageFromDob(dob, ref)).toBe(26);
  });

  it('categorises PEPFAR age bands accurately', () => {
    expect(ageBand(0)).toBe('<01');
    expect(ageBand(3)).toBe('01-04');
    expect(ageBand(12)).toBe('10-14');
    expect(ageBand(22)).toBe('20-24');
    expect(ageBand(35)).toBe('35-39');
    expect(ageBand(55)).toBe('50+');
  });

  it('normalises sex classifications across clinical variants', () => {
    expect(parseSex('M')).toBe('M');
    expect(parseSex('Male')).toBe('M');
    expect(parseSex('f')).toBe('F');
    expect(parseSex('FEMALE')).toBe('F');
    expect(parseSex('unknown')).toBeNull();
  });

  it('normalises boolean Yes/No answers', () => {
    expect(parseYesNo('Y')).toBe(true);
    expect(parseYesNo('YES')).toBe(true);
    expect(parseYesNo('No')).toBe(false);
    expect(parseYesNo('unknown')).toBeNull();
  });

  it('parses viral load values and handles undetectable/target not detected', () => {
    const suppressed = parseViralLoad('<20');
    expect(suppressed.suppressed).toBe(true);
    expect(suppressed.qualitative).toBe('<20');

    const elevated = parseViralLoad('15000');
    expect(elevated.value).toBe(15000);
    expect(elevated.suppressed).toBe(false);

    const tnd = parseViralLoad('Target Not Detected');
    expect(tnd.suppressed).toBe(true);
  });

  it('calculates medians correctly for odd and even number arrays', () => {
    expect(median([1, 5, 2])).toBe(2);
    expect(median([1, 2, 5, 10])).toBe(3.5);
    expect(median([])).toBeNull();
  });
});