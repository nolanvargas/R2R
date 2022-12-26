if (!CSSStyleDeclaration.prototype.toggleProperty) {
  CSSStyleDeclaration.prototype.toggleProperty = function (prop) {
    if (this.getPropertyValue(prop) === "none") {
      this.setProperty(prop, "auto");
    } else {
      this.setProperty(prop, "none");
    }
  };
}
