const candleStick = (dta) => [new Date(dta.timestamp).getTime(), dta.open, dta.high, dta.low, dta.close];
const spline = (dta) => [new Date(dta.timestamp).getTime(), dta.close];
const column = (dta) => [new Date(dta.timestamp).getTime(), dta.volume];
const columnrange = (dta) => [new Date(dta.timestamp).getTime(), dta.low, dta.hight];

const dataTransform = {
	candlestick: () => (dta) => [new Date(dta.timestamp).getTime(),  dta.open, dta.high, dta.low, dta.close],
	ohlc: () => (dta) => [new Date(dta.timestamp).getTime(),  dta.open, dta.high, dta.low, dta.close],
	spline: () => (dta) => [new Date(dta.timestamp).getTime(), dta.close],
	line: () => (dta) => [new Date(dta.timestamp).getTime(), dta.close],
	area: () => (dta) => [new Date(dta.timestamp).getTime(), dta.close],
	step: () => (dta) => [new Date(dta.timestamp).getTime(), dta.close],
	column:  () => (dta) => [new Date(dta.timestamp).getTime(), dta.volume],
	columnrange: () => (dta) => [new Date(dta.timestamp).getTime(), dta.low, dta.high]
}

export default dataTransform;
