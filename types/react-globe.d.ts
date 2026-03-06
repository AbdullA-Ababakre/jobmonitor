declare module 'react-globe.gl' {
  import { Component, Ref } from 'react'

  export interface GlobeInstance {
    controls(): {
      autoRotate: boolean
      autoRotateSpeed: number
      enableDamping: boolean
      dampingFactor: number
    }
    pointOfView(pov: { lat?: number; lng?: number; altitude?: number }, durationMs?: number): void
    scene(): any
    camera(): any
    renderer(): any
    toGlobeCoords(x: number, y: number): { lat: number; lng: number } | null
  }

  export interface GlobeProps {
    ref?: Ref<GlobeInstance>
    width?: number
    height?: number
    globeImageUrl?: string
    bumpImageUrl?: string
    backgroundColor?: string
    atmosphereColor?: string
    atmosphereAltitude?: number
    showGraticules?: boolean
    showAtmosphere?: boolean

    // Points layer
    pointsData?: object[]
    pointLat?: string | ((d: object) => number)
    pointLng?: string | ((d: object) => number)
    pointColor?: string | ((d: object) => string)
    pointAltitude?: string | number | ((d: object) => number)
    pointRadius?: string | number | ((d: object) => number)
    pointResolution?: number
    pointsMerge?: boolean
    pointLabel?: string | ((d: object) => string)
    onPointClick?: (d: object, event: MouseEvent) => void
    onPointHover?: (d: object | null) => void

    // HTML layer
    htmlElementsData?: object[]
    htmlLat?: string | ((d: object) => number)
    htmlLng?: string | ((d: object) => number)
    htmlAltitude?: string | number | ((d: object) => number)
    htmlElement?: string | ((d: object) => HTMLElement)
    onHtmlElementClick?: (d: object, event: MouseEvent) => void

    // Arcs layer
    arcsData?: object[]
    arcStartLat?: string | ((d: object) => number)
    arcStartLng?: string | ((d: object) => number)
    arcEndLat?: string | ((d: object) => number)
    arcEndLng?: string | ((d: object) => number)
    arcColor?: string | ((d: object) => string | string[])
    arcAltitude?: number | string | ((d: object) => number) | null
    arcAltitudeAutoScale?: number | string | ((d: object) => number)
    arcStroke?: number | null | string | ((d: object) => number | null)
    arcCurveResolution?: number
    arcDashLength?: number | string | ((d: object) => number)
    arcDashGap?: number | string | ((d: object) => number)
    arcDashInitialGap?: number | string | ((d: object) => number)
    arcDashAnimateTime?: number | string | ((d: object) => number)
    arcLabel?: string | ((d: object) => string)
    onArcClick?: (d: object, event: MouseEvent) => void

    // Labels layer
    labelsData?: object[]
    labelLat?: string | ((d: object) => number)
    labelLng?: string | ((d: object) => number)
    labelText?: string | ((d: object) => string)
    labelColor?: string | ((d: object) => string)
    labelAltitude?: number | string | ((d: object) => number)
    labelSize?: number | string | ((d: object) => number)
    labelDotRadius?: number | string | ((d: object) => number)
    labelDotOrientation?: string | ((d: object) => string)
    labelResolution?: number

    // Custom layer
    customLayerData?: object[]
    customThreeObject?: string | object | ((d: object) => object)
    customThreeObjectUpdate?: string | ((obj: object, d: object) => void)
    onCustomLayerClick?: (d: object, event: MouseEvent) => void

    // Animation
    animateIn?: boolean
    onGlobeReady?: () => void
    onZoom?: (pov: { lat: number; lng: number; altitude: number }) => void
  }

  export default class Globe extends Component<GlobeProps> {
    controls(): GlobeInstance['controls']
    pointOfView: GlobeInstance['pointOfView']
    scene: GlobeInstance['scene']
    camera: GlobeInstance['camera']
    toGlobeCoords: GlobeInstance['toGlobeCoords']
  }
}
