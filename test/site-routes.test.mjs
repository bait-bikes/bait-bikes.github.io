import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const routes = [
	'index.html',
	'contact/index.html',
	'operations/index.html',
	'partners/index.html',
	'petitions/index.html',
	'resources/index.html',
	'technology/index.html',
	'theft-intelligence/index.html',
	'why-bikes/index.html',
];

test('build emits every public route', async () => {
	for (const route of routes) {
		const html = await readFile(new URL(`../dist/${route}`, import.meta.url), 'utf8');
		assert.match(html, /<!doctype html>/i, route);
	}
});

test('shared navigation links to the canonical user login and signup routes', async () => {
	const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
	assert.match(html, /https:\/\/user\.baitbikes\.org\/login/);
	assert.match(html, /https:\/\/user\.baitbikes\.org\/signup/);
});

test('every route declares baitbikes.org as its canonical public origin', async () => {
	for (const route of routes) {
		const html = await readFile(new URL(`../dist/${route}`, import.meta.url), 'utf8');
		assert.match(html, /<link rel="canonical" href="https:\/\/baitbikes\.org\//, route);
		assert.doesNotMatch(html, /rel="canonical" href="https:\/\/bait-bikes\.github\.io/, route);
	}
});

test('petition page discloses the carbon copy and attached-PDF delivery behavior', async () => {
	const html = await readFile(new URL('../dist/petitions/index.html', import.meta.url), 'utf8');
	assert.match(html, /carbon-copied to you/i);
	assert.match(html, /with the full petition attached/i);
	assert.match(html, /Email \+ PDF \(\.eml\)/);
});
