export interface Token {
    name: string;
    address: string;
}

export interface Tranche {
    expiration: number,
    address: string,
    ptPool: {
        address: string,
        poolId: string,
        fee: string,
        timeStretch: number
    },
    ytPool: {
        address: string,
        poolId: string,
        fee: string,
    },
    trancheFactory: string,
    weightedPoolFactory: string,
    convergentCurvePoolFactory: string,
}

export interface ConstantsObject {
	tokens: {[name: string]: string};
	wrappedPositions: {[name: string]: {[name: string]: string}};
	vaults: {[name: string]: {[name: string]: string}};
	trancheFactory: string;
	userProxy: string;
	balancerVault: string;
	weightedPoolFactory: string;
	convergentCurvePoolFactory: string;
	yieldTokenCompoundingAddress?: string;
	yieldTokenCompoundingPTAddress?: string;
	tranches: {[tokenName: string]: Tranche[]}
}

