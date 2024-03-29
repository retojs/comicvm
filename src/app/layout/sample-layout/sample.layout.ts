export const SAMPLE_LAYOUT = `

pages:
  - # page 1 
    stripHeights: [ 0.4, 0.6 ]
    strips:
      - # strip 1
        panelWidths: [ 0.3, 0.4, 0.3 ]
        panels: 
          - [ 2, bgr-1, { Mariel: surprised, Dad: smiling }]
          - [ 1, { all: happy, Mariel: {x: 1.4, size: 1.5 }}]
          - [ 0, bgr-2, { zoom: 1.9, pan: {x: 1.3, y: 1 }}]
          
      - # strip 2
        panels:
          - [ 3, bgr-2, { Silas: { pos: { y: 1.7, size: 1.5 }, how: wet }}]
          
  - # page 2
    strips:
      - # strip 1
        panels:
          - [ 1, { animate: { zoom: 1, pan: { x: -1, y: 0.5 }}}]
          - [ 2, sunset-beach ]
          
backgrounds:
  scene-background: 
    zoom: 1 
    pan: { x: 0.5, y: 1.5 }
    all: { y: 1.5 }
    Mariel: 
      how: sad happy
      pos: { x: 2.3, y: 1.5, size: 1.5 }

  sunset-beach:
    zoom: 1
    pan: { x: 1, y: 1 }
    Basil:
      how: screaming
      pos: { x: 1.5, y: -0.5, size: 2 }

backgroundId: scene-background
zoom: 1
pan: { x: 1, y: 1 }
Mariel:
  how: fluffy
  pos: { x: -1.2, size: 0.75 }
`;