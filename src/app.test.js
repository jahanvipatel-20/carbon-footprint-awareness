import { describe, expect, it } from 'vitest';

const carbonFactors = {
  petrolCar: 0.21,
  electricCar: 0.05,
  bus: 0.08,
  train: 0.04,
  electricityKwh: 0.45,
  heavyMeat: 7.2,
  lowMeat: 4.6,
  vegetarian: 3.8,
  vegan: 2.9,
};

function escapeOutput(inputString) {
  if (typeof inputString !== 'string') return '';
  return inputString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function computeEnvironmentalImpact(transportKm, transportMode, electricityKwh, dietPreference) {
  const transitFactor = carbonFactors[transportMode] || 0;
  const foodFactor = carbonFactors[dietPreference] || 0;
  const transportTotal = transportKm * transitFactor;
  const energyTotal = electricityKwh * carbonFactors.electricityKwh;
  return parseFloat((transportTotal + energyTotal + foodFactor).toFixed(3));
}

function validatePayloadMetrics(transportKm, electricityKwh) {
  if (Number.isNaN(transportKm) || Number.isNaN(electricityKwh)) return 'Metrics must resolve to numeric inputs.';
  if (transportKm < 0 || electricityKwh < 0) return 'Environmental inputs cannot represent negative scalar factors.';
  if (transportKm > 1500 || electricityKwh > 500) return 'Data values exceed daily physical verification limits.';
  return null;
}

describe('sandbox validation', () => {
  it('computes standard operational variables', () => {
    expect(computeEnvironmentalImpact(10, 'petrolCar', 10, 'vegetarian')).toBeCloseTo(10 * 0.21 + 10 * 0.45 + 3.8, 3);
  });

  it('applies fallback if parameters fall to zero', () => {
    expect(computeEnvironmentalImpact(0, 'electricCar', 0, 'vegan')).toBe(2.9);
  });

  it('rejects negative metrics safely', () => {
    expect(validatePayloadMetrics(-5, 20)).toContain('negative scalar factors');
  });

  it('flags inputs exceeding logical parameters', () => {
    expect(validatePayloadMetrics(5000, 10)).toContain('exceed daily physical verification limits');
  });

  it('validates non-numeric variables safely', () => {
    expect(validatePayloadMetrics(NaN, 12)).toContain('numeric inputs');
  });

  it('escapes HTML special characters for security', () => {
    const escaped = escapeOutput('<script>alert("XSS")</script>');
    expect(escaped).not.toContain('<script>');
    expect(escaped).toContain('&lt;');
    expect(escaped).toContain('&gt;');
  });
});
