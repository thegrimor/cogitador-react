export interface GearDefinition {
  name: string
  category: string
  notes: string
}

export const GEAR: GearDefinition[] = [
  { name: 'Comunicador personal', category: 'Comunicación', notes: 'Rango 1km campo abierto, cifrado básico · Precio: 50 (Común)' },
  { name: 'Micro-bead', category: 'Comunicación', notes: 'Auricular discreto, rango 1km · Precio: 75 (Normal)' },
  { name: 'Comunicador largo alcance', category: 'Comunicación', notes: 'Rango planetario, requiere fuente de energía · Precio: 500 (Escasa)' },
  { name: 'Auspex/Escáner', category: 'Detección', notes: 'Detecta calor, metales y vida 50m. +20 Percepción búsquedas · Precio: 500 (Rara)' },
  { name: 'Detector de vida', category: 'Detección', notes: 'Detecta biomasa a 30m · Precio: 200 (Rara)' },
  { name: 'Escáner de movimiento', category: 'Detección', notes: 'Detecta movimiento a 50m · Precio: 150 (Normal)' },
  { name: 'Binoculares', category: 'Detección', notes: 'Zoom ×10, +20 Per a distancia · Precio: 75 (Común)' },
  { name: 'Visión nocturna', category: 'Detección', notes: 'Ve en oscuridad durante 4h · Precio: 150 (Normal)' },
  { name: 'Medikit', category: 'Médico', notes: '+20 Medicae, 3 usos · Precio: 150 (Normal)' },
  { name: 'Estimulantes', category: 'Médico', notes: 'Elimina 1 nivel de fatiga. Dosis · Precio: 25 (Normal)' },
  { name: 'Antídoto', category: 'Médico', notes: 'Neutraliza un veneno. Dosis · Precio: 50 (Escasa)' },
  { name: 'Campo quirúrgico', category: 'Médico', notes: '+20 Medicae en cirugía · Precio: 500 (Rara)' },
  { name: 'Ganzúas', category: 'Infiltración', notes: '+10 Seguridad · Precio: 25 (Normal)' },
  { name: 'Equipo de disfraz', category: 'Infiltración', notes: '+20 Disfraz · Precio: 200 (Normal)' },
  { name: 'Inhibidor psi', category: 'Infiltración', notes: 'Bloquea poderes psíquicos en 5m · Precio: 1500 (Muy rara)' },
  { name: 'Respirador', category: 'Supervivencia', notes: 'Filtra gases y toxinas, 6h · Precio: 25 (Común)' },
  { name: 'Traje ambiental', category: 'Supervivencia', notes: 'Protege vacío y ambientes hostiles 4h · Precio: 2000 (Escasa)' },
  { name: 'Cuerda (10m)', category: 'Supervivencia', notes: 'Resistencia 200kg · Precio: 10 (Abundante)' },
  { name: 'Arnés de escalada', category: 'Supervivencia', notes: '+20 Trepar · Precio: 25 (Común)' },
  { name: 'Cogitador personal', category: 'Tecnología', notes: '+10 Int cálculo/memoria · Precio: 500 (Escasa)' },
  { name: 'Interfaz de datos', category: 'Tecnología', notes: 'Conexión directa terminales mecánicos · Precio: 750 (Rara)' },
  { name: 'Herramientas mecánicas', category: 'Tecnología', notes: '+10 Comp. Tecnológica reparaciones · Precio: 100 (Normal)' },
  { name: 'Kit de demolición', category: 'Tecnología', notes: 'Explosivos controlados, 3 cargas · Precio: 300 (Rara)' },
  { name: 'Linterna', category: 'Iluminación', notes: 'Cono 30m, 6h batería · Precio: 10 (Abundante)' },
  { name: 'Luz de bengala', category: 'Iluminación', notes: 'Ilumina 20m radio, 10 minutos · Precio: 5 (Abundante)' },
  { name: 'Granada de fragmentación', category: 'Explosivos', notes: '2d10 X radio 4m · Precio: 30 (Normal)' },
  { name: 'Granada de humo', category: 'Explosivos', notes: 'Nube 6m radio, 3 asaltos · Precio: 15 (Común)' },
  { name: 'Granada Krak', category: 'Explosivos', notes: '2d10+4 E, sin explosión de área · Precio: 50 (Escasa)' },
  { name: 'Explosivo de demolición', category: 'Explosivos', notes: '1d10+4 X radio 3m por carga · Precio: 50 (Rara)' },
]
