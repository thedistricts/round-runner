import { writable } from 'svelte/store'
import { ORIENTATION } from '$lib/enum'

const { subscribe, update  } = writable ({
    innerWidth: 1600, 
    innerHeight: 1200,
    ratio: 16/12, 
    orientation: ORIENTATION.LANDSCAPE,   
    wide: false,
    isMobile: false,
    isTablet: false,
    isDesktop: true
})

interface ViewportProps {
    innerWidth: number;
    innerHeight: number;
}

function register({ innerWidth, innerHeight }: ViewportProps) {
    const ratio = innerWidth / innerHeight
    const orientation = ratio >= 1 ? ORIENTATION.LANDSCAPE : ORIENTATION.PORTRAIT
    const wide = (ratio > 2) || (ratio < 0.5)
    const isMobile = innerWidth <= 640
    const isTablet = innerWidth > 640 && innerWidth <= 1366
    const isDesktop = innerWidth > 1366

    update (() => {
        return {
            innerWidth, 
            innerHeight,
            orientation,
            ratio,
            wide,
            isMobile,
            isTablet,
            isDesktop
        }
    })
}

export const viewport = {
    subscribe, register 
}