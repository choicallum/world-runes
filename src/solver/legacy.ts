export {}
// function countTraits(team: Champion[], emblems: Record<string, number>) {
//     const counts: Record<string, number> = {}

//     for (const champ of team) {
//         for (const trait of champ.traits) {
//             counts[trait] = (counts[trait] ?? 0) + 1
//         }
//     }

//     for (const [traitName, emblemCount] of Object.entries(emblems)) {
//         if (emblemCount > 0) {
//             counts[traitName] = (counts[traitName] ?? 0) + emblemCount;
//         }
//     }
//     return counts
// }

// function countRegions(traitCount: Record<string, number>): number {
//     let activeRegions = 0;

//     for (const [traitName, count] of Object.entries(traitCount)) {
//         const trait = traitByName[traitName];
//         if (!trait) console.error("Unknown trait: ", trait)
//         if (!trait.isRegion) continue;

//         const minThreshold = Math.min(...trait.thresholds);
//         if (count >= minThreshold) {
//             activeRegions++;
//         }
//     }
//     return activeRegions;
// }

// function canSatisfyRegions(
//     required: Record<string, number>,
//     slotsLeft: number
// ): boolean {
//     // success
//     if (Object.values(required).every(v => v <= 0)) return true;

//     if (slotsLeft === 0) return false;

//     // hard upper bound
//     const totalRequired = Object.values(required).reduce((a, b) => a + b, 0);
//     if (totalRequired > slotsLeft * 2) return false;

//     for (const entry of regionEntries) {
//         // must help at least one region
//         if (!entry.regions.some(r => required[r] > 0)) continue;

//         const nextRequired: Record<string, number> = { ...required };
//         for (const r of entry.regions) {
//             if (nextRequired[r] !== undefined) {
//                 nextRequired[r]--;
//             }
//         }

//         if (canSatisfyRegions(nextRequired, slotsLeft - 1)) {
//             return true;
//         }
//     }

//     return false;
// }

// function regionSubsets(regions: string[], targetSize: number): string[][] {
//     const result: string[][] = [];

//     function dfs(index: number, current: string[]) {
//         if (current.length === targetSize) {
//             result.push([...current]);
//             return;
//         }

//         if (index === regions.length) return;

//         // if remaining elements + current length < targetSize, stop
//         if (current.length + (regions.length - index) < targetSize) return;

//         // include current region
//         current.push(regions[index]);
//         dfs(index + 1, current);
//         current.pop();

//         // skip current region
//         dfs(index + 1, current);
//     }

//     dfs(0, []);
//     return result;
// }
