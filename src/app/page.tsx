"use client"

import Gauge from '@/components/Gauge';
import FrequencyTrendChart from '@/components/Linea3Tendenci';
import PlotlyDirectChart from '@/components/PlotlyDirect'
import SimpleBar from '@/components/SimpleBar';

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-4 p-8">

      <div className='relative bg-white rounded-bl-[2.5rem] rounded-tr-[2.5rem] shadow-2xl'>
        <div className='flex justify-center items-center bg-neutral-900 w-[35%] h-[35px] pr-2 py-5 rounded-br-full text-background border-t border-6 border-l border-6'>
          <h1>FRECUENCIA</h1>
        </div>
        <div className='py-5'>
          <FrequencyTrendChart minPF={40.5} maxPF={60.5} />
        </div>
      </div>

      <div className='relative bg-white rounded-bl-[2.5rem] rounded-tr-[2.5rem] shadow-2xl'>
        <div className='flex justify-center items-center bg-neutral-900 w-[35%] h-[35px] pr-2 py-5 rounded-br-full text-background border-t border-6 border-l border-6'>
          <h1>VOLTAJE</h1>
        </div>
        <div className='py-5'>
          <Gauge />
        </div>
      </div>

      <div className='relative bg-white rounded-bl-[2.5rem] rounded-tr-[2.5rem] shadow-2xl'>
        <div className='flex justify-center items-center bg-neutral-900 w-[35%] h-[35px] pr-2 py-5 rounded-br-full text-background border-t border-6 border-l border-6'>
          <h1>FACTOR DE POTENCIA</h1>
        </div>
        <div className='py-5'>
          <SimpleBar />
        </div>
      </div>

      <div className='relative bg-white rounded-bl-[2.5rem] rounded-tr-[2.5rem] shadow-2xl'>
        <div className='flex justify-center items-center bg-neutral-900 w-[35%] h-[35px] pr-2 py-5 rounded-br-full text-background border-t border-6 border-l border-6'>
          <h1>POTENCIA Y CONTROL</h1>
        </div>
        <div className='py-5'>
          <PlotlyDirectChart />
        </div>
      </div>
    </div>
  );
}