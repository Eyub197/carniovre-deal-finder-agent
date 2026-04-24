# headless way download

const [popup] = await Promise.all([
	context.waitForEvent("page"),
	page.click('text="Свали PDF"'),
]);
await popup.waitForURL("**/*");

const urlPdf = popup.url();
const pdf = await fetch(urlPdf);
const buffer = await pdf.arrayBuffer();
const path = `lib/broshura-${index}.pdf`;
await writeFile(path, Buffer.from(buffer));
