import { describe, it, expect } from 'vitest';
import { deidentify, rehydrate } from '../lib/deidentify';

describe('Clinical Note De-identification Engine', () => {
  it('redacts patient names, hospital numbers, and phone numbers', () => {
    const sample = 'Name: John Doe\nHospital No: ART-09211\nPhone: 08012345678\nPatient presented with fever.';
    const result = deidentify(sample);

    expect(result.redacted).not.toContain('John Doe');
    expect(result.redacted).not.toContain('ART-09211');
    expect(result.redacted).not.toContain('08012345678');
    expect(result.entries.length).toBeGreaterThan(0);
  });

  it('rehydrates redacted tokens back to original values when given structured extraction', () => {
    const sample = 'Name: Mary Okafor\nPatient attended clinic today.';
    const deid = deidentify(sample);

    expect(deid.entries.length).toBeGreaterThan(0);
    const token = deid.entries[0]?.token;

    const restored = rehydrate(`Patient: ${token}`, deid.map);
    expect(restored).toBe(`Patient: ${deid.entries[0].original}`);
  });
});