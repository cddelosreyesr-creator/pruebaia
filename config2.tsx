import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Thermometer, ArrowDown, Info, Zap, RotateCcw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickExample {
  celsius: number;
  label: string;
}

const quickExamples: QuickExample[] = [
  { celsius: 0, label: "Congelación" },
  { celsius: 25, label: "Ambiente" },
  { celsius: 37, label: "Corporal" },
  { celsius: 100, label: "Ebullición" },
];

export default function Home() {
  const [celsiusValue, setCelsiusValue] = useState<string>("");
  const [fahrenheitValue, setFahrenheitValue] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  const convertCelsiusToFahrenheit = (celsius: number): number => {
    return (celsius * 9) / 5 + 32;
  };

  const formatDecimal = (value: number): string => {
    return Number(value.toFixed(1)).toString();
  };

  const validateAndConvert = (value: string) => {
    // Reset error state
    setHasError(false);
    setErrorMessage("");

    if (value === "") {
      setFahrenheitValue(null);
      return;
    }

    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) {
      setHasError(true);
      setErrorMessage("Por favor, ingresa un número válido");
      setFahrenheitValue(null);
      return;
    }

    // Valid number, convert it
    const result = convertCelsiusToFahrenheit(numericValue);
    setFahrenheitValue(result);

    // Trigger animation
    setShowAnimation(false);
    setTimeout(() => setShowAnimation(true), 10);
  };

  const handleCelsiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCelsiusValue(value);
    validateAndConvert(value);
  };

  const handleClear = () => {
    setCelsiusValue("");
    setFahrenheitValue(null);
    setHasError(false);
    setErrorMessage("");
    setShowAnimation(false);
  };

  const setTemperature = (celsius: number) => {
    const value = celsius.toString();
    setCelsiusValue(value);
    validateAndConvert(value);
  };

  const getConversionFormula = () => {
    if (celsiusValue && !hasError) {
      const celsius = parseFloat(celsiusValue);
      if (!isNaN(celsius)) {
        const fahrenheit = convertCelsiusToFahrenheit(celsius);
        return `(${formatDecimal(celsius)} × 9/5) + 32 = ${formatDecimal(fahrenheit)}`;
      }
    }
    return "(°C × 9/5) + 32 = °F";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Thermometer className="text-white text-2xl w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Convertidor de Temperatura
          </h1>
          <p className="text-gray-600 text-sm">
            Convierte grados Celsius a Fahrenheit al instante
          </p>
        </div>

        {/* Main Converter Card */}
        <Card className="bg-card rounded-2xl shadow-lg p-6 mb-6">
          {/* Temperature Input */}
          <div className="mb-6">
            <Label htmlFor="celsius-input" className="block text-sm font-medium text-secondary mb-2">
              Temperatura en Celsius (°C)
            </Label>
            <div className="relative">
              <Input
                type="number"
                id="celsius-input"
                value={celsiusValue}
                onChange={handleCelsiusChange}
                placeholder="Ingresa la temperatura en °C"
                step="0.1"
                className={cn(
                  "temperature-input w-full px-4 py-3 border-2 rounded-xl focus:border-primary focus:outline-none transition-colors text-lg text-center pr-12",
                  hasError && "border-destructive error-shake"
                )}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-gray-400 font-medium">°C</span>
              </div>
            </div>

            {/* Error Message */}
            {hasError && (
              <div className="mt-2 text-destructive text-sm flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Conversion Arrow */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-full p-3">
              <ArrowDown className="text-primary text-xl w-6 h-6" />
            </div>
          </div>

          {/* Temperature Result */}
          <div className={cn(
            "result-card rounded-xl p-6 text-center text-white",
            showAnimation && "conversion-animation"
          )}>
            <div className="mb-2">
              <span className="text-white/80 text-sm font-medium">Resultado en Fahrenheit</span>
            </div>
            <div className="text-4xl font-bold mb-2">
              {fahrenheitValue !== null ? `${formatDecimal(fahrenheitValue)}°F` : "---°F"}
            </div>
            <div className="text-white/70 text-sm">
              {getConversionFormula()}
            </div>
          </div>

          {/* Clear Button */}
          <div className="mt-6 text-center">
            <Button
              onClick={handleClear}
              variant="outline"
              className="px-6 py-2 text-primary border-primary hover:bg-primary hover:text-white transition-colors duration-200 font-medium"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </Card>

        {/* Information Card */}
        <Card className="bg-card rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-secondary mb-3 flex items-center">
            <Info className="text-primary mr-2 w-5 h-5" />
            Información sobre la conversión
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span><strong>Fórmula:</strong> °F = (°C × 9/5) + 32</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span><strong>Punto de congelación del agua:</strong> 0°C = 32°F</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span><strong>Punto de ebullición del agua:</strong> 100°C = 212°F</span>
            </div>
          </div>
        </Card>

        {/* Quick Examples */}
        <Card className="bg-card rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-secondary mb-3 flex items-center">
            <Zap className="text-accent mr-2 w-5 h-5" />
            Ejemplos rápidos
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickExamples.map((example, index) => (
              <Button
                key={index}
                onClick={() => setTemperature(example.celsius)}
                variant="ghost"
                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 h-auto flex flex-col items-center transition-colors"
              >
                <div className="text-lg font-semibold text-secondary">{example.celsius}°C</div>
                <div className="text-xs text-gray-500">{example.label}</div>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
