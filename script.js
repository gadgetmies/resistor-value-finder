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
        
        // Additional resistor elements
        this.r1bInput = document.getElementById('r1b');
        this.r2bInput = document.getElementById('r2b');
        this.r1bUnitSelect = document.getElementById('r1bUnit');
        this.r2bUnitSelect = document.getElementById('r2bUnit');
        
        // Slider elements
        this.vinSlider = document.getElementById('vinSlider');
        this.voutSlider = document.getElementById('voutSlider');
        this.r1Slider = document.getElementById('r1Slider');
        this.r2Slider = document.getElementById('r2Slider');
        this.r1bSlider = document.getElementById('r1bSlider');
        this.r2bSlider = document.getElementById('r2bSlider');
        
        // Fine-tuning slider elements
        this.vinFineTuneSlider = document.getElementById('vinFineTune');
        this.voutFineTuneSlider = document.getElementById('voutFineTune');
        this.r1FineTuneSlider = document.getElementById('r1FineTune');
        this.r2FineTuneSlider = document.getElementById('r2FineTune');
        this.r1bFineTuneSlider = document.getElementById('r1bFineTune');
        this.r2bFineTuneSlider = document.getElementById('r2bFineTune');
        
        // Configuration elements
        this.r1bGroup = document.getElementById('r1bGroup');
        this.r2bGroup = document.getElementById('r2bGroup');
        
        // Search configuration elements
        this.searchR1ConfigSelect = document.getElementById('searchR1Config');
        this.searchR2ConfigSelect = document.getElementById('searchR2Config');
        
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


        // Additional resistor input listeners
        if (this.r1bInput) {
            this.r1bInput.addEventListener('input', () => {
                this.handleInputChange('r1b');
                this.saveToStorage();
            });
        }
        if (this.r2bInput) {
            this.r2bInput.addEventListener('input', () => {
                this.handleInputChange('r2b');
                this.saveToStorage();
            });
        }

        // Additional resistor slider listeners
        if (this.r1bSlider) {
            this.r1bSlider.addEventListener('input', () => {
                this.handleSliderChange('r1b');
                this.saveToStorage();
            });
        }
        if (this.r2bSlider) {
            this.r2bSlider.addEventListener('input', () => {
                this.handleSliderChange('r2b');
                this.saveToStorage();
            });
        }

        // Additional resistor fine-tuning listeners
        if (this.r1bFineTuneSlider) {
            this.r1bFineTuneSlider.addEventListener('input', () => {
                this.handleFineTuneChange('r1b');
                this.saveToStorage();
            });
        }
        if (this.r2bFineTuneSlider) {
            this.r2bFineTuneSlider.addEventListener('input', () => {
                this.handleFineTuneChange('r2b');
                this.saveToStorage();
            });
        }

        // Additional resistor unit change listeners
        if (this.r1bUnitSelect) {
            this.r1bUnitSelect.addEventListener('change', () => {
                this.updateSliderRange('r1b');
                this.saveToStorage();
            });
        }
        if (this.r2bUnitSelect) {
            this.r2bUnitSelect.addEventListener('change', () => {
                this.updateSliderRange('r2b');
                this.saveToStorage();
            });
        }

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
        if (this.searchR1ConfigSelect) {
            this.searchR1ConfigSelect.addEventListener('change', () => {
                this.syncConfigurations();
                this.saveToStorage();
            });
        }
        if (this.searchR2ConfigSelect) {
            this.searchR2ConfigSelect.addEventListener('change', () => {
                this.syncConfigurations();
                this.saveToStorage();
            });
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

    updateResistorConfiguration(resistorType) {
        // Use search configuration selectors since they were moved to the resistor finder tab
        const configSelect = this[`search${resistorType.charAt(0).toUpperCase() + resistorType.slice(1)}ConfigSelect`];
        const additionalGroup = this[`${resistorType}bGroup`];
        
        if (!configSelect || !additionalGroup) return;
        
        const config = configSelect.value;
        
        if (config === 'single') {
            additionalGroup.style.display = 'none';
        } else {
            additionalGroup.style.display = 'block';
        }
        
        // Update calculations when configuration changes
        this.updateCalculations();
        
        // Update circuit diagram
        this.updateCircuitDiagram();
        
        // Update formula display
        this.updateFormulaDisplay();
    }

    syncConfigurations() {
        // Update calculator configurations based on search configurations
        this.updateResistorConfiguration('r1');
        this.updateResistorConfiguration('r2');
    }

    updateCircuitDiagram() {
        const svg = document.querySelector('.circuit-diagram svg');
        if (!svg) return;
        
        const r1Config = this.searchR1ConfigSelect?.value || 'single';
        const r2Config = this.searchR2ConfigSelect?.value || 'single';
        
        // Clear existing resistor elements
        const existingResistors = svg.querySelectorAll('.resistor');
        existingResistors.forEach(el => el.remove());
        
        // Add R1 resistors based on configuration
        this.addResistorToDiagram(svg, 'r1', r1Config, 100, 40);
        
        // Add R2 resistors based on configuration
        this.addResistorToDiagram(svg, 'r2', r2Config, 100, 120);
    }

    addResistorToDiagram(svg, resistorType, config, x, y) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('resistor');
        
        if (config === 'single') {
            // Single resistor
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x);
            rect.setAttribute('y', y);
            rect.setAttribute('width', '60');
            rect.setAttribute('height', '20');
            rect.setAttribute('fill', 'none');
            rect.setAttribute('stroke', '#333');
            rect.setAttribute('stroke-width', '2');
            group.appendChild(rect);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x + 30);
            text.setAttribute('y', y + 13);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '10');
            text.textContent = resistorType.toUpperCase();
            group.appendChild(text);
            
        } else if (config === 'series') {
            // Two resistors in series
            const rect1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect1.setAttribute('x', x);
            rect1.setAttribute('y', y);
            rect1.setAttribute('width', '30');
            rect1.setAttribute('height', '20');
            rect1.setAttribute('fill', 'none');
            rect1.setAttribute('stroke', '#333');
            rect1.setAttribute('stroke-width', '2');
            group.appendChild(rect1);
            
            const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text1.setAttribute('x', x + 15);
            text1.setAttribute('y', y + 13);
            text1.setAttribute('text-anchor', 'middle');
            text1.setAttribute('font-size', '8');
            text1.textContent = resistorType.toUpperCase() + 'a';
            group.appendChild(text1);
            
            const rect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect2.setAttribute('x', x + 30);
            rect2.setAttribute('y', y);
            rect2.setAttribute('width', '30');
            rect2.setAttribute('height', '20');
            rect2.setAttribute('fill', 'none');
            rect2.setAttribute('stroke', '#333');
            rect2.setAttribute('stroke-width', '2');
            group.appendChild(rect2);
            
            const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text2.setAttribute('x', x + 45);
            text2.setAttribute('y', y + 13);
            text2.setAttribute('text-anchor', 'middle');
            text2.setAttribute('font-size', '8');
            text2.textContent = resistorType.toUpperCase() + 'b';
            group.appendChild(text2);
            
        } else if (config === 'parallel') {
            // Two resistors in parallel
            const rect1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect1.setAttribute('x', x);
            rect1.setAttribute('y', y - 10);
            rect1.setAttribute('width', '60');
            rect1.setAttribute('height', '15');
            rect1.setAttribute('fill', 'none');
            rect1.setAttribute('stroke', '#333');
            rect1.setAttribute('stroke-width', '2');
            group.appendChild(rect1);
            
            const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text1.setAttribute('x', x + 30);
            text1.setAttribute('y', y - 2);
            text1.setAttribute('text-anchor', 'middle');
            text1.setAttribute('font-size', '8');
            text1.textContent = resistorType.toUpperCase() + 'a';
            group.appendChild(text1);
            
            const rect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect2.setAttribute('x', x);
            rect2.setAttribute('y', y + 15);
            rect2.setAttribute('width', '60');
            rect2.setAttribute('height', '15');
            rect2.setAttribute('fill', 'none');
            rect2.setAttribute('stroke', '#333');
            rect2.setAttribute('stroke-width', '2');
            group.appendChild(rect2);
            
            const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text2.setAttribute('x', x + 30);
            text2.setAttribute('y', y + 27);
            text2.setAttribute('text-anchor', 'middle');
            text2.setAttribute('font-size', '8');
            text2.textContent = resistorType.toUpperCase() + 'b';
            group.appendChild(text2);
            
            // Add parallel connection lines
            const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line1.setAttribute('x1', x);
            line1.setAttribute('y1', y);
            line1.setAttribute('x2', x);
            line1.setAttribute('y2', y + 5);
            line1.setAttribute('stroke', '#333');
            line1.setAttribute('stroke-width', '2');
            group.appendChild(line1);
            
            const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line2.setAttribute('x1', x + 60);
            line2.setAttribute('y1', y);
            line2.setAttribute('x2', x + 60);
            line2.setAttribute('y2', y + 5);
            line2.setAttribute('stroke', '#333');
            line2.setAttribute('stroke-width', '2');
            group.appendChild(line2);
            
            const line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line3.setAttribute('x1', x);
            line3.setAttribute('y1', y + 15);
            line3.setAttribute('x2', x);
            line3.setAttribute('y2', y + 20);
            line3.setAttribute('stroke', '#333');
            line3.setAttribute('stroke-width', '2');
            group.appendChild(line3);
            
            const line4 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line4.setAttribute('x1', x + 60);
            line4.setAttribute('y1', y + 15);
            line4.setAttribute('x2', x + 60);
            line4.setAttribute('y2', y + 20);
            line4.setAttribute('stroke', '#333');
            line4.setAttribute('stroke-width', '2');
            group.appendChild(line4);
        }
        
        svg.appendChild(group);
    }

    updateFormulaDisplay() {
        const formulaElement = document.querySelector('.formula-display');
        if (!formulaElement) return;
        
        const r1Config = this.searchR1ConfigSelect?.value || 'single';
        const r2Config = this.searchR2ConfigSelect?.value || 'single';
        
        let r1Text = 'R₁';
        let r2Text = 'R₂';
        
        if (r1Config === 'series') {
            r1Text = '(R₁a + R₁b)';
        } else if (r1Config === 'parallel') {
            r1Text = '(R₁a || R₁b)';
        }
        
        if (r2Config === 'series') {
            r2Text = '(R₂a + R₂b)';
        } else if (r2Config === 'parallel') {
            r2Text = '(R₂a || R₂b)';
        }
        
        formulaElement.innerHTML = `V<sub>out</sub> = V<sub>in</sub> × (${r2Text} / (${r1Text} + ${r2Text}))`;
    }

    updateInputStates() {
        // Enable/disable inputs based on calculation mode
        const inputs = {
            vin: { input: this.vinInput, slider: this.vinSlider },
            vout: { input: this.voutInput, slider: this.voutSlider },
            r1: { input: this.r1Input, slider: this.r1Slider },
            r2: { input: this.r2Input, slider: this.r2Slider },
            r1b: { input: this.r1bInput, slider: this.r1bSlider },
            r2b: { input: this.r2bInput, slider: this.r2bSlider }
        };

        Object.keys(inputs).forEach(key => {
            const isDisabled = key === this.calcMode;
            const inputGroup = inputs[key].input?.closest('.input-group');
            
            if (inputGroup) {
                if (isDisabled) {
                    inputGroup.classList.add('disabled');
                    inputs[key].input.disabled = true;
                    inputs[key].slider.disabled = true;
                } else {
                    inputGroup.classList.remove('disabled');
                    inputs[key].input.disabled = false;
                    inputs[key].slider.disabled = false;
                }
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

    getEffectiveResistance(resistorType) {
        // Use search configuration selectors since they were moved to the resistor finder tab
        const configSelect = this[`search${resistorType.charAt(0).toUpperCase() + resistorType.slice(1)}ConfigSelect`];
        if (!configSelect) return 0;
        
        const config = configSelect.value;
        const r1 = this.getResistorValue(resistorType);
        
        if (config === 'single') {
            return r1;
        } else if (config === 'series') {
            const r2 = this.getResistorValue(`${resistorType}b`);
            return r1 + r2;
        } else if (config === 'parallel') {
            const r2 = this.getResistorValue(`${resistorType}b`);
            if (r1 === 0 || r2 === 0) return 0;
            return (r1 * r2) / (r1 + r2);
        }
        
        return r1;
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

    setEffectiveResistorValue(resistorType, effectiveValueInOhms) {
        // Use search configuration selectors since they were moved to the resistor finder tab
        const configSelect = this[`search${resistorType.charAt(0).toUpperCase() + resistorType.slice(1)}ConfigSelect`];
        if (!configSelect) return;
        
        const config = configSelect.value;
        
        if (config === 'single') {
            this.setResistorValue(resistorType, effectiveValueInOhms);
        } else if (config === 'series') {
            // For series, split the effective resistance equally between the two resistors
            const halfValue = effectiveValueInOhms / 2;
            this.setResistorValue(resistorType, halfValue);
            this.setResistorValue(`${resistorType}b`, halfValue);
        } else if (config === 'parallel') {
            // For parallel, set both resistors to twice the effective resistance
            const doubleValue = effectiveValueInOhms * 2;
            this.setResistorValue(resistorType, doubleValue);
            this.setResistorValue(`${resistorType}b`, doubleValue);
        }
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
            const r1 = this.getEffectiveResistance('r1');
            const r2 = this.getEffectiveResistance('r2');

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
                        this.setEffectiveResistorValue('r1', calculatedValue);
                    }
                    break;

                case 'r2':
                    if (r1 > 0 && vin > 0 && vout > 0 && vout < vin) {
                        calculatedValue = r1 * vout / (vin - vout);
                        resultR2 = calculatedValue;
                        this.setEffectiveResistorValue('r2', calculatedValue);
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
        if (this.r1bSlider && this.r1bUnitSelect) {
            this.updateSliderRange('r1b');
        }
        if (this.r2bSlider && this.r2bUnitSelect) {
            this.updateSliderRange('r2b');
        }
        
        // Initialize resistor configurations
        this.updateResistorConfiguration('r1');
        this.updateResistorConfiguration('r2');
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

    // Build effective candidates for a branch (single/series/parallel) with unequal pairs supported
    buildEffectiveCandidates(config, resistorValues, maxNeighborSpan = 24) {
        const candidates = [];
        const n = resistorValues.length;

        if (config === 'single') {
            for (let i = 0; i < n; i++) {
                const a = resistorValues[i];
                candidates.push({ eff: a, a: a, b: null, op: 'single' });
            }
            return candidates;
        }

        // For series/parallel, generate unequal pairs but limit j to a local neighborhood to keep it fast
        const isSeries = config === 'series';
        for (let i = 0; i < n; i++) {
            const a = resistorValues[i];
            const jEnd = Math.min(n, i + maxNeighborSpan);
            for (let j = i; j < jEnd; j++) { // j starts at i to avoid duplicate pair ordering
                const b = resistorValues[j];
                let eff;
                if (isSeries) {
                    eff = a + b;
                } else {
                    // parallel
                    eff = (a * b) / (a + b);
                }
                candidates.push({ eff, a, b, op: isSeries ? 'series' : 'parallel' });
            }
        }
        return candidates;
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
        
        // Get current resistor configurations from search selectors
        const r1Config = this.searchR1ConfigSelect?.value || 'single';
        const r2Config = this.searchR2ConfigSelect?.value || 'single';
        
        // Build effective candidates for each branch
        const r1Candidates = this.buildEffectiveCandidates(r1Config, resistorValues);
        const r2Candidates = this.buildEffectiveCandidates(r2Config, resistorValues);
        
        // Evaluate combinations
        for (let i = 0; i < r1Candidates.length; i++) {
            const c1 = r1Candidates[i];
            for (let j = 0; j < r2Candidates.length; j++) {
                const c2 = r2Candidates[j];
                const r1 = c1.eff;
                const r2 = c2.eff;
                const totalResistance = r1 + r2;
                
                // Skip if target resistance is specified and doesn't match
                if (targetResistance > 0) {
                    const resistanceError = Math.abs(totalResistance - targetResistance);
                    const resistanceErrorPercent = (resistanceError / targetResistance) * 100;
                    if (resistanceErrorPercent > 50) continue;
                }
                
                // Calculate actual output voltage
                const actualVout = vin * (r2 / (r1 + r2));
                // Calculate required input voltage to achieve target output voltage
                const requiredVin = vout * (r1 + r2) / r2;
                // Calculate voltage error
                const voltageError = actualVout - vout;
                const voltageErrorPercent = (voltageError / vout) * 100;
                
                // Resistance error (if target specified)
                let resistanceError = 0;
                let resistanceErrorPercent = 0;
                if (targetResistance > 0) {
                    resistanceError = totalResistance - targetResistance;
                    resistanceErrorPercent = (resistanceError / targetResistance) * 100;
                }
                
                // Combined score
                const voltageScore = Math.abs(voltageErrorPercent);
                const resistanceScore = targetResistance > 0 ? Math.abs(resistanceErrorPercent) : 0;
                const combinedScore = voltageScore + (resistanceScore * 0.1);
                
                const accuracy = this.getAccuracyRating(Math.abs(voltageErrorPercent));
                
                results.push({
                    r1: c1.a,
                    r1b: c1.b,
                    r2: c2.a,
                    r2b: c2.b,
                    r1Config: r1Config,
                    r2Config: r2Config,
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
                
                // Format resistor values based on configuration
                let r1Display = this.formatResistance(result.r1);
                let r2Display = this.formatResistance(result.r2);
                
                if (result.r1b) {
                    r1Display += ` ${result.r1Config === 'parallel' ? '||' : '+'} ${this.formatResistance(result.r1b)}`;
                }
                if (result.r2b) {
                    r2Display += ` ${result.r2Config === 'parallel' ? '||' : '+'} ${this.formatResistance(result.r2b)}`;
                }
                
                row.innerHTML = `
                    <span class="resistor-value" data-label="R1">${r1Display}</span>
                    <span class="resistor-value" data-label="R2">${r2Display}</span>
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
        
        // Update additional resistors if they exist
        if (result.r1b !== null) {
            this.setResistorValue('r1b', result.r1b);
        }
        if (result.r2b !== null) {
            this.setResistorValue('r2b', result.r2b);
        }
        
        // Update resistor configurations
        if (this.searchR1ConfigSelect) {
            this.searchR1ConfigSelect.value = result.r1Config;
        }
        if (this.searchR2ConfigSelect) {
            this.searchR2ConfigSelect.value = result.r2Config;
        }
        
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
        
        // Update resistor configurations and calculations
        this.updateResistorConfiguration('r1');
        this.updateResistorConfiguration('r2');
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
            r1b: this.r1bInput?.value || '',
            r2b: this.r2bInput?.value || '',
            r1Unit: this.r1UnitSelect?.value || 'kΩ',
            r2Unit: this.r2UnitSelect?.value || 'kΩ',
            r1bUnit: this.r1bUnitSelect?.value || 'kΩ',
            r2bUnit: this.r2bUnitSelect?.value || 'kΩ',
            searchR1Config: this.searchR1ConfigSelect?.value || 'single',
            searchR2Config: this.searchR2ConfigSelect?.value || 'single',
            calcMode: this.calcMode,
            
            // Fine-tuning slider values
            vinFineTune: this.vinFineTuneSlider?.value || '0',
            voutFineTune: this.voutFineTuneSlider?.value || '0',
            r1FineTune: this.r1FineTuneSlider?.value || '0',
            r2FineTune: this.r2FineTuneSlider?.value || '0',
            r1bFineTune: this.r1bFineTuneSlider?.value || '0',
            r2bFineTune: this.r2bFineTuneSlider?.value || '0',
            
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
            if (data.r1b && this.r1bInput) {
                this.r1bInput.value = data.r1b;
                if (data.r1bUnit && this.r1bUnitSelect) {
                    this.r1bUnitSelect.value = data.r1bUnit;
                }
                const r1bInOhms = this.convertToBaseUnits(parseFloat(data.r1b), data.r1bUnit || 'kΩ');
                this.r1bSlider.value = r1bInOhms;
            }
            if (data.r2b && this.r2bInput) {
                this.r2bInput.value = data.r2b;
                if (data.r2bUnit && this.r2bUnitSelect) {
                    this.r2bUnitSelect.value = data.r2bUnit;
                }
                const r2bInOhms = this.convertToBaseUnits(parseFloat(data.r2b), data.r2bUnit || 'kΩ');
                this.r2bSlider.value = r2bInOhms;
            }
            if (data.searchR1Config && this.searchR1ConfigSelect) {
                this.searchR1ConfigSelect.value = data.searchR1Config;
            }
            if (data.searchR2Config && this.searchR2ConfigSelect) {
                this.searchR2ConfigSelect.value = data.searchR2Config;
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
            if (data.r1bFineTune && this.r1bFineTuneSlider) {
                this.r1bFineTuneSlider.value = data.r1bFineTune;
            }
            if (data.r2bFineTune && this.r2bFineTuneSlider) {
                this.r2bFineTuneSlider.value = data.r2bFineTune;
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
            
            // Update resistor configurations after loading
            this.updateResistorConfiguration('r1');
            this.updateResistorConfiguration('r2');
            
            // Sync configurations between tabs
            this.syncConfigurations();
            
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
