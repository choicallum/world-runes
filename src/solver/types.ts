export interface Champion {
    name: string
    cost: number
    traits: string[]
}

export interface Trait {
    name: string
    thresholds: number[]
    isRegion: boolean
    hasEmblem: boolean
}

export interface Region {
    regions: string[]
    champions: string[]
    costs?: number[]
    thresholds?: number[]
}

export interface Result {
    regions: string[];
    champions: Champion[];
}

export type MultiRegionUnit = {
    name: string;
    key: string;      
    regions: string[]; 
    cost: number;
}
