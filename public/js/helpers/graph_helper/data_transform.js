const candleStick = (dta) => {
	return	[new Date(dta.timestamp).getTime(), dta.open, dta.high, dta.low, dta.close];
}
const spline = (dta) => {
	return	[new Date(dta.timestamp).getTime(), dta.close];
}
const column = (dta) => {
	return	[new Date(dta.timestamp).getTime(), dta.volume];
}
const columnrange = (dta) => {
	return	[new Date(dta.timestamp).getTime(), dta.low, dta.hight];
}
module.exports = {
	candlestick: () => {
		return (dta) => {
			return	[new Date(dta.timestamp).getTime(),  dta.open, dta.high, dta.low, dta.close];
		}
	},
	ohlc: () => {
		return (dta) => {
			return	[new Date(dta.timestamp).getTime(),  dta.open, dta.high, dta.low, dta.close];
		}
	},
	spline: () => {
		return (dta) => {
			return	[new Date(dta.timestamp).getTime(), dta.close];
		}
	},
	line: () => {
		return (dta) => {
			return	[new Date(dta.timestamp).getTime(), dta.close];
		}
	},
	area: () => {
		return (dta) => {
			return	[new Date(dta.timestamp).getTime(), dta.close];
		}
	},
	step: () => {
		return (dta) => {
			return	[new Date(dta.timestamp).getTime(), dta.close];
		}
	},
	column:  () => {
		return (dta) => {
			return	[new Date(dta.timestamp).getTime(), dta.volume];
		}
	},
	columnrange: () => {
		return (dta) => {
			return	[new Date(dta.timestamp).getTime(), dta.low, dta.high];
		}
	}
}

