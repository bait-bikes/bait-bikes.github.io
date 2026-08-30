import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface PetitionDelivery {
	draft: string;
	title: string;
	recipient: string;
	submitter: string;
	filename: string;
}

type PdfFont = Awaited<ReturnType<PDFDocument['embedFont']>>;

export const safePetitionFilename = (value: string) => value
	.toLowerCase()
	.normalize('NFKD')
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-|-$/g, '')
	.slice(0, 64) || 'bicycle-safety-petition';

const bytesToBase64 = (bytes: Uint8Array) => {
	let binary = '';
	for (let index = 0; index < bytes.length; index += 0x8000) {
		binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
	}
	return btoa(binary);
};

const wrapBase64 = (value: string) => value.match(/.{1,76}/g)?.join('\r\n') ?? '';
const encodeHeader = (value: string) => `=?UTF-8?B?${bytesToBase64(new TextEncoder().encode(value))}?=`;

const displayable = (value: string, font: PdfFont) => [...value].map((character) => {
	if (character === '\n' || character === '\r') return character;
	try {
		font.encodeText(character);
		return character;
	} catch {
		return '?';
	}
}).join('');

const wrapPdfLine = (value: string, font: PdfFont, size: number, width: number) => {
	if (!value) return [''];
	const lines: string[] = [];
	let line = '';
	for (const token of value.split(/\s+/)) {
		const candidate = line ? `${line} ${token}` : token;
		if (font.widthOfTextAtSize(candidate, size) <= width) {
			line = candidate;
			continue;
		}
		if (line) lines.push(line);
		if (font.widthOfTextAtSize(token, size) <= width) {
			line = token;
			continue;
		}
		let segment = '';
		for (const character of token) {
			if (font.widthOfTextAtSize(segment + character, size) > width && segment) {
				lines.push(segment);
				segment = character;
			} else {
				segment += character;
			}
		}
		line = segment;
	}
	if (line) lines.push(line);
	return lines;
};

export const buildPetitionPdf = async ({ draft, title }: Pick<PetitionDelivery, 'draft' | 'title'>) => {
	const document = await PDFDocument.create();
	document.setTitle(title);
	document.setSubject('Bicycle-safety petition prepared with the Bait Bikes browser-only toolkit');
	document.setCreator('Bait Bikes Petition Toolkit');
	const regular = await document.embedFont(StandardFonts.Helvetica);
	const bold = await document.embedFont(StandardFonts.HelveticaBold);
	const width = 612;
	const height = 792;
	const margin = 54;
	const bodySize = 11;
	const lineHeight = 15;
	let page = document.addPage([width, height]);
	let y = height - margin;
	const safeDraft = displayable(draft, regular);
	const addPage = () => {
		page = document.addPage([width, height]);
		y = height - margin;
	};

	for (const [paragraphIndex, paragraph] of safeDraft.split('\n').entries()) {
		const isTitle = paragraphIndex === 0;
		const font = isTitle ? bold : regular;
		const size = isTitle ? 16 : bodySize;
		const spacing = isTitle ? 20 : lineHeight;
		for (const line of wrapPdfLine(paragraph, font, size, width - margin * 2)) {
			if (y < margin + spacing) addPage();
			if (line) page.drawText(line, { x: margin, y, size, font, color: rgb(0.04, 0.1, 0.09) });
			y -= spacing;
		}
	}

	const pages = document.getPages();
	pages.forEach((item, index) => item.drawText(`Prepared with Bait Bikes · Page ${index + 1} of ${pages.length}`, {
		x: margin,
		y: 28,
		size: 8,
		font: regular,
		color: rgb(0.35, 0.4, 0.38),
	}));
	return document.save();
};

export const buildPetitionEmailPackage = async (delivery: PetitionDelivery, providedPdf?: Uint8Array) => {
	const pdf = providedPdf ?? await buildPetitionPdf(delivery);
	const boundary = `----=_BaitBikes_${Date.now().toString(36)}`;
	const textBody = wrapBase64(bytesToBase64(new TextEncoder().encode(delivery.draft)));
	const pdfBody = wrapBase64(bytesToBase64(pdf));
	return [
		`To: ${delivery.recipient.replace(/[\r\n]+/g, '')}`,
		`Cc: ${delivery.submitter.replace(/[\r\n]+/g, '')}`,
		`Subject: ${encodeHeader(delivery.title.replace(/[\r\n]+/g, ' '))}`,
		'MIME-Version: 1.0',
		`Content-Type: multipart/mixed; boundary="${boundary}"`,
		'',
		`--${boundary}`,
		'Content-Type: text/plain; charset=UTF-8',
		'Content-Transfer-Encoding: base64',
		'',
		textBody,
		`--${boundary}`,
		`Content-Type: application/pdf; name="${delivery.filename}.pdf"`,
		'Content-Transfer-Encoding: base64',
		`Content-Disposition: attachment; filename="${delivery.filename}.pdf"`,
		'',
		pdfBody,
		`--${boundary}--`,
		'',
	].join('\r\n');
};
