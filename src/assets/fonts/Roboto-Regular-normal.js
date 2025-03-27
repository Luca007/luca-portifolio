/**
 * This is a stub for the Roboto-Regular font.
 * The actual implementation would include the font data.
 * In a real application, you would use a proper font file.
 */
(function (jsPDF) {
  var font = 'Roboto-Regular';
  var callAddFont = function () {
    this.addFileToVFS(font + '-normal.ttf', 'base64-encoded-font-data-would-go-here');
    this.addFont(font + '-normal.ttf', font, 'normal');
  };
  jsPDF.API.events.push(['addFonts', callAddFont]);
})(jsPDF.API);
