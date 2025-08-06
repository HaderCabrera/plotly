import { Variable } from "lucide-react";


// TENDENCIES
interface TraceData {
  x: Date[];
  y: number[];
  name: string;
  lineColor?: string;
  mode?: 'lines' | 'markers' | 'lines+markers';
}

const generateData = (
  points: number,
  timeRange: number // en milisegundos
) => {
  const baseValue = 40 + Math.random() * 20; // 40–60

  const x = Array.from({ length: points }, (_, i) => {
    const step = timeRange / points;
    return new Date(Date.now() - timeRange + step * i);
  });

  const y = Array.from({ length: points }, () => 
    baseValue + (Math.random() * 2 - 1) * 0.5 // variación de ±0.5Hz
  );

  return { x, y};
};

const FrecuencyCilinder1:TraceData = {
    x: generateData(1000, 3600000).x,
    y: generateData(1000, 3600000).y,
    mode: 'lines',
    name: 'Cyl 1',
};

const FrecuencyCilinder2:TraceData = {
    x: generateData(1000, 3600000).x,
    y: generateData(1000, 3600000).y,
    mode: 'lines',
    name: 'Cyl 2',
};

const FrecuencyCilinder3:TraceData = {
    x: generateData(1000, 3600000).x,
    y: generateData(1000, 3600000).y,
    mode: 'lines',
    name: 'Cyl 3',
}

const FrecuencyCilinder4:TraceData = {
    x: generateData(1000, 3600000).x,
    y: generateData(1000, 3600000).y,
    mode: 'lines',
    name: 'Cyl 4',
}

const FrecuencyCilinder5:TraceData = {
    x: generateData(1000, 3600000).x,
    y: generateData(1000, 3600000).y,
    mode: 'lines',
    name: 'Cyl 5',
}

const FrecuencyCilinder6:TraceData = {
    x: generateData(1000, 3600000).x,
    y: generateData(1000, 3600000).y,
    mode: 'lines',
    name: 'Cyl 6',
}

const FrecuencyCilinder7:TraceData = {
    x: generateData(1000, 3600000).x,
    y: generateData(1000, 3600000).y,
    mode: 'lines',
    name: 'Cyl 7',
}

const FrecuencyCilinder8:TraceData = {
    x: generateData(1000, 3600000).x,
    y: generateData(1000, 3600000).y,
    mode: 'lines',
    name: 'Cyl 8',
}

const FrecuencyCilinder9:TraceData = {
    x: generateData(1000, 3600000).x,
    y: generateData(1000, 3600000).y,
    mode: 'lines',
    name: 'Cyl 9',
}

const FrecuencyCilinder10:TraceData = {
    x: generateData(1000, 3600000).x,
    y: generateData(1000, 3600000).y,
    mode: 'lines',
    name: 'Cyl 10',
}

const data = [
    FrecuencyCilinder1, 
    FrecuencyCilinder2, 
    FrecuencyCilinder3,
    FrecuencyCilinder4,
    FrecuencyCilinder5,
    FrecuencyCilinder6,
    FrecuencyCilinder7,
    FrecuencyCilinder8,
    FrecuencyCilinder9,
    FrecuencyCilinder10,
];


//power

// Función generadora de datos para energía (ahora con soporte mensual)
const generateEnergyData = (
  days: number, // número de días a mostrar (1-30)
  baseValue: number,
  variation: number,
  dailyPeakHour: number = 14 // hora pico diaria (0-23)
): { x: Date[], y: number[] } => {
  // Calculamos puntos como 24 horas * número de días
  const points = 24 * days;
  // Usamos timestamp de inicio (ahora) y fin (hace 'days' días)
  const now = Date.now();
  const timeRange = days * 24 * 60 * 60 * 1000; // milisegundos en 'days' días

  const x = Array.from({ length: points }, (_, i) => {
    const date = new Date(now - timeRange + (i * (timeRange / points)));
    // Aseguramos que las horas estén alineadas correctamente
    date.setMinutes(0, 0, 0);
    return date;
  });

  const y = Array.from({ length: points }, (_, i) => {
    const hourOfDay = new Date(x[i]).getHours();
    // Patrón diario: máximo en la hora pico
    const dailyPattern = 0.7 + 0.3 * Math.cos((hourOfDay - dailyPeakHour) * Math.PI / 12);
    // Variación aleatoria + patrón diario
    return (baseValue * dailyPattern) + (Math.random() * 2 - 1) * variation;
  });

  return { x, y };
};

// Datos para energía consumida (kWh) - 30 días, pico a las 14:00
const EnergyConsumed: TraceData = {
  ...generateEnergyData(30, 150, 20, 14),
  name: 'Energía Consumida (kWh)',
  lineColor: '#3b82f6',
  mode: 'lines'
};

// Datos para energía generada (kWh) - 30 días, pico al mediodía (solar)
const EnergyGenerated: TraceData = {
  ...generateEnergyData(30, 80, 15, 12),
  name: 'Energía Generada (kWh)',
  lineColor: '#10b981',
  mode: 'lines'
};

// Datos para energía reactiva generada (kVARh) - 30 días, pico mañana
const ReactiveEnergyGenerated: TraceData = {
  ...generateEnergyData(30, 60, 10, 10),
  name: 'Energía Reactiva Generada (kVARh)',
  lineColor: '#f59e0b',
  mode: 'lines'
};

// Array con las tres trazas requeridas (mismos timestamps)
const energyTraces = [
  EnergyConsumed,
  EnergyGenerated,
  ReactiveEnergyGenerated
];

// Datos para potencia activa (kW) - 30 días, pico a las 14:00
const ActivePower: TraceData = {
  ...generateEnergyData(30, 1250, 100, 14), // Base de 1250 kW con variación de 100
  name: 'Potencia Activa (kW)',
  lineColor: '#3b82f6',
  mode: 'lines'
};

// Datos para potencia reactiva (kVAR) - 30 días, pico a las 10:00
// Asumimos un factor de potencia típico de 0.8-0.9, por lo que la reactiva será menor
const ReactivePower: TraceData = {
  ...generateEnergyData(30, 600, 50, 10), // Base de 600 kVAR con variación de 50
  name: 'Potencia Reactiva (kVAR)',
  lineColor: '#f59e0b',
  mode: 'lines'
};

// Datos para potencia aparente (kVA) - 30 días, pico a las 14:00
// La aparente es la combinación de activa y reactiva, será mayor que la activa
const ApparentPower: TraceData = {
  ...generateEnergyData(30, 1400, 120, 14), // Base de 1400 kVA con variación de 120
  name: 'Potencia Aparente (kVA)',
  lineColor: '#10b981',
  mode: 'lines'
};

// Array con las tres trazas de potencia (mismos timestamps)
const powerTraces = [
  ActivePower,
  ReactivePower,
  ApparentPower
];


//SALIDAS

const PowerData = {
  minPF: 1000,
  maxPF: 1480,
  traces: powerTraces,
  tittle: 'Potencias del generador',
  yAxisTitle:'Potencia',
}

const FrecuencyCilindersData = {
    minPF: 30,
    maxPF: 65,
    traces : data,
    tittle: 'Grafica de frecuencias',
    yAxisTitle: 'Frecuencia [Hz]',
}

const EnergyPowerData = {
  minPF: 0,
  maxPF: 200,
  traces: energyTraces,
  tittle: 'Consumo y Generación de Energía',
  yAxisTitle: 'Energía (kWh/kVARh)',
};


//OUTPUTS
export {
    FrecuencyCilindersData,
    EnergyPowerData,
    PowerData,

}