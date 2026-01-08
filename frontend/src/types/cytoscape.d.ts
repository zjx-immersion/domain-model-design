/**
 * Cytoscape.js类型定义补充
 * 为项目中使用的Cytoscape功能提供类型支持
 */

declare module 'cytoscape' {
  interface Core {
    png(options?: { full?: boolean; scale?: number }): string
    zoom(): number
    zoom(level: number): Core
    fit(padding?: number): Core
    animate(options: {
      center?: { eles: any }
      zoom?: number
    }, config?: {
      duration?: number
    }): void
  }

  interface ElementDefinition {
    data: {
      id: string
      label?: string
      type?: string
      color?: string
      status?: string
      source?: string
      target?: string
    }
  }

  interface LayoutOptions {
    name: string
    rankDir?: string
    nodeSep?: number
    rankSep?: number
    idealEdgeLength?: number
    nodeOverlap?: number
    refresh?: number
    randomize?: boolean
    radius?: number
    rows?: number
    cols?: number
  }
}

declare module 'cytoscape-dagre' {
  import cytoscape from 'cytoscape'
  const cytoscapeDagre: (cy: typeof cytoscape) => void
  export = cytoscapeDagre
}

