export interface WeaponDefinition {
  name: string
  group: string
  cls: string
  dmgType: string
  range: string
  rof: string
  dmg: string
  pen: number
  clip: string
  notes: string
}

export const WEAPONS: WeaponDefinition[] = [
  { name: 'Pistola láser', group: 'Láser', cls: 'Pistola', dmgType: 'E', range: '30m', rof: 'T/-/-', dmg: '1d10+2', pen: 0, clip: '30', notes: 'Fiable · Recarga: Completa · Precio: 50 (Común)' },
  { name: 'Carabina láser', group: 'Láser', cls: 'Básica', dmgType: 'E', range: '60m', rof: 'T/-/-', dmg: '1d10+2', pen: 0, clip: '40', notes: 'Fiable · Recarga: Completa · Precio: 75 (Común)' },
  { name: 'Rifle láser', group: 'Láser', cls: 'Básica', dmgType: 'E', range: '100m', rof: 'T/3/-', dmg: '1d10+3', pen: 0, clip: '60', notes: 'Fiable · Recarga: Completa · Precio: 75 (Común)' },
  { name: 'Rifle láser largo alcance', group: 'Láser', cls: 'Básica', dmgType: 'E', range: '150m', rof: 'T/-/-', dmg: '1d10+3', pen: 1, clip: '40', notes: 'Fiable, Preciso · Recarga: Completa · Precio: 100 (Escasa)' },
  { name: 'Cañón láser portátil', group: 'Láser', cls: 'Pesada', dmgType: 'E', range: '300m', rof: 'T/-/-', dmg: '5d10+10', pen: 10, clip: '5', notes: 'Recarga: 2 completos · Precio: 5000 (Muy rara)' },
  { name: 'Pistola automática', group: 'Proyectiles sólidos', cls: 'Pistola', dmgType: 'I', range: '30m', rof: 'T/-/6', dmg: '1d10+2', pen: 0, clip: '18', notes: 'Recarga: Completa · Precio: 75 (Común)' },
  { name: 'Revólver de bajo calibre', group: 'Proyectiles sólidos', cls: 'Pistola', dmgType: 'I', range: '30m', rof: 'T/-/-', dmg: '1d10+3', pen: 0, clip: '6', notes: 'Fiable · Recarga: 2 completos · Precio: 40 (Frecuente)' },
  { name: 'Pistola de bajo calibre', group: 'Proyectiles sólidos', cls: 'Pistola', dmgType: 'I', range: '30m', rof: 'T/3/-', dmg: '1d10+3', pen: 0, clip: '9', notes: 'Recarga: Completa · Precio: 50 (Frecuente)' },
  { name: 'Pistola pesada', group: 'Proyectiles sólidos', cls: 'Pistola', dmgType: 'I', range: '35m', rof: 'T/-/-', dmg: '1d10+4', pen: 2, clip: '5', notes: 'Recarga: 2 completos · Precio: 65 (Normal)' },
  { name: 'Rifle automático', group: 'Proyectiles sólidos', cls: 'Básica', dmgType: 'I', range: '90m', rof: 'T/3/10', dmg: '1d10+3', pen: 0, clip: '30', notes: 'Recarga: Completa · Precio: 100 (Común)' },
  { name: 'Fusil de caza', group: 'Proyectiles sólidos', cls: 'Básica', dmgType: 'I', range: '150m', rof: 'T/-/-', dmg: '1d10+3', pen: 0, clip: '5', notes: 'Preciso · Recarga: Completa · Precio: 100 (Escasa)' },
  { name: 'Escopeta', group: 'Proyectiles sólidos', cls: 'Básica', dmgType: 'I', range: '30m', rof: 'T/-/-', dmg: '1d10+4', pen: 0, clip: '2', notes: 'Dispersión, Fiable · Recarga: 2 completos · Precio: 60 (Común)' },
  { name: 'Escopeta de corredera', group: 'Proyectiles sólidos', cls: 'Básica', dmgType: 'I', range: '30m', rof: 'T/-/-', dmg: '1d10+4', pen: 0, clip: '8', notes: 'Dispersión · Recarga: 2 completos · Precio: 75 (Normal)' },
  { name: 'Escopeta de combate', group: 'Proyectiles sólidos', cls: 'Básica', dmgType: 'I', range: '30m', rof: 'T/3/-', dmg: '1d10+4', pen: 0, clip: '18', notes: 'Dispersión · Recarga: Completa · Precio: 150 (Escasa)' },
  { name: 'Ametralladora pesada', group: 'Proyectiles sólidos', cls: 'Pesada', dmgType: 'I', range: '120m', rof: '-/-/10', dmg: '1d10+4', pen: 3, clip: '200', notes: 'Recarga: 2 completos · Precio: 750 (Escasa)' },
  { name: 'Pistola bólter', group: 'Bólter', cls: 'Pistola', dmgType: 'X', range: '30m', rof: 'T/2/-', dmg: '1d10+5', pen: 4, clip: '8', notes: 'Desgarradora · Recarga: Completa · Precio: 250 (Rara)' },
  { name: 'Bólter', group: 'Bólter', cls: 'Básica', dmgType: 'X', range: '90m', rof: 'T/2/4', dmg: '1d10+5', pen: 4, clip: '24', notes: 'Desgarrador · Recarga: Completa · Precio: 500 (Muy rara)' },
  { name: 'Bólter pesado', group: 'Bólter', cls: 'Pesada', dmgType: 'X', range: '120m', rof: '-/-/10', dmg: '2d10', pen: 5, clip: '60', notes: 'Desgarrador · Recarga: 2 completos · Precio: 2000 (Muy rara)' },
  { name: 'Pistola infierno', group: 'Fusión', cls: 'Pistola', dmgType: 'E', range: '10m', rof: 'T/-/-', dmg: '2d10+4', pen: 12, clip: '3', notes: 'Recarga: Completa · Precio: 7500 (Muy rara)' },
  { name: 'Rifle de fusión', group: 'Fusión', cls: 'Básica', dmgType: 'E', range: '20m', rof: 'T/-/-', dmg: '2d10+4', pen: 12, clip: '5', notes: 'Recarga: 2 completos · Precio: 4000 (Rara)' },
  { name: 'Pistola de plasma', group: 'Plasma', cls: 'Pistola', dmgType: 'E', range: '30m', rof: 'T/-/-', dmg: '1d10+6', pen: 6, clip: '10', notes: 'Recarga, Sobrecalentamiento · Recarga: 4 completos · Precio: 4000 (Muy rara)' },
  { name: 'Rifle de plasma', group: 'Plasma', cls: 'Básica', dmgType: 'E', range: '90m', rof: 'T/2/-', dmg: '1d10+6', pen: 6, clip: '20', notes: 'Recarga, Sobrecalentamiento · Recarga: 8 completos · Precio: 3000 (Muy rara)' },
  { name: 'Pistola lanzallamas', group: 'Lanzallamas', cls: 'Pistola', dmgType: 'E', range: '10m', rof: 'T/-/-', dmg: '1d10+4', pen: 2, clip: '3', notes: 'Lanzallamas · Recarga: 2 completos · Precio: 200 (Rara)' },
  { name: 'Lanzallamas', group: 'Lanzallamas', cls: 'Básica', dmgType: 'E', range: '20m', rof: 'T/-/-', dmg: '1d10+4', pen: 3, clip: '3', notes: 'Lanzallamas · Recarga: 2 completos · Precio: 300 (Escasa)' },
  { name: 'Boleadoras', group: 'Primitivas', cls: 'Lanzadora', dmgType: 'I', range: '10m', rof: 'T/-/-', dmg: '—', pen: 0, clip: '1', notes: 'Apresadora, Imprecisa, Primitiva · Recarga: — · Precio: 10 (Normal)' },
  { name: 'Pistola ballesta', group: 'Primitivas', cls: 'Pistola', dmgType: 'A', range: '15m', rof: 'T/-/-', dmg: '1d10', pen: 0, clip: '1', notes: 'Primitiva · Recarga: Completa · Precio: 200 (Rara)' },
  { name: 'Pistola de chispa', group: 'Primitivas', cls: 'Pistola', dmgType: 'I', range: '15m', rof: 'T/-/-', dmg: '1d10+2', pen: 0, clip: '1', notes: 'Imprecisa, Poco fiable, Primitiva · Recarga: 3 completos · Precio: 10 (Común)' },
  { name: 'Mosquete', group: 'Primitivas', cls: 'Básica', dmgType: 'I', range: '30m', rof: 'T/-/-', dmg: '1d10+2', pen: 0, clip: '1', notes: 'Impreciso, Poco fiable, Primitiva · Recarga: 5 completos · Precio: 30 (Común)' },
  { name: 'Arco', group: 'Primitivas', cls: 'Básica', dmgType: 'A', range: '30m', rof: 'T/-/-', dmg: '1d10', pen: 0, clip: '1', notes: 'Fiable, Primitivo · Recarga: Media · Precio: 10 (Común)' },
  { name: 'Honda', group: 'Primitivas', cls: 'Básica', dmgType: 'I', range: '15m', rof: 'T/-/-', dmg: '1d10-2', pen: 0, clip: '1', notes: 'Primitiva · Recarga: Completa · Precio: 10 (Frecuente)' },
  { name: 'Ballesta', group: 'Primitivas', cls: 'Básica', dmgType: 'A', range: '30m', rof: 'T/-/-', dmg: '1d10', pen: 0, clip: '1', notes: 'Primitiva · Recarga: 2 completos · Precio: 10 (Común)' },
  { name: 'Lanzagranadas', group: 'Lanzadores', cls: 'Básica', dmgType: 'X', range: '60m', rof: 'T/-/-', dmg: '*', pen: 0, clip: '6', notes: '* Depende de la munición · Recarga: Completa · Precio: 500 (Escasa)' },
  { name: 'Lanzacohetes', group: 'Lanzadores', cls: 'Pesada', dmgType: 'X', range: '120m', rof: 'T/-/-', dmg: '*', pen: 0, clip: '1', notes: '* Depende de la munición · Recarga: Completa · Precio: 1200 (Rara)' },
  { name: 'Pistola de agujas', group: 'Exóticas', cls: 'Pistola', dmgType: 'A', range: '30m', rof: 'T/-/-', dmg: '1d10', pen: 0, clip: '6', notes: 'Precisa, Tóxica · Recarga: Completa · Precio: 1250 (Muy rara)' },
  { name: 'Pistola lanzarredes', group: 'Exóticas', cls: 'Pistola', dmgType: 'I', range: '30m', rof: 'T/-/-', dmg: '—', pen: 0, clip: '1', notes: 'Apresadora · Recarga: Completa · Precio: 1200 (Rara)' },
  { name: 'Rifle de agujas', group: 'Exóticas', cls: 'Básica', dmgType: 'A', range: '180m', rof: 'T/-/-', dmg: '1d10', pen: 0, clip: '6', notes: 'Preciso, Tóxico · Recarga: 2 completos · Precio: 1000 (Muy rara)' },
  { name: 'Rifle lanzarredes', group: 'Exóticas', cls: 'Básica', dmgType: 'I', range: '50m', rof: 'T/-/-', dmg: '—', pen: 0, clip: '1', notes: 'Apresador, Explosión (5) · Recarga: Completa · Precio: 1800 (Rara)' },
  { name: 'Hacha', group: 'CaC Primitivas', cls: 'CaC', dmgType: 'A', range: '—', rof: '—', dmg: '1d10+1', pen: 0, clip: '0', notes: 'Desequilibrada, Primitiva · Recarga: — · Precio: 20 (Normal)' },
  { name: 'Nudilleras', group: 'CaC Primitivas', cls: 'CaC', dmgType: 'I', range: '—', rof: '—', dmg: '1d5-1', pen: 0, clip: '0', notes: 'Primitiva · Recarga: — · Precio: 5 (Abundante)' },
  { name: 'Garrote', group: 'CaC Primitivas', cls: 'CaC', dmgType: 'I', range: '—', rof: '—', dmg: '1d10', pen: 0, clip: '0', notes: 'Primitiva · Recarga: — · Precio: 5 (Abundante)' },
  { name: 'Mangual', group: 'CaC Primitivas', cls: 'CaC', dmgType: 'I', range: '—', rof: '—', dmg: '1d10+2', pen: 0, clip: '0', notes: 'Flexible, Primitiva · Recarga: — · Precio: 20 (Escasa)' },
  { name: 'Arma a dos manos', group: 'CaC Primitivas', cls: 'CaC', dmgType: 'A', range: '—', rof: '—', dmg: '2d10', pen: 2, clip: '0', notes: 'Aparatosa, Primitiva · Recarga: — · Precio: 70 (Escasa)' },
  { name: 'Martillo', group: 'CaC Primitivas', cls: 'CaC', dmgType: 'I', range: '—', rof: '—', dmg: '1d10+1', pen: 0, clip: '0', notes: 'Desequilibrada, Primitiva · Recarga: — · Precio: 10 (Común)' },
  { name: 'Cuchillo', group: 'CaC Primitivas', cls: 'CaC', dmgType: 'I', range: '3m', rof: '—', dmg: '1d5', pen: 0, clip: '0', notes: 'Primitiva · Recarga: — · Precio: 5 (Abundante)' },
  { name: 'Cuchillo/estrella arrojadiza', group: 'CaC Primitivas', cls: 'Lanzadora', dmgType: 'A', range: '5m', rof: '—', dmg: '1d5', pen: 0, clip: '0', notes: 'Primitiva · Recarga: — · Precio: 5 (Frecuente)' },
  { name: 'Escudo', group: 'CaC Primitivas', cls: 'CaC', dmgType: 'I', range: '—', rof: '—', dmg: '1d5', pen: 0, clip: '0', notes: 'Defensiva, Primitiva · Recarga: — · Precio: 25 (Normal)' },
  { name: 'Lanza', group: 'CaC Primitivas', cls: 'CaC', dmgType: 'A', range: '10m', rof: '—', dmg: '1d10', pen: 0, clip: '0', notes: 'Primitiva · Recarga: — · Precio: 15 (Común)' },
  { name: 'Espada', group: 'CaC Primitivas', cls: 'CaC', dmgType: 'A', range: '—', rof: '—', dmg: '1d10', pen: 0, clip: '0', notes: 'Equilibrada, Primitiva · Recarga: — · Precio: 15 (Común)' },
  { name: 'Bastón', group: 'CaC Primitivas', cls: 'CaC', dmgType: 'I', range: '—', rof: '—', dmg: '1d10', pen: 0, clip: '0', notes: 'Equilibrada, Primitiva · Recarga: — · Precio: 10 (Frecuente)' },
  { name: 'Espada sierra', group: 'Sierra', cls: 'CaC', dmgType: 'A', range: '—', rof: '—', dmg: '1d10+2', pen: 2, clip: '0', notes: 'Desgarradora, Equilibrada · Recarga: — · Precio: 275 (Rara)' },
  { name: 'Hacha sierra', group: 'Sierra', cls: 'CaC', dmgType: 'A', range: '—', rof: '—', dmg: '1d10+4', pen: 2, clip: '0', notes: 'Desgarradora · Recarga: — · Precio: 450 (Muy rara)' },
  { name: 'Cuchillo de energía', group: 'Energía', cls: 'CaC', dmgType: 'E', range: '—', rof: '—', dmg: '1d10+3', pen: 6, clip: '0', notes: 'Campo de energía · Recarga: — · Precio: 1750 (Muy rara)' },
  { name: 'Espada de energía', group: 'Energía', cls: 'CaC', dmgType: 'E', range: '—', rof: '—', dmg: '1d10+5', pen: 6, clip: '0', notes: 'Campo de energía, Equilibrada · Recarga: — · Precio: 2500 (Muy rara)' },
  { name: 'Maza eléctrica', group: 'Conmoción', cls: 'CaC', dmgType: 'I', range: '—', rof: '—', dmg: '1d10', pen: 0, clip: '0', notes: 'Conmocionadora · Recarga: — · Precio: 150 (Escasa)' },
  { name: 'Electroflagelo', group: 'Conmoción', cls: 'CaC', dmgType: 'I', range: '—', rof: '—', dmg: '1d10', pen: 0, clip: '0', notes: 'Conmocionadora, Flexible · Recarga: — · Precio: 375 (Rara)' },
]
