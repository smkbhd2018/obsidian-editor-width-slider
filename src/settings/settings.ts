import { 
	App,
	PluginSettingTab,
	Setting,
} from 'obsidian';

import ImageWidthSlider from "../main";
import { ImageWidthSliderSettings } from 'src/types/settings';

// ---------------------------- Storing Information ----------------------------
// the default value of the thing you want to store 
export const DEFAULT_SETTINGS: ImageWidthSliderSettings = {
        sliderPercentage: '50',
        sliderPercentageDefault: '50',
        sliderWidth: '150',
        unit: '%'
};
// ---------------------------- Storing Information ----------------------------

export class ImageWidthSliderSettingTab extends PluginSettingTab {
        plugin: ImageWidthSlider;

        constructor(app: App, plugin: ImageWidthSlider) {
		super(app, plugin);
		this.plugin = plugin;
	}
	// this.settings.sliderWidth
	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Slider Width')
			.setDesc('How wide do you want your slider to be?')
			.addText(text => text
				.setPlaceholder('Slider width in px')
				.setValue(this.plugin.settings.sliderWidth)
				.onChange(async (value) => {
					this.plugin.settings.sliderWidth = value;
					this.plugin.updateSliderStyle();
					await this.plugin.saveSettings();
				}));

                new Setting(containerEl)
                        .setName('Slider Default Percentage')
                        .setDesc('What do you want the default percentage of the slider to be?')
                        .addText(text => text
                                .setPlaceholder('Slider width in px')
                                .setValue(this.plugin.settings.sliderPercentageDefault)
                                .onChange(async (value) => {
                                        this.plugin.settings.sliderPercentageDefault = value;
                                        this.plugin.updateSliderStyle();
                                        await this.plugin.saveSettings();
                                }));

                new Setting(containerEl)
                        .setName('Width Unit')
                        .setDesc('Select the unit for adjusting image width')
                        .addDropdown(drop => drop
                                .addOptions({ '%': 'Percent', 'px': 'Pixels', 'vw': 'Viewport Width' })
                                .setValue(this.plugin.settings.unit)
                                .onChange(async (value) => {
                                        this.plugin.settings.unit = value;
                                        this.plugin.updateImageStyle();
                                        await this.plugin.saveSettings();
                                }));

        new Setting(containerEl)
            .setName('Note:')
            .setDesc('The field should be named "image-width" in the YAML frontmatter of the note in order to customize the image width of that respective note. It won\'t work globally for all notes unless you specify it in each note\'s frontmatter.');

	}
}