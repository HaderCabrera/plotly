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

const FrecuencyCilindersData = {
    minPF: 30,
    maxPF: 65,
    traces : data,
    tittle: 'Grafica de frecuencias',
    yAxisTitle: 'Frecuencia [Hz]',
}




//OUTPUTS
export {
    FrecuencyCilindersData,

}