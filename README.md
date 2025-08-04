# Pasos para usar libreria de plotly.js

1. Instalacion de libreria:
    ```npm install plotly.js-dist-min```

# Configuraciones adicionales

1. Cambiar *ockl* a *HEX* para que las graficas puedan mapear los colores.
1. Las variables char-1, char-2, char-3 se ajustaron, se usa la chart-5 para la grafica de lineas de tendencia.
1. Agregar estilos para *modebar* para darle ubicacion correcta.
    ```css
        .modebar-container .modebar {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            border : 0px !important;
            border : none !important;
            padding: 6px !important;
        }
        .modebar-container .modebar-group {
            display: flex !important;
            flex-wrap: nowrap !important;
            border: none !important;
        }
    ```

# Promps
1. Para preguntar por las ventanas de el dashboard

```csv
    estaba analizando las pantallas de control antiguas en un sistema motor generador de mi empresa y encontre las siguientes variables (Ayudame a identificar si son de motor o generador y generar las ventanas de mi dashboard): -> Voltaje(V), frecuencia (hz), factor de potencia(fp), potencia(kw) -> velocidad (rpm), presion aceite(psi), temperatura refrigerante(°C), voltaje(V), potencia(kW), temperatura de cilindros(°C), temperatura devanados U,V,W(°C), temperatura rodamientos acople,libre(°C), Presion de aceite PRE,POS y del TURBO (psi), presion gas de entrada(psi) ->(AVR) -> P,Q,S (kw,kvar,kva), potencia available (kW, %), potencia consumed (kW, %), U-L1L2,UL2L3,UL3L1, U-MAX, U-MIN, angulo L1L2, L2L3,L3L1 (°), Energia total (kwh), Energia total (kvarh) -> Ayudame a organizar ventanas para mis dashboard.
```

