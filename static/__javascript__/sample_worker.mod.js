	(function () {
		var __symbols__ = ['__esv5__'];
		var grid = list ([list ([list ([1, 0, 0, 0, 0, 0, 0, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0])]), list ([list ([0, 0, 0, 0, 1, 0, 0, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([1, 0, 0, 0, 1, 0, 0, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0])]), list ([list ([0, 0, 1, 0, 0, 0, 1, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([1, 0, 1, 0, 1, 0, 1, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([0, 0, 1, 0, 0, 0, 1, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0]), list ([1, 0, 1, 0, 1, 0, 1, 0]), list ([0, 0, 0, 0, 0, 0, 0, 0])]), list ([list ([0, 1, 0, 1, 0, 1, 0, 1]), list ([1, 1, 1, 1, 1, 1, 1, 1]), list ([0, 1, 0, 1, 0, 1, 0, 1]), list ([1, 1, 1, 1, 1, 1, 1, 1]), list ([0, 1, 0, 0, 0, 1, 0, 1]), list ([1, 1, 1, 1, 1, 1, 1, 1]), list ([0, 1, 0, 1, 0, 1, 0, 1]), list ([1, 1, 1, 1, 1, 1, 1, 1])])]);
		var mandel = function (width, height, max_iter, left, top, right, bottom) {
			var fx = (right - left) / width;
			var fy = (top - bottom) / height;
			for (var g = 0; g < 4; g++) {
				var __iterable0__ = range (0, height, 1 << 3 - g);
				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
					var y = __iterable0__ [__index0__];
					var buffer = list ([]);
					for (var x = 0; x < width; x++) {
						if (!(grid [g] [y % 8] [x % 8] == 1)) {
							continue;
						}
						var cr = left + x * fx;
						var ci = top - y * fy;
						var zr = cr;
						var zi = ci;
						var color = 0;
						for (var i = 1; i < max_iter; i++) {
							var tmp = zr;
							var zr = (zr * zr - zi * zi) + cr;
							var zi = (2 * tmp) * zi + ci;
							if (zr * zr + zi * zi > 4) {
								var color = i;
								break;
							}
						}
						buffer.append (dict ({'x': x, 'y': y, 'c': color, 'size': 1 << 3 - g}));
					}
					postMessage (buffer);
				}
			}
		};
		var on_message = function (e) {
			var data = e.data;
			if (data.cmd == 'start') {
				console.log ('Worker started!');
				console.log ('width={}'.format (data.width));
				console.log ('height={}'.format (data.height));
				console.log ('max_iter={}'.format (data.max_iter));
				mandel (data.width, data.height, data.max_iter, data.left, data.top, data.right, data.bottom);
				console.log ('Worker finished!');
			}
			else {
				console.log ('Unknown command!');
			}
		};
		addEventListener ('message', on_message);
		__pragma__ ('<all>')
			__all__.grid = grid;
			__all__.mandel = mandel;
			__all__.on_message = on_message;
		__pragma__ ('</all>')
	}) ();

