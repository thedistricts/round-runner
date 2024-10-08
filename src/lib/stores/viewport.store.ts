import { writable } from 'svelte/store'
enum Orientation {
    LANDSCAPE = 'landscape',
    PORTRAIT = 'portrait'
}
const { subscribe, update  } = writable ({
    innerWidth: 1600, 
    innerHeight: 1200,
    ratio: 16/12, 
    orientation: Orientation.LANDSCAPE,   
    wide: false,
    isMobile: false
})

interface ViewportProps {
    innerWidth: number;
    innerHeight: number;
}

function register({ innerWidth, innerHeight }: ViewportProps) {
    const ratio = innerWidth / innerHeight
    const orientation = ratio >= 1 ? Orientation.LANDSCAPE : Orientation.PORTRAIT
    const wide = (ratio > 2) || (ratio < 0.5)
    const isMobile = innerWidth <= 640

    update (() => {
        return {
            innerWidth, 
            innerHeight,
            orientation,
            ratio,
            wide,
            isMobile
        }
    })
}

export const viewport = {
    subscribe, register 
}