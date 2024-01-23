import Store from 'beedle';
import { get, post } from './requests';

let _saveUrl;
let _onPost;
let _onLoad;

const store = new Store({
	actions: {
		setData(context, items, saveData) {
			context.commit('setData', items);
			if (saveData) this.save(items);
		},

		load(context, { loadUrl, saveUrl, items, saveAlways }) {
			_saveUrl = saveUrl;
			const saveA = saveAlways || saveAlways === undefined;
			context.commit('setSaveAlways', saveA);
			if (_onLoad) {
				_onLoad().then(x => {
					if (items && items.length > 0 && x.length === 0) {
						items.forEach(y => x.push(y));
					}
					this.setData(context, x);
				});
			} else if (loadUrl) {
				get(loadUrl).then(x => {
					if (items && items.length > 0 && x.length === 0) {
						items.forEach(y => x.push(y));
					}
					this.setData(context, x);
				});
			} else {
				this.setData(context, items);
			}
		},

		create(context, element) {
			const { items, saveAlways } = context.state;
			items.push(element);
			this.setData(context, items, saveAlways);
		},

		delete(context, element) {
			const { items, saveAlways } = context.state;
			items.splice(items.indexOf(element), 1);
			this.setData(context, items, saveAlways);
		},

		deleteLastItem(context) {
			const { lastItem } = context.state;
			if (lastItem) {
				this.delete(context, lastItem);
				context.commit('setLastItem', null);
			}
		},

		resetLastItem(context) {
			const { lastItem } = context.state;
			if (lastItem) {
				context.commit('setLastItem', null);
				// console.log('resetLastItem');
			}
		},

		post(context) {
			const { items } = context.state;
			this.setData(context, items, true);
		},

		updateOrder(context, elements) {
			const { saveAlways } = context.state;
			const newData = elements.filter(x => x && !x.parentId);
			elements.filter(x => x && x.parentId).forEach(x => newData.push(x));
			this.setData(context, newData, saveAlways);
		},

		insertItem(context, item) {
			// console.log('insertItem', item);
			context.commit('setLastItem', item.isContainer ? null : item);
		},

		save(items) {
			if (_onPost) {
				_onPost({ task_data: items });
			} else if (_saveUrl) {
				post(_saveUrl, { task_data: items });
			}
		},
	},

	mutations: {
		setData(state, payload) {
			// eslint-disable-next-line no-param-reassign
			state.items = payload;
			return state;
		},
		setSaveAlways(state, payload) {
			// eslint-disable-next-line no-param-reassign
			state.saveAlways = payload;
			return state;
		},
		setLastItem(state, payload) {
			// eslint-disable-next-line no-param-reassign
			state.lastItem = payload;
			// console.log('setLastItem', payload);
			return state;
		},
	},

	initialState: {
		items: [],
		saveAlways: true,
		lastItem: null,
	},
});

store.setExternalHandler = (onLoad, onPost) => {
	_onLoad = onLoad;
	_onPost = onPost;
};

export default store;
