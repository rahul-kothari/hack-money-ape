
export const shortenNumber = (number: number): string => {
    const absoluteNumber = Math.abs(number);
    if (absoluteNumber >= 1000){
        if (absoluteNumber >= 1_000_000){
            if (absoluteNumber >+ 1_000_000_000){
                return  `${(number/1_000_000_000).toFixed(2)}B`;
            }
            return `${(number/1_000_000).toFixed(2)}M`;
        }
        return `${(number/1000).toFixed(2)}K`;
    }
    if (absoluteNumber < 1){
        if (absoluteNumber < 0.001) {
            if (absoluteNumber < 0.00_0001){
                if (absoluteNumber < 0.00_000_001){
                    return `${(number*1_000_000_000_000).toFixed(2)}E-12`;
                }
                return `${(number*1_000_000_000).toFixed(2)}E-9`;
            }
            return `${(number*1000_000).toFixed(2)}E-6`;
        }
        return `${number.toFixed(5)}`
    }
    return `${number.toFixed(2)}`
}