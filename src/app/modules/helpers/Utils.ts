export class Utils {
  static uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      // tslint:disable-next-line:one-variable-per-declaration no-bitwise
      const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static showLarge(imageS: any) {
    const image = new Image();
    image.src = imageS;
    const w = window.open("");
    w.document.write(image.outerHTML);
  }
}
