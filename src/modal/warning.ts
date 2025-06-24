import { App, Modal } from "obsidian";

export class WarningModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.setText("Image width must be a number!");
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
