const PDFDocument = require('pdfkit');
const fs = require('fs');
const os = require('os');
const program = require('commander');

function calculateFontSize(textLength, width, height) {
  return (height / textLength) * (height * 1.1 / width);
}

function sanitizeText(text = '') {
  return text.replace('@', '_at_');
}

program
  .version('1.0.0')
  .option('-t, --text <value>', 'Text to be rendered')
  .option('-o, --output <value>', 'Output path')
  .parse(process.argv);

let output = program._optionValues.output;
let inputtext = program._optionValues.text;

let doc = new PDFDocument({ margin: 0 });
doc.pipe(fs.createWriteStream(output));

let halfWidth = doc.page.width / 2;
let halfHeight = doc.page.height / 2;
let text = sanitizeText(inputtext);

doc
  .font('Helvetica')
  .fontSize(calculateFontSize(text.length, doc.page.width, doc.page.height))
  .rotate(50, {
    origin: [halfWidth, halfHeight]
  })
  .fillOpacity(0.1)
  .text(text, 0, halfHeight, {
    width: doc.page.width,
    align: 'center',
    continued: false
  });

doc.end();

process.stdout.write(output);
process.stdout.on('error', function({ code }) {
  if (code === 'EPIPE') {
    process.exit(0);
  }
});
