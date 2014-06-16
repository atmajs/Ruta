
var mask = global.mask || Mask;

// settings

/** define if routes like '/path' are strict by default,
 * or set explicit '!/path' - strict, '^/path' - not strict
 *
 * Strict means - like in regex start-end /^$/
 * */
var	_cfg_isStrict = true,
	_Array_slice = Array.prototype.slice;