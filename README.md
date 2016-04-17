# charts
simple svg charts.

### usage

Include js in `/src` by tag, or

```
require('scharts')(['line', ...]);
```

```
var lineEl = document.getElementById('line');
new schart(lineEl, {
  type: 'line',
  xIndex: {
    line: false
  },
  yIndex: {
    num: 5
  },
  line: {
    point: {
      fill: false,
      radius: 4
    },
    width: 4,
    color: '#ccc'
  },
  data: {
    '02-18': 0,
    '02-19': 234,
    '02-20': 634,
    '02-21': 154,
    '02-22': 164
  }
});
```
