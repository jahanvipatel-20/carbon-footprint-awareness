import { describe, expect, it } from 'vitest';

const emissionFactors = {
  petrol: 0.2,
  diesel: 0.18,
  electric: 0.08,
  gas: 0.2,
};

function calculateImpact({ transport, fuelType, energy, energySource, diet, dietType }) {
  const transportEmission = transport * emissionFactors[fuelType];
  const energyEmission = energy * (energySource === 'electric' ? 0.4 : 0.55);
  const dietEmission = diet * (dietType === 'vegan' ? 1.2 : dietType === 'vegetarian' ? 0.8 : 1.6);
  return {
    transportEmission,
    energyEmission,
    dietEmission,
    total: transportEmission + energyEmission + dietEmission,
  };
}

function getTopCategory(breakdown) {
  return breakdown.reduce((a, b) => (a.value > b.value ? a : b));
}

describe('carbon calculator', () => {
  it('calculates emissions using standard factors', () => {
    const result = calculateImpact({ transport: 50, fuelType: 'petrol', energy: 10, energySource: 'electric', diet: 7, dietType: 'balanced' });
    expect(result.transportEmission).toBeCloseTo(10, 2);
    expect(result.energyEmission).toBeCloseTo(4, 2);
    expect(result.dietEmission).toBeCloseTo(11.2, 2);
    expect(result.total).toBeCloseTo(25.2, 2);
  });

  it('selects the highest emission category correctly', () => {
    const breakdown = [
      { label: 'Transport', value: 10 },
      { label: 'Energy', value: 4 },
      { label: 'Diet', value: 11.2 },
    ];
    expect(getTopCategory(breakdown).label).toBe('Diet');
  });
});
