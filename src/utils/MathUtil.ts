export const MathUtil = {
	floorTo(value: number, precision: number): number {
		const factor = Math.pow(10, precision);
		return Math.floor(value * factor) / factor;
	},
};
