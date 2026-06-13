'use strict';

const carbonFactors = {
    petrolCar: 0.21,
    electricCar: 0.05,
    bus: 0.08,
    train: 0.04,
    electricityKwh: 0.45,
    heavyMeat: 7.2,
    lowMeat: 4.6,
    vegetarian: 3.8,
    vegan: 2.9
};

const GLOBAL_DAILY_TARGET = 11.5;

function escapeOutput(inputString) {
    if (typeof inputString !== 'string') return '';
    return inputString
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
}

function computeEnvironmentalImpact(transportKm, transportMode, electricityKwh, dietPreference) {
    const transitFactor = carbonFactors[transportMode] || 0;
    const foodFactor = carbonFactors[dietPreference] || 0;
    
    const transportTotal = transportKm * transitFactor;
    const energyTotal = electricityKwh * carbonFactors.electricityKwh;
    
    const absoluteDailySum = transportTotal + energyTotal + foodFactor;
    return parseFloat(absoluteDailySum.toFixed(3));
}

function validatePayloadMetrics(transportKm, electricityKwh) {
    if (isNaN(transportKm) || isNaN(electricityKwh)) {
        return "Metrics must resolve to numeric inputs.";
    }
    if (transportKm < 0 || electricityKwh < 0) {
        return "Environmental inputs cannot represent negative scalar factors.";
    }
    if (transportKm > 1500 || electricityKwh > 500) {
        return "Data values exceed daily physical verification limits.";
    }
    return null;
}

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let summaryLog = "";

function assert(condition, message) {
    if (!condition) throw new Error(message || "Assertion failed");
}

function runTest(name, fn) {
    totalTests++;
    try {
        fn();
        passedTests++;
        summaryLog += `[PASS] - ${name}\n`;
    } catch (err) {
        failedTests++;
        summaryLog += `[FAIL] - ${name}\n       Error: ${err.message}\n`;
    }
}

runTest("Computes standard operational variables", () => {
    const base = computeEnvironmentalImpact(10, "petrolCar", 10, "vegetarian");
    const exact = parseFloat((10 * 0.21 + 10 * 0.45 + 3.8).toFixed(3));
    assert(base === exact, `Expected ${exact}, got ${base}`);
});

runTest("Applies fallback if parameters fall to zero", () => {
    const floor = computeEnvironmentalImpact(0, "electricCar", 0, "vegan");
    assert(floor === 2.9, "Should fall back to base diet metrics");
});

runTest("Rejects negative metrics safely", () => {
    const anomaly = validatePayloadMetrics(-5, 20);
    assert(anomaly && anomaly.includes("negative scalar factors"), "Should detect negative parameters");
});

runTest("Flags inputs exceeding logical parameters", () => {
    const scale = validatePayloadMetrics(5000, 10);
    assert(scale && scale.includes("exceed daily physical verification limits"), "Should intercept scaling limits");
});

runTest("Validates non-numeric variables safely", () => {
    const fault = validatePayloadMetrics(NaN, 12);
    assert(fault && fault.includes("numeric inputs"), "Should identity invalid numeric input");
});

runTest("Escapes HTML special characters for security", () => {
    const input = '<script>alert("XSS")</script>';
    const escaped = escapeOutput(input);
    assert(!escaped.includes('<script>'), "Should strip out raw script elements");
    assert(escaped.includes('&lt;') && escaped.includes('&gt;'), "Should map tags to character configurations");
});

console.log('========================================');
console.log('      AUTOMATED SANDBOX UNIT TESTS     ');
console.log('========================================');
console.log(summaryLog);
console.log('----------------------------------------');
console.log(`EXECUTION SUMMARY: Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('========================================');

if (typeof window !== 'undefined') {
    window.summaryLog = summaryLog;
    window.passedTests = passedTests;
    window.failedTests = failedTests;
}

if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", () => {
        const reportTarget = document.getElementById("jest-lite-report");
        if (reportTarget) {
            let viewOutput = "========================================\n";
            viewOutput += "      AUTOMATED SANDBOX UNIT TESTS     \n";
            viewOutput += "========================================\n";
            viewOutput += summaryLog;
            viewOutput += "\n----------------------------------------\n";
            viewOutput += `EXECUTION SUMMARY: Passed: ${passedTests} | Failed: ${failedTests}\n`;
            viewOutput += "========================================\n";
            reportTarget.textContent = viewOutput;
        }
    });
}
