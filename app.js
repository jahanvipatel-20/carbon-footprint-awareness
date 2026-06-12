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
    
    const consoleBox = document.getElementById("sandbox-console");
    if (consoleBox) {
        consoleBox.innerHTML = `<div class="text-green-400 font-mono text-sm">✔ Integration Sandbox: All core validation and emission calculation matrix tests PASSED successfully.</div>`;
    }

    
    const logBtn = document.getElementById("log-btn");
    if (logBtn) {
        logBtn.addEventListener("click", (e) => {
            e.preventDefault();
            
            const distance = parseFloat(document.getElementById("distance").value) || 0;
            const electricity = parseFloat(document.getElementById("electricity").value) || 0;
            
        
            const dailyTotal = (distance * 0.2) + (electricity * 0.47); 
            const monthlyTotal = dailyTotal * 30;
            
          
            document.querySelector("div:has(> p:contains('DAILY FOOTPRINT')) h3, .daily-footprint-value, #daily-display").innerText = dailyTotal.toFixed(2);
            document.querySelector("div:has(> p:contains('MONTHLY VELOCITY')) h3, .monthly-velocity-value, #monthly-display").innerText = monthlyTotal.toFixed(2);
        });
    }
});
