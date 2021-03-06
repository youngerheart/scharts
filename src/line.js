var createElement = function(name, obj, html) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (var key in obj) {
    el.setAttribute(key, obj[key]);
  }
  if (html || !isNaN(html)) el.innerHTML = html;
  return el;
};

var toFixed = function(num) {
  var numArr = num.toString().split('.');
  if (numArr[1] && (numArr[1].length + numArr[0].length > 4)) {
    if (numArr[0].length < 4) num = num.toFixed(4 - numArr[0].length);
    else num = parseInt(num, 10);
  } else num.toFixed(4);
  return num;
};

var line = function(el, config) {
  this.el = el;
  this.config = config;
  this.svg = createElement('svg', {
    width: el.offsetWidth,
    height: el.offsetHeight
  });
};

line.prototype.render = function(data) {
  var el = this.el;
  var config = this.config;
  var svg = this.svg;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  // 得到数据区间
  if (data) {
    var num = Object.keys(data).length;
    if (!num) return;
    var xArr = [];
    var yArr = [];
    var points = [];
    for (var key in data) {
      xArr.push(key);
      yArr.push(Number(data[key]));
    }
    var min = Math.min.apply(null, yArr);
    var max = Math.max.apply(null, yArr);
    num--;
    var xIndexConf = config.xIndex || {};
    var yIndexConf = config.yIndex || {};
    var yIndex = yIndexConf.num - 1 || 3;
    var xInterval = num ? (el.offsetWidth - 120) / num : 0;
    var yInterval = (el.offsetHeight - (min ? 100 : 70)) / yIndex;
    // 若有小数，保留6位有效数字
    yInterval = toFixed(yInterval);
    var drewYLine = function(yNum) {
      // y轴文字
      svg.appendChild(createElement('text', {
        'text-anchor': 'end',
        'alignment-baseline': 'middle',
        'font-size': 12,
        fill: '#999',
        x: 60,
        y: yNum
      }, max - min ? toFixed(min + (max - min) / yIndex * (yIndex - i)) : max));
      // y轴线
      if (yIndexConf.line === false) return;
      svg.appendChild(createElement('line', {
        x1: 70,
        x2: el.offsetWidth,
        y1: yNum,
        y2: yNum,
        stroke: '#ccc',
        'stroke-width': 1
      }));
    };
    if (min !== max) {
      for (var i = yIndex; i > -1 ; i--) {
        drewYLine(i * yInterval + 20);
      }
    } else {
      drewYLine(el.offsetHeight / 2);
    }
    var trans = (el.offsetHeight - (min ? 100 : 70)) / (max - min);
    var line = config.line || {};
    var linePoint = line.point || {};
    var circles = [];
    var xOffset = 0;
    xArr.forEach(function(item, index) {
      var xIndex = xInterval ? 100 + xInterval * index : el.offsetWidth / 2;
      var yIndex = min === max ? el.offsetHeight / 2 : (el.offsetHeight - (min ? 80 : 50) - trans * (yArr[index] - min));
      points.push(xIndex + ',' + yIndex);
      if (linePoint) {
        circles.push(createElement('circle', {
          cx: xIndex,
          cy: yIndex,
          r: linePoint.radius || 4,
          stroke: line.color || '#ccc',
          'stroke-width': 2,
          fill: line.fill ? line.color || '#ccc' : '#fff'
        }));
      }
      xOffset += xInterval;
      if (index === 0 || xOffset > item.length * 12) {
        xOffset = 0;
        svg.appendChild(createElement('text', {
          'text-anchor': 'middle',
          'alignment-baseline': 'hanging',
          'font-size': 12,
          fill: '#999',
          x: xIndex,
          y: el.offsetHeight - 40
        }, item));
      }
      // y轴线
      if (xIndexConf.line === false) return;
      svg.appendChild(createElement('line', {
        x1: xIndex,
        x2: xIndex,
        y1: 0,
        y2: el.offsetHeight - 40,
        stroke: '#ccc',
        'stroke-width': 1
      }));
    });
    var polyline = createElement('polyline', {
      points: points.join(' '),
      fill: 'none',
      stroke: line.color || '#ccc',
      'stroke-width': line.width || 2
    });
    // xy坐标轴
    svg.appendChild(createElement('polyline', {
      points: '70,0 70,' + (el.offsetHeight - 50) + ' ' + el.offsetWidth + ',' + (el.offsetHeight - 50),
      fill: 'none',
      stroke: '#999',
      'stroke-width': 3
    }));
    svg.appendChild(polyline);
    circles.forEach(function(circle) {
      svg.appendChild(circle);
    });
  }

  if (!el.hasChildNodes()) el.appendChild(svg);
};

if (typeof module !== 'undefined') module.exports = line;
else if (typeof schart !== 'undefined') schart.line = line;
