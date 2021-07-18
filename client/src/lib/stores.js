import { writable } from 'svelte/store';
import { browser } from '$app/env';

let jwt = null;
if (browser) {
	const KEY = 'jwt';
	jwt = writable(localStorage.getItem(KEY) || null);
	jwt.subscribe(value => value ? localStorage.setItem(KEY, value) : localStorage.removeItem(KEY));
}
export { jwt };
