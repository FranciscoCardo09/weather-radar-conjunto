export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".gitkeep"]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.dC_HyOm-.js",app:"_app/immutable/entry/app.D1sQNXaU.js",imports:["_app/immutable/entry/start.dC_HyOm-.js","_app/immutable/chunks/AGS36fEn.js","_app/immutable/chunks/D3onIxrH.js","_app/immutable/chunks/D-XqJJ3s.js","_app/immutable/entry/app.D1sQNXaU.js","_app/immutable/chunks/D3onIxrH.js","_app/immutable/chunks/BUzLhcr0.js","_app/immutable/chunks/B9iJ3e22.js","_app/immutable/chunks/D-XqJJ3s.js","_app/immutable/chunks/8GWtkEVA.js","_app/immutable/chunks/BLaX_Sos.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/compare",
				pattern: /^\/compare\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/weather/[city_id]",
				pattern: /^\/weather\/([^/]+?)\/?$/,
				params: [{"name":"city_id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
