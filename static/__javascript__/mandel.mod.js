	(function () {
		var __symbols__ = ['__esv5__'];
		var cos = __init__ (__world__.math).cos;
		var log = __init__ (__world__.math).log;
		var sqrt = __init__ (__world__.math).sqrt;
		var pi = __init__ (__world__.math).pi;
		var rgb = function (r, g, b) {
			var _hex = function (x) {
				var _SYM_ = '0123456789abcdef';
				var res = list (['0', '0']);
				for (var i = 0; i < 2; i++) {
					var __left0__ = tuple ([Math.floor (x / 16), x % 16]);
					var x = __left0__ [0];
					var r = __left0__ [1];
					res [1 - i] = _SYM_ [r];
				}
				return ''.join (res);
			};
			return '#{0}{1}{2}'.format (_hex (r), _hex (g), _hex (b));
		};
		var Mandel = __class__ ('Mandel', [object], {
			get __init__ () {return __get__ (this, function (self) {
				// pass;
			});},
			get reset () {return __get__ (this, function (self) {
				if (self.canvas.width <= self.canvas.height) {
					self.mandel_left = -(2);
					self.mandel_top = (2.5 * (self.canvas.height / self.canvas.width)) / 2;
					self.mandel_right = 0.5;
					self.mandel_bottom = -(self.mandel_top);
				}
				else {
					self.mandel_left = -(2.5 * (self.canvas.width / self.canvas.height)) * (3 / 5);
					self.mandel_top = 1.25;
					self.mandel_right = (2.5 * (self.canvas.width / self.canvas.height)) * (2 / 5);
					self.mandel_bottom = -(1.25);
				}
			});},
			get startup () {return __get__ (this, function (self) {
				print ("let's go!");
				self.resizing = 0;
				self.action = null;
				self.worker = new Worker ('__javascript__/sample_worker.js');
				self.worker.onmessage = self.on_message;
				self.py_selector = document.getElementById ('selector');
				self.container = document.getElementById ('container');
				self.canvas = document.getElementById ('mandelbrot');
				self.canvas.width = self.container.offsetWidth;
				self.canvas.height = self.container.offsetHeight;
				self.canvas.style.width = '{}px'.format (self.canvas.width);
				self.canvas.style.height = '{}px'.format (self.canvas.height);
				self.ctx = self.canvas.getContext ('2d');
				self.reset ();
				document.getElementById ('container').onmousedown = self.on_mousedown;
				document.getElementById ('container').onmousemove = self.on_mousemove;
				document.getElementById ('container').onmouseup = self.on_mouseup;
				document.getElementById ('container').ontouchstart = self.on_touchstart;
				document.getElementById ('container').ontouchmove = self.on_touchmove;
				document.getElementById ('container').ontouchend = self.on_touchend;
			});},
			get drawPixel () {return __get__ (this, function (self, x, y, c, size) {
				self.ctx.fillStyle = c;
				self.ctx.fillRect (int (x * self.ratio), int (y * self.ratio), int (size * self.ratio), int (size * self.ratio));
			});},
			get getColor () {return __get__ (this, function (self, c) {
				if (c == 0) {
					return tuple ([0, 0, 0]);
				}
				var r = int ((255 * (1 + cos (sqrt (sqrt (c))))) / 2);
				var g = int ((255 * (1 + cos (sqrt (sqrt (2 * c))))) / 2);
				var b = int ((255 * (1 + cos (sqrt (sqrt (3 * c) + pi / 4)))) / 2);
				return tuple ([r, g, b]);
			});},
			get updateProgress () {return __get__ (this, function (self) {
				var progress = int ((((100 * (8 / 15)) * (self.rows_done + 1)) / self.canvas.height) * self.ratio);
				document.getElementById ('progress-bar').style.width = '{}%'.format (progress);
			});},
			get on_message () {return __get__ (this, function (self, e) {
				self.rows_done++;
				self.updateProgress ();
				var __iterable0__ = e.data;
				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
					var p = __iterable0__ [__index0__];
					var __left0__ = self.getColor (p.c);
					var r = __left0__ [0];
					var g = __left0__ [1];
					var b = __left0__ [2];
					self.drawPixel (p.x, p.y, rgb (r, g, b), p.size);
				}
			});},
			get draw () {return __get__ (this, function (self) {
				self.action = null;
				self.ratio = int (document.getElementById ('txt_width').value);
				self.max_iter = 1 << int (document.getElementById ('txt_max_iter').value);
				if (self.py_selector.style.visibility == 'visible') {
					self.define_selection ();
					self.py_selector.style.visibility = 'hidden';
				}
				print (self.width, self.ratio, self.max_iter);
				print (self.mandel_left, self.mandel_top, self.mandel_right, self.mandel_bottom);
				self.rows_done = 0;
				self.updateProgress ();
				self.worker.postMessage (dict ({'cmd': 'start', 'width': int (self.canvas.width / self.ratio), 'height': int (self.canvas.height / self.ratio), 'max_iter': self.max_iter, 'left': self.mandel_left, 'top': self.mandel_top, 'right': self.mandel_right, 'bottom': self.mandel_bottom}));
			});},
			get define_selection () {return __get__ (this, function (self) {
				var deltaX = self.mandel_right - self.mandel_left;
				var deltaY = self.mandel_top - self.mandel_bottom;
				var deltaSelX = self.r - self.l;
				var deltaSelY = self.b - self.t;
				if (self.canvas.width <= self.canvas.height) {
					self.t -= ((self.canvas.height / self.canvas.width - 1) * deltaSelY) / 2;
					self.b += ((self.canvas.height / self.canvas.width - 1) * deltaSelY) / 2;
				}
				else {
					self.l -= ((self.canvas.width / self.canvas.height - 1) * deltaSelX) / 2;
					self.r += ((self.canvas.width / self.canvas.height - 1) * deltaSelX) / 2;
				}
				var __left0__ = tuple ([self.mandel_left + (deltaX * self.l) / self.canvas.width, self.mandel_top - (deltaY * self.t) / self.canvas.height, self.mandel_left + (deltaX * self.r) / self.canvas.width, self.mandel_top - (deltaY * self.b) / self.canvas.height]);
				self.mandel_left = __left0__ [0];
				self.mandel_top = __left0__ [1];
				self.mandel_right = __left0__ [2];
				self.mandel_bottom = __left0__ [3];
				print (self.mandel_left, self.mandel_top, self.mandel_right, self.mandel_bottom);
			});},
			get place_selector () {return __get__ (this, function (self, x, y) {
				self.action = 'select';
				var __left0__ = tuple ([x - 30, y - 30]);
				self.l = __left0__ [0];
				self.t = __left0__ [1];
				var __left0__ = tuple ([x + 30, y + 30]);
				self.r = __left0__ [0];
				self.b = __left0__ [1];
				self.baseX = int (self.r + self.l) / 2;
				self.baseY = int (self.b + self.t) / 2;
				var deltaX = max (0, -(self.l)) + min (0, self.canvas.width - self.r);
				var deltaY = max (0, -(self.t)) + min (0, self.canvas.height - self.b);
				self.l += deltaX;
				self.r += deltaY;
				self.t += deltaY;
				self.b += deltaY;
				self.py_selector.style.visibility = 'visible';
				self.py_selector.style.left = '{}px'.format (self.l);
				self.py_selector.style.top = '{}px'.format (self.t);
				self.py_selector.style.width = '{}px'.format ((self.r - self.l) + 1);
				self.py_selector.style.height = '{}px'.format ((self.b - self.t) + 1);
			});},
			get move_selector () {return __get__ (this, function (self, x, y) {
				var deltaX = x - self.baseX;
				var deltaY = y - self.baseY;
				if (self.l + deltaX < 0) {
					var deltaX = self.l;
				}
				if (self.r + deltaX >= self.canvas.width) {
					var deltaX = self.canvas.width - self.r;
				}
				if (self.t + deltaY < 0) {
					var deltaY = self.t;
				}
				if (self.b + deltaY >= self.canvas.height) {
					var deltaY = self.canvas.height - self.b;
				}
				self.l += deltaX;
				self.r += deltaX;
				self.baseX += deltaX;
				self.t += deltaY;
				self.b += deltaY;
				self.baseY += deltaY;
				self.py_selector.style.left = '{}px'.format (self.l);
				self.py_selector.style.top = '{}px'.format (self.t);
				self.py_selector.style.width = '{}px'.format ((self.r - self.l) + 1);
				self.py_selector.style.height = '{}px'.format ((self.b - self.t) + 1);
			});},
			get resize_selector () {return __get__ (this, function (self, dir, x, y) {
				var sign = function (x) {
					return (x >= 0 ? 1 : -(1));
				};
				var adjust = function (dx, dy, esx, esy) {
					var __left0__ = tuple ([min (abs (dx), abs (dy)), sign (dx), sign (dy)]);
					var d = __left0__ [0];
					var sx = __left0__ [1];
					var sy = __left0__ [2];
					if (sx * sy == esx * esy) {
						return tuple ([d * sx, d * sy]);
					}
					else {
						return tuple ([0, 0]);
					}
				};
				if (dir == 'NW') {
					var deltaX = x - self.l;
					var deltaY = y - self.t;
					console.log ('NW (0): deltaX={}, deltaY={}'.format (deltaX, deltaY));
					if (self.l + deltaX < 0) {
						var deltaX = self.l;
					}
					if (self.l + deltaX >= self.r - 30) {
						var deltaX = (self.r - self.l) - 30;
					}
					if (self.t + deltaY < 0) {
						var deltaY = self.t;
					}
					if (self.t + deltaY >= self.b - 30) {
						var deltaY = (self.b - self.t) - 30;
					}
					console.log ('NW (1): deltaX={}, deltaY={}'.format (deltaX, deltaY));
					var __left0__ = adjust (deltaX, deltaY, -(1), -(1));
					var deltaX = __left0__ [0];
					var deltaY = __left0__ [1];
					console.log ('NW (2): deltaX={}, deltaY={}'.format (deltaX, deltaY));
					self.l += deltaX;
					self.t += deltaY;
				}
				else {
					if (dir == 'NE') {
						var deltaX = x - self.r;
						var deltaY = y - self.t;
						if (self.r + deltaX >= self.canvas.width) {
							var deltaX = self.canvas.width - self.r;
						}
						if (self.r + deltaX <= self.l + 30) {
							var deltaX = (self.l + 30) - self.r;
						}
						if (self.t + deltaY < 0) {
							var deltaY = self.t;
						}
						if (self.t + deltaY >= self.b - 30) {
							var deltaY = (self.b - 30) - self.t;
						}
						var __left0__ = adjust (deltaX, deltaY, 1, -(1));
						var deltaX = __left0__ [0];
						var deltaY = __left0__ [1];
						self.r += deltaX;
						self.t += deltaY;
					}
					else {
						if (dir == 'SW') {
							var deltaX = x - self.l;
							var deltaY = y - self.b;
							if (self.l + deltaX < 0) {
								var deltaX = self.l;
							}
							if (self.l + deltaX >= self.r - 30) {
								var deltaX = (self.r - self.l) - 30;
							}
							if (self.b + deltaY <= self.t + 30) {
								var deltaY = (self.t + 30) - self.b;
							}
							if (self.b + deltaY >= self.canvas.height) {
								var deltaY = self.canvas.height - self.b;
							}
							var __left0__ = adjust (deltaX, deltaY, -(1), 1);
							var deltaX = __left0__ [0];
							var deltaY = __left0__ [1];
							self.l += deltaX;
							self.b += deltaY;
						}
						else {
							if (dir == 'SE') {
								var deltaX = x - self.r;
								var deltaY = y - self.b;
								if (self.r + deltaX >= self.canvas.width) {
									var deltaX = self.canvas.width - self.r;
								}
								if (self.r + deltaX <= self.l + 30) {
									var deltaX = (self.l + 30) - self.r;
								}
								if (self.b + deltaY <= self.t + 30) {
									var deltaY = (self.t + 30) - self.b;
								}
								if (self.b + deltaY >= self.canvas.height) {
									var deltaY = self.canvas.height - self.b;
								}
								var __left0__ = adjust (deltaX, deltaY, 1, 1);
								var deltaX = __left0__ [0];
								var deltaY = __left0__ [1];
								self.r += deltaX;
								self.b += deltaY;
							}
						}
					}
				}
				self.baseX = int (self.r + self.l) / 2;
				self.baseY = int (self.b + self.t) / 2;
				self.py_selector.style.left = '{}px'.format (self.l);
				self.py_selector.style.top = '{}px'.format (self.t);
				self.py_selector.style.width = '{}px'.format ((self.r - self.l) + 1);
				self.py_selector.style.height = '{}px'.format ((self.b - self.t) + 1);
			});},
			get __selector_start_event () {return __get__ (this, function (self, target, x, y) {
				if (target == 'mandelbrot') {
					if (self.action === null) {
						self.place_selector (x, y);
					}
				}
				else {
					if (self.action == 'select') {
						if ((self.baseX - 10 <= x && x <= self.baseX + 10) && (self.baseY - 10 <= y && y <= self.baseY + 10)) {
							self.action = 'moving';
						}
						else {
							if ((self.l <= x && x <= self.l + 20)) {
								if ((self.t <= y && y <= self.t + 20)) {
									self.action = 'resize-NW';
								}
								else {
									if ((self.b - 20 <= y && y <= self.b)) {
										self.action = 'resize-SW';
									}
								}
							}
							else {
								if ((self.r - 20 <= x && x <= self.r)) {
									if ((self.t <= y && y <= self.t + 20)) {
										self.action = 'resize-NE';
									}
									else {
										if ((self.b - 20 <= y && y <= self.b)) {
											self.action = 'resize-SE';
										}
									}
								}
							}
						}
					}
				}
			});},
			get __selector_move_event () {return __get__ (this, function (self, x, y) {
				if (self.action !== null) {
					if (self.action == 'moving') {
						self.move_selector (x, y);
						return false;
					}
					else {
						if (self.action.startswith ('resize-')) {
							self.resize_selector (self.action.__getslice__ (-(2), null, 1), x, y);
							return false;
						}
					}
				}
			});},
			get __selector_end_event () {return __get__ (this, function (self) {
				if (self.action !== null && (self.action == 'moving' || self.action.startsWith ('resize-'))) {
					self.action = 'select';
					return false;
				}
			});},
			get on_mousedown () {return __get__ (this, function (self, e) {
				self.__selector_start_event (e.target.id, e.clientX, e.clientY);
			});},
			get on_touchstart () {return __get__ (this, function (self, e) {
				self.__selector_start_event (e.target.id, e.targetTouches [0].clientX, e.targetTouches [0].clientY);
			});},
			get on_mousemove () {return __get__ (this, function (self, e) {
				var ret = self.__selector_move_event (e.clientX, e.clientY);
				if (ret === false) {
					return false;
				}
			});},
			get on_touchmove () {return __get__ (this, function (self, e) {
				var ret = self.__selector_move_event (e.targetTouches [0].clientX, e.targetTouches [0].clientY);
				if (ret === false) {
					return false;
				}
			});},
			get on_mouseup () {return __get__ (this, function (self, e) {
				var ret = self.__selector_end_event ();
				if (ret === false) {
					return false;
				}
			});},
			get on_touchend () {return __get__ (this, function (self, e) {
				self.on_mouseup (e);
			});}
		});
		var mandelbrot = Mandel ();
		__pragma__ ('<use>' +
			'math' +
		'</use>')
		__pragma__ ('<all>')
			__all__.Mandel = Mandel;
			__all__.cos = cos;
			__all__.log = log;
			__all__.mandelbrot = mandelbrot;
			__all__.pi = pi;
			__all__.rgb = rgb;
			__all__.sqrt = sqrt;
		__pragma__ ('</all>')
	}) ();

