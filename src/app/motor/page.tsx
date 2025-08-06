'use client'

import { FrecuencyCilindersData } from '@/utils/generatedata/tendency'
import { PressionGasData, VelocidadData, PressionAceiteData, PressionTurboData } from '@/utils/generatedata/gauge'

import BarPlotly from "@/components/BarV1";
import Gauge from "@/components/Gauge";
import Tendency from "@/components/Tendency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { useState } from "react";
import CylinderTemperatureChart from '@/components/BarV1';

export default function MotorGrid() {
    const [selectTendency, setselectTendency] = useState('temperatura');
    return (
        // Grid principal: 4 columnas x 3 filas = 12 celdas de igual tamaño
        <div className="flex flex-col lg:grid lg:grid-cols-4 lg:grid-rows-3 gap-3 h-[100vh] p-3">

            {/* Velocidad */}
            <div className="col-span-3 row-span-1">
                <div className="flex flex-col lg:flex-row h-full gap-3">
                    {/* Gauge del motor - ocupa espacio proporcional */}
                    <div className='bg-background shadow-2xl flex-1 flex flex-col'>
                        <div className='flex justify-center items-center bg-accent dark:bg-input/30 w-[35%] h-[35px] pr-2 rounded-br-full text-primary border-b-6 border-r-6 border-boder'>
                            <h1 className="text-sm font-semibold leading-none tracking-tight text-muted-foreground uppercase">
                                VELOCIDAD</h1>
                        </div>
                        <div className="flex-1 min-h-0">
                            <Gauge {...VelocidadData} />
                        </div>
                    </div>

                    <div className="flex-1 bg-background shadow-2xl h-full flex flex-col">
                        {/* Grid: 2 columnas, 3 filas que ocupa toda la altura */}
                        <div className="flex-1 grid grid-cols-5 gap-4 px-6 py-3">
                            {/* Columna izquierda: 3 filas - Voltaje, Frecuencia, FP */}
                            <div className="col-span-2 grid grid-rows-3 gap-1">

                                {/* Voltaje */}
                                <div className="rounded-xl border-l-4 border-r-4 border-border flex items-center justify-between px-4">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Voltaje</p>
                                        <p className="text-xs text-muted-foreground">Trifásico</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-foreground">400</p>
                                        <p className="text-xs text-muted-foreground">V</p>
                                    </div>
                                </div>

                                {/* Frecuencia */}
                                <div className="rounded-xl border-l-4 border-r-4 border-border flex items-center justify-between px-4 my-auto">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Frecuencia</p>
                                        <p className="text-xs text-muted-foreground">Red</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-foreground">60.0</p>
                                        <p className="text-xs text-muted-foreground">Hz</p>
                                    </div>
                                </div>

                                {/* Factor de Potencia */}
                                <div className=" rounded-xl border-l-4 border-r-4 border-border flex items-center justify-between px-4 ">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Factor de Potencia</p>
                                        <p className="text-xs text-muted-foreground">Carga</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-foreground">0.87</p>
                                        <p className="text-xs text-muted-foreground">FP</p>
                                    </div>
                                </div>
                            </div>

                            {/* Columna derecha: Potencia Mecánica (ocupa 3 filas) */}
                            <div className="col-span-3  rounded-2xl flex flex-col items-center justify-center text-center  px-6 py-8">
                                <h3 className="text-lg font-medium text-foreground mb-4">Potencia Mecánica</h3>
                                <p className="text-5xl font-bold text-foreground mb-2">840</p>
                                <p className="text-base text-muted-foreground">kW</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gauges */}
            <div className="col-span-1 row-span-3 flex flex-col gap-3">

                {/* Gauge 1: Ocupa 1/3 del espacio vertical disponible */}
                <div className='bg-background rounded-tr-[2.5rem] shadow-2xl flex-1 flex flex-col'>
                    <div className='flex justify-center items-center bg-accent dark:bg-input/30 w-[45%] h-[35px] pr-2  rounded-br-full text-primary border-b-6 border-r-6 border-boder'>
                        <h1 className="text-sm font-semibold leading-none tracking-tight text-muted-foreground uppercase">
                            PRESION GAS
                        </h1>
                    </div>
                    <div className="flex-1 min-h-0">
                        <Gauge {...PressionGasData} />
                    </div>
                </div>

                {/* Gauge 2: Ocupa 1/3 del espacio vertical disponible */}
                <div className='bg-background shadow-2xl flex-1 flex flex-col'>
                    <div className='flex justify-center items-center bg-accent dark:bg-input/30 w-[45%] h-[35px] pr-2 rounded-br-full text-primary border-b-6 border-r-6 border-boder'>
                        <h1 className="text-sm font-semibold leading-none tracking-tight text-muted-foreground uppercase">
                            PRESION TURBO
                        </h1>
                    </div>
                    <div className="flex-1 min-h-0">
                        <Gauge {...PressionTurboData} />
                    </div>
                </div>

                {/* Gauge 3: Ocupa 1/3 del espacio vertical disponible */}
                <div className='bg-background rounded-br-[2.5rem] shadow-2xl flex-1 flex flex-col'>
                    <div className='flex justify-center items-center bg-accent dark:bg-input/30 w-[45%] h-[35px] pr-2 rounded-br-full text-primary border-b-6 border-r-6 border-boder'>
                        <h1 className="text-sm font-semibold leading-none tracking-tight text-muted-foreground uppercase">
                            PRESION ACEITE
                        </h1>
                    </div>
                    <div className="flex-1 min-h-0">
                        <Gauge {...PressionAceiteData} />
                    </div>
                </div>
            </div>

            {/*grefico de temperaturas*/}
            <div className="col-span-1 row-span-2">
                <div className="bg-background rounded-bl-[2.5rem] shadow-2xl h-full flex flex-col">
                    {/* Header - Igual que el resto del grid */}
                    <div className="flex justify-center items-center bg-accent dark:bg-input/30 w-[40%] h-[35px] pr-2  rounded-br-full text-primary border-b-6 border-r-6 border-border">
                        <h1 className="text-sm font-semibold leading-none tracking-tight text-muted-foreground uppercase">
                            TEMPERATURAS
                        </h1>
                    </div>

                    {/* Content - Ocupa todo el espacio restante sin sobrar */}
                    <div className="flex-1 flex flex-col p-5 pt-4 gap-8 justify-between">
                        {/* Temperatura de Refrigerante */}
                        <div className=" rounded-xl px-6 py-5 flex items-center justify-between border-border flex-1">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h3 className="text-lg md:text-xl font-medium text-foreground">Refrigerante</h3>
                                    <p className="text-sm md:text-base text-muted-foreground">Principal</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl md:text-5xl font-bold text-foreground">30.3</p>
                                <p className="text-sm md:text-base text-muted-foreground">°C</p>
                            </div>
                        </div>

                        {/* Devanados U, V, W - 3 columnas, altura fija relativa */}
                        <div className="grid grid-cols-3 gap-3 h-32"> {/* altura fija proporcional */}
                            {[
                                { name: "U", temp: "85.2" },
                                { name: "V", temp: "87.1" },
                                { name: "W", temp: "84.8" },
                            ].map((dev) => (
                                <div
                                    key={dev.name}
                                    className="rounded-lg p-3 border-l-4 border-r-4 border-border flex flex-col items-center text-center"
                                >
                                    <div className="bg-accent rounded-full p-2 mb-2 -mt-6">
                                        <Settings className="w-5 h-5 text-primary" />
                                    </div>
                                    <h4 className="text-sm md:text-base font-medium text-foreground mb-1">Devanado {dev.name}</h4>
                                    <p className="text-xl md:text-2xl font-bold text-foreground">{dev.temp}</p>
                                    <p className="text-xs md:text-sm text-muted-foreground">°C</p>
                                </div>
                            ))}
                        </div>

                        {/* Temperatura de Rodamientos */}
                        <div className=" rounded-xl px-6 py-5 flex items-center justify-between  border-border flex-1">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h3 className="text-lg md:text-xl font-medium text-foreground">Rodamientos</h3>
                                    <p className="text-sm md:text-base text-muted-foreground">Mecánica</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl md:text-5xl font-bold text-foreground">45.7</p>
                                <p className="text-sm md:text-base text-muted-foreground">°C</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* grafico de cilindros */}
            <div className="col-span-2 row-span-2">
                <div className='bg-background shadow-2xl h-full flex flex-col'>
                    <Select
                        defaultValue="temperatura"
                        onValueChange={(value) => setselectTendency(value)}
                    >
                        <SelectTrigger
                            className="bg-accent text-primary border-b-6 border-r-6 border-border rounded-br-full pr-2 w-[35%] flex items-center justify-center focus:ring-0 focus:ring-offset-0"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="w-auto">
                            <SelectItem value="temperatura">CILINDROS TEMPERATURA</SelectItem>
                            <SelectItem value="frecuencia">CLINDROS FRECUENCIA</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className=' flex-1 min-h-0'>
                        {selectTendency === 'temperatura' ? (
                            // <BarPlotly /> // Componente para
                            <CylinderTemperatureChart
                                minTemp={80}
                                maxTemp={120}
                                title="Temperaturas - Motor Principal"
                                warningThreshold={0.85} // 85% del máximo
                            />
                        ) : selectTendency === 'frecuencia' ? (
                            <Tendency {...FrecuencyCilindersData} /> // Componente para frecuencia (o el que necesites)
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}