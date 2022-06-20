/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/animejs/lib/anime.es.js":
/*!**********************************************!*\
  !*** ./node_modules/animejs/lib/anime.es.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/*\n * anime.js v3.2.1\n * (c) 2020 Julian Garnier\n * Released under the MIT license\n * animejs.com\n */\n\n// Defaults\n\nvar defaultInstanceSettings = {\n  update: null,\n  begin: null,\n  loopBegin: null,\n  changeBegin: null,\n  change: null,\n  changeComplete: null,\n  loopComplete: null,\n  complete: null,\n  loop: 1,\n  direction: 'normal',\n  autoplay: true,\n  timelineOffset: 0\n};\n\nvar defaultTweenSettings = {\n  duration: 1000,\n  delay: 0,\n  endDelay: 0,\n  easing: 'easeOutElastic(1, .5)',\n  round: 0\n};\n\nvar validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d'];\n\n// Caching\n\nvar cache = {\n  CSS: {},\n  springs: {}\n};\n\n// Utils\n\nfunction minMax(val, min, max) {\n  return Math.min(Math.max(val, min), max);\n}\n\nfunction stringContains(str, text) {\n  return str.indexOf(text) > -1;\n}\n\nfunction applyArguments(func, args) {\n  return func.apply(null, args);\n}\n\nvar is = {\n  arr: function (a) { return Array.isArray(a); },\n  obj: function (a) { return stringContains(Object.prototype.toString.call(a), 'Object'); },\n  pth: function (a) { return is.obj(a) && a.hasOwnProperty('totalLength'); },\n  svg: function (a) { return a instanceof SVGElement; },\n  inp: function (a) { return a instanceof HTMLInputElement; },\n  dom: function (a) { return a.nodeType || is.svg(a); },\n  str: function (a) { return typeof a === 'string'; },\n  fnc: function (a) { return typeof a === 'function'; },\n  und: function (a) { return typeof a === 'undefined'; },\n  nil: function (a) { return is.und(a) || a === null; },\n  hex: function (a) { return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a); },\n  rgb: function (a) { return /^rgb/.test(a); },\n  hsl: function (a) { return /^hsl/.test(a); },\n  col: function (a) { return (is.hex(a) || is.rgb(a) || is.hsl(a)); },\n  key: function (a) { return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes'; },\n};\n\n// Easings\n\nfunction parseEasingParameters(string) {\n  var match = /\\(([^)]+)\\)/.exec(string);\n  return match ? match[1].split(',').map(function (p) { return parseFloat(p); }) : [];\n}\n\n// Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js\n\nfunction spring(string, duration) {\n\n  var params = parseEasingParameters(string);\n  var mass = minMax(is.und(params[0]) ? 1 : params[0], .1, 100);\n  var stiffness = minMax(is.und(params[1]) ? 100 : params[1], .1, 100);\n  var damping = minMax(is.und(params[2]) ? 10 : params[2], .1, 100);\n  var velocity =  minMax(is.und(params[3]) ? 0 : params[3], .1, 100);\n  var w0 = Math.sqrt(stiffness / mass);\n  var zeta = damping / (2 * Math.sqrt(stiffness * mass));\n  var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;\n  var a = 1;\n  var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;\n\n  function solver(t) {\n    var progress = duration ? (duration * t) / 1000 : t;\n    if (zeta < 1) {\n      progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));\n    } else {\n      progress = (a + b * progress) * Math.exp(-progress * w0);\n    }\n    if (t === 0 || t === 1) { return t; }\n    return 1 - progress;\n  }\n\n  function getDuration() {\n    var cached = cache.springs[string];\n    if (cached) { return cached; }\n    var frame = 1/6;\n    var elapsed = 0;\n    var rest = 0;\n    while(true) {\n      elapsed += frame;\n      if (solver(elapsed) === 1) {\n        rest++;\n        if (rest >= 16) { break; }\n      } else {\n        rest = 0;\n      }\n    }\n    var duration = elapsed * frame * 1000;\n    cache.springs[string] = duration;\n    return duration;\n  }\n\n  return duration ? solver : getDuration;\n\n}\n\n// Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function\n\nfunction steps(steps) {\n  if ( steps === void 0 ) steps = 10;\n\n  return function (t) { return Math.ceil((minMax(t, 0.000001, 1)) * steps) * (1 / steps); };\n}\n\n// BezierEasing https://github.com/gre/bezier-easing\n\nvar bezier = (function () {\n\n  var kSplineTableSize = 11;\n  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);\n\n  function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1 }\n  function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1 }\n  function C(aA1)      { return 3.0 * aA1 }\n\n  function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT }\n  function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1) }\n\n  function binarySubdivide(aX, aA, aB, mX1, mX2) {\n    var currentX, currentT, i = 0;\n    do {\n      currentT = aA + (aB - aA) / 2.0;\n      currentX = calcBezier(currentT, mX1, mX2) - aX;\n      if (currentX > 0.0) { aB = currentT; } else { aA = currentT; }\n    } while (Math.abs(currentX) > 0.0000001 && ++i < 10);\n    return currentT;\n  }\n\n  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {\n    for (var i = 0; i < 4; ++i) {\n      var currentSlope = getSlope(aGuessT, mX1, mX2);\n      if (currentSlope === 0.0) { return aGuessT; }\n      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;\n      aGuessT -= currentX / currentSlope;\n    }\n    return aGuessT;\n  }\n\n  function bezier(mX1, mY1, mX2, mY2) {\n\n    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) { return; }\n    var sampleValues = new Float32Array(kSplineTableSize);\n\n    if (mX1 !== mY1 || mX2 !== mY2) {\n      for (var i = 0; i < kSplineTableSize; ++i) {\n        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);\n      }\n    }\n\n    function getTForX(aX) {\n\n      var intervalStart = 0;\n      var currentSample = 1;\n      var lastSample = kSplineTableSize - 1;\n\n      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {\n        intervalStart += kSampleStepSize;\n      }\n\n      --currentSample;\n\n      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);\n      var guessForT = intervalStart + dist * kSampleStepSize;\n      var initialSlope = getSlope(guessForT, mX1, mX2);\n\n      if (initialSlope >= 0.001) {\n        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);\n      } else if (initialSlope === 0.0) {\n        return guessForT;\n      } else {\n        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);\n      }\n\n    }\n\n    return function (x) {\n      if (mX1 === mY1 && mX2 === mY2) { return x; }\n      if (x === 0 || x === 1) { return x; }\n      return calcBezier(getTForX(x), mY1, mY2);\n    }\n\n  }\n\n  return bezier;\n\n})();\n\nvar penner = (function () {\n\n  // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)\n\n  var eases = { linear: function () { return function (t) { return t; }; } };\n\n  var functionEasings = {\n    Sine: function () { return function (t) { return 1 - Math.cos(t * Math.PI / 2); }; },\n    Circ: function () { return function (t) { return 1 - Math.sqrt(1 - t * t); }; },\n    Back: function () { return function (t) { return t * t * (3 * t - 2); }; },\n    Bounce: function () { return function (t) {\n      var pow2, b = 4;\n      while (t < (( pow2 = Math.pow(2, --b)) - 1) / 11) {}\n      return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow(( pow2 * 3 - 2 ) / 22 - t, 2)\n    }; },\n    Elastic: function (amplitude, period) {\n      if ( amplitude === void 0 ) amplitude = 1;\n      if ( period === void 0 ) period = .5;\n\n      var a = minMax(amplitude, 1, 10);\n      var p = minMax(period, .1, 2);\n      return function (t) {\n        return (t === 0 || t === 1) ? t : \n          -a * Math.pow(2, 10 * (t - 1)) * Math.sin((((t - 1) - (p / (Math.PI * 2) * Math.asin(1 / a))) * (Math.PI * 2)) / p);\n      }\n    }\n  };\n\n  var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];\n\n  baseEasings.forEach(function (name, i) {\n    functionEasings[name] = function () { return function (t) { return Math.pow(t, i + 2); }; };\n  });\n\n  Object.keys(functionEasings).forEach(function (name) {\n    var easeIn = functionEasings[name];\n    eases['easeIn' + name] = easeIn;\n    eases['easeOut' + name] = function (a, b) { return function (t) { return 1 - easeIn(a, b)(1 - t); }; };\n    eases['easeInOut' + name] = function (a, b) { return function (t) { return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : \n      1 - easeIn(a, b)(t * -2 + 2) / 2; }; };\n    eases['easeOutIn' + name] = function (a, b) { return function (t) { return t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 : \n      (easeIn(a, b)(t * 2 - 1) + 1) / 2; }; };\n  });\n\n  return eases;\n\n})();\n\nfunction parseEasings(easing, duration) {\n  if (is.fnc(easing)) { return easing; }\n  var name = easing.split('(')[0];\n  var ease = penner[name];\n  var args = parseEasingParameters(easing);\n  switch (name) {\n    case 'spring' : return spring(easing, duration);\n    case 'cubicBezier' : return applyArguments(bezier, args);\n    case 'steps' : return applyArguments(steps, args);\n    default : return applyArguments(ease, args);\n  }\n}\n\n// Strings\n\nfunction selectString(str) {\n  try {\n    var nodes = document.querySelectorAll(str);\n    return nodes;\n  } catch(e) {\n    return;\n  }\n}\n\n// Arrays\n\nfunction filterArray(arr, callback) {\n  var len = arr.length;\n  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;\n  var result = [];\n  for (var i = 0; i < len; i++) {\n    if (i in arr) {\n      var val = arr[i];\n      if (callback.call(thisArg, val, i, arr)) {\n        result.push(val);\n      }\n    }\n  }\n  return result;\n}\n\nfunction flattenArray(arr) {\n  return arr.reduce(function (a, b) { return a.concat(is.arr(b) ? flattenArray(b) : b); }, []);\n}\n\nfunction toArray(o) {\n  if (is.arr(o)) { return o; }\n  if (is.str(o)) { o = selectString(o) || o; }\n  if (o instanceof NodeList || o instanceof HTMLCollection) { return [].slice.call(o); }\n  return [o];\n}\n\nfunction arrayContains(arr, val) {\n  return arr.some(function (a) { return a === val; });\n}\n\n// Objects\n\nfunction cloneObject(o) {\n  var clone = {};\n  for (var p in o) { clone[p] = o[p]; }\n  return clone;\n}\n\nfunction replaceObjectProps(o1, o2) {\n  var o = cloneObject(o1);\n  for (var p in o1) { o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p]; }\n  return o;\n}\n\nfunction mergeObjects(o1, o2) {\n  var o = cloneObject(o1);\n  for (var p in o2) { o[p] = is.und(o1[p]) ? o2[p] : o1[p]; }\n  return o;\n}\n\n// Colors\n\nfunction rgbToRgba(rgbValue) {\n  var rgb = /rgb\\((\\d+,\\s*[\\d]+,\\s*[\\d]+)\\)/g.exec(rgbValue);\n  return rgb ? (\"rgba(\" + (rgb[1]) + \",1)\") : rgbValue;\n}\n\nfunction hexToRgba(hexValue) {\n  var rgx = /^#?([a-f\\d])([a-f\\d])([a-f\\d])$/i;\n  var hex = hexValue.replace(rgx, function (m, r, g, b) { return r + r + g + g + b + b; } );\n  var rgb = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);\n  var r = parseInt(rgb[1], 16);\n  var g = parseInt(rgb[2], 16);\n  var b = parseInt(rgb[3], 16);\n  return (\"rgba(\" + r + \",\" + g + \",\" + b + \",1)\");\n}\n\nfunction hslToRgba(hslValue) {\n  var hsl = /hsl\\((\\d+),\\s*([\\d.]+)%,\\s*([\\d.]+)%\\)/g.exec(hslValue) || /hsla\\((\\d+),\\s*([\\d.]+)%,\\s*([\\d.]+)%,\\s*([\\d.]+)\\)/g.exec(hslValue);\n  var h = parseInt(hsl[1], 10) / 360;\n  var s = parseInt(hsl[2], 10) / 100;\n  var l = parseInt(hsl[3], 10) / 100;\n  var a = hsl[4] || 1;\n  function hue2rgb(p, q, t) {\n    if (t < 0) { t += 1; }\n    if (t > 1) { t -= 1; }\n    if (t < 1/6) { return p + (q - p) * 6 * t; }\n    if (t < 1/2) { return q; }\n    if (t < 2/3) { return p + (q - p) * (2/3 - t) * 6; }\n    return p;\n  }\n  var r, g, b;\n  if (s == 0) {\n    r = g = b = l;\n  } else {\n    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;\n    var p = 2 * l - q;\n    r = hue2rgb(p, q, h + 1/3);\n    g = hue2rgb(p, q, h);\n    b = hue2rgb(p, q, h - 1/3);\n  }\n  return (\"rgba(\" + (r * 255) + \",\" + (g * 255) + \",\" + (b * 255) + \",\" + a + \")\");\n}\n\nfunction colorToRgb(val) {\n  if (is.rgb(val)) { return rgbToRgba(val); }\n  if (is.hex(val)) { return hexToRgba(val); }\n  if (is.hsl(val)) { return hslToRgba(val); }\n}\n\n// Units\n\nfunction getUnit(val) {\n  var split = /[+-]?\\d*\\.?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);\n  if (split) { return split[1]; }\n}\n\nfunction getTransformUnit(propName) {\n  if (stringContains(propName, 'translate') || propName === 'perspective') { return 'px'; }\n  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) { return 'deg'; }\n}\n\n// Values\n\nfunction getFunctionValue(val, animatable) {\n  if (!is.fnc(val)) { return val; }\n  return val(animatable.target, animatable.id, animatable.total);\n}\n\nfunction getAttribute(el, prop) {\n  return el.getAttribute(prop);\n}\n\nfunction convertPxToUnit(el, value, unit) {\n  var valueUnit = getUnit(value);\n  if (arrayContains([unit, 'deg', 'rad', 'turn'], valueUnit)) { return value; }\n  var cached = cache.CSS[value + unit];\n  if (!is.und(cached)) { return cached; }\n  var baseline = 100;\n  var tempEl = document.createElement(el.tagName);\n  var parentEl = (el.parentNode && (el.parentNode !== document)) ? el.parentNode : document.body;\n  parentEl.appendChild(tempEl);\n  tempEl.style.position = 'absolute';\n  tempEl.style.width = baseline + unit;\n  var factor = baseline / tempEl.offsetWidth;\n  parentEl.removeChild(tempEl);\n  var convertedUnit = factor * parseFloat(value);\n  cache.CSS[value + unit] = convertedUnit;\n  return convertedUnit;\n}\n\nfunction getCSSValue(el, prop, unit) {\n  if (prop in el.style) {\n    var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();\n    var value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';\n    return unit ? convertPxToUnit(el, value, unit) : value;\n  }\n}\n\nfunction getAnimationType(el, prop) {\n  if (is.dom(el) && !is.inp(el) && (!is.nil(getAttribute(el, prop)) || (is.svg(el) && el[prop]))) { return 'attribute'; }\n  if (is.dom(el) && arrayContains(validTransforms, prop)) { return 'transform'; }\n  if (is.dom(el) && (prop !== 'transform' && getCSSValue(el, prop))) { return 'css'; }\n  if (el[prop] != null) { return 'object'; }\n}\n\nfunction getElementTransforms(el) {\n  if (!is.dom(el)) { return; }\n  var str = el.style.transform || '';\n  var reg  = /(\\w+)\\(([^)]*)\\)/g;\n  var transforms = new Map();\n  var m; while (m = reg.exec(str)) { transforms.set(m[1], m[2]); }\n  return transforms;\n}\n\nfunction getTransformValue(el, propName, animatable, unit) {\n  var defaultVal = stringContains(propName, 'scale') ? 1 : 0 + getTransformUnit(propName);\n  var value = getElementTransforms(el).get(propName) || defaultVal;\n  if (animatable) {\n    animatable.transforms.list.set(propName, value);\n    animatable.transforms['last'] = propName;\n  }\n  return unit ? convertPxToUnit(el, value, unit) : value;\n}\n\nfunction getOriginalTargetValue(target, propName, unit, animatable) {\n  switch (getAnimationType(target, propName)) {\n    case 'transform': return getTransformValue(target, propName, animatable, unit);\n    case 'css': return getCSSValue(target, propName, unit);\n    case 'attribute': return getAttribute(target, propName);\n    default: return target[propName] || 0;\n  }\n}\n\nfunction getRelativeValue(to, from) {\n  var operator = /^(\\*=|\\+=|-=)/.exec(to);\n  if (!operator) { return to; }\n  var u = getUnit(to) || 0;\n  var x = parseFloat(from);\n  var y = parseFloat(to.replace(operator[0], ''));\n  switch (operator[0][0]) {\n    case '+': return x + y + u;\n    case '-': return x - y + u;\n    case '*': return x * y + u;\n  }\n}\n\nfunction validateValue(val, unit) {\n  if (is.col(val)) { return colorToRgb(val); }\n  if (/\\s/g.test(val)) { return val; }\n  var originalUnit = getUnit(val);\n  var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;\n  if (unit) { return unitLess + unit; }\n  return unitLess;\n}\n\n// getTotalLength() equivalent for circle, rect, polyline, polygon and line shapes\n// adapted from https://gist.github.com/SebLambla/3e0550c496c236709744\n\nfunction getDistance(p1, p2) {\n  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));\n}\n\nfunction getCircleLength(el) {\n  return Math.PI * 2 * getAttribute(el, 'r');\n}\n\nfunction getRectLength(el) {\n  return (getAttribute(el, 'width') * 2) + (getAttribute(el, 'height') * 2);\n}\n\nfunction getLineLength(el) {\n  return getDistance(\n    {x: getAttribute(el, 'x1'), y: getAttribute(el, 'y1')}, \n    {x: getAttribute(el, 'x2'), y: getAttribute(el, 'y2')}\n  );\n}\n\nfunction getPolylineLength(el) {\n  var points = el.points;\n  var totalLength = 0;\n  var previousPos;\n  for (var i = 0 ; i < points.numberOfItems; i++) {\n    var currentPos = points.getItem(i);\n    if (i > 0) { totalLength += getDistance(previousPos, currentPos); }\n    previousPos = currentPos;\n  }\n  return totalLength;\n}\n\nfunction getPolygonLength(el) {\n  var points = el.points;\n  return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));\n}\n\n// Path animation\n\nfunction getTotalLength(el) {\n  if (el.getTotalLength) { return el.getTotalLength(); }\n  switch(el.tagName.toLowerCase()) {\n    case 'circle': return getCircleLength(el);\n    case 'rect': return getRectLength(el);\n    case 'line': return getLineLength(el);\n    case 'polyline': return getPolylineLength(el);\n    case 'polygon': return getPolygonLength(el);\n  }\n}\n\nfunction setDashoffset(el) {\n  var pathLength = getTotalLength(el);\n  el.setAttribute('stroke-dasharray', pathLength);\n  return pathLength;\n}\n\n// Motion path\n\nfunction getParentSvgEl(el) {\n  var parentEl = el.parentNode;\n  while (is.svg(parentEl)) {\n    if (!is.svg(parentEl.parentNode)) { break; }\n    parentEl = parentEl.parentNode;\n  }\n  return parentEl;\n}\n\nfunction getParentSvg(pathEl, svgData) {\n  var svg = svgData || {};\n  var parentSvgEl = svg.el || getParentSvgEl(pathEl);\n  var rect = parentSvgEl.getBoundingClientRect();\n  var viewBoxAttr = getAttribute(parentSvgEl, 'viewBox');\n  var width = rect.width;\n  var height = rect.height;\n  var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(' ') : [0, 0, width, height]);\n  return {\n    el: parentSvgEl,\n    viewBox: viewBox,\n    x: viewBox[0] / 1,\n    y: viewBox[1] / 1,\n    w: width,\n    h: height,\n    vW: viewBox[2],\n    vH: viewBox[3]\n  }\n}\n\nfunction getPath(path, percent) {\n  var pathEl = is.str(path) ? selectString(path)[0] : path;\n  var p = percent || 100;\n  return function(property) {\n    return {\n      property: property,\n      el: pathEl,\n      svg: getParentSvg(pathEl),\n      totalLength: getTotalLength(pathEl) * (p / 100)\n    }\n  }\n}\n\nfunction getPathProgress(path, progress, isPathTargetInsideSVG) {\n  function point(offset) {\n    if ( offset === void 0 ) offset = 0;\n\n    var l = progress + offset >= 1 ? progress + offset : 0;\n    return path.el.getPointAtLength(l);\n  }\n  var svg = getParentSvg(path.el, path.svg);\n  var p = point();\n  var p0 = point(-1);\n  var p1 = point(+1);\n  var scaleX = isPathTargetInsideSVG ? 1 : svg.w / svg.vW;\n  var scaleY = isPathTargetInsideSVG ? 1 : svg.h / svg.vH;\n  switch (path.property) {\n    case 'x': return (p.x - svg.x) * scaleX;\n    case 'y': return (p.y - svg.y) * scaleY;\n    case 'angle': return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;\n  }\n}\n\n// Decompose value\n\nfunction decomposeValue(val, unit) {\n  // const rgx = /-?\\d*\\.?\\d+/g; // handles basic numbers\n  // const rgx = /[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?/g; // handles exponents notation\n  var rgx = /[+-]?\\d*\\.?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?/g; // handles exponents notation\n  var value = validateValue((is.pth(val) ? val.totalLength : val), unit) + '';\n  return {\n    original: value,\n    numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],\n    strings: (is.str(val) || unit) ? value.split(rgx) : []\n  }\n}\n\n// Animatables\n\nfunction parseTargets(targets) {\n  var targetsArray = targets ? (flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets))) : [];\n  return filterArray(targetsArray, function (item, pos, self) { return self.indexOf(item) === pos; });\n}\n\nfunction getAnimatables(targets) {\n  var parsed = parseTargets(targets);\n  return parsed.map(function (t, i) {\n    return {target: t, id: i, total: parsed.length, transforms: { list: getElementTransforms(t) } };\n  });\n}\n\n// Properties\n\nfunction normalizePropertyTweens(prop, tweenSettings) {\n  var settings = cloneObject(tweenSettings);\n  // Override duration if easing is a spring\n  if (/^spring/.test(settings.easing)) { settings.duration = spring(settings.easing); }\n  if (is.arr(prop)) {\n    var l = prop.length;\n    var isFromTo = (l === 2 && !is.obj(prop[0]));\n    if (!isFromTo) {\n      // Duration divided by the number of tweens\n      if (!is.fnc(tweenSettings.duration)) { settings.duration = tweenSettings.duration / l; }\n    } else {\n      // Transform [from, to] values shorthand to a valid tween value\n      prop = {value: prop};\n    }\n  }\n  var propArray = is.arr(prop) ? prop : [prop];\n  return propArray.map(function (v, i) {\n    var obj = (is.obj(v) && !is.pth(v)) ? v : {value: v};\n    // Default delay value should only be applied to the first tween\n    if (is.und(obj.delay)) { obj.delay = !i ? tweenSettings.delay : 0; }\n    // Default endDelay value should only be applied to the last tween\n    if (is.und(obj.endDelay)) { obj.endDelay = i === propArray.length - 1 ? tweenSettings.endDelay : 0; }\n    return obj;\n  }).map(function (k) { return mergeObjects(k, settings); });\n}\n\n\nfunction flattenKeyframes(keyframes) {\n  var propertyNames = filterArray(flattenArray(keyframes.map(function (key) { return Object.keys(key); })), function (p) { return is.key(p); })\n  .reduce(function (a,b) { if (a.indexOf(b) < 0) { a.push(b); } return a; }, []);\n  var properties = {};\n  var loop = function ( i ) {\n    var propName = propertyNames[i];\n    properties[propName] = keyframes.map(function (key) {\n      var newKey = {};\n      for (var p in key) {\n        if (is.key(p)) {\n          if (p == propName) { newKey.value = key[p]; }\n        } else {\n          newKey[p] = key[p];\n        }\n      }\n      return newKey;\n    });\n  };\n\n  for (var i = 0; i < propertyNames.length; i++) loop( i );\n  return properties;\n}\n\nfunction getProperties(tweenSettings, params) {\n  var properties = [];\n  var keyframes = params.keyframes;\n  if (keyframes) { params = mergeObjects(flattenKeyframes(keyframes), params); }\n  for (var p in params) {\n    if (is.key(p)) {\n      properties.push({\n        name: p,\n        tweens: normalizePropertyTweens(params[p], tweenSettings)\n      });\n    }\n  }\n  return properties;\n}\n\n// Tweens\n\nfunction normalizeTweenValues(tween, animatable) {\n  var t = {};\n  for (var p in tween) {\n    var value = getFunctionValue(tween[p], animatable);\n    if (is.arr(value)) {\n      value = value.map(function (v) { return getFunctionValue(v, animatable); });\n      if (value.length === 1) { value = value[0]; }\n    }\n    t[p] = value;\n  }\n  t.duration = parseFloat(t.duration);\n  t.delay = parseFloat(t.delay);\n  return t;\n}\n\nfunction normalizeTweens(prop, animatable) {\n  var previousTween;\n  return prop.tweens.map(function (t) {\n    var tween = normalizeTweenValues(t, animatable);\n    var tweenValue = tween.value;\n    var to = is.arr(tweenValue) ? tweenValue[1] : tweenValue;\n    var toUnit = getUnit(to);\n    var originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);\n    var previousValue = previousTween ? previousTween.to.original : originalValue;\n    var from = is.arr(tweenValue) ? tweenValue[0] : previousValue;\n    var fromUnit = getUnit(from) || getUnit(originalValue);\n    var unit = toUnit || fromUnit;\n    if (is.und(to)) { to = previousValue; }\n    tween.from = decomposeValue(from, unit);\n    tween.to = decomposeValue(getRelativeValue(to, from), unit);\n    tween.start = previousTween ? previousTween.end : 0;\n    tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;\n    tween.easing = parseEasings(tween.easing, tween.duration);\n    tween.isPath = is.pth(tweenValue);\n    tween.isPathTargetInsideSVG = tween.isPath && is.svg(animatable.target);\n    tween.isColor = is.col(tween.from.original);\n    if (tween.isColor) { tween.round = 1; }\n    previousTween = tween;\n    return tween;\n  });\n}\n\n// Tween progress\n\nvar setProgressValue = {\n  css: function (t, p, v) { return t.style[p] = v; },\n  attribute: function (t, p, v) { return t.setAttribute(p, v); },\n  object: function (t, p, v) { return t[p] = v; },\n  transform: function (t, p, v, transforms, manual) {\n    transforms.list.set(p, v);\n    if (p === transforms.last || manual) {\n      var str = '';\n      transforms.list.forEach(function (value, prop) { str += prop + \"(\" + value + \") \"; });\n      t.style.transform = str;\n    }\n  }\n};\n\n// Set Value helper\n\nfunction setTargetsValue(targets, properties) {\n  var animatables = getAnimatables(targets);\n  animatables.forEach(function (animatable) {\n    for (var property in properties) {\n      var value = getFunctionValue(properties[property], animatable);\n      var target = animatable.target;\n      var valueUnit = getUnit(value);\n      var originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);\n      var unit = valueUnit || getUnit(originalValue);\n      var to = getRelativeValue(validateValue(value, unit), originalValue);\n      var animType = getAnimationType(target, property);\n      setProgressValue[animType](target, property, to, animatable.transforms, true);\n    }\n  });\n}\n\n// Animations\n\nfunction createAnimation(animatable, prop) {\n  var animType = getAnimationType(animatable.target, prop.name);\n  if (animType) {\n    var tweens = normalizeTweens(prop, animatable);\n    var lastTween = tweens[tweens.length - 1];\n    return {\n      type: animType,\n      property: prop.name,\n      animatable: animatable,\n      tweens: tweens,\n      duration: lastTween.end,\n      delay: tweens[0].delay,\n      endDelay: lastTween.endDelay\n    }\n  }\n}\n\nfunction getAnimations(animatables, properties) {\n  return filterArray(flattenArray(animatables.map(function (animatable) {\n    return properties.map(function (prop) {\n      return createAnimation(animatable, prop);\n    });\n  })), function (a) { return !is.und(a); });\n}\n\n// Create Instance\n\nfunction getInstanceTimings(animations, tweenSettings) {\n  var animLength = animations.length;\n  var getTlOffset = function (anim) { return anim.timelineOffset ? anim.timelineOffset : 0; };\n  var timings = {};\n  timings.duration = animLength ? Math.max.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.duration; })) : tweenSettings.duration;\n  timings.delay = animLength ? Math.min.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.delay; })) : tweenSettings.delay;\n  timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.duration - anim.endDelay; })) : tweenSettings.endDelay;\n  return timings;\n}\n\nvar instanceID = 0;\n\nfunction createNewInstance(params) {\n  var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);\n  var tweenSettings = replaceObjectProps(defaultTweenSettings, params);\n  var properties = getProperties(tweenSettings, params);\n  var animatables = getAnimatables(params.targets);\n  var animations = getAnimations(animatables, properties);\n  var timings = getInstanceTimings(animations, tweenSettings);\n  var id = instanceID;\n  instanceID++;\n  return mergeObjects(instanceSettings, {\n    id: id,\n    children: [],\n    animatables: animatables,\n    animations: animations,\n    duration: timings.duration,\n    delay: timings.delay,\n    endDelay: timings.endDelay\n  });\n}\n\n// Core\n\nvar activeInstances = [];\n\nvar engine = (function () {\n  var raf;\n\n  function play() {\n    if (!raf && (!isDocumentHidden() || !anime.suspendWhenDocumentHidden) && activeInstances.length > 0) {\n      raf = requestAnimationFrame(step);\n    }\n  }\n  function step(t) {\n    // memo on algorithm issue:\n    // dangerous iteration over mutable `activeInstances`\n    // (that collection may be updated from within callbacks of `tick`-ed animation instances)\n    var activeInstancesLength = activeInstances.length;\n    var i = 0;\n    while (i < activeInstancesLength) {\n      var activeInstance = activeInstances[i];\n      if (!activeInstance.paused) {\n        activeInstance.tick(t);\n        i++;\n      } else {\n        activeInstances.splice(i, 1);\n        activeInstancesLength--;\n      }\n    }\n    raf = i > 0 ? requestAnimationFrame(step) : undefined;\n  }\n\n  function handleVisibilityChange() {\n    if (!anime.suspendWhenDocumentHidden) { return; }\n\n    if (isDocumentHidden()) {\n      // suspend ticks\n      raf = cancelAnimationFrame(raf);\n    } else { // is back to active tab\n      // first adjust animations to consider the time that ticks were suspended\n      activeInstances.forEach(\n        function (instance) { return instance ._onDocumentVisibility(); }\n      );\n      engine();\n    }\n  }\n  if (typeof document !== 'undefined') {\n    document.addEventListener('visibilitychange', handleVisibilityChange);\n  }\n\n  return play;\n})();\n\nfunction isDocumentHidden() {\n  return !!document && document.hidden;\n}\n\n// Public Instance\n\nfunction anime(params) {\n  if ( params === void 0 ) params = {};\n\n\n  var startTime = 0, lastTime = 0, now = 0;\n  var children, childrenLength = 0;\n  var resolve = null;\n\n  function makePromise(instance) {\n    var promise = window.Promise && new Promise(function (_resolve) { return resolve = _resolve; });\n    instance.finished = promise;\n    return promise;\n  }\n\n  var instance = createNewInstance(params);\n  var promise = makePromise(instance);\n\n  function toggleInstanceDirection() {\n    var direction = instance.direction;\n    if (direction !== 'alternate') {\n      instance.direction = direction !== 'normal' ? 'normal' : 'reverse';\n    }\n    instance.reversed = !instance.reversed;\n    children.forEach(function (child) { return child.reversed = instance.reversed; });\n  }\n\n  function adjustTime(time) {\n    return instance.reversed ? instance.duration - time : time;\n  }\n\n  function resetTime() {\n    startTime = 0;\n    lastTime = adjustTime(instance.currentTime) * (1 / anime.speed);\n  }\n\n  function seekChild(time, child) {\n    if (child) { child.seek(time - child.timelineOffset); }\n  }\n\n  function syncInstanceChildren(time) {\n    if (!instance.reversePlayback) {\n      for (var i = 0; i < childrenLength; i++) { seekChild(time, children[i]); }\n    } else {\n      for (var i$1 = childrenLength; i$1--;) { seekChild(time, children[i$1]); }\n    }\n  }\n\n  function setAnimationsProgress(insTime) {\n    var i = 0;\n    var animations = instance.animations;\n    var animationsLength = animations.length;\n    while (i < animationsLength) {\n      var anim = animations[i];\n      var animatable = anim.animatable;\n      var tweens = anim.tweens;\n      var tweenLength = tweens.length - 1;\n      var tween = tweens[tweenLength];\n      // Only check for keyframes if there is more than one tween\n      if (tweenLength) { tween = filterArray(tweens, function (t) { return (insTime < t.end); })[0] || tween; }\n      var elapsed = minMax(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;\n      var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);\n      var strings = tween.to.strings;\n      var round = tween.round;\n      var numbers = [];\n      var toNumbersLength = tween.to.numbers.length;\n      var progress = (void 0);\n      for (var n = 0; n < toNumbersLength; n++) {\n        var value = (void 0);\n        var toNumber = tween.to.numbers[n];\n        var fromNumber = tween.from.numbers[n] || 0;\n        if (!tween.isPath) {\n          value = fromNumber + (eased * (toNumber - fromNumber));\n        } else {\n          value = getPathProgress(tween.value, eased * toNumber, tween.isPathTargetInsideSVG);\n        }\n        if (round) {\n          if (!(tween.isColor && n > 2)) {\n            value = Math.round(value * round) / round;\n          }\n        }\n        numbers.push(value);\n      }\n      // Manual Array.reduce for better performances\n      var stringsLength = strings.length;\n      if (!stringsLength) {\n        progress = numbers[0];\n      } else {\n        progress = strings[0];\n        for (var s = 0; s < stringsLength; s++) {\n          var a = strings[s];\n          var b = strings[s + 1];\n          var n$1 = numbers[s];\n          if (!isNaN(n$1)) {\n            if (!b) {\n              progress += n$1 + ' ';\n            } else {\n              progress += n$1 + b;\n            }\n          }\n        }\n      }\n      setProgressValue[anim.type](animatable.target, anim.property, progress, animatable.transforms);\n      anim.currentValue = progress;\n      i++;\n    }\n  }\n\n  function setCallback(cb) {\n    if (instance[cb] && !instance.passThrough) { instance[cb](instance); }\n  }\n\n  function countIteration() {\n    if (instance.remaining && instance.remaining !== true) {\n      instance.remaining--;\n    }\n  }\n\n  function setInstanceProgress(engineTime) {\n    var insDuration = instance.duration;\n    var insDelay = instance.delay;\n    var insEndDelay = insDuration - instance.endDelay;\n    var insTime = adjustTime(engineTime);\n    instance.progress = minMax((insTime / insDuration) * 100, 0, 100);\n    instance.reversePlayback = insTime < instance.currentTime;\n    if (children) { syncInstanceChildren(insTime); }\n    if (!instance.began && instance.currentTime > 0) {\n      instance.began = true;\n      setCallback('begin');\n    }\n    if (!instance.loopBegan && instance.currentTime > 0) {\n      instance.loopBegan = true;\n      setCallback('loopBegin');\n    }\n    if (insTime <= insDelay && instance.currentTime !== 0) {\n      setAnimationsProgress(0);\n    }\n    if ((insTime >= insEndDelay && instance.currentTime !== insDuration) || !insDuration) {\n      setAnimationsProgress(insDuration);\n    }\n    if (insTime > insDelay && insTime < insEndDelay) {\n      if (!instance.changeBegan) {\n        instance.changeBegan = true;\n        instance.changeCompleted = false;\n        setCallback('changeBegin');\n      }\n      setCallback('change');\n      setAnimationsProgress(insTime);\n    } else {\n      if (instance.changeBegan) {\n        instance.changeCompleted = true;\n        instance.changeBegan = false;\n        setCallback('changeComplete');\n      }\n    }\n    instance.currentTime = minMax(insTime, 0, insDuration);\n    if (instance.began) { setCallback('update'); }\n    if (engineTime >= insDuration) {\n      lastTime = 0;\n      countIteration();\n      if (!instance.remaining) {\n        instance.paused = true;\n        if (!instance.completed) {\n          instance.completed = true;\n          setCallback('loopComplete');\n          setCallback('complete');\n          if (!instance.passThrough && 'Promise' in window) {\n            resolve();\n            promise = makePromise(instance);\n          }\n        }\n      } else {\n        startTime = now;\n        setCallback('loopComplete');\n        instance.loopBegan = false;\n        if (instance.direction === 'alternate') {\n          toggleInstanceDirection();\n        }\n      }\n    }\n  }\n\n  instance.reset = function() {\n    var direction = instance.direction;\n    instance.passThrough = false;\n    instance.currentTime = 0;\n    instance.progress = 0;\n    instance.paused = true;\n    instance.began = false;\n    instance.loopBegan = false;\n    instance.changeBegan = false;\n    instance.completed = false;\n    instance.changeCompleted = false;\n    instance.reversePlayback = false;\n    instance.reversed = direction === 'reverse';\n    instance.remaining = instance.loop;\n    children = instance.children;\n    childrenLength = children.length;\n    for (var i = childrenLength; i--;) { instance.children[i].reset(); }\n    if (instance.reversed && instance.loop !== true || (direction === 'alternate' && instance.loop === 1)) { instance.remaining++; }\n    setAnimationsProgress(instance.reversed ? instance.duration : 0);\n  };\n\n  // internal method (for engine) to adjust animation timings before restoring engine ticks (rAF)\n  instance._onDocumentVisibility = resetTime;\n\n  // Set Value helper\n\n  instance.set = function(targets, properties) {\n    setTargetsValue(targets, properties);\n    return instance;\n  };\n\n  instance.tick = function(t) {\n    now = t;\n    if (!startTime) { startTime = now; }\n    setInstanceProgress((now + (lastTime - startTime)) * anime.speed);\n  };\n\n  instance.seek = function(time) {\n    setInstanceProgress(adjustTime(time));\n  };\n\n  instance.pause = function() {\n    instance.paused = true;\n    resetTime();\n  };\n\n  instance.play = function() {\n    if (!instance.paused) { return; }\n    if (instance.completed) { instance.reset(); }\n    instance.paused = false;\n    activeInstances.push(instance);\n    resetTime();\n    engine();\n  };\n\n  instance.reverse = function() {\n    toggleInstanceDirection();\n    instance.completed = instance.reversed ? false : true;\n    resetTime();\n  };\n\n  instance.restart = function() {\n    instance.reset();\n    instance.play();\n  };\n\n  instance.remove = function(targets) {\n    var targetsArray = parseTargets(targets);\n    removeTargetsFromInstance(targetsArray, instance);\n  };\n\n  instance.reset();\n\n  if (instance.autoplay) { instance.play(); }\n\n  return instance;\n\n}\n\n// Remove targets from animation\n\nfunction removeTargetsFromAnimations(targetsArray, animations) {\n  for (var a = animations.length; a--;) {\n    if (arrayContains(targetsArray, animations[a].animatable.target)) {\n      animations.splice(a, 1);\n    }\n  }\n}\n\nfunction removeTargetsFromInstance(targetsArray, instance) {\n  var animations = instance.animations;\n  var children = instance.children;\n  removeTargetsFromAnimations(targetsArray, animations);\n  for (var c = children.length; c--;) {\n    var child = children[c];\n    var childAnimations = child.animations;\n    removeTargetsFromAnimations(targetsArray, childAnimations);\n    if (!childAnimations.length && !child.children.length) { children.splice(c, 1); }\n  }\n  if (!animations.length && !children.length) { instance.pause(); }\n}\n\nfunction removeTargetsFromActiveInstances(targets) {\n  var targetsArray = parseTargets(targets);\n  for (var i = activeInstances.length; i--;) {\n    var instance = activeInstances[i];\n    removeTargetsFromInstance(targetsArray, instance);\n  }\n}\n\n// Stagger helpers\n\nfunction stagger(val, params) {\n  if ( params === void 0 ) params = {};\n\n  var direction = params.direction || 'normal';\n  var easing = params.easing ? parseEasings(params.easing) : null;\n  var grid = params.grid;\n  var axis = params.axis;\n  var fromIndex = params.from || 0;\n  var fromFirst = fromIndex === 'first';\n  var fromCenter = fromIndex === 'center';\n  var fromLast = fromIndex === 'last';\n  var isRange = is.arr(val);\n  var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);\n  var val2 = isRange ? parseFloat(val[1]) : 0;\n  var unit = getUnit(isRange ? val[1] : val) || 0;\n  var start = params.start || 0 + (isRange ? val1 : 0);\n  var values = [];\n  var maxValue = 0;\n  return function (el, i, t) {\n    if (fromFirst) { fromIndex = 0; }\n    if (fromCenter) { fromIndex = (t - 1) / 2; }\n    if (fromLast) { fromIndex = t - 1; }\n    if (!values.length) {\n      for (var index = 0; index < t; index++) {\n        if (!grid) {\n          values.push(Math.abs(fromIndex - index));\n        } else {\n          var fromX = !fromCenter ? fromIndex%grid[0] : (grid[0]-1)/2;\n          var fromY = !fromCenter ? Math.floor(fromIndex/grid[0]) : (grid[1]-1)/2;\n          var toX = index%grid[0];\n          var toY = Math.floor(index/grid[0]);\n          var distanceX = fromX - toX;\n          var distanceY = fromY - toY;\n          var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);\n          if (axis === 'x') { value = -distanceX; }\n          if (axis === 'y') { value = -distanceY; }\n          values.push(value);\n        }\n        maxValue = Math.max.apply(Math, values);\n      }\n      if (easing) { values = values.map(function (val) { return easing(val / maxValue) * maxValue; }); }\n      if (direction === 'reverse') { values = values.map(function (val) { return axis ? (val < 0) ? val * -1 : -val : Math.abs(maxValue - val); }); }\n    }\n    var spacing = isRange ? (val2 - val1) / maxValue : val1;\n    return start + (spacing * (Math.round(values[i] * 100) / 100)) + unit;\n  }\n}\n\n// Timeline\n\nfunction timeline(params) {\n  if ( params === void 0 ) params = {};\n\n  var tl = anime(params);\n  tl.duration = 0;\n  tl.add = function(instanceParams, timelineOffset) {\n    var tlIndex = activeInstances.indexOf(tl);\n    var children = tl.children;\n    if (tlIndex > -1) { activeInstances.splice(tlIndex, 1); }\n    function passThrough(ins) { ins.passThrough = true; }\n    for (var i = 0; i < children.length; i++) { passThrough(children[i]); }\n    var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));\n    insParams.targets = insParams.targets || params.targets;\n    var tlDuration = tl.duration;\n    insParams.autoplay = false;\n    insParams.direction = tl.direction;\n    insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);\n    passThrough(tl);\n    tl.seek(insParams.timelineOffset);\n    var ins = anime(insParams);\n    passThrough(ins);\n    children.push(ins);\n    var timings = getInstanceTimings(children, params);\n    tl.delay = timings.delay;\n    tl.endDelay = timings.endDelay;\n    tl.duration = timings.duration;\n    tl.seek(0);\n    tl.reset();\n    if (tl.autoplay) { tl.play(); }\n    return tl;\n  };\n  return tl;\n}\n\nanime.version = '3.2.1';\nanime.speed = 1;\n// TODO:#review: naming, documentation\nanime.suspendWhenDocumentHidden = true;\nanime.running = activeInstances;\nanime.remove = removeTargetsFromActiveInstances;\nanime.get = getOriginalTargetValue;\nanime.set = setTargetsValue;\nanime.convertPx = convertPxToUnit;\nanime.path = getPath;\nanime.setDashoffset = setDashoffset;\nanime.stagger = stagger;\nanime.timeline = timeline;\nanime.easing = parseEasings;\nanime.penner = penner;\nanime.random = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (anime);\n\n\n//# sourceURL=webpack://flappy-bird/./node_modules/animejs/lib/anime.es.js?");

/***/ }),

/***/ "./node_modules/collider-js/index.js":
/*!*******************************************!*\
  !*** ./node_modules/collider-js/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    /**\n     * @param selector\n     * @returns {ClientRect}\n     */\n    getRect: function (selector) {\n        return document.querySelector(selector).getBoundingClientRect();\n    },\n    /**\n     * @param el1\n     * @param el2\n     * @returns {{first: Rectangle|*, second: Rectangle|*}}\n     */\n    getRectsObject: function (el1, el2) {\n        return {\n            first: this.getRect(el1),\n            second: this.getRect(el2),\n        };\n    },\n    /**\n     * Is elements touch each other somehow\n     *\n     * @param el1\n     * @param el2\n     * @returns {boolean}\n     */\n    isOverlapped: function (el1, el2) {\n        var rects = this.getRectsObject(el1, el2);\n\n        return !(\n            rects.first.top > rects.second.bottom\n            || rects.first.right < rects.second.left\n            || rects.first.bottom < rects.second.top\n            || rects.first.left > rects.second.right\n        );\n    },\n    /**\n     * Check if element 1's top is higher than element 2's top\n     *\n     * @param el1\n     * @param el2\n     * @returns {boolean}\n     */\n    isHigher: function (el1, el2) {\n        var rects = this.getRectsObject(el1, el2);\n\n        return rects.first.top < rects.second.top;\n    },\n    /**\n     * Check if element 1's top is higher to element 2's bottom to px\n     *\n     * @param el1\n     * @param el2\n     * @param px\n     * @returns {boolean}\n     */\n    isCloserFromBottom: function (el1, el2, px) {\n    \tvar rects = this.getRectsObject(el1, el2);\n\n        return (rects.first.top - rects.second.bottom) < px;\n    }\n});\n\n\n//# sourceURL=webpack://flappy-bird/./node_modules/collider-js/index.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style/index.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style/index.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ \"./node_modules/css-loader/dist/runtime/noSourceMaps.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);\n// Imports\n\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, \"* {\\n    overflow: hidden;\\n}\\n\\nbody {\\n    height: 100vh;\\n    margin: 0;\\n    user-select: none;\\n}\\n\\n#game {\\n    background-size: 400px 100%;\\n    width: 100%;\\n    height: 100%;\\n}\\n\\n#game .player {\\n    position: absolute;\\n    width: 60px;\\n    height: 40px;\\n    background-size: cover;\\n    background-position: center center;\\n    animation: playerIdleAnimation 1s infinite ease-in-out;\\n    z-index: 3;\\n}\\n\\n#game .floor {\\n    width: 100%;\\n    position: absolute;\\n    z-index: 99;\\n    bottom: 0;\\n    background-size: 60% 150px;\\n    background-repeat: repeat-x;\\n    background-color: #DED99E;\\n}\\n\\n#game .pipe-obstacle {\\n    height: 400px;\\n    width: 100px;\\n    background-size: cover;\\n    position: absolute;\\n    z-index: 2;\\n}\\n\\n#game .points-container {\\n    position: absolute;\\n    z-index: 9999;\\n    left: 50%;\\n    transform: translateX(-50%);\\n    margin-top: 30px;\\n    display: flex;\\n    justify-content: center;\\n}\\n\\n#game .game-instructions {\\n    position: absolute;\\n    left: 50%;\\n    top: 45%;\\n    transform: translate(-50%, -50%);\\n    transition: opacity .5s;\\n    z-index: 999;\\n}\\n\\n#game .game-overlay {\\n    position: absolute;\\n    width: 100%;\\n    height: 100%;\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    z-index: 99999;\\n    opacity: 0;\\n}\\n\\n#game .die-overlay {\\n    background-color: #fff;\\n}\\n\\n#game .restart-overlay {\\n    background-color: #000;\\n}\\n\\n@keyframes playerIdleAnimation {\\n\\n    0% {\\n        transform: translateY(0px);\\n    }\\n\\n    50% {\\n        transform: translateY(20px);\\n    }\\n\\n    100% {\\n        transform: translateY(0px);\\n    }\\n\\n}\", \"\"]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack://flappy-bird/./src/style/index.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\nmodule.exports = function (cssWithMappingToString) {\n  var list = []; // return the list of modules as css string\n\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = \"\";\n      var needLayer = typeof item[5] !== \"undefined\";\n\n      if (item[4]) {\n        content += \"@supports (\".concat(item[4], \") {\");\n      }\n\n      if (item[2]) {\n        content += \"@media \".concat(item[2], \" {\");\n      }\n\n      if (needLayer) {\n        content += \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\");\n      }\n\n      content += cssWithMappingToString(item);\n\n      if (needLayer) {\n        content += \"}\";\n      }\n\n      if (item[2]) {\n        content += \"}\";\n      }\n\n      if (item[4]) {\n        content += \"}\";\n      }\n\n      return content;\n    }).join(\"\");\n  }; // import a list of modules into the list\n\n\n  list.i = function i(modules, media, dedupe, supports, layer) {\n    if (typeof modules === \"string\") {\n      modules = [[null, modules, undefined]];\n    }\n\n    var alreadyImportedModules = {};\n\n    if (dedupe) {\n      for (var k = 0; k < this.length; k++) {\n        var id = this[k][0];\n\n        if (id != null) {\n          alreadyImportedModules[id] = true;\n        }\n      }\n    }\n\n    for (var _k = 0; _k < modules.length; _k++) {\n      var item = [].concat(modules[_k]);\n\n      if (dedupe && alreadyImportedModules[item[0]]) {\n        continue;\n      }\n\n      if (typeof layer !== \"undefined\") {\n        if (typeof item[5] === \"undefined\") {\n          item[5] = layer;\n        } else {\n          item[1] = \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\").concat(item[1], \"}\");\n          item[5] = layer;\n        }\n      }\n\n      if (media) {\n        if (!item[2]) {\n          item[2] = media;\n        } else {\n          item[1] = \"@media \".concat(item[2], \" {\").concat(item[1], \"}\");\n          item[2] = media;\n        }\n      }\n\n      if (supports) {\n        if (!item[4]) {\n          item[4] = \"\".concat(supports);\n        } else {\n          item[1] = \"@supports (\".concat(item[4], \") {\").concat(item[1], \"}\");\n          item[4] = supports;\n        }\n      }\n\n      list.push(item);\n    }\n  };\n\n  return list;\n};\n\n//# sourceURL=webpack://flappy-bird/./node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nmodule.exports = function (i) {\n  return i[1];\n};\n\n//# sourceURL=webpack://flappy-bird/./node_modules/css-loader/dist/runtime/noSourceMaps.js?");

/***/ }),

/***/ "./node_modules/debounce/index.js":
/*!****************************************!*\
  !*** ./node_modules/debounce/index.js ***!
  \****************************************/
/***/ ((module) => {

eval("/**\n * Returns a function, that, as long as it continues to be invoked, will not\n * be triggered. The function will be called after it stops being called for\n * N milliseconds. If `immediate` is passed, trigger the function on the\n * leading edge, instead of the trailing. The function also has a property 'clear' \n * that is a function which will clear the timer to prevent previously scheduled executions. \n *\n * @source underscore.js\n * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/\n * @param {Function} function to wrap\n * @param {Number} timeout in ms (`100`)\n * @param {Boolean} whether to execute at the beginning (`false`)\n * @api public\n */\nfunction debounce(func, wait, immediate){\n  var timeout, args, context, timestamp, result;\n  if (null == wait) wait = 100;\n\n  function later() {\n    var last = Date.now() - timestamp;\n\n    if (last < wait && last >= 0) {\n      timeout = setTimeout(later, wait - last);\n    } else {\n      timeout = null;\n      if (!immediate) {\n        result = func.apply(context, args);\n        context = args = null;\n      }\n    }\n  };\n\n  var debounced = function(){\n    context = this;\n    args = arguments;\n    timestamp = Date.now();\n    var callNow = immediate && !timeout;\n    if (!timeout) timeout = setTimeout(later, wait);\n    if (callNow) {\n      result = func.apply(context, args);\n      context = args = null;\n    }\n\n    return result;\n  };\n\n  debounced.clear = function() {\n    if (timeout) {\n      clearTimeout(timeout);\n      timeout = null;\n    }\n  };\n  \n  debounced.flush = function() {\n    if (timeout) {\n      result = func.apply(context, args);\n      context = args = null;\n      \n      clearTimeout(timeout);\n      timeout = null;\n    }\n  };\n\n  return debounced;\n};\n\n// Adds compatibility for ES modules\ndebounce.debounce = debounce;\n\nmodule.exports = debounce;\n\n\n//# sourceURL=webpack://flappy-bird/./node_modules/debounce/index.js?");

/***/ }),

/***/ "./src/assets/audio/die.ogg":
/*!**********************************!*\
  !*** ./src/assets/audio/die.ogg ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"6a573a32b376873fbb89dae17c9a3aa7.ogg\");\n\n//# sourceURL=webpack://flappy-bird/./src/assets/audio/die.ogg?");

/***/ }),

/***/ "./src/assets/audio/hit.ogg":
/*!**********************************!*\
  !*** ./src/assets/audio/hit.ogg ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"53be63225a77062f0e0567615aaef471.ogg\");\n\n//# sourceURL=webpack://flappy-bird/./src/assets/audio/hit.ogg?");

/***/ }),

/***/ "./src/assets/audio/point.ogg":
/*!************************************!*\
  !*** ./src/assets/audio/point.ogg ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"25b7658563967e60ca23fb51af9c084f.ogg\");\n\n//# sourceURL=webpack://flappy-bird/./src/assets/audio/point.ogg?");

/***/ }),

/***/ "./src/assets/audio/wing.ogg":
/*!***********************************!*\
  !*** ./src/assets/audio/wing.ogg ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"06f58df2486e5ade890cf491a58b4e35.ogg\");\n\n//# sourceURL=webpack://flappy-bird/./src/assets/audio/wing.ogg?");

/***/ }),

/***/ "./src/assets/sprites/background-day.png":
/*!***********************************************!*\
  !*** ./src/assets/sprites/background-day.png ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"039bc31e7cce0bc9d110eb6ca38bd0b2.png\");\n\n//# sourceURL=webpack://flappy-bird/./src/assets/sprites/background-day.png?");

/***/ }),

/***/ "./src/assets/sprites/base.png":
/*!*************************************!*\
  !*** ./src/assets/sprites/base.png ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"3982a7be868726b9a66239379cce5a9a.png\");\n\n//# sourceURL=webpack://flappy-bird/./src/assets/sprites/base.png?");

/***/ }),

/***/ "./src/assets/sprites/message.png":
/*!****************************************!*\
  !*** ./src/assets/sprites/message.png ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"0d52ffd753331310c937a7c37aae2b59.png\");\n\n//# sourceURL=webpack://flappy-bird/./src/assets/sprites/message.png?");

/***/ }),

/***/ "./src/assets/sprites/pipe-green.png":
/*!*******************************************!*\
  !*** ./src/assets/sprites/pipe-green.png ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"4787c0e6b062de71aa5f1ff4b709a45b.png\");\n\n//# sourceURL=webpack://flappy-bird/./src/assets/sprites/pipe-green.png?");

/***/ }),

/***/ "./src/assets/sprites/redbird-downflap.png":
/*!*************************************************!*\
  !*** ./src/assets/sprites/redbird-downflap.png ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"186976fb5830536ae9f20433e8288a58.png\");\n\n//# sourceURL=webpack://flappy-bird/./src/assets/sprites/redbird-downflap.png?");

/***/ }),

/***/ "./src/assets/sprites/redbird-midflap.png":
/*!************************************************!*\
  !*** ./src/assets/sprites/redbird-midflap.png ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"310b383088e07b20e02b611cf092cbe7.png\");\n\n//# sourceURL=webpack://flappy-bird/./src/assets/sprites/redbird-midflap.png?");

/***/ }),

/***/ "./src/assets/sprites/redbird-upflap.png":
/*!***********************************************!*\
  !*** ./src/assets/sprites/redbird-upflap.png ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"8014bab3b6d96f267953fbba9e64f452.png\");\n\n//# sourceURL=webpack://flappy-bird/./src/assets/sprites/redbird-upflap.png?");

/***/ }),

/***/ "./src/style/index.css":
/*!*****************************!*\
  !*** ./src/style/index.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ \"./node_modules/style-loader/dist/runtime/styleDomAPI.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ \"./node_modules/style-loader/dist/runtime/insertBySelector.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ \"./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ \"./node_modules/style-loader/dist/runtime/insertStyleElement.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ \"./node_modules/style-loader/dist/runtime/styleTagTransform.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./index.css */ \"./node_modules/css-loader/dist/cjs.js!./src/style/index.css\");\n\n      \n      \n      \n      \n      \n      \n      \n      \n      \n\nvar options = {};\n\noptions.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());\noptions.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());\n\n      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, \"head\");\n    \noptions.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());\noptions.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());\n\nvar update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"], options);\n\n\n\n\n       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"] && _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals ? _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals : undefined);\n\n\n//# sourceURL=webpack://flappy-bird/./src/style/index.css?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nvar stylesInDOM = [];\n\nfunction getIndexByIdentifier(identifier) {\n  var result = -1;\n\n  for (var i = 0; i < stylesInDOM.length; i++) {\n    if (stylesInDOM[i].identifier === identifier) {\n      result = i;\n      break;\n    }\n  }\n\n  return result;\n}\n\nfunction modulesToDom(list, options) {\n  var idCountMap = {};\n  var identifiers = [];\n\n  for (var i = 0; i < list.length; i++) {\n    var item = list[i];\n    var id = options.base ? item[0] + options.base : item[0];\n    var count = idCountMap[id] || 0;\n    var identifier = \"\".concat(id, \" \").concat(count);\n    idCountMap[id] = count + 1;\n    var indexByIdentifier = getIndexByIdentifier(identifier);\n    var obj = {\n      css: item[1],\n      media: item[2],\n      sourceMap: item[3],\n      supports: item[4],\n      layer: item[5]\n    };\n\n    if (indexByIdentifier !== -1) {\n      stylesInDOM[indexByIdentifier].references++;\n      stylesInDOM[indexByIdentifier].updater(obj);\n    } else {\n      var updater = addElementStyle(obj, options);\n      options.byIndex = i;\n      stylesInDOM.splice(i, 0, {\n        identifier: identifier,\n        updater: updater,\n        references: 1\n      });\n    }\n\n    identifiers.push(identifier);\n  }\n\n  return identifiers;\n}\n\nfunction addElementStyle(obj, options) {\n  var api = options.domAPI(options);\n  api.update(obj);\n\n  var updater = function updater(newObj) {\n    if (newObj) {\n      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {\n        return;\n      }\n\n      api.update(obj = newObj);\n    } else {\n      api.remove();\n    }\n  };\n\n  return updater;\n}\n\nmodule.exports = function (list, options) {\n  options = options || {};\n  list = list || [];\n  var lastIdentifiers = modulesToDom(list, options);\n  return function update(newList) {\n    newList = newList || [];\n\n    for (var i = 0; i < lastIdentifiers.length; i++) {\n      var identifier = lastIdentifiers[i];\n      var index = getIndexByIdentifier(identifier);\n      stylesInDOM[index].references--;\n    }\n\n    var newLastIdentifiers = modulesToDom(newList, options);\n\n    for (var _i = 0; _i < lastIdentifiers.length; _i++) {\n      var _identifier = lastIdentifiers[_i];\n\n      var _index = getIndexByIdentifier(_identifier);\n\n      if (stylesInDOM[_index].references === 0) {\n        stylesInDOM[_index].updater();\n\n        stylesInDOM.splice(_index, 1);\n      }\n    }\n\n    lastIdentifiers = newLastIdentifiers;\n  };\n};\n\n//# sourceURL=webpack://flappy-bird/./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nvar memo = {};\n/* istanbul ignore next  */\n\nfunction getTarget(target) {\n  if (typeof memo[target] === \"undefined\") {\n    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself\n\n    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n      try {\n        // This will throw an exception if access to iframe is blocked\n        // due to cross-origin restrictions\n        styleTarget = styleTarget.contentDocument.head;\n      } catch (e) {\n        // istanbul ignore next\n        styleTarget = null;\n      }\n    }\n\n    memo[target] = styleTarget;\n  }\n\n  return memo[target];\n}\n/* istanbul ignore next  */\n\n\nfunction insertBySelector(insert, style) {\n  var target = getTarget(insert);\n\n  if (!target) {\n    throw new Error(\"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.\");\n  }\n\n  target.appendChild(style);\n}\n\nmodule.exports = insertBySelector;\n\n//# sourceURL=webpack://flappy-bird/./node_modules/style-loader/dist/runtime/insertBySelector.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction insertStyleElement(options) {\n  var element = document.createElement(\"style\");\n  options.setAttributes(element, options.attributes);\n  options.insert(element, options.options);\n  return element;\n}\n\nmodule.exports = insertStyleElement;\n\n//# sourceURL=webpack://flappy-bird/./node_modules/style-loader/dist/runtime/insertStyleElement.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction setAttributesWithoutAttributes(styleElement) {\n  var nonce =  true ? __webpack_require__.nc : 0;\n\n  if (nonce) {\n    styleElement.setAttribute(\"nonce\", nonce);\n  }\n}\n\nmodule.exports = setAttributesWithoutAttributes;\n\n//# sourceURL=webpack://flappy-bird/./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction apply(styleElement, options, obj) {\n  var css = \"\";\n\n  if (obj.supports) {\n    css += \"@supports (\".concat(obj.supports, \") {\");\n  }\n\n  if (obj.media) {\n    css += \"@media \".concat(obj.media, \" {\");\n  }\n\n  var needLayer = typeof obj.layer !== \"undefined\";\n\n  if (needLayer) {\n    css += \"@layer\".concat(obj.layer.length > 0 ? \" \".concat(obj.layer) : \"\", \" {\");\n  }\n\n  css += obj.css;\n\n  if (needLayer) {\n    css += \"}\";\n  }\n\n  if (obj.media) {\n    css += \"}\";\n  }\n\n  if (obj.supports) {\n    css += \"}\";\n  }\n\n  var sourceMap = obj.sourceMap;\n\n  if (sourceMap && typeof btoa !== \"undefined\") {\n    css += \"\\n/*# sourceMappingURL=data:application/json;base64,\".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), \" */\");\n  } // For old IE\n\n  /* istanbul ignore if  */\n\n\n  options.styleTagTransform(css, styleElement, options.options);\n}\n\nfunction removeStyleElement(styleElement) {\n  // istanbul ignore if\n  if (styleElement.parentNode === null) {\n    return false;\n  }\n\n  styleElement.parentNode.removeChild(styleElement);\n}\n/* istanbul ignore next  */\n\n\nfunction domAPI(options) {\n  var styleElement = options.insertStyleElement(options);\n  return {\n    update: function update(obj) {\n      apply(styleElement, options, obj);\n    },\n    remove: function remove() {\n      removeStyleElement(styleElement);\n    }\n  };\n}\n\nmodule.exports = domAPI;\n\n//# sourceURL=webpack://flappy-bird/./node_modules/style-loader/dist/runtime/styleDomAPI.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction styleTagTransform(css, styleElement) {\n  if (styleElement.styleSheet) {\n    styleElement.styleSheet.cssText = css;\n  } else {\n    while (styleElement.firstChild) {\n      styleElement.removeChild(styleElement.firstChild);\n    }\n\n    styleElement.appendChild(document.createTextNode(css));\n  }\n}\n\nmodule.exports = styleTagTransform;\n\n//# sourceURL=webpack://flappy-bird/./node_modules/style-loader/dist/runtime/styleTagTransform.js?");

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _style_index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style/index.css */ \"./src/style/index.css\");\n/* harmony import */ var _modules_Game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/Game */ \"./src/modules/Game.js\");\n\n\n\nnew _modules_Game__WEBPACK_IMPORTED_MODULE_1__.Game();\n\n\n//# sourceURL=webpack://flappy-bird/./src/app.js?");

/***/ }),

/***/ "./src/assets/sprites lazy recursive ^\\.\\/.*\\.png$":
/*!*****************************************************************!*\
  !*** ./src/assets/sprites/ lazy ^\.\/.*\.png$ namespace object ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var map = {\n\t\"./0.png\": [\n\t\t\"./src/assets/sprites/0.png\",\n\t\t\"src_assets_sprites_0_png\"\n\t],\n\t\"./1.png\": [\n\t\t\"./src/assets/sprites/1.png\",\n\t\t\"src_assets_sprites_1_png\"\n\t],\n\t\"./2.png\": [\n\t\t\"./src/assets/sprites/2.png\",\n\t\t\"src_assets_sprites_2_png\"\n\t],\n\t\"./3.png\": [\n\t\t\"./src/assets/sprites/3.png\",\n\t\t\"src_assets_sprites_3_png\"\n\t],\n\t\"./4.png\": [\n\t\t\"./src/assets/sprites/4.png\",\n\t\t\"src_assets_sprites_4_png\"\n\t],\n\t\"./5.png\": [\n\t\t\"./src/assets/sprites/5.png\",\n\t\t\"src_assets_sprites_5_png\"\n\t],\n\t\"./6.png\": [\n\t\t\"./src/assets/sprites/6.png\",\n\t\t\"src_assets_sprites_6_png\"\n\t],\n\t\"./7.png\": [\n\t\t\"./src/assets/sprites/7.png\",\n\t\t\"src_assets_sprites_7_png\"\n\t],\n\t\"./8.png\": [\n\t\t\"./src/assets/sprites/8.png\",\n\t\t\"src_assets_sprites_8_png\"\n\t],\n\t\"./9.png\": [\n\t\t\"./src/assets/sprites/9.png\",\n\t\t\"src_assets_sprites_9_png\"\n\t],\n\t\"./background-day.png\": [\n\t\t\"./src/assets/sprites/background-day.png\"\n\t],\n\t\"./background-night.png\": [\n\t\t\"./src/assets/sprites/background-night.png\",\n\t\t\"src_assets_sprites_background-night_png\"\n\t],\n\t\"./base.png\": [\n\t\t\"./src/assets/sprites/base.png\"\n\t],\n\t\"./bluebird-downflap.png\": [\n\t\t\"./src/assets/sprites/bluebird-downflap.png\",\n\t\t\"src_assets_sprites_bluebird-downflap_png\"\n\t],\n\t\"./bluebird-midflap.png\": [\n\t\t\"./src/assets/sprites/bluebird-midflap.png\",\n\t\t\"src_assets_sprites_bluebird-midflap_png\"\n\t],\n\t\"./bluebird-upflap.png\": [\n\t\t\"./src/assets/sprites/bluebird-upflap.png\",\n\t\t\"src_assets_sprites_bluebird-upflap_png\"\n\t],\n\t\"./gameover.png\": [\n\t\t\"./src/assets/sprites/gameover.png\",\n\t\t\"src_assets_sprites_gameover_png\"\n\t],\n\t\"./message.png\": [\n\t\t\"./src/assets/sprites/message.png\"\n\t],\n\t\"./pipe-green.png\": [\n\t\t\"./src/assets/sprites/pipe-green.png\"\n\t],\n\t\"./pipe-red.png\": [\n\t\t\"./src/assets/sprites/pipe-red.png\",\n\t\t\"src_assets_sprites_pipe-red_png\"\n\t],\n\t\"./redbird-downflap.png\": [\n\t\t\"./src/assets/sprites/redbird-downflap.png\"\n\t],\n\t\"./redbird-midflap.png\": [\n\t\t\"./src/assets/sprites/redbird-midflap.png\"\n\t],\n\t\"./redbird-upflap.png\": [\n\t\t\"./src/assets/sprites/redbird-upflap.png\"\n\t],\n\t\"./yellowbird-downflap.png\": [\n\t\t\"./src/assets/sprites/yellowbird-downflap.png\",\n\t\t\"src_assets_sprites_yellowbird-downflap_png\"\n\t],\n\t\"./yellowbird-midflap.png\": [\n\t\t\"./src/assets/sprites/yellowbird-midflap.png\",\n\t\t\"src_assets_sprites_yellowbird-midflap_png\"\n\t],\n\t\"./yellowbird-upflap.png\": [\n\t\t\"./src/assets/sprites/yellowbird-upflap.png\",\n\t\t\"src_assets_sprites_yellowbird-upflap_png\"\n\t]\n};\nfunction webpackAsyncContext(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\treturn Promise.resolve().then(() => {\n\t\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\t\te.code = 'MODULE_NOT_FOUND';\n\t\t\tthrow e;\n\t\t});\n\t}\n\n\tvar ids = map[req], id = ids[0];\n\treturn Promise.all(ids.slice(1).map(__webpack_require__.e)).then(() => {\n\t\treturn __webpack_require__(id);\n\t});\n}\nwebpackAsyncContext.keys = () => (Object.keys(map));\nwebpackAsyncContext.id = \"./src/assets/sprites lazy recursive ^\\\\.\\\\/.*\\\\.png$\";\nmodule.exports = webpackAsyncContext;\n\n//# sourceURL=webpack://flappy-bird/./src/assets/sprites/_lazy_^\\.\\/.*\\.png$_namespace_object?");

/***/ }),

/***/ "./src/config/index.js":
/*!*****************************!*\
  !*** ./src/config/index.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"config\": () => (/* binding */ config)\n/* harmony export */ });\nconst config = {\n    speed: 4,\n\n    pipe: {\n        distance: 1500,\n        secureSpace: 200,\n    },\n\n    floor: {\n        size: 100,\n    },\n};\n\n\n//# sourceURL=webpack://flappy-bird/./src/config/index.js?");

/***/ }),

/***/ "./src/modules/AudioManager.js":
/*!*************************************!*\
  !*** ./src/modules/AudioManager.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AudioManager\": () => (/* binding */ AudioManager)\n/* harmony export */ });\n/* harmony import */ var _assets_audio_wing_ogg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/audio/wing.ogg */ \"./src/assets/audio/wing.ogg\");\n/* harmony import */ var _assets_audio_hit_ogg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/audio/hit.ogg */ \"./src/assets/audio/hit.ogg\");\n/* harmony import */ var _assets_audio_point_ogg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../assets/audio/point.ogg */ \"./src/assets/audio/point.ogg\");\n/* harmony import */ var _assets_audio_die_ogg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/audio/die.ogg */ \"./src/assets/audio/die.ogg\");\n\n\n\n\n\nclass AudioManager {\n    static flap() {\n        new Audio(_assets_audio_wing_ogg__WEBPACK_IMPORTED_MODULE_0__[\"default\"]).play();\n    }\n\n    static hit() {\n        new Audio(_assets_audio_hit_ogg__WEBPACK_IMPORTED_MODULE_1__[\"default\"]).play();\n    }\n\n    static point() {\n        new Audio(_assets_audio_point_ogg__WEBPACK_IMPORTED_MODULE_2__[\"default\"]).play();\n    }\n\n    static die() {\n        new Audio(_assets_audio_die_ogg__WEBPACK_IMPORTED_MODULE_3__[\"default\"]).play();\n    }\n}\n\n\n\n\n//# sourceURL=webpack://flappy-bird/./src/modules/AudioManager.js?");

/***/ }),

/***/ "./src/modules/CollisionDetector.js":
/*!******************************************!*\
  !*** ./src/modules/CollisionDetector.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CollisionDetector\": () => (/* binding */ CollisionDetector)\n/* harmony export */ });\n/* harmony import */ var collider_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! collider-js */ \"./node_modules/collider-js/index.js\");\n/* harmony import */ var _utils_ColliderUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/ColliderUtils */ \"./src/utils/ColliderUtils.js\");\n\n\n\nclass CollisionDetector {\n    constructor(player, onColide = () => {}) {\n        this.player = player;\n        this.onColide = onColide;\n\n        requestAnimationFrame(this.listenForCollisions.bind(this));\n    }\n\n    listenForCollisions() {\n        const existingPipes = document.querySelectorAll(\".pipe-obstacle\");\n\n        existingPipes.forEach((element) => {\n            if (_utils_ColliderUtils__WEBPACK_IMPORTED_MODULE_1__.ColliderUtils.isCollide(element, this.player.playerElement)) {\n                this.onColide();\n            }\n        });\n\n        const floorElement = document.querySelector(\".floor\");\n\n        if (_utils_ColliderUtils__WEBPACK_IMPORTED_MODULE_1__.ColliderUtils.isCollide(floorElement, this.player.playerElement)) {\n            this.onColide();\n        }\n\n        requestAnimationFrame(this.listenForCollisions.bind(this));\n    }\n}\n\n\n\n\n//# sourceURL=webpack://flappy-bird/./src/modules/CollisionDetector.js?");

/***/ }),

/***/ "./src/modules/Game.js":
/*!*****************************!*\
  !*** ./src/modules/Game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Game\": () => (/* binding */ Game)\n/* harmony export */ });\n/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ \"./src/modules/Player.js\");\n/* harmony import */ var _GameBackground__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GameBackground */ \"./src/modules/GameBackground.js\");\n/* harmony import */ var _PipeGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PipeGenerator */ \"./src/modules/PipeGenerator.js\");\n/* harmony import */ var _CollisionDetector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CollisionDetector */ \"./src/modules/CollisionDetector.js\");\n/* harmony import */ var _PlayerControl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PlayerControl */ \"./src/modules/PlayerControl.js\");\n/* harmony import */ var _AudioManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AudioManager */ \"./src/modules/AudioManager.js\");\n/* harmony import */ var _PointManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./PointManager */ \"./src/modules/PointManager.js\");\n/* harmony import */ var _MenuManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./MenuManager */ \"./src/modules/MenuManager.js\");\n/* harmony import */ var _GameOverlayManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./GameOverlayManager */ \"./src/modules/GameOverlayManager.js\");\n\n\n\n\n\n\n\n\n\n\nclass Game {\n    static isOver = false;\n    static isStarted = false;\n    static canRestart = false;\n\n    constructor() {\n        this.gameContainer = document.querySelector(\"#game\");\n        _MenuManager__WEBPACK_IMPORTED_MODULE_7__.MenuManager.setup();\n\n        this.setupGame();\n    }\n\n    setupGame() {\n        Game.canRestart = false;\n\n        _MenuManager__WEBPACK_IMPORTED_MODULE_7__.MenuManager.showInstructions();\n        _PointManager__WEBPACK_IMPORTED_MODULE_6__.PointManager.setup();\n\n        new _GameBackground__WEBPACK_IMPORTED_MODULE_1__.GameBackground(this.gameContainer);\n\n        this.player = new _Player__WEBPACK_IMPORTED_MODULE_0__.Player(this.gameContainer);\n\n        // only creates a new player control if needed to avoid event listener duplication\n        if (!this.playerControl) {\n            this.playerControl = new _PlayerControl__WEBPACK_IMPORTED_MODULE_4__.PlayerControl(this, this.player);\n        } else {\n            this.playerControl.player = this.player;\n        }\n    }\n\n    startGame() {\n        // reset game status\n        Game.isStarted = true;\n        Game.isOver = false;\n\n        // create the obstables generator\n        new _PipeGenerator__WEBPACK_IMPORTED_MODULE_2__.PipeGenerator(this.gameContainer, this.player);\n\n        // detect game collision\n        new _CollisionDetector__WEBPACK_IMPORTED_MODULE_3__.CollisionDetector(this.player, () => {\n            // set game over\n            if (!Game.isOver) {\n                Game.isOver = true;\n                this.player.overFall();\n\n                _AudioManager__WEBPACK_IMPORTED_MODULE_5__.AudioManager.hit();\n                _AudioManager__WEBPACK_IMPORTED_MODULE_5__.AudioManager.die();\n\n                _GameOverlayManager__WEBPACK_IMPORTED_MODULE_8__.GameOverlayManager.showDieOverlay();\n\n                _MenuManager__WEBPACK_IMPORTED_MODULE_7__.MenuManager.showInstructions();\n\n                clearInterval(_PipeGenerator__WEBPACK_IMPORTED_MODULE_2__.PipeGenerator.generateInterval);\n\n                setTimeout(() => (Game.canRestart = true), 1000);\n            }\n        });\n\n        new _PointManager__WEBPACK_IMPORTED_MODULE_6__.PointManager(this.player);\n    }\n\n    restart() {\n        // delete all existing data from last game\n        document.querySelectorAll(\".pipe-obstacle\").forEach((o) => o.remove());\n        document.querySelector(\".floor\").remove();\n        document.querySelector(\".player\").remove();\n\n        clearInterval(_PipeGenerator__WEBPACK_IMPORTED_MODULE_2__.PipeGenerator.generateInterval);\n\n        // restart the game\n        Game.isOver = false;\n        Game.isStarted = false;\n\n        this.setupGame();\n    }\n}\n\n\n\n\n//# sourceURL=webpack://flappy-bird/./src/modules/Game.js?");

/***/ }),

/***/ "./src/modules/GameBackground.js":
/*!***************************************!*\
  !*** ./src/modules/GameBackground.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GameBackground\": () => (/* binding */ GameBackground)\n/* harmony export */ });\n/* harmony import */ var _assets_sprites_background_day_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/sprites/background-day.png */ \"./src/assets/sprites/background-day.png\");\n/* harmony import */ var _assets_sprites_base_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/sprites/base.png */ \"./src/assets/sprites/base.png\");\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config */ \"./src/config/index.js\");\n/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Game */ \"./src/modules/Game.js\");\n\n\n\n\n\nclass GameBackground {\n    constructor(gameContainer) {\n        this.gameContainer = gameContainer;\n\n        this.setup();\n        requestAnimationFrame(this.startAnimation.bind(this));\n    }\n\n    setup() {\n        // Set game background image\n        this.gameContainer.style.backgroundImage = `url(${_assets_sprites_background_day_png__WEBPACK_IMPORTED_MODULE_0__[\"default\"]})`;\n\n        // Create floor\n        const floor = document.createElement(\"div\");\n        floor.classList.add(\"floor\");\n        floor.style.backgroundImage = `url(${_assets_sprites_base_png__WEBPACK_IMPORTED_MODULE_1__[\"default\"]})`;\n        floor.style.height = `${_config__WEBPACK_IMPORTED_MODULE_2__.config.floor.size}px`;\n\n        this.floor = floor;\n        this.gameContainer.append(floor);\n\n        this.floorPosition = 0;\n        this.backgroundPosition = 0;\n    }\n\n    startAnimation() {\n        if (_Game__WEBPACK_IMPORTED_MODULE_3__.Game.isOver) return;\n\n        this.floorPosition += _config__WEBPACK_IMPORTED_MODULE_2__.config.speed;\n        this.floor.style.backgroundPosition = `${-this.floorPosition}px 0`;\n\n        requestAnimationFrame(this.startAnimation.bind(this));\n    }\n}\n\n\n\n\n//# sourceURL=webpack://flappy-bird/./src/modules/GameBackground.js?");

/***/ }),

/***/ "./src/modules/GameOverlayManager.js":
/*!*******************************************!*\
  !*** ./src/modules/GameOverlayManager.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GameOverlayManager\": () => (/* binding */ GameOverlayManager)\n/* harmony export */ });\n/* harmony import */ var animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! animejs/lib/anime.es.js */ \"./node_modules/animejs/lib/anime.es.js\");\n\n\nclass GameOverlayManager {\n    static showDieOverlay() {\n        (0,animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            targets: \".die-overlay\",\n            keyframes: [{ opacity: 1 }, { opacity: 0 }],\n            duration: 700,\n        });\n    }\n\n    static showReloadOverlay() {\n        (0,animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            targets: \".restart-overlay\",\n            keyframes: [{ opacity: 1 }, { opacity: 0 }],\n            duration: 1500,\n        });\n    }\n}\n\n\n\n\n//# sourceURL=webpack://flappy-bird/./src/modules/GameOverlayManager.js?");

/***/ }),

/***/ "./src/modules/MenuManager.js":
/*!************************************!*\
  !*** ./src/modules/MenuManager.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MenuManager\": () => (/* binding */ MenuManager)\n/* harmony export */ });\n/* harmony import */ var _assets_sprites_message_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/sprites/message.png */ \"./src/assets/sprites/message.png\");\n\n\nclass MenuManager {\n    static setup() {\n        const element = document.createElement(\"img\");\n        element.setAttribute(\"src\", _assets_sprites_message_png__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n        element.classList.add(\"game-instructions\");\n\n        document.querySelector(\"#game\").append(element);\n    }\n\n    static showInstructions() {\n        document.querySelector(\".game-instructions\").style.opacity = 1;\n    }\n\n    static hideInstructions() {\n        document.querySelector(\".game-instructions\").style.opacity = 0;\n    }\n}\n\n\n\n\n//# sourceURL=webpack://flappy-bird/./src/modules/MenuManager.js?");

/***/ }),

/***/ "./src/modules/PipeGenerator.js":
/*!**************************************!*\
  !*** ./src/modules/PipeGenerator.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PipeGenerator\": () => (/* binding */ PipeGenerator)\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ \"./src/config/index.js\");\n/* harmony import */ var _PipeObstacle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PipeObstacle */ \"./src/modules/PipeObstacle.js\");\n\n\n\nclass PipeGenerator {\n    static generateInterval;\n\n    constructor(gameContainer, player) {\n        this.gameContainer = gameContainer;\n        this.player = player;\n\n        this.setup();\n    }\n\n    setup() {\n        // creates the initial pipe\n        new _PipeObstacle__WEBPACK_IMPORTED_MODULE_1__.PipeObstacle(this.gameContainer, this.player);\n\n        // creates pipe each distance seconds\n        PipeGenerator.generateInterval = setInterval(() => new _PipeObstacle__WEBPACK_IMPORTED_MODULE_1__.PipeObstacle(this.gameContainer, this.player), _config__WEBPACK_IMPORTED_MODULE_0__.config.pipe.distance);\n    }\n}\n\n\n\n\n//# sourceURL=webpack://flappy-bird/./src/modules/PipeGenerator.js?");

/***/ }),

/***/ "./src/modules/PipeObstacle.js":
/*!*************************************!*\
  !*** ./src/modules/PipeObstacle.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PipeObstacle\": () => (/* binding */ PipeObstacle)\n/* harmony export */ });\n/* harmony import */ var _assets_sprites_pipe_green_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/sprites/pipe-green.png */ \"./src/assets/sprites/pipe-green.png\");\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ \"./src/config/index.js\");\n/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Game */ \"./src/modules/Game.js\");\n/* harmony import */ var _PointManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PointManager */ \"./src/modules/PointManager.js\");\n\n\n\n\n\nclass PipeObstacle {\n    constructor(gameContainer, player) {\n        this.gameContainer = gameContainer;\n        this.player = player;\n\n        this.setup();\n\n        requestAnimationFrame(this.startMoving.bind(this));\n    }\n\n    setup() {\n        this.pointRecorded = false;\n\n        // Creates the pipe element\n        const topPipe = document.createElement(\"div\");\n        const bottomPipe = document.createElement(\"div\");\n\n        topPipe.classList.add(\"pipe-obstacle\");\n        bottomPipe.classList.add(\"pipe-obstacle\");\n\n        topPipe.classList.add(\"pipe-top\");\n        bottomPipe.classList.add(\"pipe-bottom\");\n\n        topPipe.style.backgroundImage = `url(${_assets_sprites_pipe_green_png__WEBPACK_IMPORTED_MODULE_0__[\"default\"]})`;\n        bottomPipe.style.backgroundImage = `url(${_assets_sprites_pipe_green_png__WEBPACK_IMPORTED_MODULE_0__[\"default\"]})`;\n\n        topPipe.style.transform = \"rotate(180deg)\";\n\n        // Insert the pipe in the game\n        this.gameContainer.append(topPipe);\n        this.gameContainer.append(bottomPipe);\n\n        this.topPipe = topPipe;\n        this.bottomPipe = bottomPipe;\n\n        this.setupPipePosition();\n    }\n\n    setupPipePosition() {\n        const boundingsOffset = 200;\n\n        // Creates the position for the pipe\n        let pipeHeight = Math.random() * (window.innerHeight - _config__WEBPACK_IMPORTED_MODULE_1__.config.floor.size - boundingsOffset);\n\n        if (pipeHeight < boundingsOffset) {\n            pipeHeight = boundingsOffset;\n        }\n\n        this.topPipe.style.height = `${pipeHeight}px`;\n        this.bottomPipe.style.height = `${window.innerHeight - pipeHeight - _config__WEBPACK_IMPORTED_MODULE_1__.config.pipe.secureSpace}px`;\n\n        this.topPipe.style.top = \"0px\";\n        this.bottomPipe.style.bottom = \"0px\";\n\n        // Creates pipe horizontal position\n        this.position = window.innerWidth;\n\n        this.bottomPipe.style.left = `${this.position}px`;\n        this.topPipe.style.left = `${this.position}px`;\n    }\n\n    startMoving() {\n        if (_Game__WEBPACK_IMPORTED_MODULE_2__.Game.isOver) return;\n\n        this.position -= _config__WEBPACK_IMPORTED_MODULE_1__.config.speed;\n\n        this.bottomPipe.style.left = `${this.position}px`;\n        this.topPipe.style.left = `${this.position}px`;\n\n        if (this.position < this.player.playerElement.getBoundingClientRect().left && !this.pointRecorded) {\n            _PointManager__WEBPACK_IMPORTED_MODULE_3__.PointManager.addPoint();\n            this.pointRecorded = true;\n        }\n\n        requestAnimationFrame(this.startMoving.bind(this));\n    }\n}\n\n\n\n\n//# sourceURL=webpack://flappy-bird/./src/modules/PipeObstacle.js?");

/***/ }),

/***/ "./src/modules/Player.js":
/*!*******************************!*\
  !*** ./src/modules/Player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Player\": () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! animejs/lib/anime.es.js */ \"./node_modules/animejs/lib/anime.es.js\");\n/* harmony import */ var debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! debounce */ \"./node_modules/debounce/index.js\");\n/* harmony import */ var debounce__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debounce__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _assets_sprites_redbird_midflap_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../assets/sprites/redbird-midflap.png */ \"./src/assets/sprites/redbird-midflap.png\");\n/* harmony import */ var _assets_sprites_redbird_upflap_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/sprites/redbird-upflap.png */ \"./src/assets/sprites/redbird-upflap.png\");\n/* harmony import */ var _assets_sprites_redbird_downflap_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../assets/sprites/redbird-downflap.png */ \"./src/assets/sprites/redbird-downflap.png\");\n/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Game */ \"./src/modules/Game.js\");\n/* harmony import */ var _AudioManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AudioManager */ \"./src/modules/AudioManager.js\");\n\n\n\n\n\n\n\n\n\nconst FLAP_STATES = {\n    UP: 0,\n    DOWN: 1,\n    MID: 2,\n};\n\nclass Player {\n    playerElement = null;\n\n    constructor(gameContainer) {\n        this.gameContainer = gameContainer;\n        this.setup();\n        this.setupAnimation();\n    }\n\n    flap() {\n        if (_Game__WEBPACK_IMPORTED_MODULE_5__.Game.isOver) return;\n\n        if (this.topPosition <= 0) return;\n\n        _AudioManager__WEBPACK_IMPORTED_MODULE_6__.AudioManager.flap();\n\n        this.playerElement.style.animation = \"none\";\n        this.flapState = FLAP_STATES.DOWN;\n        this.topPosition = this.topPosition - 9;\n\n        // Stops previous actions if exists\n        this.fallAnimation?.pause();\n        this.flapAnimation?.pause();\n        this.fallRotateAnimation?.pause();\n\n        // Debounce fall to fall bird after the last flap only\n        if (!this.debouncedFall) {\n            this.debouncedFall = (0,debounce__WEBPACK_IMPORTED_MODULE_1__.debounce)(this.beginFall.bind(this), 200);\n        }\n\n        // Creates animation to flap the bird\n        this.flapAnimation = (0,animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            targets: this.playerElement,\n            top: {\n                value: this.topPosition + \"%\",\n                duration: 1000,\n            },\n            rotate: {\n                value: -30,\n                duration: 300,\n            },\n            begin: this.debouncedFall,\n        });\n    }\n\n    beginFall() {\n        if (_Game__WEBPACK_IMPORTED_MODULE_5__.Game.isOver) return;\n\n        this.flapAnimation?.pause();\n        this.fallRotateAnimation?.pause();\n\n        // Creates animation to fall bird\n        this.fallAnimation = (0,animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            targets: this.playerElement,\n            top: {\n                value: \"83%\",\n                duration: 9000,\n            },\n            update: (anim) => {\n                this.topPosition = Number(this.playerElement.style.top.toString().replace(\"%\", \"\"));\n            },\n        });\n\n        this.fallRotateAnimation = (0,animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            targets: this.playerElement,\n            rotate: { value: 70, duration: 600 },\n            easing: \"easeInOutCubic\",\n            delay: 100,\n        });\n\n        // Removes the fall debounce\n        this.debouncedFall = null;\n    }\n\n    setup() {\n        // Creates the player bird and defines its default position\n        const element = document.createElement(\"div\");\n        element.style.backgroundImage = `url(${_assets_sprites_redbird_downflap_png__WEBPACK_IMPORTED_MODULE_4__[\"default\"]})`;\n        element.classList.add(\"player\");\n\n        this.topPosition = 40;\n        element.style.top = this.topPosition + \"%\";\n        element.style.left = \"20%\";\n\n        // Add player to the container\n        this.playerElement = element;\n        this.gameContainer.append(element);\n    }\n\n    setupAnimation() {\n        this.flapState = FLAP_STATES.MID;\n\n        // Animates the bird flaps\n        this.flatAnimationInterval = setInterval(() => {\n            if (this.flapState === FLAP_STATES.MID) {\n                this.flapState = FLAP_STATES.UP;\n            } else if (this.flapState === FLAP_STATES.DOWN) {\n                this.flapState = FLAP_STATES.MID;\n            } else if (this.flapState === FLAP_STATES.UP) {\n                this.flapState = FLAP_STATES.DOWN;\n            }\n\n            this.renderFlapState();\n        }, 100);\n    }\n\n    renderFlapState() {\n        const FlapImages = {\n            [FLAP_STATES.DOWN]: _assets_sprites_redbird_downflap_png__WEBPACK_IMPORTED_MODULE_4__[\"default\"],\n            [FLAP_STATES.UP]: _assets_sprites_redbird_upflap_png__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n            [FLAP_STATES.MID]: _assets_sprites_redbird_midflap_png__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n        };\n\n        this.playerElement.style.backgroundImage = `url(${FlapImages[this.flapState]})`;\n    }\n\n    overFall() {\n        clearInterval(this.flatAnimationInterval);\n\n        this.fallAnimation?.pause();\n        this.flapAnimation?.pause();\n        this.fallRotateAnimation?.pause();\n\n        (0,animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            targets: this.playerElement,\n            top: `85%`,\n            rotate: {\n                value: 90,\n                duration: 50,\n            },\n            duration: 300,\n            easing: \"linear\",\n        });\n    }\n}\n\n\n\n\n//# sourceURL=webpack://flappy-bird/./src/modules/Player.js?");

/***/ }),

/***/ "./src/modules/PlayerControl.js":
/*!**************************************!*\
  !*** ./src/modules/PlayerControl.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PlayerControl\": () => (/* binding */ PlayerControl)\n/* harmony export */ });\n/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game */ \"./src/modules/Game.js\");\n/* harmony import */ var _GameOverlayManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GameOverlayManager */ \"./src/modules/GameOverlayManager.js\");\n/* harmony import */ var _MenuManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MenuManager */ \"./src/modules/MenuManager.js\");\n/* harmony import */ var _utils_AgentUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/AgentUtils */ \"./src/utils/AgentUtils.js\");\n\n\n\n\n\nclass PlayerControl {\n    static listenersWasSet = false;\n\n    constructor(game, player) {\n        this.game = game;\n        this.player = player;\n\n        if (_utils_AgentUtils__WEBPACK_IMPORTED_MODULE_3__.AgentUtils.isMobile()) {\n            document.addEventListener(\"touchstart\", () => this.handleAction());\n        } else {\n            document.addEventListener(\"click\", () => this.handleAction());\n            document.addEventListener(\"keydown\", () => this.handleAction());\n        }\n    }\n\n    handleAction() {\n        // starts a new game\n        if (!_Game__WEBPACK_IMPORTED_MODULE_0__.Game.isStarted && !_Game__WEBPACK_IMPORTED_MODULE_0__.Game.isOver) {\n            _MenuManager__WEBPACK_IMPORTED_MODULE_2__.MenuManager.hideInstructions();\n            this.game.startGame();\n            return this.player.flap();\n        }\n\n        // flaps the user\n        if (!_Game__WEBPACK_IMPORTED_MODULE_0__.Game.isOver) {\n            // flap and hide the instructions\n            this.player.flap();\n            return _MenuManager__WEBPACK_IMPORTED_MODULE_2__.MenuManager.hideInstructions();\n        }\n\n        // restarts the game\n        if (_Game__WEBPACK_IMPORTED_MODULE_0__.Game.canRestart) {\n            // restart game if the game is over\n            _GameOverlayManager__WEBPACK_IMPORTED_MODULE_1__.GameOverlayManager.showReloadOverlay();\n            setTimeout(() => this.game.restart(), 500);\n        }\n    }\n}\n\n\n\n\n//# sourceURL=webpack://flappy-bird/./src/modules/PlayerControl.js?");

/***/ }),

/***/ "./src/modules/PointManager.js":
/*!*************************************!*\
  !*** ./src/modules/PointManager.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PointManager\": () => (/* binding */ PointManager)\n/* harmony export */ });\n/* harmony import */ var _AudioManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioManager */ \"./src/modules/AudioManager.js\");\n\n\nclass PointManager {\n    static totalPoints = 0;\n\n    static setup() {\n        PointManager.totalPoints = 0;\n        this.renderPoints();\n    }\n\n    static async addPoint() {\n        _AudioManager__WEBPACK_IMPORTED_MODULE_0__.AudioManager.point();\n        PointManager.totalPoints++;\n\n        this.renderPoints();\n    }\n\n    static async renderPoints() {\n        const pointsContainer = document.querySelector(\".points-container\");\n\n        const pointsChar = this.totalPoints.toString().split(\"\");\n        const pointsSprites = await Promise.all(pointsChar.map((p) => __webpack_require__(\"./src/assets/sprites lazy recursive ^\\\\.\\\\/.*\\\\.png$\")(`./${p}.png`)));\n\n        pointsContainer.innerHTML = \"\";\n\n        pointsSprites.forEach((sprite) => {\n            const pointImage = document.createElement(\"img\");\n            pointImage.setAttribute(\"src\", sprite.default);\n\n            pointsContainer.append(pointImage);\n        });\n    }\n}\n\n\n\n\n//# sourceURL=webpack://flappy-bird/./src/modules/PointManager.js?");

/***/ }),

/***/ "./src/utils/AgentUtils.js":
/*!*********************************!*\
  !*** ./src/utils/AgentUtils.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AgentUtils\": () => (/* binding */ AgentUtils)\n/* harmony export */ });\nconst AgentUtils = {\n    isMobile() {\n        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);\n    },\n};\n\n\n//# sourceURL=webpack://flappy-bird/./src/utils/AgentUtils.js?");

/***/ }),

/***/ "./src/utils/ColliderUtils.js":
/*!************************************!*\
  !*** ./src/utils/ColliderUtils.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ColliderUtils\": () => (/* binding */ ColliderUtils)\n/* harmony export */ });\nconst ColliderUtils = {\n    isCollide(a, b) {\n        const aRect = a.getBoundingClientRect();\n        let bRect = b.getBoundingClientRect();\n\n        return !(aRect.top + aRect.height < bRect.top + 15 || aRect.top > bRect.top + bRect.height - 10 || aRect.left + aRect.width < bRect.left + 30 || aRect.left > bRect.left + bRect.width - 20);\n    },\n};\n\n\n//# sourceURL=webpack://flappy-bird/./src/utils/ColliderUtils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".main.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "flappy-bird:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkflappy_bird"] = self["webpackChunkflappy_bird"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.js");
/******/ 	
/******/ })()
;