import assert from 'node:assert/strict';
import test from 'node:test';

import { PDFDocument } from 'pdf-lib';
import {
	buildPetitionEmailPackage,
	buildPetitionPdf,
	safePetitionFilename,
} from '../src/lib/petition-delivery.ts';

const delivery = {
	title: 'Protect bicycle owners',
	draft: 'Protect bicycle owners\n\nTo: City Council, City of Example\n\nFund secure bicycle parking and publish a local theft analysis.\n\nPlease acknowledge this petition.',
	recipient: 'council@example.gov',
	submitter: 'rider@example.org',
	filename: 'city-of-example-bicycle-safety',
};

test('creates a readable PDF containing the full petition document structure', async () => {
	const bytes = await buildPetitionPdf(delivery);
	assert.equal(Buffer.from(bytes.subarray(0, 4)).toString(), '%PDF');
	const document = await PDFDocument.load(bytes);
	assert.equal(document.getTitle(), delivery.title);
	assert.ok(document.getPageCount() >= 1);
});

test('creates an RFC 822 email with To, Cc, full text, and a valid PDF attachment', async () => {
	const email = await buildPetitionEmailPackage(delivery);
	assert.match(email, /^To: council@example\.gov\r\nCc: rider@example\.org\r\n/);
	assert.match(email, /Content-Type: multipart\/mixed/);
	assert.match(email, /Content-Disposition: attachment; filename="city-of-example-bicycle-safety\.pdf"/);

	const textMatch = email.match(/Content-Type: text\/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n([\s\S]*?)\r\n--/);
	assert.ok(textMatch);
	assert.equal(Buffer.from(textMatch[1].replace(/\s/g, ''), 'base64').toString(), delivery.draft);

	const pdfMatch = email.match(/Content-Type: application\/pdf[^]*?Content-Disposition: attachment[^]*?\r\n\r\n([\s\S]*?)\r\n--/);
	assert.ok(pdfMatch);
	const attachedPdf = Buffer.from(pdfMatch[1].replace(/\s/g, ''), 'base64');
	assert.equal(attachedPdf.subarray(0, 4).toString(), '%PDF');
	assert.ok((await PDFDocument.load(attachedPdf)).getPageCount() >= 1);
});

test('generates a bounded attachment-safe filename', () => {
	assert.equal(safePetitionFilename('City of Example — Bicycle Safety!'), 'city-of-example-bicycle-safety');
});
