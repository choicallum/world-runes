import { Trait, MultiRegionUnit } from "./types"
import traitJson from '../data/traits.json'
import regionJson from '../data/regions.json'
import regionSubsetsJson from '../data/regionSubsets.json'

/* =========================
   Constants
========================= */

const WORLD_RUNE_THRESHOLD = 4
const MULTI_REGION_UNITS: MultiRegionUnit[] = [
    {
        name: "Fizz",
        key: "Bilgewater,Yordle",
        regions: ["Bilgewater", "Yordle"],
        cost: 4
    },
    {
        name: "Xin Zhao",
        key: "Demacia,Ionia",
        regions: ["Demacia", "Ionia"],
        cost: 2
    },
    {
        name: "Poppy",
        key: "Demacia,Yordle",
        regions: ["Demacia", "Yordle"],
        cost: 2
    },
    {
        name: "Kennen",
        key: "Ionia,Yordle",
        regions: ["Ionia", "Yordle"],
        cost: 3
    },
    {
        name: "Vi",
        key: "Piltover,Zaun",
        regions: ["Piltover", "Zaun"],
        cost: 2
    },
    {
        name: "Ziggs",
        key: "Yordle,Zaun",
        regions: ["Yordle", "Zaun"],
        cost: 5
    }
];

/* =========================
    Data
========================= */
const emblemTraits: Trait[] = traitJson.filter(trait => trait.hasEmblem).sort((a, b) => a.name.localeCompare(b.name));
export const emblems: Record<string, number> = Object.fromEntries(
    emblemTraits.map(trait => [trait.name, 0])
);

const regions: Record<string, { champions: string[]; costs?: number[]; thresholds?: number[] }> = {};
for (const [key, value] of Object.entries(regionJson)) {
    const v = value as { champions: string[]; costs?: number[]; thresholds?: number[] };
    regions[key.trim()] = { champions: v.champions, costs: v.costs, thresholds: v.thresholds };
}

/* =========================
    Helpers
========================= */

function computeRequired(
    regionSet: string[],
    emblems: Record<string, number>
): Record<string, number> {
    const required: Record<string, number> = {};

    for (const r of regionSet) {
        // Prefer thresholds provided in the regions hash; fall back to traitJson if necessary
        const regionEntry = regions[r];
        const thresholds = regionEntry?.thresholds ?? traitJson.find(t => t.name === r)?.thresholds;
        if (!thresholds || thresholds.length === 0) continue;

        const minThreshold = Math.min(...thresholds);
        const emblemCount = emblems[r] ?? 0;
        const need = Math.max(0, minThreshold - emblemCount);
        if (need > 0) required[r] = need;
    }

    return required;
}

function canSatisfy(
    required: Record<string, number>,
    maxCost: number,
    addUnits: string[] = []
): string[] | null {
    const solution: string[] = [...addUnits];

    let satisfiedRegions = 0;

    for (const [region, req] of Object.entries(required) as [string, number][]) {
        let sum = 0;
        const regionData = regions[region];
        if (!regionData?.costs) return null;

        for (let cost = 0; cost < maxCost; cost++) {
            sum += regionData.costs[cost] ?? 0;
        }

        if (sum < req) return null;
        satisfiedRegions += 1;
    }

    if (satisfiedRegions === WORLD_RUNE_THRESHOLD) {
        // Fill in remaining single-trait requirements
        for (const [region, req] of Object.entries(required)) {
            for (let i = 0; i < req; i++) {
                solution.push(region);
            }
        }
        return solution;
    }

    return null;
}

/* =========================
    Solver
========================= */
export function solve(
    emblems: Record<string, number>, 
    maxCost: number,
    maxSize: number,
): { subset: string; solution: string[] }[]  {
    const resultsMap: Record<string, string[]> = {};
    const subsets = (regionSubsetsJson as unknown as string[][]);

    for (const subset of subsets) {
        const subsetKey = subset.join(", ");
        const required = computeRequired(subset, emblems);

        // go up in size until we meet a match
        // we prefer these heuristics:
        // size > less dual trait units
        // that is, a team of 6 > a team of 6 with no dual traits > a team of 6 with dual traits > a team of 7 ...
        for (let size = 1; size <= maxSize; size++) {
            // try monotrait units only
            let solution = canSatisfy(required, maxCost);
            if (solution && solution.length <= size) {
                resultsMap[subsetKey] = solution;
                break; // stop searching larger sizes once a valid solution is found
            }
            // if not possible, try multitrait units
            const required_copy = { ...required };
            const multiUnitKeys: string[] = [];

            for (const unit of MULTI_REGION_UNITS) {
                if (unit.cost > maxCost) continue;
                if (!unit.regions.every(r => subset.includes(r))) continue;

                for (const r of unit.regions) {
                    required_copy[r] = Math.max(0, required_copy[r] - 1);
                }
                multiUnitKeys.push(unit.name);
            }

            solution = canSatisfy(required_copy, maxCost, multiUnitKeys);
            if (solution && solution.length <= size) {
                resultsMap[subsetKey] = solution;
                break; // found a valid solution for this subset
            }
            // if not possible, up the team size
        }
    }
    const sorted = Object.entries(resultsMap)
        .map(([subset, solution]) => ({ subset, solution }))
        .sort((a, b) => {
            if (a.solution.length !== b.solution.length) return a.solution.length - b.solution.length;
            const multiA = a.solution.filter(u => MULTI_REGION_UNITS.some(m => m.key === u)).length;
            const multiB = b.solution.filter(u => MULTI_REGION_UNITS.some(m => m.key === u)).length;
            return multiA - multiB;
        });

    return sorted;
}

