declare module 'color-name-list' {
    interface ColorInfo {
        name: string;
        hex: string;
    }
    export const colorNameList: ColorInfo[];
}

declare module 'nearest-color' {
    interface ColorMap {
        [key: string]: string;
    }
    
    interface NearestColorFunction {
        (color: string): { name: string; value: string; };
        from: (colors: ColorMap) => NearestColorFunction;
    }
    
    const nearestColor: NearestColorFunction;
    export default nearestColor;
}