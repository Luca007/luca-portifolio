/**
 * This is a stub for the Roboto-Light font.
 * The actual implementation would include the font data.
 * In a real application, you would use a proper font file.
 */
(function (jsPDF) {
  var font = 'Roboto-Light';
  var callAddFont = function () {
    this.addFileToVFS(font + '-light.ttf', 'base64-encoded-font-data-would-go-here');
    this.addFont(font + '-light.ttf', font, 'light');
  };
  jsPDF.API.events.push(['addFonts', callAddFont]);
})(jsPDF.API);
