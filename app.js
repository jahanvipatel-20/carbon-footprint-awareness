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

function compileInsightMatrix(totalEmissions, transportKm, electricityKwh) {
    const contextContainer = [];
    
    if (totalEmissions > GLOBAL_DAILY_TARGET) {
        contextContainer.push("<div class='p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium'>Your metrics exceed target levels. Implement changes immediately.</div>");
    } else {
        contextContainer.push("<div class='p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium'>Excellent tracking state. You are well within clean operational parameters.</div>");
    }
    
    if (transportKm > 50) {
        contextContainer.push("<div class='p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm'>High transit profile. Consider route optimization or transitions to train/bus travel.</div>");
    }
    if (electricityKwh > 25) {
        contextContainer.push("<div class='p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm'>High energy metrics discovered. Audit idle structural loads and transition devices down.</div>");
    }
    
    return contextContainer.join("");
}

function processInteractions(event) {
    if (event) event.preventDefault();
    
    const feedbackNode = document.getElementById("validationFeedback");
    if (feedbackNode) {
        feedbackNode.classList.add("hidden");
        feedbackNode.textContent = "";
    }

    const distance = parseFloat(document.getElementById("transportInput").value) || 0;
    const transitType = document.getElementById("transportMode").value;
    const currentEnergy = parseFloat(document.getElementById("energyInput").value) || 0;
    const selectedDiet = document.getElementById("dietInput").value;

    const validationFault = validatePayloadMetrics(distance, currentEnergy);
    if (validationFault) {
        if (feedbackNode) {
            feedbackNode.textContent = escapeOutput(validationFault);
            feedbackNode.classList.remove("hidden");
        }
        return;
    }

    const calculatedTotal = computeEnvironmentalImpact(distance, transitType, currentEnergy, selectedDiet);
    const monthlyProjection = parseFloat((calculatedTotal * 30.42).toFixed(2));
    
    let variancePercent = 0;
    if (calculatedTotal > 0) {
        variancePercent = Math.round(((calculatedTotal - GLOBAL_DAILY_TARGET) / GLOBAL_DAILY_TARGET) * 100);
    }

    localStorage.setItem("cached_transit_val", distance.toString());
    localStorage.setItem("cached_energy_val", currentEnergy.toString());

    document.getElementById("totalEmissionsDisplay").textContent = calculatedTotal.toFixed(2);
    document.getElementById("monthlyProjectionDisplay").textContent = monthlyProjection.toLocaleString();
    
    const varianceNode = document.getElementById("varianceDisplay");
    const wrapperNode = document.getElementById("varianceWrapper");
    
    if (varianceNode && wrapperNode) {
        if (variancePercent > 0) {
            varianceNode.textContent = `+${variancePercent}%`;
            wrapperNode.className = "text-3xl font-extrabold text-red-600 mt-1";
        } else {
            varianceNode.textContent = `${variancePercent}%`;
            wrapperNode.className = "text-3xl font-extrabold text-green-600 mt-1";
        }
    }

    const generatedInsightsHTML = compileInsightMatrix(calculatedTotal, distance, currentEnergy);
    document.getElementById("insightsContainer").innerHTML = generatedInsightsHTML;

    renderSandboxReport();
}

function renderSandboxReport() {
    const reportTarget = document.getElementById("jest-lite-report");
    if (!reportTarget) {
        return;
    }

    const summaryLog = window.summaryLog || "No sandbox output available.";
    const passedTests = window.passedTests ?? 0;
    const failedTests = window.failedTests ?? 0;

    reportTarget.className = failedTests > 0
        ? "bg-red-900 text-red-100 border border-red-700 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-48 shadow-inner"
        : "bg-green-900 text-green-100 border border-green-700 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-48 shadow-inner";

    let viewOutput = "========================================\n";
    viewOutput += "      AUTOMATED SANDBOX UNIT TESTS     \n";
    viewOutput += "========================================\n";
    viewOutput += summaryLog;
    viewOutput += "\n----------------------------------------\n";
    viewOutput += `EXECUTION SUMMARY: Passed: ${passedTests} | Failed: ${failedTests}\n`;
    viewOutput += "========================================\n";
    reportTarget.textContent = viewOutput;
}

function createThrottledRunner(callbackDelay, targetingFunction) {
    let operationTimeout;
    return function(...executionArgs) {
        clearTimeout(operationTimeout);
        operationTimeout = setTimeout(() => {
            targetingFunction.apply(this, executionArgs);
        }, callbackDelay);
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const formTarget = document.getElementById("trackerForm");
    if (formTarget) {
        formTarget.addEventListener("submit", processInteractions);
    }
    
    const responsiveInputs = ["transportInput", "energyInput", "transportMode", "dietInput"];
    const throttledUpdate = createThrottledRunner(250, () => {
        processInteractions(null);
    });
    
    responsiveInputs.forEach(elementId => {
        const inputNode = document.getElementById(elementId);
        if (inputNode) {
            inputNode.addEventListener("input", throttledUpdate);
        }
    });

    // Prefill from previous session (improves UX when hosted on GitHub Pages)
    try {
        const cachedTransit = localStorage.getItem("cached_transit_val");
        const cachedEnergy = localStorage.getItem("cached_energy_val");
        if (cachedTransit !== null && document.getElementById("transportInput")) {
            document.getElementById("transportInput").value = cachedTransit;
        }
        if (cachedEnergy !== null && document.getElementById("energyInput")) {
            document.getElementById("energyInput").value = cachedEnergy;
        }
    } catch (e) {
        // localStorage may be unavailable in some sandboxed environments; ignore silently
    }

    // Run an initial calculation to populate cards and insights
    setTimeout(() => processInteractions(null), 50);
});
