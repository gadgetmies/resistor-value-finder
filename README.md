# Voltage Divider Calculator

A modern, interactive web application for calculating voltage divider circuit parameters.

## Features

- **Interactive Calculations**: Calculate any parameter (Vout, Vin, R1, or R2) based on the others
- **Real-time Sliders**: Adjust values using intuitive sliders alongside number inputs
- **Standard Resistor Search**: Find the best standard resistor combinations for your target voltages
- **Multiple Resistor Series**: Support for E12, E24, E48, and E96 standard resistor series
- **Accuracy Ratings**: Results ranked by accuracy (Excellent, Good, Fair, Poor)
- **Visual Circuit Diagram**: SVG representation of the voltage divider circuit
- **Additional Metrics**: Shows voltage division ratio, total resistance, and current
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Input Validation**: Prevents invalid calculations and shows helpful error messages

## How to Use

1. **Select Calculation Mode**: Choose what you want to calculate from the dropdown:
   - Output Voltage (Vout)
   - Input Voltage (Vin) 
   - Resistor R1
   - Resistor R2

2. **Enter Known Values**: Input the values you know using either:
   - Number inputs for precise values
   - Sliders for quick adjustments

3. **View Results**: The calculator automatically updates all values and shows additional metrics

4. **Find Standard Resistors**: Use the "Find Standard Resistor Values" section to:
   - Enter your target input and output voltages
   - Select a resistor series (E12, E24, E48, or E96)
   - Click "Find Best Resistors" to see ranked results
   - Click any result to apply those resistor values to the main calculator

## Voltage Divider Formula

```
Vout = Vin × (R2 / (R1 + R2))
```

## Keyboard Shortcuts

- `Ctrl/Cmd + 1`: Calculate Output Voltage
- `Ctrl/Cmd + 2`: Calculate Input Voltage  
- `Ctrl/Cmd + 3`: Calculate R1
- `Ctrl/Cmd + 4`: Calculate R2

## Getting Started

Simply open `index.html` in your web browser. No additional setup or dependencies required!

## Browser Compatibility

Works in all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
