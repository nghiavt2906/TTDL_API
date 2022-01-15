import * as indicator from './environment_indicator'
export const BOD5 = [
  { qi: 100, BPi: 4 },
  { qi: 75, BPi: 6 },
  { qi: 50, BPi: 15 },
  { qi: 25, BPi: 25 },
  { qi: 10, BPi: 50 }
]

export const COD = [
  { qi: 100, BPi: 10 },
  { qi: 75, BPi: 15 },
  { qi: 50, BPi: 30 },
  { qi: 25, BPi: 50 },
  { qi: 10, BPi: 150 }
]

export const TOC = [
  { qi: 100, BPi: 4 },
  { qi: 75, BPi: 6 },
  { qi: 50, BPi: 15 },
  { qi: 25, BPi: 25 },
  { qi: 10, BPi: 50 }
]

export const NH4 = [
  { qi: 100, BPi: 0.3 },
  { qi: 75, BPi: 0.3 },
  { qi: 50, BPi: 0.6 },
  { qi: 25, BPi: 0.9 },
  { qi: 10, BPi: 5 }
]

export const NO3 = [
  { qi: 100, BPi: 2 },
  { qi: 75, BPi: 5 },
  { qi: 50, BPi: 10 },
  { qi: 25, BPi: 15 },
  { qi: 10, BPi: 15 }
]

export const NO2 = [
  { qi: 100, BPi: 0.05 },
  { qi: 75, BPi: 0.05 },
  { qi: 50, BPi: 0.05 },
  { qi: 25, BPi: 0.05 },
  { qi: 10, BPi: 0.05 }
]

export const PO4 = [
  { qi: 100, BPi: 0.1 },
  { qi: 75, BPi: 0.2 },
  { qi: 50, BPi: 0.3 },
  { qi: 25, BPi: 0.5 },
  { qi: 10, BPi: 4 }
]

export const Coliform = [
  { qi: 100, BPi: 2500 },
  { qi: 75, BPi: 5000 },
  { qi: 50, BPi: 7500 },
  { qi: 25, BPi: 10000 },
  { qi: 10, BPi: 10000 }
]

export const ECOLI = [
  { qi: 100, BPi: 20 },
  { qi: 75, BPi: 50 },
  { qi: 50, BPi: 100 },
  { qi: 25, BPi: 200 },
  { qi: 10, BPi: 200 }
]

export const As = [
  { qi: 100, BPi: 0.01 },
  { qi: 75, BPi: 0.02 },
  { qi: 50, BPi: 0.05 },
  { qi: 25, BPi: 0.1 },
  { qi: 10, BPi: 0.1 }
]

export const Cd = [
  { qi: 100, BPi: 0.005 },
  { qi: 75, BPi: 0.005 },
  { qi: 50, BPi: 0.008 },
  { qi: 25, BPi: 0.01 },
  { qi: 10, BPi: 0.1 }
]

export const Pb = [
  { qi: 100, BPi: 0.02 },
  { qi: 75, BPi: 0.02 },
  { qi: 50, BPi: 0.04 },
  { qi: 25, BPi: 0.05 },
  { qi: 10, BPi: 0.5 }
]

export const Cr = [
  { qi: 100, BPi: 0.01 },
  { qi: 75, BPi: 0.02 },
  { qi: 50, BPi: 0.04 },
  { qi: 25, BPi: 0.05 },
  { qi: 10, BPi: 0.1 }
]

export const Cu = [
  { qi: 100, BPi: 0.1 },
  { qi: 75, BPi: 0.2 },
  { qi: 50, BPi: 0.5 },
  { qi: 25, BPi: 1 },
  { qi: 10, BPi: 2 }
]

export const Zn = [
  { qi: 100, BPi: 0.5 },
  { qi: 75, BPi: 1 },
  { qi: 50, BPi: 1.5 },
  { qi: 25, BPi: 2 },
  { qi: 10, BPi: 3 }
]

export const Hg = [
  { qi: 100, BPi: 0.001 },
  { qi: 75, BPi: 0.001 },
  { qi: 50, BPi: 0.0015 },
  { qi: 25, BPi: 0.002 },
  { qi: 10, BPi: 0.01 }
]

export const DO = [
  { qi: 10, BPi: 20 },
  { qi: 25, BPi: 20 },
  { qi: 50, BPi: 50 },
  { qi: 75, BPi: 75 },
  { qi: 100, BPi: 88 },
  { qi: 100, BPi: 112 },
  { qi: 75, BPi: 125 },
  { qi: 50, BPi: 150 },
  { qi: 25, BPi: 200 },
  { qi: 10, BPi: 200 }
]

export const pH = [
  { qi: 10, BPi: 5.5 },
  { qi: 50, BPi: 5.5 },
  { qi: 100, BPi: 6 },
  { qi: 100, BPi: 8.5 },
  { qi: 50, BPi: 9 },
  { qi: 10, BPi: 9 }
]

export const Aldrin = 0.1
export const BHC = 0.02
export const Dieldrin = 0.1
export const DDTs = 1
export const Heptachlor = 0.2

// export const wqiIndicators = [
//   { id: As, name: indicator.As},
//   { id: Aldrin, name: indicator.Aldrin},
//   { id: BCH, name: indicator.BCH},
//   { id: BOD5, name: indicator.BOD5},
//   { id: Cd, name: indicator.Cd},
//   { id: COD, name: indicator.COD},
//   { id: Coliform, name: indicator.Coliform},
//   { id: Cu, name: indicator.Cu},
//   { id: Cr, name: indicator.Cr},
//   { id: DO, name: indicator.DO},
//   { id: Dieldrin, name: indicator.Dieldrin},
//   { id: DDTs, name: indicator.DDTs},
//   { id: ECOLI, name: indicator.ECOLI},
//   { id: Hg, name: indicator.Hg},
//   { id: Heptachlor, name: indicator.Heptachlor},
//   { id: NH4, name: indicator.NH4},
//   { id: NO2, name: indicator.NO2},
//   { id: NO3, name: indicator.NO3},
//   { id: Pb, name: indicator.Pb},
//   { id: pH, name: indicator.pH},
//   { id: PO4, name: indicator.PO4},
//   { id: TOC, name: indicator.TOC},
//   { id: Zn, name: indicator.Zn}
// ]