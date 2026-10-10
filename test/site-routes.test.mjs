import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const routes = [
	'index.html',
	'contact/index.html',
	'operations/index.html',
	'origins/dc-2012/index.html',
	'city-program/index.html',
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

test('historical DC material is qualified and not presented as current data or automatic authority', async () => {
	const html = await readFile(new URL('../dist/origins/dc-2012/index.html', import.meta.url), 'utf8');
	assert.match(html, /July 19, 2012/);
	assert.match(html, /not verified counts or current trends/);
	assert.match(html, /not a warrant/);
	assert.match(html, /\/city-program\//);
});

test('city-program guidance makes legal review, privacy, and response safety explicit', async () => {
	const html = await readFile(new URL('../dist/city-program/index.html', import.meta.url), 'utf8');
	assert.match(html, /Local rules/);
	assert.match(html, /legal authority/);
	assert.match(html, /privacy/);
	assert.match(html, /No documented lawful authority/);
	assert.match(html, /no arrest quotas/);
	assert.match(html, /\/origins\/dc-2012\//);
});

test('homepage and resources connect the historical proposal and city framework', async () => {
	for (const route of ['index.html', 'resources/index.html']) {
		const html = await readFile(new URL(`../dist/${route}`, import.meta.url), 'utf8');
		assert.match(html, /\/city-program\//);
		assert.match(html, /\/origins\/dc-2012\//);
	}
});

test('petition page discloses the carbon copy and attached-PDF delivery behavior', async () => {
	const html = await readFile(new URL('../dist/petitions/index.html', import.meta.url), 'utf8');
	assert.match(html, /carbon-copied to you/i);
	assert.match(html, /with the full petition attached/i);
	assert.match(html, /Email \+ PDF \(\.eml\)/);
});
