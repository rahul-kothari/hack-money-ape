
export const shortenNumber = (number: number): string => {
    if (number >= 1000){
        if (number >= 1_000_000){
            if (number >+ 1_000_000_000){
                return  `${(number/1_000_000_000).toFixed(2)}B`;
            }
            return `${(number/1_000_000).toFixed(2)}M`;
        }
        return `${(number/1000).toFixed(2)}K`;
    }
    if (number < 1){
        if (number < 0.001) {
            if (number < 0.00_0001){
                if (number < 0.00_000_001){
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