export const SAMPLE_LAYOUT = `
---
panelProperties:
  - plotItemCount
  - backgroundId
  - characterQualifier
  - characterPositions
  - zoom
  - pan
pages:
  # page 1
  - stripHeights: [0.4, 0.6]
    strips:
      # upper strip
      - panelWidths: [0.3, 0.4, 0.3]
        panels:
          - - 2
            - bgr-1
            - Mariel=surprised; Dad=smiling
          - - 1
            - bgr-2
            - all=happy
            - Mariel: {x: 1.4, size: 1.5}
          - - 0
            - bgr-3
            -
            -
            - 1.9
            - [1.3, 1]
      # lower strip
      - panels:
          - - 3
            - bgr-3
            -
            - Silas: {y: 1.7, size: 1.5}
  # page 2
  - strips:
      # upper strip
      - panels:
          - - 1
          - - 2
            - sunset-beach
backgrounds:
  default:
    zoom: 1
    pan: [0.5, 1.5]
    Mariel:
      how:
        - sad
        - happy
      pos: {x: 2.3, y: 1.5, size: 1.5}
    all:
      how:
        - fluffy
      pos: {x: 2.5}
  sunset-beach:
    zoom: 1
    pan: [1, 1]
    Basil:
      how:
        - screaming
      pos: {x: 1.5, y: -0.5, size: 2}
scene:
  zoom: 1
  pan: [1, 1]
  Mariel:
    how:
      - wet
    pos: {x: -1.2, size: 0.75}

`;