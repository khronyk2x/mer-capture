import { describe, it, expect } from 'vitest';
import { runDQ } from '../lib/dq';

describe('MER Data Quality Engine', () => {
  it('identifies critical sequence errors like pickup before visit date', () => {
    const rows = [
      {
        patient_id: 'PT-001',
        facility: 'General Hospital Marina',
        visit_date: '2026-03-20',
        next_pickup_date: '2026-03-10', // Invalid: pickup before visit
      },
    ];
    const flags = runDQ(rows);
    expect(flags.length).toBeGreaterThan(0);
    expect(flags[0].rule).toBe('pickup_before_visit');
    expect(flags[0].severity).toBe('critical');
  });

  it('passes valid aligned patient records without critical errors', () => {
    const rows = [
      {
        patient_id: 'PT-002',
        facility: 'General Hospital Marina',
        visit_date: '2026-03-10',
        next_pickup_date: '2026-06-10',
        art_start_date: '2024-01-15',
        date_confirmed_positive: '2024-01-10',
      },
    ];
    const flags = runDQ(rows);
    const criticalFlags = flags.filter(f => f.severity === 'critical');
    expect(criticalFlags.length).toBe(0);
  });
});