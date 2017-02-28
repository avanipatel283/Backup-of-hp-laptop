//Login_main_bunddle.js

var DSCRM = window.DSCRM || {};
DSCRM.Core = (function($) {
	var self = null;
	var modules = {};
	var plugins = {};
	var debug = false;
	isFunction = function(object) {
		return typeof object === "function";
	}, addErrorLogging = function(object) {
		var method;
		for ( var name in object) {
			method = object[name];
			if (isFunction(method)) {
				object[name] = function(name, method) {
					return function() {
						try {
							return method.apply(this, arguments);
						} catch (error) {
							if (debug) {
								throw (error);
							} else {
								self.log(name + "() : " + error.message);
							}
						}
					};
				}(name, method);
			}
		}
		return object;
	};
	return {
		init : function() {
			self = this;
			self.initializePlugins();
			self.startAllModules();
		},
		initializePlugins : function() {
			for ( var name in plugins) {
				var plugin = plugins[name];
				if (isFunction(plugin.init)) {
					plugin.init();
				}
			}
		},
		log : function(message) {
			console.log(message);
		},
		registerModule : function(moduleName, pluginsArray, fn) {
			modules[moduleName] = {
				creator : fn,
				instance : null,
				subscribed : {},
				plugins : pluginsArray
			};
		},
		startModule : function(moduleName) {
			var module = modules[moduleName];
			if (module === undefined) {
				throw new Error(
						"Attempt to start a module that has not been registered : "
								+ moduleName);
			} else {
				if (modules[moduleName].instance === null) {
					var pluginsArray = module.plugins;
					var sandBoxForModule = new Sandbox(moduleName, pluginsArray);
					module.instance = module.creator(sandBoxForModule);
					module.instance.init();
				}
			}
			return module;
		},
		stopModule : function(moduleName) {
			var module = modules[moduleName];
			if (module === undefined) {
				throw new Error(
						"Attempt to stop a module that has not been registered: "
								+ moduleName);
			}
			if (module.instance) {
				module.instance.destroy();
				module.instance = null;
			}
		},
		getModule : function(moduleName) {
			return modules[moduleName];
		},
		startModules : function(modules) {
			if (!$.isArray(modules) || $.isEmptyObject(modules)) {
				return;
			}
			for (var i = 0, len = modules.length; i < len; i++) {
				self.startModule(modules[i]);
			}
		},
		startAllModules : function() {
			for ( var moduleName in modules) {
				if (modules.hasOwnProperty(moduleName)) {
					self.startModule(moduleName);
				}
			}
		},
		stopAllModules : function() {
			for ( var moduleName in modules) {
				if (modules.hasOwnProperty(moduleName)) {
					this.stopModule(moduleName);
				}
			}
		},
		registerPlugin : function(pluginName, fn) {
			var plugin = fn($);
			plugins[pluginName] = plugin;
		},
		getPlugin : function(pluginName) {
			return plugins[pluginName];
		},
		subscribe : function(messageName, fn, moduleName) {
			var module = modules[moduleName];
			if (module) {
				module.subscribed[messageName] = fn;
			}
		},
		unsubscribe : function(moduleName) {
			var module = modules[moduleName];
			module.subscribed = {};
		},
		publish : function(messageName) {
			console.info("messageName :" + messageName);
			var args = Array.prototype.slice.call(arguments, 1);
			var list = null;
			for ( var name in modules) {
				list = self.getModule(name).subscribed;
				if (list[messageName] && isFunction(list[messageName])) {
					list[messageName].apply(self, args);
				}
			}
		}
	};
}(jQuery));
var Sandbox = function(name, pluginsArray) {
	var data = {
		moduleName : name,
		window : window,
		dom : $,
		subscribe : function(messageName, fn) {
			return DSCRM.Core.subscribe(messageName, fn, name);
		},
		unsubscribe : function() {
			return DSCRM.Core.unsubscribe(name);
		},
		publish : function(messageName, data) {
			DSCRM.Core.publish(messageName, data);
			return this;
		},
		log : function(message) {
			return DSCRM.Core.log(message);
		}
	};
	if (pluginsArray == undefined || pluginsArray.length === 0) {
		pluginsArray = [ "ajax", "cache", "util", "alert" ];
	}
	pluginsArray.forEach(function(pluginName) {
		data[pluginName] = DSCRM.Core.getPlugin(pluginName);
	});
	return data;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// login_module_bundle.js

DSCRM.Core.registerModule("login-form", [], function(sandbox) {
	var _self = null;
	var _private = {
		loginFormEl : null,
		emailEl : null,
		passwordEl : null,
		staySignedInEl : null,
		urlInfoEl : null,
		validateForm : function(event) {
			var email = sandbox.dom.trim(_private.emailEl.val());
			var password = sandbox.dom.trim(_private.passwordEl.val());
			password = calcMD5(password);
			var urlPath = sandbox.window.location.pathname
					+ sandbox.window.location.hash;
			_private.urlInfoEl.val(urlPath);
			_private.passwordEl.val(password);
			if (_private.staySignedInEl.prop("checked")) {
				sandbox.publish("set-login-info-cookie", [ {
					key : "email",
					value : email,
					days : 365
				}, {
					key : "password",
					value : password,
					days : 365
				} ]);
			}
			return true;
		}
	};
	var api = {
		init : function() {
			_self = this;
			_private.loginFormEl = sandbox.dom("#login-form");
			_private.emailEl = _private.loginFormEl.find("#login-email");
			_private.passwordEl = _private.loginFormEl.find("#login-password");
			_private.staySignedInEl = _private.loginFormEl
					.find("#login-stay-signed-in");
			_private.urlInfoEl = _private.loginFormEl.find("#login-url-info");
			_private.loginFormEl.submit(_self.submit);
		},
		destroy : function() {
			_private.loginFormEl.off("submit");
			_private.loginFormEl = null;
			_private.emailEl = null;
			_private.passwordEl = null;
			_private.staySignedInEl = null;
		},
		submit : function(event) {
			return _private.validateForm(event);
		}
	};
	api._private = _private;
	return api;
});
DSCRM.Core.registerModule("login-alert-message", [],
		function(sandbox) {
			var self = null, el = null, arrayOfAlertTypeClasses = [
					"alert-success", "alert-info", "alert-warning",
					"alert-danger", "show", "hide" ], showMessage = function(
					type, message) {
				if (!type || !message) {
					return;
				}
				var alertClassType = null;
				switch (type) {
				case "success":
					alertClassType = arrayOfAlertTypeClasses[0];
					break;
				case "info":
					alertClassType = arrayOfAlertTypeClasses[1];
					break;
				case "warning":
					alertClassType = arrayOfAlertTypeClasses[2];
					break;
				case "danger":
					alertClassType = arrayOfAlertTypeClasses[3];
					break;
				default:
					return;
				}
				sandbox.dom(el).html(message).removeClass(
						arrayOfAlertTypeClasses.join(" ")).addClass(
						alertClassType).addClass("show");
			}, hideAlertBox = function() {
				sandbox.dom(el).html("").removeClass(
						arrayOfAlertTypeClasses.join(" ")).addClass("hide");
			};
			return {
				init : function() {
					self = this;
					el = "#login-alert-message";
					sandbox.subscribe("show-alert-message", self.show);
					sandbox.subscribe("hide-alert-message", self.hide);
				},
				destroy : function() {
					el = null;
					sandbox.unsubscribe();
					self.hide();
				},
				show : function(data) {
					showMessage(data.type, data.message);
				},
				hide : function() {
					hideAlertBox();
				}
			};
		});
DSCRM.Core
		.registerModule(
				"check-cookie",
				[],
				function(sandbox) {
					var self = null, el = null, emailEl = null, passwordEl = null, radioElement = null, getCookie = function(
							name) {
						var i, x, y, ARRcookies = document.cookie.split(";");
						for (i = 0; i < ARRcookies.length; i++) {
							x = ARRcookies[i].substr(0, ARRcookies[i]
									.indexOf("="));
							y = ARRcookies[i]
									.substr(ARRcookies[i].indexOf("=") + 1);
							x = x.replace(/^\s+|\s+$/g, "");
							if (x == name) {
								return decodeURI(y);
							}
						}
					}, checkCookieForEmailAndPassword = function() {
						var email = getCookie("email");
						var password = getCookie("password");
						if (!email || !password) {
							return;
						}
						sandbox.dom(el).find(emailEl).val(email);
						sandbox.dom(el).find(passwordEl).val(password);
					}, storeAKeyInCookie = function(key, value, expireInDays) {
						var exdate = new Date();
						exdate.setDate(exdate.getDate() + expireInDays);
						value = encodeURI(value)
								+ ((expireInDays == null) ? "" : "; expires="
										+ exdate.toUTCString());
						document.cookie = key + "=" + value;
					}, storeKeysInCookie = function(arrayOfData) {
						var data = null;
						for (var i = 0, len = arrayOfData.length; i < len; i++) {
							data = null;
							data = arrayOfData[i];
							storeAKeyInCookie(data.key, data.value, data.days);
						}
					};
					return {
						init : function() {
							self = this;
							el = "#login-form";
							emailEl = "#login-email";
							passwordEl = "#login-password";
							radioElement = "#login-stay-signed-in";
							sandbox.subscribe("check-cookie-present",
									self.checkInCookie);
							sandbox.subscribe("set-login-info-cookie",
									self.storeInCookie);
						},
						destroy : function() {
							el = null;
							emailEl = null;
							passwordEl = null;
							radioElement = null;
							sandbox.unsubscribe();
						},
						checkInCookie : function() {
							checkCookieForEmailAndPassword();
						},
						storeInCookie : function(arrayOfData) {
							storeKeysInCookie(arrayOfData);
						}
					};
				});
DSCRM.Core
		.registerModule(
				"full-auth",
				[ "util", "url" ],
				function(sandbox) {
					var self = null, checkForConnIDAndRedirectToFullAuth = function(
							data) {
						var staticContentURL = data.staticContentURL, fullAuthServerURL = data.fullAuthServerURL, serviceAccountID = data.serviceAccountID;
						var connid = sandbox.util.getQueryString({
							key : "connid",
							defaultValue : null
						});
						var phone = sandbox.util.getQueryString({
							key : "phone",
							defaultValue : null
						});
						var fullAuthFailed = sandbox.util.getQueryString({
							key : "fullAuthFailed",
							defaultValue : null
						});
						if ((!connid && !phone)
								|| (fullAuthFailed != null && fullAuthFailed)) {
							return;
						}
						var type = sandbox.url.page();
						if (!type) {
							return;
						}
						var ID = sandbox.url.entityID();
						var userpin = sandbox.util.getQueryString({
							key : "userpin",
							defaultValue : ""
						});
						var callType = sandbox.util.getQueryString({
							key : "calltype",
							defaultValue : ""
						});
						var currentTabIndex = sandbox.util.getQueryString({
							key : "currentTabIndex",
							defaultValue : ""
						});
						var redirectURLToDS = staticContentURL
								+ "/crm/redirectURLForTC" + "?" + "type="
								+ type;
						if (!!connid) {
							redirectURLToDS = redirectURLToDS + "&ID=" + ID
									+ "&connid=" + connid + "&userpin="
									+ userpin + "&calltype=" + callType
									+ "&currentTabIndex=" + currentTabIndex;
						} else {
							(!!phone);
						}
						redirectURLToDS = redirectURLToDS + "&phone=" + phone;
						fullAuthServerURL = fullAuthServerURL
								+ "?serviceAccountId=" + serviceAccountID;
						fullAuthServerURL = fullAuthServerURL + "&redirectUrl="
								+ encodeURIComponent(redirectURLToDS)
								+ "&errorUrl="
								+ encodeURIComponent(redirectURLToDS);
						fullAuthServerURL = fullAuthServerURL
								+ "&allowExternalUser=false";
						sandbox
								.publish(
										"show-alert-message",
										{
											type : "info",
											message : "Please wait we're redirecting you for Google authentication"
										});
						setTimeout(function() {
							window.location.href = fullAuthServerURL;
						}, 2000);
					};
					return {
						init : function() {
							self = this;
							sandbox.subscribe("check-for-connid",
									self.checkAndRedirectToFullAuth);
						},
						destroy : function() {
							sandbox.unsubscribe();
						},
						checkAndRedirectToFullAuth : function(data) {
							checkForConnIDAndRedirectToFullAuth(data);
						}
					};
				});
DSCRM.Core.registerModule("forgot-password", [ "util", "alert" ], function(
		sandbox) {
	var emailID = null;
	var showForgotPassword = function(event) {
		sandbox.dom(this).parent().parent().addClass("hide");
		sandbox.dom("#forgot-pwd-container").removeClass("hide");
		emailID = sandbox.dom("#login-email").val();
		sandbox.dom("#forgot-pwd-container").find("input").val(emailID);
	};
	return {
		init : function() {
			sandbox.dom("#login-forgot-password").on("click",
					showForgotPassword);
			sandbox.dom("#back-to-signIn").on("click", function() {
				sandbox.dom("#forgot-pwd-container").addClass("hide");
				sandbox.dom("#login-signUp-container").removeClass("hide");
			});
		}
	};
});
DSCRM.Core
		.registerModule(
				"google-login-redirect",
				[ "util", "alert" ],
				function(sandbox) {
					var _userDetail = "", _platform = "", _browserName = "", _browserVersion = "", _urlPath = null, readBrowserInfo = function() {
						var ua = navigator.userAgent, tem, M = ua
								.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)
								|| [];
						if (/trident/i.test(M[1])) {
							tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
							return {
								name : "IE ",
								version : (tem[1] || "")
							};
						}
						if (M[1] === "Chrome") {
							tem = ua.match(/\bOPR\/(\d+)/);
							if (tem != null) {
								return {
									name : "Opera",
									version : tem[1]
								};
							}
						}
						M = M[2] ? [ M[1], M[2] ] : [ navigator.appName,
								navigator.appVersion, "-?" ];
						if ((tem = ua.match(/version\/(\d+)/i)) != null) {
							M.splice(1, 1, tem[1]);
						}
						_browserName = M[0];
						_browserVersion = M[1];
					}, redirectToGoogleSignin = function() {
						readBrowserInfo();
						_urlPath = window.location.pathname
								+ window.location.hash;
						_platform = navigator["platform"];
						_userDetail = "Browser Information : <br>Sign Up Source Page : login <br> Federated Identity : Google Sign In From Web App <br> Browser Name : "
								+ _browserName
								+ "<br> Browser Version : "
								+ _browserVersion
								+ "<br> Platform : "
								+ _platform;
						document["login-form"].urlPath.value = _urlPath;
						document["login-form"].authenticaitonProviderId.value = "";
						document["login-form"].federatedLoginProvider.value = "google-sign-in";
						document["login-form"].action = "/gmailLogin?userdetails="
								+ _userDetail;
						document["login-form"].submit();
					};
					return {
						init : function() {
							sandbox.dom("#google-login-btn").on("click",
									redirectToGoogleSignin);
						}
					};
				});
DSCRM.Core.init();
DSCRM.Core.startModules([ "login-form", "login-alert-message", "check-cookie",
		"full-auth", "forgot-password" ]);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// login_plugins_bundle.js

DSCRM.Core.registerPlugin("util", function($) {
    var self = null,
        _cachePlugin = DSCRM.Core.getPlugin("cache"),
        getQueryString = function(key, default_) {
            if (default_ == null) {
                default_ = "";
            }
            key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
            var qs = regex.exec(window.location.href);
            if (qs == null) {
                return default_;
            } else {
                return qs[1];
            }
        },
        getQueryStringFromUrl = function(url, key, default_) {
            if (default_ == null) {
                default_ = "";
            }
            key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
            var qs = regex.exec(url);
            if (qs == null) {
                return default_;
            } else {
                return qs[1];
            }
        },
        formatDate = function(date, format) {
            format = format + "";
            var result = "";
            var i_format = 0;
            var c = "";
            var token = "";
            var y = date.getYear() + "";
            var M = date.getMonth() + 1;
            var d = date.getDate();
            var E = date.getDay();
            var H = date.getHours();
            var m = date.getMinutes();
            var s = date.getSeconds();
            var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
            var value = new Object();
            if (y.length < 4) {
                y = "" + (y - 0 + 1900);
            }
            value["y"] = "" + y;
            value["yyyy"] = y;
            value["yy"] = y.substring(2, 4);
            value["M"] = M;
            value["MM"] = LZ(M);
            value["MMM"] = MONTH_NAMES[M - 1];
            value["NNN"] = MONTH_NAMES[M + 11];
            value["d"] = d;
            value["dd"] = LZ(d);
            value["E"] = DAY_NAMES[E + 7];
            value["EE"] = DAY_NAMES[E];
            value["H"] = H;
            value["HH"] = LZ(H);
            if (H == 0) {
                value["h"] = 12;
            } else {
                if (H > 12) {
                    value["h"] = H - 12;
                } else {
                    value["h"] = H;
                }
            }
            value["hh"] = LZ(value["h"]);
            if (H > 11) {
                value["K"] = H - 12;
            } else {
                value["K"] = H;
            }
            value["k"] = H + 1;
            value["KK"] = LZ(value["K"]);
            value["kk"] = LZ(value["k"]);
            if (H > 11) {
                value["a"] = "PM";
            } else {
                value["a"] = "AM";
            }
            value["m"] = m;
            value["mm"] = LZ(m);
            value["s"] = s;
            value["ss"] = LZ(s);
            while (i_format < format.length) {
                c = format.charAt(i_format);
                token = "";
                while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                    token += format.charAt(i_format++);
                }
                if (value[token] != null) {
                    result = result + value[token];
                } else {
                    result = result + token;
                }
            }
            return result;
        },
        LZ = function(x) {
            return (x < 0 || x > 9 ? "" : "0") + x;
        },
        MONTH_NAMES = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"),
        DAY_NAMES = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"),
        formatLastUpdatedDate = function(lastUpdatedDate) {
            var currentdate = new Date();
            var olddate = new Date(lastUpdatedDate);
            var oldmilliseconds = olddate.getTime();
            var currmilliseconds = currentdate.getTime() - oldmilliseconds;
            var seconds = currmilliseconds / 1000;
            var second_new = Math.ceil(seconds);
            var minutes = seconds / 60;
            var minute_new = Math.floor(minutes);
            var hours = minutes / 60;
            var hour_new = Math.floor(hours);
            var days = hours / 24;
            var day_new = Math.floor(days);
            var months = days / 30;
            var month_new = Math.floor(months);
            var years = months / 12;
            var year_new = Math.floor(years);
            if (year_new >= 1) {
                var yearvalue = getLastUpdatedDateString(year_new, " year");
                return yearvalue;
            } else {
                if (month_new >= 1) {
                    var monthvalue = getLastUpdatedDateString(month_new, " month");
                    return monthvalue;
                } else {
                    if (day_new >= 1) {
                        var dayvalue = getLastUpdatedDateString(day_new, " day");
                        return dayvalue;
                    } else {
                        if (hour_new >= 1) {
                            var hourvalue = getLastUpdatedDateString(hour_new, " hour");
                            return hourvalue;
                        } else {
                            if (minute_new >= 1) {
                                var minvalue = getLastUpdatedDateString(minute_new, " minute");
                                return minvalue;
                            } else {
                                var secvalue = getLastUpdatedDateString(second_new, " second");
                                return secvalue;
                            }
                        }
                    }
                }
            }
        },
        formatEmailAddress = function(address) {
            if (!address) {
                return address;
            }
            var modifiedAddress = "";
            var addressArray = [];
            try {
                address = address.replace(/(^\s*,)|(,\s*$)/g, "");
                if (address.indexOf(",") != -1) {
                    addressArray = address.split(",");
                    $.each(addressArray, function(index, val) {
                        if (val.indexOf("@") != -1) {
                            modifiedAddress = modifiedAddress + val.replace(/[()\;:"\[\]\\]/gi, "") + ",";
                        } else {
                            modifiedAddress = modifiedAddress + val.replace(/[()\;:"\[\]\\]/gi, "");
                        }
                    });
                } else {
                    modifiedAddress = address.replace(/[()\;:"\[\]\\]/gi, "");
                }
            } catch (e) {
                modifiedAddress = address;
            }
            modifiedAddress = modifiedAddress.replace(/(^\s*,)|(,\s*$)/g, "");
            return modifiedAddress;
        },
        validateEmailAddress = function(address) {
            var match = true;
            var re = /(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)/;
            if (address.indexOf(",") != -1) {
                addressArray = address.split(",");
                $.each(addressArray, function(index, val) {
                    match = re.test($.trim(val));
                    if (!match) {
                        return false;
                    }
                });
            } else {
                match = re.test($.trim(address));
            }
            return match;
        },
        getLastUpdatedDateString = function(value_new, type_new) {
            var str = null;
            if ((value_new <= 1) || (value_new > 0 && value_new <= 1)) {
                str = value_new + type_new + " ago";
            } else {
                str = value_new + type_new + "s" + " ago";
            }
            return str;
        },
        _isInteger = function(val) {
            var digits = "1234567890";
            for (var i = 0; i < val.length; i++) {
                if (digits.indexOf(val.charAt(i)) == -1) {
                    return false;
                }
            }
            return true;
        },
        _getInt = function(str, i, minlength, maxlength) {
            for (var x = maxlength; x >= minlength; x--) {
                var token = str.substring(i, i + x);
                if (token.length < minlength) {
                    return null;
                }
                if (_isInteger(token)) {
                    return token;
                }
            }
            return null;
        },
        generateUUID = function generateUUID() {
            var d = new Date().getTime();
            var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == "x" ? r : (r & 7 | 8)).toString(16);
            });
            return uuid;
        },
        concat = function(sourceMap, objectToCopy, property) {
            if (objectToCopy instanceof Array) {
                for (var i = 0, l = objectToCopy.length, obj; i < l; i++) {
                    obj = objectToCopy[i];
                    sourceMap[obj[property]] = obj;
                }
            } else {
                if (objectToCopy instanceof Object) {
                    $.each(objectToCopy, function(key, value) {
                        sourceMap[value[property]] = value;
                    });
                }
            }
        },
        getWordsCount = function(text) {
            var count = 0,
                i = 0;
            text = text.replace(/\s/g, " ");
            var textArray = text.split(" ");
            for (; i < textArray.length; i++) {
                if (textArray[i].length > 0) {
                    count++;
                }
            }
            return count;
        },
        constructMessage = function(message) {
            message = message.replace(/\%/g, "&#37;");
            message = message.replace(/\+/g, "&#43;");
            message = encodeURIComponent(message);
            return message;
        },
        getPersonName = function(firstName, lastName) {
            var name = null;
            if (!!firstName && !!lastName) {
                name = firstName + " " + lastName;
            } else {
                if (!!firstName && !lastName) {
                    name = firstName;
                } else {
                    if (!firstName && !!lastName) {
                        name = lastName;
                    } else {
                        name = "";
                    }
                }
            }
            return name;
        },
        matchString = function(str, strRegExp) {
            var regExp = new RegExp(strRegExp);
            var matcher = str.match(regExp);
            if (matcher != null) {
                str = replaceMatchedString(str, matcher);
            }
            return str;
        },
        replaceMatchedString = function(str, matcher) {
            for (var i = 0; i < matcher.length; i++) {
                str = str.replace(matcher[i], "");
            }
            return str;
        },
        removeDuplicatesInArray = function(a) {
            var prims = {
                    "boolean": {},
                    "number": {},
                    "string": {}
                },
                objs = [];
            return a.filter(function(item) {
                var type = typeof item;
                if (type in prims) {
                    return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
                } else {
                    return objs.indexOf(item) >= 0 ? false : objs.push(item);
                }
            });
        },
        getEntityURL = function(data) {
            if (self.isEmptyObject(data)) {
                return null;
            }
            var entityType = data.entityType,
                entityID = data.entityID,
                staticContentUrl = _cachePlugin.get("staticContentURL"),
                entityUrl = staticContentUrl + "/crm";
            switch (entityType) {
                case "lead":
                    entityUrl = entityUrl + "#lead/" + entityID;
                    break;
                case "contact":
                    entityUrl = entityUrl + "#contact/" + entityID;
                    break;
                case "deal":
                    entityUrl = entityUrl + "#deal/" + entityID;
                    break;
                case "account":
                    entityUrl = entityUrl + "#account/" + entityID;
                    break;
                case "task":
                    entityUrl = entityUrl + "#task/" + entityID;
                    break;
                default:
                    entityUrl = null;
                    break;
            }
            return entityUrl;
        };
    Date.prototype.addHours = function(h) {
        this.setHours(this.getHours() + h);
        return this;
    };
    return {
        init: function() {
            self = this;
        },
        destroy: function() {
            self = null;
        },
        getQueryString: function(data) {
            return getQueryString(data.key, data.defaultValue);
        },
        getQueryStringFromUrl: function(data) {
            return getQueryStringFromUrl(data.url, data.key, data.defaultValue);
        },
        escapeValue: function(value) {
            console.info(value);
            if (typeof value == "string") {
                value = escape(value);
            } else {
                if (value instanceof Object) {
                    $.each(value, function(key, val) {
                        value[key] = escapeValue(val);
                    });
                }
            }
            console.info(value);
            return value;
        },
        formatDate: function(date, format) {
            return formatDate(date, format);
        },
        getLocalTime: function(UTCOffset) {
            var date = new Date();
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            date.setTime(date.getTime() + UTCOffset);
            return {
                "date": date,
                "str": formatDate(date, "h:mm a")
            };
        },
        getTimezoneString: function() {
            var dateTimeString = new Date().toString();
            timezonePosition = dateTimeString.indexOf("(");
            return dateTimeString.substring(timezonePosition + 1, dateTimeString.length - 1);
        },
        getLocalTime_v2: function(UTCOffset, dateFormat) {
            var date = new Date();
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            date.setTime(date.getTime() + UTCOffset);
            return {
                "date": date,
                "str": formatDate(date, dateFormat)
            };
        },
        getStarCountForRating: function(rating) {
            switch (parseInt(rating)) {
                case 1:
                    return 3;
                case 2:
                    return 2;
                case 3:
                    return 1;
                case 4:
                    return null;
                case 6:
                    return 0;
                default:
                    return -1;
            }
        },
        removeEmptyValuePairs: function(map) {
            var map2 = {},
                val;
            for (var prop in map) {
                if (map.hasOwnProperty(prop)) {
                    val = map[prop];
                    if (!self.isEmptyString(val)) {
                        map2[prop] = val;
                    }
                }
            }
            return map2;
        },
        formatLastUpdatedDate: function(date) {
            return formatLastUpdatedDate(date);
        },
        formatEmailAddress: function(address) {
            return formatEmailAddress(address);
        },
        validateEmailAddress: function(address) {
            return validateEmailAddress(address);
        },
        isEmptyString: function(str) {
            if (!!str) {
                return false;
            } else {
                if (str == 0 && !isNaN(parseFloat(str))) {
                    return false;
                }
            }
            return true;
        },
        isEmptyObject: function(object) {
            return $.isEmptyObject(object);
        },
        getFeatureAvailablityStatus: function(featureName) {
            if (self.isEmptyString(featureName)) {
                throw Error("Key is empty");
            }
            var cachePlugin = DSCRM.Core.getPlugin("cache");
            var accountSettings = cachePlugin.get("accountSettings");
            var featuresAvailabilityMap = JSON.parse(accountSettings.featuresAvailabilityStatus);
            if ($.isEmptyObject(featuresAvailabilityMap)) {
                return false;
            }
            return featuresAvailabilityMap[featureName];
        },
        getMyDateFromFormat: function(val, format) {
            val = val + "";
            val = $.trim(val);
            format = format + "";
            var i_val = 0;
            var i_format = 0;
            var c = "";
            var token = "";
            var token2 = "";
            var x, y;
            var now = new Date();
            var year = now.getYear();
            var month = now.getMonth() + 1;
            var date = 1;
            var hh = now.getHours();
            var mm = now.getMinutes();
            var ss = now.getSeconds();
            var ampm = "";
            while (i_format < format.length) {
                c = format.charAt(i_format);
                token = "";
                while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                    token += format.charAt(i_format++);
                }
                if (token == "yyyy" || token == "yy" || token == "y") {
                    if (token == "yyyy") {
                        x = 4;
                        y = 4;
                    }
                    if (token == "yy") {
                        x = 2;
                        y = 2;
                    }
                    if (token == "y") {
                        x = 2;
                        y = 4;
                    }
                    year = _getInt(val, i_val, x, y);
                    if (year == null) {
                        return 0;
                    }
                    i_val += year.length;
                    if (year.length == 2) {
                        if (year > 70) {
                            year = 1900 + (year - 0);
                        } else {
                            year = 2000 + (year - 0);
                        }
                    }
                } else {
                    if (token == "MMM" || token == "NNN") {
                        month = 0;
                        for (var i = 0; i < MONTH_NAMES.length; i++) {
                            var month_name = MONTH_NAMES[i];
                            if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                                if (token == "MMM" || (token == "NNN" && i > 11)) {
                                    month = i + 1;
                                    if (month > 12) {
                                        month -= 12;
                                    }
                                    i_val += month_name.length;
                                    break;
                                }
                            }
                        }
                        if ((month < 1) || (month > 12)) {
                            return 0;
                        }
                    } else {
                        if (token == "EE" || token == "E") {
                            for (var i = 0; i < DAY_NAMES.length; i++) {
                                var day_name = DAY_NAMES[i];
                                if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                                    i_val += day_name.length;
                                    break;
                                }
                            }
                        } else {
                            if (token == "MM" || token == "M") {
                                month = _getInt(val, i_val, token.length, 2);
                                if (month == null || (month < 1) || (month > 12)) {
                                    return 0;
                                }
                                i_val += month.length;
                            } else {
                                if (token == "dd" || token == "d") {
                                    date = _getInt(val, i_val, token.length, 2);
                                    if (date == null || (date < 1) || (date > 31)) {
                                        return 0;
                                    }
                                    i_val += date.length;
                                } else {
                                    if (token == "hh" || token == "h") {
                                        hh = _getInt(val, i_val, token.length, 2);
                                        if (hh == null || (hh < 1) || (hh > 12)) {
                                            return 0;
                                        }
                                        i_val += hh.length;
                                    } else {
                                        if (token == "HH" || token == "H") {
                                            hh = _getInt(val, i_val, token.length, 2);
                                            if (hh == null || (hh < 0) || (hh > 23)) {
                                                return 0;
                                            }
                                            i_val += hh.length;
                                        } else {
                                            if (token == "KK" || token == "K") {
                                                hh = _getInt(val, i_val, token.length, 2);
                                                if (hh == null || (hh < 0) || (hh > 11)) {
                                                    return 0;
                                                }
                                                i_val += hh.length;
                                            } else {
                                                if (token == "kk" || token == "k") {
                                                    hh = _getInt(val, i_val, token.length, 2);
                                                    if (hh == null || (hh < 1) || (hh > 24)) {
                                                        return 0;
                                                    }
                                                    i_val += hh.length;
                                                    hh--;
                                                } else {
                                                    if (token == "mm" || token == "m") {
                                                        mm = _getInt(val, i_val, token.length, 2);
                                                        if (mm == null || (mm < 0) || (mm > 59)) {
                                                            return 0;
                                                        }
                                                        i_val += mm.length;
                                                    } else {
                                                        if (token == "ss" || token == "s") {
                                                            ss = _getInt(val, i_val, token.length, 2);
                                                            if (ss == null || (ss < 0) || (ss > 59)) {
                                                                return 0;
                                                            }
                                                            i_val += ss.length;
                                                        } else {
                                                            if (token == "a") {
                                                                if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
                                                                    ampm = "AM";
                                                                } else {
                                                                    if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
                                                                        ampm = "PM";
                                                                    } else {
                                                                        return 0;
                                                                    }
                                                                }
                                                                i_val += 2;
                                                            } else {
                                                                if (val.substring(i_val, i_val + token.length) != token) {
                                                                    return 0;
                                                                } else {
                                                                    i_val += token.length;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (i_val != val.length) {
                return 0;
            }
            if (month == 2) {
                if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
                    if (date > 29) {
                        return 0;
                    }
                } else {
                    if (date > 28) {
                        return 0;
                    }
                }
            }
            if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
                if (date > 30) {
                    return 0;
                }
            }
            if (hh < 12 && ampm == "PM") {
                hh = hh - 0 + 12;
            } else {
                if (hh > 11 && ampm == "AM") {
                    hh -= 12;
                }
            }
            var newdate = new Date(year, month - 1, date, hh, mm, ss);
            return newdate;
        },
        getDateObjectFromString: function(val, toDateStr) {
            var fromDate = "",
                toDate = "",
                fromDateFormat = "",
                toDateFormat = "";
            var date = new Date();
            var startOfToday = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10), 0, 0, 0);
            var endOfToday = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10), 23, 59, 59);
            var startOfTomo = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) + 1, 0, 0, 0);
            var endOfTomo = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) + 1, 23, 59, 59);
            var startOfYesterday = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) - 1, 0, 0, 0);
            var endOfYesterday = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) - 1, 23, 59, 59);
            var dateLate = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) - 1, 23, 59, 59);
            var dateWeek = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) - 7);
            var numberOfDays = parseInt(date.getDay());
            var dateThisWeek = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) - numberOfDays, 0, 0, 0);
            var dateThisWeekEnd = new Date(parseInt(dateThisWeek.getFullYear(), 10), parseInt(dateThisWeek.getMonth(), 10), parseInt(dateThisWeek.getDate(), 10) + 6, 23, 59, 59);
            var dateThisMonth = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), 1, 0, 0, 0);
            var dateNextMonth = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10) + 1, 1);
            var dateThisMonthEnd = new Date(parseInt(dateNextMonth.getFullYear(), 10), parseInt(dateNextMonth.getMonth(), 10), parseInt(dateNextMonth.getDate(), 10) - 1, 23, 59, 59);
            var dateLastMonthStart = new Date(parseInt(dateThisMonth.getFullYear(), 10), parseInt(dateThisMonth.getMonth(), 10) - 1, 1, 0, 0, 0);
            var dateLastMonthEnd = new Date(parseInt(dateThisMonth.getFullYear(), 10), parseInt(dateThisMonth.getMonth(), 10), parseInt(dateThisMonth.getDate(), 10) - 1, 23, 59, 59);
            if (val == "Late And Today") {
                fromDate = 0;
                toDate = endOfToday;
            } else {
                if (val == "Late") {
                    fromDate = 0;
                    toDate = dateLate;
                } else {
                    if (val == "Yesterday") {
                        fromDate = startOfYesterday;
                        toDate = endOfYesterday;
                    } else {
                        if (val == "Today") {
                            fromDate = startOfToday;
                            toDate = endOfToday;
                        } else {
                            if (val == "Tomorrow") {
                                fromDate = startOfTomo;
                                toDate = endOfTomo;
                            } else {
                                if (val == "This Week") {
                                    fromDate = dateThisWeek;
                                    toDate = dateThisWeekEnd;
                                } else {
                                    if (val == "Last 7 Days") {
                                        fromDate = dateWeek;
                                        toDate = date;
                                    } else {
                                        if (val == "This Month") {
                                            fromDate = dateThisMonth;
                                            toDate = dateThisMonthEnd;
                                        } else {
                                            if (val == "Last Month") {
                                                fromDate = dateLastMonthStart;
                                                toDate = dateLastMonthEnd;
                                            } else {
                                                if (val == "All") {
                                                    fromDate = 0;
                                                    toDate = 0;
                                                } else {
                                                    fromDate = self.getMyDateFromFormat(val, "MM-dd-yyyy");
                                                    toDate = self.getMyDateFromFormat(toDateStr, "MM-dd-yyyy");
                                                    fromDate = new Date(parseInt(fromDate.getFullYear(), 10), parseInt(fromDate.getMonth(), 10), parseInt(fromDate.getDate(), 10), 0, 0, 0);
                                                    toDate = new Date(parseInt(toDate.getFullYear(), 10), parseInt(toDate.getMonth(), 10), parseInt(toDate.getDate(), 10), 23, 59, 59);
                                                    fromDateFormat = formatDate(fromDate, "NNN dd, yyyy");
                                                    toDateFormat = formatDate(toDate, "NNN dd, yyyy");
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (fromDate != 0) {
                fromDate = fromDate.getTime();
            }
            if (toDate != 0) {
                toDate = toDate.getTime();
            }
            return [fromDate, toDate];
        },
        getDateRange: function(val) {
            var fromDate = "",
                toDate = "",
                fromDateFormat = "",
                toDateFormat = "",
                reportType = "",
                map = {};
            var date = new Date();
            var dateLate = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) - 1, 23, 59, 59);
            var dateWeek = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) - 7);
            var dateMonth = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10) - 1, parseInt(date.getDate(), 10));
            var numberOfDays = parseInt(date.getDay());
            var dateThisWeek = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) - numberOfDays);
            var dateThisWeekEnd = new Date(parseInt(dateThisWeek.getFullYear(), 10), parseInt(dateThisWeek.getMonth(), 10), parseInt(dateThisWeek.getDate(), 10) + 6);
            var startOfYest = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) - 1, 0, 0, 0);
            var endOfYest = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) - 1, 23, 59, 59);
            var startOfTomo = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) + 1, 0, 0, 0);
            var endOfTomo = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10) + 1, 23, 59, 59);
            var dateThisMonth = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), 1);
            var dateNextMonth = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10) + 1, 1);
            var dateThisMonthEnd = new Date(parseInt(dateNextMonth.getFullYear(), 10), parseInt(dateNextMonth.getMonth(), 10), parseInt(dateNextMonth.getDate(), 10) - 1);
            var dateLastMonthStart = new Date(parseInt(dateThisMonth.getFullYear(), 10), parseInt(dateThisMonth.getMonth(), 10) - 1, 1);
            var dateLastMonthEnd = new Date(parseInt(dateThisMonth.getFullYear(), 10), parseInt(dateThisMonth.getMonth(), 10), parseInt(dateThisMonth.getDate(), 10) - 1);
            var endOfToday = new Date(parseInt(date.getFullYear(), 10), parseInt(date.getMonth(), 10), parseInt(date.getDate(), 10), 23, 59, 59);
            if (val == "LateAndToday") {
                fromDate = 0;
                toDate = endOfToday;
            } else {
                if (val == "Late") {
                    fromDate = 0;
                    toDate = dateLate;
                } else {
                    if (val == "Tomorrow") {
                        fromDate = formatDate(startOfTomo, "MM/dd/yyyy");
                        toDate = formatDate(endOfTomo, "MM/dd/yyyy");
                    } else {
                        if (val == "Yesterday") {
                            fromDate = formatDate(startOfYest, "MM/dd/yyyy");
                            toDate = formatDate(endOfYest, "MM/dd/yyyy");
                        } else {
                            if (val == "Today") {
                                fromDate = formatDate(date, "MM/dd/yyyy");
                                toDate = formatDate(date, "MM/dd/yyyy");
                            } else {
                                if (val == "ThisWeek") {
                                    fromDate = formatDate(dateThisWeek, "MM/dd/yyyy");
                                    toDate = formatDate(dateThisWeekEnd, "MM/dd/yyyy");
                                } else {
                                    if (val == "Last7Days") {
                                        fromDate = formatDate(dateWeek, "MM/dd/yyyy");
                                        toDate = formatDate(date, "MM/dd/yyyy");
                                    } else {
                                        if (val == "ThisMonth") {
                                            fromDate = formatDate(dateThisMonth, "MM/dd/yyyy");
                                            toDate = formatDate(dateThisMonthEnd, "MM/dd/yyyy");
                                        } else {
                                            if (val == "LastMonth") {
                                                fromDate = formatDate(dateLastMonthStart, "MM/dd/yyyy");
                                                toDate = formatDate(dateLastMonthEnd, "MM/dd/yyyy");
                                            } else {
                                                if (val == "AllTime") {
                                                    fromDate = formatDate(dateMonth, "MM/dd/yyyy");
                                                    toDate = formatDate(date, "MM/dd/yyyy");
                                                } else {
                                                    if (val == "All") {
                                                        fromDate = "all";
                                                        toDate = formatDate(date, "MM/dd/yyyy");
                                                    } else {
                                                        var arr = val.split("to");
                                                        fromDate = getMyDateFromFormat(arr[0], "MM-dd-yyyy");
                                                        toDate = getMyDateFromFormat(arr[1], "MM-dd-yyyy");
                                                        fromDate = new Date(parseInt(fromDate.getFullYear(), 10), parseInt(fromDate.getMonth(), 10), parseInt(fromDate.getDate(), 10), 0, 0, 0);
                                                        toDate = new Date(parseInt(toDate.getFullYear(), 10), parseInt(toDate.getMonth(), 10), parseInt(toDate.getDate(), 10), 23, 59, 59);
                                                        fromDateFormat = formatDate(fromDate, "NNN dd, yyyy");
                                                        toDateFormat = formatDate(toDate, "NNN dd, yyyy");
                                                        fromDate = formatDate(fromDate, "MM/dd/yyyy");
                                                        toDate = formatDate(toDate, "MM/dd/yyyy");
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            map["fromDate"] = fromDate;
            map["toDate"] = toDate;
            return map;
        },
        generateUUID: function() {
            return generateUUID();
        },
        concat: function(sourceMap, objectToCopy, property) {
            concat(sourceMap, objectToCopy, property);
        },
        pageTitle: function(name, type) {
            if (!!name && name != "null" && name != "undefined" && !!type) {
                $("title").html(name + " - " + type);
            } else {
                if (!!type) {
                    $("title").html(type);
                } else {
                    if (!!name && name != "null" && name != "undefined") {
                        $("title").html(name);
                    }
                }
            }
        },
        getMaxDocumentSize: function(isEmailAttachment) {
            var attachmentsSizeLimitPerEmail = self.getPropertyValueFromCurrentPlan("attachmentsSizeLimitPerEmail"),
                uploadSizeLimitPerDocument = self.getPropertyValueFromCurrentPlan("uploadSizeLimitPerDocument");
            if (isEmailAttachment) {
                var taskID = DSCRM.Core.getPlugin("url").entityID(),
                    hash = DSCRM.Core.getPlugin("url").hash();
                if (hash.indexOf("#task/") != -1 && !!taskID && taskID.length > 3) {
                    return attachmentsSizeLimitPerEmail * 1000;
                } else {
                    if (!!arguments[1]) {
                        return attachmentsSizeLimitPerEmail * 1000;
                    } else {
                        return 5000;
                    }
                }
            } else {
                return uploadSizeLimitPerDocument * 1000;
            }
        },
        getPropertyValueFromCurrentPlan: function(property) {
            var cache = DSCRM.Core.getPlugin("cache"),
                currentPlanID = cache.get("accountSettings")["planID"],
                plans = cache.get("plans"),
                propertyValue;
            $.each(plans, function(index, value) {
                if (value.id != currentPlanID) {
                    return true;
                }
                propertyValue = value[property];
                return false;
            });
            return propertyValue;
        },
        sortObjects: function(obj, prop) {
            if (obj instanceof Array) {
                obj.sort(function(a, b) {
                    var nameA = a[prop].toLowerCase(),
                        nameB = b[prop].toLowerCase();
                    nameA = !!nameA ? nameA : "";
                    nameB = !!nameB ? nameB : "";
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
            } else {
                if (obj instanceof Object) {
                    var newObj = [];
                    Object.keys(obj).map(function(key) {
                        newObj.push(obj[key]);
                    });
                    return self.sortObjects(newObj, prop);
                }
            }
            return obj;
        },
        sortByNumbers: function(data, field, isAscending) {
            var sortedMap = {},
                sortedArray = [];
            var data1 = 0,
                data2 = 0;
            if ($.isEmptyObject(data)) {
                return;
            }
            Object.keys(data).sort(function(a, b) {
                data1 = data[a][field];
                data2 = data[b][field];
                if (!data1) {
                    data1 = 0;
                }
                if (!data2) {
                    data2 = 0;
                }
                if (isAscending) {
                    return data1 < data2 ? -1 : 1;
                } else {
                    return data1 > data2 ? -1 : 1;
                }
            }).forEach(function(key) {
                if (data instanceof Array) {
                    sortedArray.push(data[key]);
                } else {
                    if (data instanceof Object) {
                        sortedMap[key] = {};
                        sortedMap[key] = data[key];
                    }
                }
            });
            if (data instanceof Array) {
                return sortedArray;
            } else {
                if (data instanceof Object) {
                    return sortedMap;
                }
            }
        },
        getWordsCount: function(text) {
            return getWordsCount(text);
        },
        constructMessage: function(message) {
            return constructMessage(message);
        },
        parseMillisecondsIntoReadableTime: function(milliseconds) {
            var hours = milliseconds / (1000 * 60 * 60);
            var absoluteHours = Math.floor(hours);
            var h = absoluteHours;
            if (absoluteHours > 0) {
                h = "+" + absoluteHours;
            } else {
                h = absoluteHours.toString();
            }
            var m = (milliseconds / (1000 * 60)) % 60;
            if (m < 10) {
                m = "0" + m;
            }
            return h + ":" + m;
        },
        getPersonName: function(firstName, lastName) {
            return getPersonName(firstName, lastName);
        },
        removeHTMLTags: function(str) {
            if (!str) {
                return;
            }
            var lPattern = "",
                startRegExp = /<\s*\w.*?>/g,
                endRegExp = /<\s*\/\s*\w\s*.*?>|<\s*br\s*>/g;
            str = matchString(str, startRegExp);
            str = matchString(str, endRegExp);
            str = str.replace(/&nbsp;/g, "");
            return str;
        },
        removeDuplicatesInArray: function(a) {
            return removeDuplicatesInArray(a);
        },
        getEntityURL: function(data) {
            return getEntityURL(data);
        },
        getTitlesFromNameBasedOnCategory: function(name, category) {
            if (!name || !category) {
                return null;
            }
            var data = {};
            if (category === "person") {
                var index = name.indexOf(" ");
                if (index == -1) {
                    data.firstName = name;
                    data.lastName = "";
                } else {
                    data.lastName = name.substr(index + 1, name.length);
                    data.firstName = name.substr(0, index);
                }
            } else {
                data.fullName = name;
            }
            return data;
        },
        getNameForContact: function(firstName, lastName, fullName) {
            var name;
            if (self.isEmptyObject(firstName) && !self.isEmptyObject(lastName)) {
                name = lastName;
            } else {
                if (self.isEmptyObject(lastName) && !self.isEmptyObject(firstName)) {
                    name = firstName;
                } else {
                    if (!self.isEmptyObject(firstName) && !self.isEmptyObject(lastName)) {
                        name = firstName + " " + lastName;
                    } else {
                        if (!self.isEmptyObject(fullName)) {
                            name = fullName;
                        }
                    }
                }
            }
            return name;
        },
        getFileExtension: function(filename) {
            var dotPosition = filename.lastIndexOf(".");
            if (dotPosition == -1) {
                return "";
            }
            return filename.substr(dotPosition + 1).toLowerCase();
        },
        isSummernoteEmpty: function(code) {
            var isEmpty = false;
            var nonEmptyTags = ["img", "video", "iframe", "audio"];
            var filtered;
            var hasNonEmptyTag = false;
            var stringWithoutTags;
            filtered = $(code).text().replace(/\s+/g, "");
            nonEmptyTags.forEach(function(tag) {
                if ($(code).find(tag).length > 0) {
                    console.log("content contains a tag :" + tag);
                    hasNonEmptyTag = true;
                    return false;
                }
            });
            isEmpty = !(filtered.length > 0 || hasNonEmptyTag);
            return isEmpty;
        },
        setARURLDetailsInCache: function() {
            var connid = getQueryString("connid", null),
                map = {},
                ID = DSCRM.Core.getPlugin("url").entityID(),
                page = DSCRM.Core.getPlugin("url").page(),
                userPIN, calltype, windowARURL = window.location.href;
            href = DSCRM.Core.getPlugin("url").href();
            if (!!connid) {
                map["ID"] = ID;
                map["entity"] = page;
                userPIN = getQueryString("userpin", null);
                calltype = getQueryString("calltype", null);
                if (!!connid) {
                    sessionStorage["connectionid"] = connid;
                    sessionStorage["windowARURL"] = windowARURL;
                    map["connectionid"] = connid;
                    map["windowARURL"] = windowARURL;
                }
                if (!!userPIN) {
                    sessionStorage["userpin"] = userPIN;
                    map["userpin"] = userPIN;
                }
                if (!!calltype) {
                    sessionStorage["calltype"] = calltype;
                    map["calltype"] = calltype;
                }
                DSCRM.Core.getPlugin("cache").update({
                    arDetailMap: map
                });
            }
        },
        linkify: function(inputText) {
            var linkClass, targetBlank;
            linkClass = "url";
            targetBlank = true;
            inputText = inputText.replace(/\u200B/g, "");
            inputText = inputText.replace(/^\s+|\s+$/gm, "");
            var replacePattern1 = /(src="|" | href="|">|\s>)?(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;�]*[-A-Z0-9+&@#\/%=~_|�]/gim;
            var replacePattern1 = /(src="|href="|">|\s>)?(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;�]*[-A-Z0-9+&@#\/%=~_|�]/gim;
            var replacedText = inputText.replace(replacePattern1, function($0, $1) {
                return $1 ? $0 : '<a class="' + linkClass + '" href="' + $0 + '"' + (targetBlank ? 'target="_blank"' : "") + ">" + $0 + "</a>";
            });
            var replacePattern2 = /(src="|href="|">|\s>|https?:\/\/|ftp:\/\/)?www\.[-A-Z0-9+&@#\/%?=~_|!:,.;�]*[-A-Z0-9+&@#\/%=~_|�]/gim;
            var replacedText = replacedText.replace(replacePattern2, function($0, $1) {
                return $1 ? $0 : '<a class="' + linkClass + '" href="http://' + $0 + '"' + (targetBlank ? 'target="_blank"' : "") + ">" + $0 + "</a>";
            });
            return replacedText;
        },
        getARURLParameter: function(param) {
            var ans, mapArDetail = _cachePlugin.get("arDetailMap");
            if (!self.isEmptyObject(mapArDetail)) {
                ans = mapArDetail[param];
            }
            if (!ans) {
                ans = sessionStorage[param];
            }
            if (!ans) {
                ans = getQueryString(param);
            }
            if (!ans) {
                return "";
            }
            return ans;
        },
        isElementInViewport: function(el) {
            if (typeof jQuery === "function" && el instanceof jQuery) {
                el = el[0];
            }
            var rect = el.getBoundingClientRect();
            return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth));
        },
        Decoder: {
            isEmpty: function(val) {
                if (val) {
                    return ((val === null) || val.length == 0 || /^\s+$/.test(val));
                } else {
                    return true;
                }
            },
            arr1: ["&nbsp;", "&iexcl;", "&cent;", "&pound;", "&curren;", "&yen;", "&brvbar;", "&sect;", "&uml;", "&copy;", "&ordf;", "&laquo;", "&not;", "&shy;", "&reg;", "&macr;", "&deg;", "&plusmn;", "&sup2;", "&sup3;", "&acute;", "&micro;", "&para;", "&middot;", "&cedil;", "&sup1;", "&ordm;", "&raquo;", "&frac14;", "&frac12;", "&frac34;", "&iquest;", "&Agrave;", "&Aacute;", "&Acirc;", "&Atilde;", "&Auml;", "&Aring;", "&AElig;", "&Ccedil;", "&Egrave;", "&Eacute;", "&Ecirc;", "&Euml;", "&Igrave;", "&Iacute;", "&Icirc;", "&Iuml;", "&ETH;", "&Ntilde;", "&Ograve;", "&Oacute;", "&Ocirc;", "&Otilde;", "&Ouml;", "&times;", "&Oslash;", "&Ugrave;", "&Uacute;", "&Ucirc;", "&Uuml;", "&Yacute;", "&THORN;", "&szlig;", "&agrave;", "&aacute;", "&acirc;", "&atilde;", "&auml;", "&aring;", "&aelig;", "&ccedil;", "&egrave;", "&eacute;", "&ecirc;", "&euml;", "&igrave;", "&iacute;", "&icirc;", "&iuml;", "&eth;", "&ntilde;", "&ograve;", "&oacute;", "&ocirc;", "&otilde;", "&ouml;", "&divide;", "&oslash;", "&ugrave;", "&uacute;", "&ucirc;", "&uuml;", "&yacute;", "&thorn;", "&yuml;", "&quot;", "&amp;", "&lt;", "&gt;", "&OElig;", "&oelig;", "&Scaron;", "&scaron;", "&Yuml;", "&circ;", "&tilde;", "&ensp;", "&emsp;", "&thinsp;", "&zwnj;", "&zwj;", "&lrm;", "&rlm;", "&ndash;", "&mdash;", "&lsquo;", "&rsquo;", "&sbquo;", "&ldquo;", "&rdquo;", "&bdquo;", "&dagger;", "&Dagger;", "&permil;", "&lsaquo;", "&rsaquo;", "&euro;", "&fnof;", "&Alpha;", "&Beta;", "&Gamma;", "&Delta;", "&Epsilon;", "&Zeta;", "&Eta;", "&Theta;", "&Iota;", "&Kappa;", "&Lambda;", "&Mu;", "&Nu;", "&Xi;", "&Omicron;", "&Pi;", "&Rho;", "&Sigma;", "&Tau;", "&Upsilon;", "&Phi;", "&Chi;", "&Psi;", "&Omega;", "&alpha;", "&beta;", "&gamma;", "&delta;", "&epsilon;", "&zeta;", "&eta;", "&theta;", "&iota;", "&kappa;", "&lambda;", "&mu;", "&nu;", "&xi;", "&omicron;", "&pi;", "&rho;", "&sigmaf;", "&sigma;", "&tau;", "&upsilon;", "&phi;", "&chi;", "&psi;", "&omega;", "&thetasym;", "&upsih;", "&piv;", "&bull;", "&hellip;", "&prime;", "&Prime;", "&oline;", "&frasl;", "&weierp;", "&image;", "&real;", "&trade;", "&alefsym;", "&larr;", "&uarr;", "&rarr;", "&darr;", "&harr;", "&crarr;", "&lArr;", "&uArr;", "&rArr;", "&dArr;", "&hArr;", "&forall;", "&part;", "&exist;", "&empty;", "&nabla;", "&isin;", "&notin;", "&ni;", "&prod;", "&sum;", "&minus;", "&lowast;", "&radic;", "&prop;", "&infin;", "&ang;", "&and;", "&or;", "&cap;", "&cup;", "&int;", "&there4;", "&sim;", "&cong;", "&asymp;", "&ne;", "&equiv;", "&le;", "&ge;", "&sub;", "&sup;", "&nsub;", "&sube;", "&supe;", "&oplus;", "&otimes;", "&perp;", "&sdot;", "&lceil;", "&rceil;", "&lfloor;", "&rfloor;", "&lang;", "&rang;", "&loz;", "&spades;", "&clubs;", "&hearts;", "&diams;"],
            arr2: ["&#160;", "&#161;", "&#162;", "&#163;", "&#164;", "&#165;", "&#166;", "&#167;", "&#168;", "&#169;", "&#170;", "&#171;", "&#172;", "&#173;", "&#174;", "&#175;", "&#176;", "&#177;", "&#178;", "&#179;", "&#180;", "&#181;", "&#182;", "&#183;", "&#184;", "&#185;", "&#186;", "&#187;", "&#188;", "&#189;", "&#190;", "&#191;", "&#192;", "&#193;", "&#194;", "&#195;", "&#196;", "&#197;", "&#198;", "&#199;", "&#200;", "&#201;", "&#202;", "&#203;", "&#204;", "&#205;", "&#206;", "&#207;", "&#208;", "&#209;", "&#210;", "&#211;", "&#212;", "&#213;", "&#214;", "&#215;", "&#216;", "&#217;", "&#218;", "&#219;", "&#220;", "&#221;", "&#222;", "&#223;", "&#224;", "&#225;", "&#226;", "&#227;", "&#228;", "&#229;", "&#230;", "&#231;", "&#232;", "&#233;", "&#234;", "&#235;", "&#236;", "&#237;", "&#238;", "&#239;", "&#240;", "&#241;", "&#242;", "&#243;", "&#244;", "&#245;", "&#246;", "&#247;", "&#248;", "&#249;", "&#250;", "&#251;", "&#252;", "&#253;", "&#254;", "&#255;", "&#34;", "&#38;", "&#60;", "&#62;", "&#338;", "&#339;", "&#352;", "&#353;", "&#376;", "&#710;", "&#732;", "&#8194;", "&#8195;", "&#8201;", "&#8204;", "&#8205;", "&#8206;", "&#8207;", "&#8211;", "&#8212;", "&#8216;", "&#8217;", "&#8218;", "&#8220;", "&#8221;", "&#8222;", "&#8224;", "&#8225;", "&#8240;", "&#8249;", "&#8250;", "&#8364;", "&#402;", "&#913;", "&#914;", "&#915;", "&#916;", "&#917;", "&#918;", "&#919;", "&#920;", "&#921;", "&#922;", "&#923;", "&#924;", "&#925;", "&#926;", "&#927;", "&#928;", "&#929;", "&#931;", "&#932;", "&#933;", "&#934;", "&#935;", "&#936;", "&#937;", "&#945;", "&#946;", "&#947;", "&#948;", "&#949;", "&#950;", "&#951;", "&#952;", "&#953;", "&#954;", "&#955;", "&#956;", "&#957;", "&#958;", "&#959;", "&#960;", "&#961;", "&#962;", "&#963;", "&#964;", "&#965;", "&#966;", "&#967;", "&#968;", "&#969;", "&#977;", "&#978;", "&#982;", "&#8226;", "&#8230;", "&#8242;", "&#8243;", "&#8254;", "&#8260;", "&#8472;", "&#8465;", "&#8476;", "&#8482;", "&#8501;", "&#8592;", "&#8593;", "&#8594;", "&#8595;", "&#8596;", "&#8629;", "&#8656;", "&#8657;", "&#8658;", "&#8659;", "&#8660;", "&#8704;", "&#8706;", "&#8707;", "&#8709;", "&#8711;", "&#8712;", "&#8713;", "&#8715;", "&#8719;", "&#8721;", "&#8722;", "&#8727;", "&#8730;", "&#8733;", "&#8734;", "&#8736;", "&#8743;", "&#8744;", "&#8745;", "&#8746;", "&#8747;", "&#8756;", "&#8764;", "&#8773;", "&#8776;", "&#8800;", "&#8801;", "&#8804;", "&#8805;", "&#8834;", "&#8835;", "&#8836;", "&#8838;", "&#8839;", "&#8853;", "&#8855;", "&#8869;", "&#8901;", "&#8968;", "&#8969;", "&#8970;", "&#8971;", "&#9001;", "&#9002;", "&#9674;", "&#9824;", "&#9827;", "&#9829;", "&#9830;"],
            HTML2Numerical: function(s) {
                return this.swapArrayVals(s, this.arr1, this.arr2);
            },
            htmlDecode: function(s) {
                var c, m, d = s;
                if (this.isEmpty(d)) {
                    return "";
                }
                d = this.HTML2Numerical(d);
                var arr = d.match(/&#[0-9]{1,5};/g);
                if (arr != null) {
                    for (var x = 0; x < arr.length; x++) {
                        m = arr[x];
                        c = m.substring(2, m.length - 1);
                        if (c >= -32768 && c <= 65535) {
                            d = d.replace(m, String.fromCharCode(c));
                        } else {
                            d = d.replace(m, "");
                        }
                    }
                }
                return d;
            },
            swapArrayVals: function(s, arr1, arr2) {
                if (this.isEmpty(s)) {
                    return "";
                }
                var re;
                if (arr1 && arr2) {
                    if (arr1.length == arr2.length) {
                        for (var x = 0, i = arr1.length; x < i; x++) {
                            re = new RegExp(arr1[x], "g");
                            s = s.replace(re, arr2[x]);
                        }
                    }
                }
                return s;
            },
        },
        removeSplCharsFromPhoneNo: function(number) {
            number = number.replace(/[^0-9]/g, "");
            if (number.length == 10) {
                number = "+1" + number;
            } else {
                if (number.length > 10) {
                    number = "+" + number;
                }
            }
            return number;
        },
        mergeMaps: function(map1, map2) {
            var nMap = {};
            if (!map2 && !map1) {
                return nMap;
            }
            if (!map2) {
                nMap = JSON.parse(JSON.stringify(map1));
                return nMap;
            } else {
                if (!map1) {
                    nMap = JSON.parse(JSON.stringify(map2));
                    return nMap;
                }
            }
            nMap = JSON.parse(JSON.stringify(map2));
            $.each(map1, function(key, value) {
                nMap[key] = value;
            });
            return nMap;
        },
        getBrowserDetails: function() {
            var browserInfo = {},
                browser = {};
            browser.mozilla = false;
            browser.webkit = false;
            browser.opera = false;
            browser.safari = false;
            browser.chrome = false;
            browser.msie = false;
            browser.android = false;
            var nAgt = navigator.userAgent;
            browser.ua = nAgt;
            browser.name = navigator.appName;
            browser.fullVersion = "" + parseFloat(navigator.appVersion);
            browser.majorVersion = parseInt(navigator.appVersion, 10);
            var nameOffset, verOffset, ix;
            if ((verOffset = nAgt.indexOf("Opera")) != -1) {
                browser.opera = true;
                browser.name = "Opera";
                browser.fullVersion = nAgt.substring(verOffset + 6);
                if ((verOffset = nAgt.indexOf("Version")) != -1) {
                    browser.fullVersion = nAgt.substring(verOffset + 8);
                }
            } else {
                if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
                    browser.msie = true;
                    browser.name = "Microsoft Internet Explorer";
                    browser.fullVersion = nAgt.substring(verOffset + 5);
                } else {
                    if (nAgt.indexOf("Trident") != -1) {
                        browser.msie = true;
                        browser.name = "Microsoft Internet Explorer";
                        var start = nAgt.indexOf("rv:") + 3;
                        var end = start + 4;
                        browser.fullVersion = nAgt.substring(start, end);
                    } else {
                        if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
                            browser.webkit = true;
                            browser.chrome = true;
                            browser.name = "Chrome";
                            browser.fullVersion = nAgt.substring(verOffset + 7);
                        } else {
                            if ((verOffset = nAgt.indexOf("Safari")) != -1) {
                                browser.webkit = true;
                                browser.safari = true;
                                browser.name = "Safari";
                                browser.fullVersion = nAgt.substring(verOffset + 7);
                                if ((verOffset = nAgt.indexOf("Version")) != -1) {
                                    browser.fullVersion = nAgt.substring(verOffset + 8);
                                }
                            } else {
                                if ((verOffset = nAgt.indexOf("AppleWebkit")) != -1) {
                                    browser.webkit = true;
                                    browser.name = "Safari";
                                    browser.fullVersion = nAgt.substring(verOffset + 7);
                                    if ((verOffset = nAgt.indexOf("Version")) != -1) {
                                        browser.fullVersion = nAgt.substring(verOffset + 8);
                                    }
                                } else {
                                    if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
                                        browser.mozilla = true;
                                        browser.name = "Firefox";
                                        browser.fullVersion = nAgt.substring(verOffset + 8);
                                    } else {
                                        if ((nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/"))) {
                                            browser.name = nAgt.substring(nameOffset, verOffset);
                                            browser.fullVersion = nAgt.substring(verOffset + 1);
                                            if (browser.name.toLowerCase() == browser.name.toUpperCase()) {
                                                browser.name = navigator.appName;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if ((ix = browser.fullVersion.indexOf(";")) != -1) {
                browser.fullVersion = browser.fullVersion.substring(0, ix);
            }
            if ((ix = browser.fullVersion.indexOf(" ")) != -1) {
                browser.fullVersion = browser.fullVersion.substring(0, ix);
            }
            browser.majorVersion = parseInt("" + browser.fullVersion, 10);
            if (isNaN(browser.majorVersion)) {
                browser.fullVersion = "" + parseFloat(navigator.appVersion);
                browser.majorVersion = parseInt(navigator.appVersion, 10);
            }
            browser.version = browser.majorVersion;
            browserInfo["url"] = window.location.href;
            browserInfo["version"] = browser.fullVersion;
            browserInfo["platform"] = navigator["platform"];
            browserInfo["browser"] = browser.name;
            return browserInfo;
        },
        now: Date.now || function() {
            return new Date().getTime();
        },
        clearRange: function() {
            if (!!document.createRange) {
                document.getSelection().removeAllRanges();
            }
        },
        throttle: function(func, wait, options) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            if (!options) {
                options = {};
            }
            var later = function() {
                previous = options.leading === false ? 0 : Date.now();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            };
            return function() {
                var now = Date.now();
                if (!previous && options.leading === false) {
                    previous = now;
                }
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) {
                        context = args = null;
                    }
                } else {
                    if (!timeout && options.trailing !== false) {
                        timeout = setTimeout(later, remaining);
                    }
                }
                return result;
            };
        },
        debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        },
        putCursorAtEnd: function(el) {
            return el.each(function() {
                if (!el.is(":focus")) {
                    el.focus();
                }
                if (el.setSelectionRange) {
                    var len = el.val().length * 2;
                    setTimeout(function() {
                        el.setSelectionRange(len, len);
                    }, 1);
                } else {
                    el.val(el.val());
                }
                el.scrollTop = 999999;
            });
        },
        isHtmlString: function(content) {
            return /<[a-z][\s\S]*>/i.test(content);
        },
        containsSpecialChars: function(content) {
            return false;
            if ($.trim(content) == "") {
                return false;
            }
            var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`=";
            for (i = 0; i < specialChars.length; i++) {
                if (content.indexOf(specialChars[i]) > -1) {
                    return true;
                }
            }
            return false;
        },
        isPositiveNumber: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) > 0;
        },
        cleanSummernoteHtml: function(pastedHtml) {
            var cleanedHtml;
            console.warn("Html content before cleaning");
            console.warn(pastedHtml);
            var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
            cleanedHtml = pastedHtml.replace(stringStripper, " ");
            var commentSripper = new RegExp("<!--(.*?)-->", "g");
            cleanedHtml = cleanedHtml.replace(commentSripper, "");
            var tagStripper = new RegExp("<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>", "gi");
            cleanedHtml = cleanedHtml.replace(tagStripper, "");
            var badTags = ["style", "script", "applet", "embed", "noframes", "noscript"];
            for (var i = 0; i < badTags.length; i++) {
                var tagStripper = new RegExp("<" + badTags[i] + ".*?" + badTags[i] + "(.*?)>", "gi");
                cleanedHtml = cleanedHtml.replace(tagStripper, "");
            }
            var badAttributes = ["start", "data-id", "data-history-id"];
            for (var i = 0; i < badAttributes.length; i++) {
                var attributeStripper = new RegExp(" " + badAttributes[i] + '="(.*?)"', "gi");
                cleanedHtml = cleanedHtml.replace(attributeStripper, "");
            }
            var badStyleAttr = ["position", "max-height"];
            for (var i = 0; i < badStyleAttr.length; i++) {
                var styleAttributeStripper = new RegExp(" " + badStyleAttr[i] + ": (.*?;)", "gi");
                cleanedHtml = cleanedHtml.replace(styleAttributeStripper, "");
            }
            console.warn("Html content after cleaning");
            console.warn(cleanedHtml);
            return cleanedHtml;
        },
        navigateList: function(e) {
            var ul = $(e.target).siblings("ul.dropdown-menu");
            input = $(e.target);
            if (ul.children().length == 0) {
                return;
            }
            var selectedEl = ul.find(".select"),
                firstEl = ul.find("li:first-child"),
                lastEl = ul.find("li:last-child"),
                nextEl, prevEl;
            if (e.which == 40) {
                if (selectedEl.length == 0) {
                    ul.find("li:first-child").addClass("select");
                } else {
                    nextEl = selectedEl.next("li").length ? selectedEl.next("li") : firstEl;
                    selectedEl.removeClass("select");
                    nextEl.addClass("select");
                }
            } else {
                if (e.which == 38) {
                    if (selectedEl.length == 0) {
                        ul.find("li:last-child").addClass("select");
                    } else {
                        prevEl = selectedEl.prev("li").length ? selectedEl.prev("li") : lastEl;
                        selectedEl.removeClass("select");
                        prevEl.addClass("select");
                    }
                } else {
                    if (e.which == 13) {
                        if (selectedEl.length != 0) {
                            input.val(selectedEl.children().text());
                            selectedEl.removeClass("select");
                            ul.removeClass("show");
                            ul.parent().removeClass("open");
                        }
                    }
                }
            }
        },
        toInitCaps: function(string) {
            if (!string) {
                return string;
            }
            var nameArray = string.split(" "),
                i, outputName = "";
            for (i = 0; i < nameArray.length; i++) {
                outputName = outputName + " " + nameArray[i].charAt(0).toUpperCase() + nameArray[i].slice(1);
            }
            return $.trim(outputName);
        },
        checkAndTrimLastArrayContent: function(inputList, param) {
            if (self.isEmptyObject(inputList)) {
                return;
            }
            if (inputList.constructor === Array && inputList[inputList.length - 1] == param) {
                inputList.pop();
            } else {
                if (inputList == param) {
                    return null;
                }
            }
            return inputList;
        },
        getProductLogo: function(brandID) {
            var products = DSCRM.Core.getPlugin("cache").get("products"),
                productLogo;
            var defaultProductImage = "../images/default-image/defaultlead_img.png";
            if (!!brandID) {
                $.each(products, function(index, value) {
                    if (value.brandID == brandID) {
                        if (!!value.brandImages) {
                            productLogo = value.brandImages;
                        }
                        return false;
                    }
                });
                return productLogo;
            } else {
                return defaultProductImage;
            }
        },
        filterByDepartmentID: function(map) {
            var newMap = {},
                departmentID = DSCRM.Core.getPlugin("cache").get("selectedDepartmentID");
            if ($.isEmptyObject(map)) {
                return newMap;
            }
            $.each(map, function(key, obj) {
                if (obj.departmentID == departmentID) {
                    newMap[key] = obj;
                }
            });
            return newMap;
        }
    };
});
DSCRM.Core.registerPlugin("url", function($) {
    var path, hash, entityID, page, subtab;
    var onHashChange = function(hashStr) {
            hash = hashStr;
            entityID = page = subtab = undefined;
            var parts = hashStr.split("/"),
                index;
            page = parts[0];
            if (!page) {
                return;
            }
            page = page.substr(1);
            if (parts.length < 2) {
                if (page.indexOf("accounts?phone") != -1) {
                    page = "accounts";
                    return;
                } else {
                    return;
                }
            }
            if (page == "settings" || parts[1] == "Temp") {
                subtab = parts[1];
            } else {
                if (parts[1].indexOf("?") != -1) {
                    entityID = parts[1].substr(0, parts[1].indexOf("?"));
                } else {
                    entityID = parts[1];
                }
            }
        },
        getQueryString = function(key, default_) {
            if (default_ == null) {
                default_ = "";
            }
            key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
            var qs = regex.exec(window.location.href);
            if (qs == null) {
                return default_;
            } else {
                return qs[1];
            }
        };
    return {
        init: function() {
            path = window.location.origin;
            console.info("url-plugin :" + path);
            $(window).on("hashchange", function(e) {
                onHashChange(window.location.hash);
                console.info("url-plugin - hashchange : " + JSON.stringify({
                    path: path,
                    hash: hash,
                    entity: page,
                    entityID: entityID,
                    subTab: subtab
                }));
                DSCRM.Core.publish("hash-changed", {
                    path: path,
                    hash: hash,
                    entity: page,
                    entityID: entityID,
                    subTab: subtab
                });
            });
        },
        path: function() {
            return path;
        },
        hash: function() {
            return hash;
        },
        entityID: function() {
            return entityID;
        },
        subtab: function() {
            return subtab;
        },
        page: function() {
            return page;
        },
        href: function() {
            return window.location.href;
        },
        changeHash: function(type, ID) {
            if (!!ID) {
                window.location.hash = "#" + type + "/" + ID;
            } else {
                window.location.hash = "#" + type;
            }
        },
        openHashInNewTab: function(type, ID) {
            var appUrl = DSCRM.Core.getPlugin("cache").get("appURL") + "/crm";
            if (!!ID) {
                appUrl = "#" + type + "/" + ID;
            } else {
                appUrl = "#" + type;
            }
            var win = window.open(appUrl, "_blank");
            win.focus();
        },
        getQueryString: function(key, default_) {
            return getQueryString(key, default_);
        },
        changeHref: function(href) {
            if (!href) {
                return;
            }
            window.location.href = href;
        }
    };
});