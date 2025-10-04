class VoltageDividerCalculator {
    constructor() {
        this.calcMode = 'vout';
        this.initializeElements();
        this.setupEventListeners();
        this.initializeStandardResistors();
        this.initializeSliderRanges();
        this.loadFromStorage();
        this.updateCalculations();
    }

    initializeElements() {
        // Input elements
        this.vinInput = document.getElementById('vin');
        this.voutInput = document.getElementById('vout');
        this.r1Input = document.getElementById('r1');
        this.r2Input = document.getElementById('r2');
        this.r1UnitSelect = document.getElementById('r1Unit');
        this.r2UnitSelect = document.getElementById('r2Unit');
        
        // Slider elements
        this.vinSlider = document.getElementById('vinSlider');
        this.voutSlider = document.getElementById('voutSlider');
        this.r1Slider = document.getElementById('r1Slider');
        this.r2Slider = document.getElementById('r2Slider');
        
        // Fine-tuning slider elements
        this.vinFineTuneSlider = document.getElementById('vinFineTune');
        this.voutFineTuneSlider = document.getElementById('voutFineTune');
        this.r1FineTuneSlider = document.getElementById('r1FineTune');
        this.r2FineTuneSlider = document.getElementById('r2FineTune');
        
        // Other elements
        this.calcModeSelect = document.getElementById('calcMode');
        this.errorMessage = document.getElementById('errorMessage');
        
        // Result elements
        this.ratioElement = document.getElementById('ratio');
        this.totalResistanceElement = document.getElementById('totalResistance');
        this.currentElement = document.getElementById('current');
        
        // Resistor search elements
        this.searchVinInput = document.getElementById('searchVin');
        this.searchVoutInput = document.getElementById('searchVout');
        this.targetResistanceInput = document.getElementById('targetResistance');
        this.targetResistanceUnitSelect = document.getElementById('targetResistanceUnit');
        this.resistorSeriesSelect = document.getElementById('resistorSeries');
        this.searchButton = document.getElementById('searchResistors');
        this.searchResults = document.getElementById('searchResults');
        this.resultsList = document.getElementById('resultsList');
        
    }

    setupEventListeners() {
        // Calculation mode change
        this.calcModeSelect.addEventListener('change', (e) => {
            this.calcMode = e.target.value;
            this.updateInputStates();
            this.updateCalculations();
            this.saveToStorage();
        });

        // Input change listeners
        this.vinInput.addEventListener('input', () => {
            this.handleInputChange('vin');
            this.saveToStorage();
        });
        this.voutInput.addEventListener('input', () => {
            this.handleInputChange('vout');
            this.saveToStorage();
        });
        this.r1Input.addEventListener('input', () => {
            this.handleInputChange('r1');
            this.saveToStorage();
        });
        this.r2Input.addEventListener('input', () => {
            this.handleInputChange('r2');
            this.saveToStorage();
        });

        // Slider change listeners
        this.vinSlider.addEventListener('input', () => {
            this.handleSliderChange('vin');
            this.saveToStorage();
        });
        this.voutSlider.addEventListener('input', () => {
            this.handleSliderChange('vout');
            this.saveToStorage();
        });
        this.r1Slider.addEventListener('input', () => {
            this.handleSliderChange('r1');
            this.saveToStorage();
        });
        this.r2Slider.addEventListener('input', () => {
            this.handleSliderChange('r2');
            this.saveToStorage();
        });

        // Fine-tuning slider listeners
        this.vinFineTuneSlider.addEventListener('input', () => {
            this.handleFineTuneChange('vin');
            this.saveToStorage();
        });
        this.voutFineTuneSlider.addEventListener('input', () => {
            this.handleFineTuneChange('vout');
            this.saveToStorage();
        });
        this.r1FineTuneSlider.addEventListener('input', () => {
            this.handleFineTuneChange('r1');
            this.saveToStorage();
        });
        this.r2FineTuneSlider.addEventListener('input', () => {
            this.handleFineTuneChange('r2');
            this.saveToStorage();
        });

        // Resistor search listeners
        if (this.searchButton) {
            this.searchButton.addEventListener('click', () => this.searchResistors());
        }
        if (this.searchVinInput) {
            this.searchVinInput.addEventListener('input', () => {
                this.validateSearchInputs();
                this.saveToStorage();
            });
        }
        if (this.searchVoutInput) {
            this.searchVoutInput.addEventListener('input', () => {
                this.validateSearchInputs();
                this.saveToStorage();
            });
        }
        if (this.targetResistanceInput) {
            this.targetResistanceInput.addEventListener('input', () => {
                this.validateSearchInputs();
                this.saveToStorage();
            });
        }
        if (this.targetResistanceUnitSelect) {
            this.targetResistanceUnitSelect.addEventListener('change', () => {
                this.updateTargetResistanceRange();
                this.saveToStorage();
            });
        }
        if (this.resistorSeriesSelect) {
            this.resistorSeriesSelect.addEventListener('change', () => this.saveToStorage());
        }
        if (this.r1UnitSelect) {
            this.r1UnitSelect.addEventListener('change', () => {
                this.updateSliderRange('r1');
                this.saveToStorage();
            });
        }
        if (this.r2UnitSelect) {
            this.r2UnitSelect.addEventListener('change', () => {
                this.updateSliderRange('r2');
                this.saveToStorage();
            });
        }

        // Tab switching
        this.setupTabSwitching();
    }

    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));

                // Add active class to clicked button and corresponding pane
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Save the active tab
                this.saveToStorage();
            });
        });
    }

    handleInputChange(type) {
        const input = this[`${type}Input`];
        const slider = this[`${type}Slider`];
        const fineTuneSlider = this[`${type}FineTuneSlider`];
        
        if (type === 'r1' || type === 'r2') {
            // For resistors, slider now uses display values directly
            slider.value = parseFloat(input.value) || 0;
        } else {
            // For voltages, direct assignment
            slider.value = input.value;
        }
        
        // Reset fine-tuning slider when input changes
        if (fineTuneSlider) {
            fineTuneSlider.value = 0;
        }
        
        // Validate and update calculations
        if (this.validateInput(input.value)) {
            this.updateCalculations();
            this.hideError();
        }
    }

    handleSliderChange(type) {
        const input = this[`${type}Input`];
        const slider = this[`${type}Slider`];
        
        if (type === 'r1' || type === 'r2') {
            // For resistors, slider now contains display values directly
            input.value = parseFloat(slider.value).toFixed(3);
        } else {
            // For voltages, direct assignment
            input.value = slider.value;
        }
        
        // Reset fine-tuning slider when main slider changes
        const fineTuneSlider = this[`${type}FineTuneSlider`];
        if (fineTuneSlider) {
            fineTuneSlider.value = 0;
        }
        
        // Update calculations
        this.updateCalculations();
    }

    handleFineTuneChange(type) {
        const input = this[`${type}Input`];
        const mainSlider = this[`${type}Slider`];
        const fineTuneSlider = this[`${type}FineTuneSlider`];
        
        if (!input || !mainSlider || !fineTuneSlider) return;
        
        const baseValue = parseFloat(mainSlider.value) || 0;
        const fineTuneValue = parseFloat(fineTuneSlider.value) || 0;
        
        if (type === 'r1' || type === 'r2') {
            // For resistors, apply percentage-based fine-tuning
            const adjustedValue = baseValue * (1 + fineTuneValue);
            input.value = adjustedValue.toFixed(3);
        } else {
            // For voltages, apply direct fine-tuning
            const adjustedValue = baseValue + fineTuneValue;
            input.value = adjustedValue.toFixed(2);
        }
        
        // Update calculations
        this.updateCalculations();
    }

    validateInput(value) {
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0;
    }

    updateInputStates() {
        // Enable/disable inputs based on calculation mode
        const inputs = {
            vin: { input: this.vinInput, slider: this.vinSlider },
            vout: { input: this.voutInput, slider: this.voutSlider },
            r1: { input: this.r1Input, slider: this.r1Slider },
            r2: { input: this.r2Input, slider: this.r2Slider }
        };

        Object.keys(inputs).forEach(key => {
            const isDisabled = key === this.calcMode;
            const inputGroup = inputs[key].input.closest('.input-group');
            
            if (isDisabled) {
                inputGroup.classList.add('disabled');
                inputs[key].input.disabled = true;
                inputs[key].slider.disabled = true;
            } else {
                inputGroup.classList.remove('disabled');
                inputs[key].input.disabled = false;
                inputs[key].slider.disabled = false;
            }
        });
    }

    // Unit conversion methods
    convertToBaseUnits(value, unit) {
        switch (unit) {
            case 'Ω': return value;
            case 'kΩ': return value * 1000;
            case 'MΩ': return value * 1000000;
            default: return value;
        }
    }

    convertFromBaseUnits(value, unit) {
        switch (unit) {
            case 'Ω': return value;
            case 'kΩ': return value / 1000;
            case 'MΩ': return value / 1000000;
            default: return value;
        }
    }

    getResistorValue(type) {
        const input = this[`${type}Input`];
        const unitSelect = this[`${type}UnitSelect`];
        return this.convertToBaseUnits(parseFloat(input.value) || 0, unitSelect.value);
    }

    setResistorValue(type, valueInOhms) {
        const input = this[`${type}Input`];
        const unitSelect = this[`${type}UnitSelect`];
        const slider = this[`${type}Slider`];
        
        // Convert to display units
        const displayValue = this.convertFromBaseUnits(valueInOhms, unitSelect.value);
        
        // Update input and slider
        input.value = displayValue.toFixed(2);
        slider.value = valueInOhms;
    }

    updateSliderRange(type) {
        const unitSelect = this[`${type}UnitSelect`];
        const slider = this[`${type}Slider`];
        const input = this[`${type}Input`];
        
        // Set range based on unit - slider represents display values
        let min, max, step;
        switch (unitSelect.value) {
            case 'Ω':
                min = 1; max = 1000; step = 1;
                break;
            case 'kΩ':
                min = 1; max = 1000; step = 0.1;
                break;
            case 'MΩ':
                min = 1; max = 1000; step = 0.1;
                break;
        }
        
        // Set slider range to match display values
        slider.min = min;
        slider.max = max;
        slider.step = step;
        
        // Update input constraints
        input.min = min;
        input.max = max;
        input.step = step;
        
        // Convert current value to new unit and update both input and slider
        const currentValue = parseFloat(input.value) || 0;
        if (currentValue > 0) {
            const currentInOhms = this.convertToBaseUnits(currentValue, unitSelect.value);
            const newDisplayValue = this.convertFromBaseUnits(currentInOhms, unitSelect.value);
            
            input.value = newDisplayValue.toFixed(3);
            slider.value = newDisplayValue; // Slider uses display value, not base ohms
        } else {
            // Set default value if no current value
            const defaultValue = 10; // Default 10 in current unit
            input.value = defaultValue;
            slider.value = defaultValue;
        }
    }

    updateCalculations() {
        try {
            const vin = parseFloat(this.vinInput.value) || 0;
            const vout = parseFloat(this.voutInput.value) || 0;
            const r1 = this.getResistorValue('r1');
            const r2 = this.getResistorValue('r2');

            let calculatedValue;
            let resultVin = vin, resultVout = vout, resultR1 = r1, resultR2 = r2;

            // Calculate based on selected mode
            switch (this.calcMode) {
                case 'vout':
                    if (r1 > 0 && r2 > 0) {
                        calculatedValue = vin * (r2 / (r1 + r2));
                        resultVout = calculatedValue;
                        this.voutInput.value = calculatedValue.toFixed(3);
                        this.voutSlider.value = calculatedValue;
                    }
                    break;

                case 'vin':
                    if (r1 > 0 && r2 > 0 && vout > 0) {
                        calculatedValue = vout * (r1 + r2) / r2;
                        resultVin = calculatedValue;
                        this.vinInput.value = calculatedValue.toFixed(3);
                        this.vinSlider.value = calculatedValue;
                    }
                    break;

                case 'r1':
                    if (r2 > 0 && vin > 0 && vout > 0 && vout < vin) {
                        calculatedValue = r2 * (vin - vout) / vout;
                        resultR1 = calculatedValue;
                        this.setResistorValue('r1', calculatedValue);
                    }
                    break;

                case 'r2':
                    if (r1 > 0 && vin > 0 && vout > 0 && vout < vin) {
                        calculatedValue = r1 * vout / (vin - vout);
                        resultR2 = calculatedValue;
                        this.setResistorValue('r2', calculatedValue);
                    }
                    break;
            }

            // Update additional calculations
            this.updateAdditionalCalculations(resultVin, resultVout, resultR1, resultR2);

        } catch (error) {
            this.showError('Invalid input values. Please check your entries.');
        }
    }

    updateAdditionalCalculations(vin, vout, r1, r2) {
        // Voltage division ratio
        const ratio = r1 > 0 && r2 > 0 ? r2 / (r1 + r2) : 0;
        this.ratioElement.textContent = ratio.toFixed(4);

        // Total resistance
        const totalResistance = r1 + r2;
        this.totalResistanceElement.textContent = this.formatResistance(totalResistance);

        // Current
        const current = vin > 0 && totalResistance > 0 ? (vin / totalResistance) * 1000 : 0; // in mA
        this.currentElement.textContent = `${current.toFixed(3)} mA`;
    }

    formatResistance(resistance) {
        if (resistance >= 1000000) {
            return `${(resistance / 1000000).toFixed(2)} MΩ`;
        } else if (resistance >= 1000) {
            return `${(resistance / 1000).toFixed(2)} kΩ`;
        } else {
            return `${resistance.toFixed(0)} Ω`;
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }

    // Method to update slider ranges dynamically
    updateSliderRanges() {
        const vin = parseFloat(this.vinInput.value) || 12;
        const vout = parseFloat(this.voutInput.value) || 6;
        const r1 = parseFloat(this.r1Input.value) || 10000;
        const r2 = parseFloat(this.r2Input.value) || 10000;

        // Update voltage slider ranges
        this.vinSlider.max = Math.max(vin * 2, 50);
        this.voutSlider.max = Math.max(vout * 2, vin);

        // Update resistor slider ranges
        this.r1Slider.max = Math.max(r1 * 10, 1000000);
        this.r2Slider.max = Math.max(r2 * 10, 1000000);
    }

    initializeStandardResistors() {
        // Standard resistor values for different series
        this.standardResistors = {
            E12: [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2],
            E24: [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1],
            E48: [1.00, 1.05, 1.10, 1.15, 1.21, 1.27, 1.33, 1.40, 1.47, 1.54, 1.62, 1.69, 1.78, 1.87, 1.96, 2.05, 2.15, 2.26, 2.37, 2.49, 2.61, 2.74, 2.87, 3.01, 3.16, 3.32, 3.48, 3.65, 3.83, 4.02, 4.22, 4.42, 4.64, 4.87, 5.11, 5.36, 5.62, 5.90, 6.19, 6.49, 6.81, 7.15, 7.50, 7.87, 8.25, 8.66, 9.09, 9.53],
            E96: [1.00, 1.02, 1.05, 1.07, 1.10, 1.13, 1.15, 1.18, 1.21, 1.24, 1.27, 1.30, 1.33, 1.37, 1.40, 1.43, 1.47, 1.50, 1.54, 1.58, 1.62, 1.65, 1.69, 1.74, 1.78, 1.82, 1.87, 1.91, 1.96, 2.00, 2.05, 2.10, 2.15, 2.21, 2.26, 2.32, 2.37, 2.43, 2.49, 2.55, 2.61, 2.67, 2.74, 2.80, 2.87, 2.94, 3.01, 3.09, 3.16, 3.24, 3.32, 3.40, 3.48, 3.57, 3.65, 3.74, 3.83, 3.92, 4.02, 4.12, 4.22, 4.32, 4.42, 4.53, 4.64, 4.75, 4.87, 4.99, 5.11, 5.23, 5.36, 5.49, 5.62, 5.76, 5.90, 6.04, 6.19, 6.34, 6.49, 6.65, 6.81, 6.98, 7.15, 7.32, 7.50, 7.68, 7.87, 8.06, 8.25, 8.45, 8.66, 8.87, 9.09, 9.31, 9.53, 9.76]
        };
    }

    initializeSliderRanges() {
        // Initialize resistor sliders with proper ranges based on current units
        if (this.r1Slider && this.r1UnitSelect) {
            this.updateSliderRange('r1');
        }
        if (this.r2Slider && this.r2UnitSelect) {
            this.updateSliderRange('r2');
        }
    }

    generateResistorValues(series) {
        const baseValues = this.standardResistors[series];
        const values = [];
        
        // Generate values from 1Ω to 10MΩ
        for (let decade = 0; decade <= 6; decade++) {
            const multiplier = Math.pow(10, decade);
            baseValues.forEach(value => {
                values.push(value * multiplier);
            });
        }
        
        return values;
    }

    updateTargetResistanceRange() {
        const unitSelect = this.targetResistanceUnitSelect;
        const input = this.targetResistanceInput;
        
        if (!unitSelect || !input) return;
        
        // Use consistent range for all units: 1-1000
        const min = 1;
        const max = 1000;
        const step = 0.1;
        
        input.min = min;
        input.max = max;
        input.step = step;
        
        // Convert current value to new unit
        const currentValue = parseFloat(input.value) || 0;
        if (currentValue > 0) {
            const currentInOhms = this.convertToBaseUnits(currentValue, unitSelect.value);
            const newDisplayValue = this.convertFromBaseUnits(currentInOhms, unitSelect.value);
            input.value = newDisplayValue.toFixed(3);
        }
    }

    validateSearchInputs() {
        if (!this.searchVinInput || !this.searchVoutInput || !this.searchButton) {
            return false;
        }
        
        const vin = parseFloat(this.searchVinInput.value);
        const vout = parseFloat(this.searchVoutInput.value);
        const targetResistance = parseFloat(this.targetResistanceInput?.value) || 0;
        
        const isValid = vin > 0 && vout > 0 && vout < vin && (targetResistance === 0 || targetResistance > 0);
        
        if (isValid) {
            this.searchButton.disabled = false;
            this.searchButton.style.opacity = '1';
        } else {
            this.searchButton.disabled = true;
            this.searchButton.style.opacity = '0.6';
        }
        
        return isValid;
    }

    searchResistors() {
        if (!this.searchVinInput || !this.searchVoutInput || !this.resistorSeriesSelect) {
            this.showError('Search elements not properly initialized. Please refresh the page.');
            return;
        }
        
        const vin = parseFloat(this.searchVinInput.value);
        const vout = parseFloat(this.searchVoutInput.value);
        const targetResistanceValue = parseFloat(this.targetResistanceInput?.value) || 0;
        const targetResistanceUnit = this.targetResistanceUnitSelect?.value || 'kΩ';
        const targetResistance = targetResistanceValue > 0 ? this.convertToBaseUnits(targetResistanceValue, targetResistanceUnit) : 0;
        const series = this.resistorSeriesSelect.value;
        
        
        // Validate inputs
        if (isNaN(vin) || isNaN(vout)) {
            this.showError('Please enter valid numeric values for both voltages.');
            return;
        }
        
        if (vin <= 0) {
            this.showError('Input voltage must be greater than 0.');
            return;
        }
        
        if (vout <= 0) {
            this.showError('Output voltage must be greater than 0.');
            return;
        }
        
        if (vout >= vin) {
            this.showError(`Output voltage (${vout}V) must be less than input voltage (${vin}V).`);
            return;
        }
        
        if (targetResistance < 0) {
            this.showError('Target resistance must be positive.');
            return;
        }

        // Hide any previous errors
        this.hideError();
        
        // Show loading state
        this.searchButton.textContent = 'Searching...';
        this.searchButton.disabled = true;
        
        // Perform search (with a small delay to show loading state)
        setTimeout(() => {
            const results = this.findBestResistors(vin, vout, series, targetResistance);
            this.displaySearchResults(results);
            
            // Reset button
            this.searchButton.textContent = 'Find Best Resistors';
            this.searchButton.disabled = false;
        }, 100);
    }

    findBestResistors(vin, vout, series, targetResistance = 0) {
        const resistorValues = this.generateResistorValues(series);
        const results = [];
        
        // Test all combinations of R1 and R2
        for (let i = 0; i < resistorValues.length; i++) {
            for (let j = 0; j < resistorValues.length; j++) {
                const r1 = resistorValues[i];
                const r2 = resistorValues[j];
                const totalResistance = r1 + r2;
                
                // Skip if target resistance is specified and doesn't match
                if (targetResistance > 0) {
                    const resistanceError = Math.abs(totalResistance - targetResistance);
                    const resistanceErrorPercent = (resistanceError / targetResistance) * 100;
                    
                    // Skip combinations that are too far from target resistance (more than 50% error)
                    if (resistanceErrorPercent > 50) {
                        continue;
                    }
                }
                
                // Calculate actual output voltage
                const actualVout = vin * (r2 / (r1 + r2));
                
                // Calculate required input voltage to achieve target output voltage
                const requiredVin = vout * (r1 + r2) / r2;
                
                // Calculate voltage error
                const voltageError = actualVout - vout;
                const voltageErrorPercent = (voltageError / vout) * 100;
                
                // Calculate resistance error (if target specified)
                let resistanceError = 0;
                let resistanceErrorPercent = 0;
                if (targetResistance > 0) {
                    resistanceError = totalResistance - targetResistance;
                    resistanceErrorPercent = (resistanceError / targetResistance) * 100;
                }
                
                // Calculate combined score (voltage accuracy is primary, resistance is secondary)
                const voltageScore = Math.abs(voltageErrorPercent);
                const resistanceScore = targetResistance > 0 ? Math.abs(resistanceErrorPercent) : 0;
                const combinedScore = voltageScore + (resistanceScore * 0.1); // Resistance is 10% weight
                
                // Calculate accuracy rating based on voltage error
                const accuracy = this.getAccuracyRating(Math.abs(voltageErrorPercent));
                
                results.push({
                    r1: r1,
                    r2: r2,
                    totalResistance: totalResistance,
                    actualVout: actualVout,
                    requiredVin: requiredVin,
                    voltageError: voltageError,
                    voltageErrorPercent: voltageErrorPercent,
                    resistanceError: resistanceError,
                    resistanceErrorPercent: resistanceErrorPercent,
                    combinedScore: combinedScore,
                    accuracy: accuracy
                });
            }
        }
        
        // Sort by combined score (best first)
        results.sort((a, b) => a.combinedScore - b.combinedScore);
        
        // Return top 20 results
        return results.slice(0, 20);
    }

    getAccuracyRating(errorPercent) {
        if (errorPercent <= 0.1) return { rating: 'Excellent', class: 'excellent' };
        if (errorPercent <= 0.5) return { rating: 'Good', class: 'good' };
        if (errorPercent <= 1.0) return { rating: 'Fair', class: 'fair' };
        return { rating: 'Poor', class: 'poor' };
    }

    displaySearchResults(results) {
        this.resultsList.innerHTML = '';
        
        if (results.length === 0) {
            const noResultsRow = document.createElement('div');
            noResultsRow.className = 'result-row';
            noResultsRow.innerHTML = `
                <span colspan="7" style="text-align: center; color: #6c757d; font-style: italic;">
                    No suitable resistor combinations found. Try adjusting your target values.
                </span>
            `;
            this.resultsList.appendChild(noResultsRow);
        } else {
            results.forEach((result, index) => {
                const row = document.createElement('div');
                row.className = 'result-row';
                row.onclick = () => this.selectResistorCombination(result);
                
                // Format total resistance with deviation if target was specified
                let totalResistanceDisplay = this.formatResistance(result.totalResistance);
                if (result.resistanceErrorPercent !== 0) {
                    const deviation = result.resistanceErrorPercent > 0 ? '+' : '';
                    totalResistanceDisplay += ` (${deviation}${result.resistanceErrorPercent.toFixed(1)}%)`;
                }
                
                row.innerHTML = `
                    <span class="resistor-value" data-label="R1">${this.formatResistance(result.r1)}</span>
                    <span class="resistor-value" data-label="R2">${this.formatResistance(result.r2)}</span>
                    <span class="total-resistance-value" data-label="Total R">${totalResistanceDisplay}</span>
                    <span class="voltage-value" data-label="Actual Vout">${result.actualVout.toFixed(3)} V</span>
                    <span class="input-voltage-value" data-label="Req. Vin">${result.requiredVin.toFixed(2)} V</span>
                    <span class="error-value ${result.voltageError >= 0 ? 'positive' : 'negative'}" data-label="Error">${result.voltageError >= 0 ? '+' : ''}${result.voltageError.toFixed(3)} V</span>
                    <span class="accuracy-value ${result.accuracy.class}" data-label="Accuracy">${result.accuracy.rating}</span>
                `;
                
                this.resultsList.appendChild(row);
            });
        }
        
        this.searchResults.style.display = 'block';
    }

    selectResistorCombination(result) {
        // Get the original input voltage from the search
        const originalVin = parseFloat(this.searchVinInput.value);
        const targetVout = parseFloat(this.searchVoutInput.value);
        
        // Update the main calculator with the selected resistor values
        this.setResistorValue('r1', result.r1);
        this.setResistorValue('r2', result.r2);
        
        // Update the calculator's input voltage to the original search input
        this.vinInput.value = originalVin;
        this.vinSlider.value = originalVin;
        
        // Update the calculator's output voltage to the target output
        this.voutInput.value = targetVout;
        this.voutSlider.value = targetVout;
        
        // Set calculation mode to output voltage since we're showing the result
        this.calcModeSelect.value = 'vout';
        this.calcMode = 'vout';
        this.updateInputStates();
        
        // Update calculations
        this.updateCalculations();
        
        // Switch to calculator tab
        const calculatorTabButton = document.querySelector('[data-tab="calculator"]');
        if (calculatorTabButton) {
            calculatorTabButton.click();
        }
    }

    // Local Storage Methods
    saveToStorage() {
        const data = {
            // Calculator values
            vin: this.vinInput?.value || '',
            vout: this.voutInput?.value || '',
            r1: this.r1Input?.value || '',
            r2: this.r2Input?.value || '',
            r1Unit: this.r1UnitSelect?.value || 'kΩ',
            r2Unit: this.r2UnitSelect?.value || 'kΩ',
            calcMode: this.calcMode,
            
            // Fine-tuning slider values
            vinFineTune: this.vinFineTuneSlider?.value || '0',
            voutFineTune: this.voutFineTuneSlider?.value || '0',
            r1FineTune: this.r1FineTuneSlider?.value || '0',
            r2FineTune: this.r2FineTuneSlider?.value || '0',
            
            // Search values
            searchVin: this.searchVinInput?.value || '',
            searchVout: this.searchVoutInput?.value || '',
            targetResistance: this.targetResistanceInput?.value || '',
            targetResistanceUnit: this.targetResistanceUnitSelect?.value || 'kΩ',
            resistorSeries: this.resistorSeriesSelect?.value || 'E24',
            
            // Tab state
            activeTab: document.querySelector('.tab-button.active')?.getAttribute('data-tab') || 'resistor-finder'
        };
        
        try {
            localStorage.setItem('voltageDividerData', JSON.stringify(data));
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('voltageDividerData');
            if (!stored) return;
            
            const data = JSON.parse(stored);
            
            // Restore calculator values
            if (data.vin && this.vinInput) {
                this.vinInput.value = data.vin;
                this.vinSlider.value = data.vin;
            }
            if (data.vout && this.voutInput) {
                this.voutInput.value = data.vout;
                this.voutSlider.value = data.vout;
            }
            if (data.r1 && this.r1Input) {
                this.r1Input.value = data.r1;
                if (data.r1Unit && this.r1UnitSelect) {
                    this.r1UnitSelect.value = data.r1Unit;
                }
                const r1InOhms = this.convertToBaseUnits(parseFloat(data.r1), data.r1Unit || 'kΩ');
                this.r1Slider.value = r1InOhms;
            }
            if (data.r2 && this.r2Input) {
                this.r2Input.value = data.r2;
                if (data.r2Unit && this.r2UnitSelect) {
                    this.r2UnitSelect.value = data.r2Unit;
                }
                const r2InOhms = this.convertToBaseUnits(parseFloat(data.r2), data.r2Unit || 'kΩ');
                this.r2Slider.value = r2InOhms;
            }
            if (data.calcMode && this.calcModeSelect) {
                this.calcMode = data.calcMode;
                this.calcModeSelect.value = data.calcMode;
            }
            
            // Restore fine-tuning slider values
            if (data.vinFineTune && this.vinFineTuneSlider) {
                this.vinFineTuneSlider.value = data.vinFineTune;
            }
            if (data.voutFineTune && this.voutFineTuneSlider) {
                this.voutFineTuneSlider.value = data.voutFineTune;
            }
            if (data.r1FineTune && this.r1FineTuneSlider) {
                this.r1FineTuneSlider.value = data.r1FineTune;
            }
            if (data.r2FineTune && this.r2FineTuneSlider) {
                this.r2FineTuneSlider.value = data.r2FineTune;
            }
            
            // Restore search values
            if (data.searchVin && this.searchVinInput) {
                this.searchVinInput.value = data.searchVin;
            }
            if (data.searchVout && this.searchVoutInput) {
                this.searchVoutInput.value = data.searchVout;
            }
            if (data.targetResistance && this.targetResistanceInput) {
                this.targetResistanceInput.value = data.targetResistance;
                if (data.targetResistanceUnit && this.targetResistanceUnitSelect) {
                    this.targetResistanceUnitSelect.value = data.targetResistanceUnit;
                }
            }
            if (data.resistorSeries && this.resistorSeriesSelect) {
                this.resistorSeriesSelect.value = data.resistorSeries;
            }
            
            // Restore active tab
            if (data.activeTab) {
                const tabButton = document.querySelector(`[data-tab="${data.activeTab}"]`);
                if (tabButton) {
                    // Remove active class from all tabs
                    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                    
                    // Add active class to stored tab
                    tabButton.classList.add('active');
                    document.getElementById(data.activeTab).classList.add('active');
                }
            }
            
        } catch (error) {
            console.warn('Could not load from localStorage:', error);
        }
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VoltageDividerCalculator();
});

// Add some utility functions for better user experience
function formatNumber(num, decimals = 3) {
    return parseFloat(num).toFixed(decimals);
}

function validateVoltageDivider(vin, vout, r1, r2) {
    const errors = [];
    
    if (vin <= 0) errors.push('Input voltage must be positive');
    if (vout < 0) errors.push('Output voltage cannot be negative');
    if (vout >= vin) errors.push('Output voltage must be less than input voltage');
    if (r1 <= 0) errors.push('R1 must be positive');
    if (r2 <= 0) errors.push('R2 must be positive');
    
    return errors;
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                document.getElementById('calcMode').value = 'vout';
                document.getElementById('calcMode').dispatchEvent(new Event('change'));
                break;
            case '2':
                e.preventDefault();
                document.getElementById('calcMode').value = 'vin';
                document.getElementById('calcMode').dispatchEvent(new Event('change'));
                break;
            case '3':
                e.preventDefault();
                document.getElementById('calcMode').value = 'r1';
                document.getElementById('calcMode').dispatchEvent(new Event('change'));
                break;
            case '4':
                e.preventDefault();
                document.getElementById('calcMode').value = 'r2';
                document.getElementById('calcMode').dispatchEvent(new Event('change'));
                break;
        }
    }
});
