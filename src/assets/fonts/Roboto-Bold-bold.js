/**
 * This is a stub for the Roboto-Bold font.
 * The actual implementation would include the font data.
 * In a real application, you would use a proper font file.
 */
(function (jsPDF) {
  var font = 'Roboto-Bold';
  var callAddFont = function () {
    this.addFileToVFS(font + '-bold.ttf', 'base64-encoded-font-data-would-go-here');
    this.addFont(font + '-bold.ttf', font, 'bold');
  };
  jsPDF.API.events.push(['addFonts', callAddFont]);
})(jsPDF.API);
