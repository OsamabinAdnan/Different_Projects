// declare module 'vanta/src/vanta.net' {
//     const VANTA: any
//     export default VANTA
// }

// declare module 'vanta/src/vanta.waves' {
//     const VANTA: any
//     export default VANTA
// }

declare module 'vanta/dist/vanta.fog.min' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const VANTA: any
    export default VANTA
}
  
// declare module 'vanta/src/vanta.birds' {
//     const VANTA: any
//     export default VANTA
// }
  
// declare module 'vanta/src/vanta.clouds' {
//     const VANTA: any
//     export default VANTA
// }
  
// declare module 'vanta/src/vanta.halo' {
//     const VANTA: any
//     export default VANTA
// }

// declare module 'vanta/dist/vanta.dots.min' {
//     const VANTA: any
//     export default VANTA
// }

// Declare a custom module for Vanta.js's 'globe' effect.
// This is necessary because Vanta.js does not ship with TypeScript type definitions by default,
// and importing from a subpath like 'vanta/src/vanta.globe' would otherwise raise a type error.

// declare module 'vanta/src/vanta.globe' {
//     const VANTA: any
//     export default VANTA
// }