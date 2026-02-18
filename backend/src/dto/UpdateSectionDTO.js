module.exports = class UpdateSectionDTO {
  constructor({ content, styles, is_visible }) {
    this.content = content;
    this.styles = styles;
    this.is_visible = is_visible;
  }
};
